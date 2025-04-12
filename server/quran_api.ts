import express from 'express';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Define types for tafsir and translation data
interface TafsirData {
  [tafsirId: string]: {
    [sura: string]: {
      [ayah: string]: string;
    };
  };
}

interface TranslationData {
  [translationId: string]: {
    [sura: string]: {
      [ayah: string]: string;
    };
  };
}

// Load tafsir and translation data
const loadQuranData = (): { tafsirData: TafsirData; translationData: TranslationData } => {
  const tafsirData: TafsirData = {};
  const translationData: TranslationData = {};
  
  try {
    // تحميل ملفات التفسير
    const tafsirDir = path.join(process.cwd(), 'quran_api/tafsir_json');
    if (fs.existsSync(tafsirDir)) {
      const tafsirFiles = glob.sync(path.join(tafsirDir, '*.json'));
      
      for (const filePath of tafsirFiles) {
        const fileName = path.basename(filePath, '.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        tafsirData[fileName] = JSON.parse(fileContent);
      }
    }
    
    // تحميل ملفات الترجمة
    const translationDir = path.join(process.cwd(), 'quran_api/translations_json');
    if (fs.existsSync(translationDir)) {
      const translationFiles = glob.sync(path.join(translationDir, '*.json'));
      
      for (const filePath of translationFiles) {
        const fileName = path.basename(filePath, '.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        translationData[fileName] = JSON.parse(fileContent);
      }
    }
    
    console.log(`Successfully loaded ${Object.keys(tafsirData).length} tafsir files and ${Object.keys(translationData).length} translation files.`);
  } catch (error) {
    console.error('Error loading Quran data:', error);
  }
  
  return { tafsirData, translationData };
};

export function registerQuranApiRoutes(app: express.Express): void {
  const { tafsirData, translationData } = loadQuranData();
  const API_PREFIX = '/api';
  
  // Get available resources
  app.get(`${API_PREFIX}/quran-api/available`, (req, res) => {
    res.json({
      tafsirs: Object.keys(tafsirData),
      translations: Object.keys(translationData),
      pages: 604 // Total number of pages in the Mushaf
    });
  });
  
  // Get tafsir
  app.get(`${API_PREFIX}/quran-api/tafsir/:tafsir_id/:sura/:ayah`, (req, res) => {
    try {
      const { tafsir_id, sura, ayah } = req.params;
      
      if (!tafsirData[tafsir_id]) {
        return res.status(404).json({
          message: 'Tafsir not found',
          available_tafsirs: Object.keys(tafsirData)
        });
      }
      
      const tafsirText = tafsirData[tafsir_id]?.[sura]?.[ayah];
      
      if (!tafsirText) {
        return res.status(404).json({
          message: `Tafsir not found for sura ${sura}, ayah ${ayah}`,
          sura: parseInt(sura),
          ayah: parseInt(ayah),
          tafsir_id
        });
      }
      
      res.json({
        sura: parseInt(sura),
        ayah: parseInt(ayah),
        tafsir_id,
        text: tafsirText
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error retrieving tafsir',
        error: (error as Error).message
      });
    }
  });
  
  // Get translation
  app.get(`${API_PREFIX}/quran-api/translation/:translation_id/:sura/:ayah`, (req, res) => {
    try {
      const { translation_id, sura, ayah } = req.params;
      
      if (!translationData[translation_id]) {
        return res.status(404).json({
          message: 'Translation not found',
          available_translations: Object.keys(translationData)
        });
      }
      
      const translationText = translationData[translation_id]?.[sura]?.[ayah];
      
      if (!translationText) {
        return res.status(404).json({
          message: `Translation not found for sura ${sura}, ayah ${ayah}`,
          sura: parseInt(sura),
          ayah: parseInt(ayah),
          translation_id
        });
      }
      
      res.json({
        sura: parseInt(sura),
        ayah: parseInt(ayah),
        translation_id,
        text: translationText
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error retrieving translation',
        error: (error as Error).message
      });
    }
  });
  
  // Serve Quran page images
  app.get(`${API_PREFIX}/quran-api/page/:page_number`, (req, res) => {
    try {
      const { page_number } = req.params;
      const pageNum = parseInt(page_number);
      
      if (isNaN(pageNum) || pageNum < 1 || pageNum > 604) {
        return res.status(400).json({
          message: 'Invalid page number. Must be between 1 and 604.'
        });
      }
      
      const imagePath = path.join(process.cwd(), `quran_api/images_all/page/page_${pageNum}.png`);
      
      if (fs.existsSync(imagePath)) {
        return res.sendFile(imagePath);
      } else {
        return res.status(404).json({
          message: `Page image ${pageNum} not found`
        });
      }
    } catch (error) {
      res.status(500).json({
        message: 'Error retrieving page image',
        error: (error as Error).message
      });
    }
  });
  
  // Serve any image from the Quran API
  app.get(`${API_PREFIX}/quran-api/image/:type/:filename`, (req, res) => {
    try {
      const { type, filename } = req.params;
      const imagePath = path.join(process.cwd(), `quran_api/images_all/${type}/${filename}`);
      
      if (fs.existsSync(imagePath)) {
        return res.sendFile(imagePath);
      } else {
        return res.status(404).json({
          message: `Image not found: ${type}/${filename}`
        });
      }
    } catch (error) {
      res.status(500).json({
        message: 'Error retrieving image',
        error: (error as Error).message
      });
    }
  });
  
  // Serve static files from the quran_api/images_all directory
  app.use(`${API_PREFIX}/quran-api/static`, express.static(path.join(process.cwd(), 'quran_api/images_all')));
  
  console.log('✅ Quran API routes registered successfully');
}