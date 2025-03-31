import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import * as os from 'os';
import { execSync } from 'child_process';
import fetch from 'node-fetch';

export async function registerRoutes(app: Express): Promise<void> {
  console.log('Registering API routes...');
  // API routes prefix
  const API_PREFIX = '/api';

  // نقطة نهاية اختبار بسيطة
  app.get("/test-endpoint", (req, res) => {
    res.json({ success: true, message: "Test endpoint is working!" });
  });

  // Health check endpoint
  app.get(`${API_PREFIX}/health`, (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  // Cleanup endpoint for running the cleanup script
  app.post(`${API_PREFIX}/cleanup`, (req, res) => {
    try {
      // Make the script executable
      execSync('chmod +x cleanup.sh');
      // Run the cleanup script
      const output = execSync('./cleanup.sh').toString();
      res.status(200).json({ 
        success: true, 
        message: 'تم تنفيذ سكريبت التنظيف بنجاح', 
        output 
      });
    } catch (error: any) {
      console.error('Error executing cleanup script:', error);
      res.status(500).json({ 
        success: false, 
        message: `فشل تنفيذ سكريبت التنظيف: ${error.message}`,
        error: error.toString()
      });
    }
  });

  // تسجيل مستخدم جديد
  app.post(`${API_PREFIX}/register`, async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      // التحقق مما إذا كان اسم المستخدم موجودًا بالفعل
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }

      // إنشاء مستخدم جديد
      const newUser = await storage.createUser({ username, password });

      // إنشاء إعدادات افتراضية للمستخدم
      await storage.createUserSettings({
        userId: newUser.id,
        reciter: 'ar.alafasy',
        translation: 'ar.asad',
        fontSize: 3,
        showTranslation: true,
        autoPlayAudio: false,
        prayerMethod: 2,
        showNextPrayer: true,
        highlightCurrentVerse: true,
        autoSaveLastRead: true
      });

      res.status(201).json({
        message: 'User registered successfully',
        user: { id: newUser.id, username: newUser.username }
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to register user', error: (error as Error).message });
    }
  });

  // تسجيل الدخول
  app.post(`${API_PREFIX}/login`, async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      // البحث عن المستخدم بواسطة اسم المستخدم
      const user = await storage.getUserByUsername(username);

      // التحقق من وجود المستخدم وصحة كلمة المرور
      // ملاحظة: في تطبيق حقيقي، يجب استخدام طريقة آمنة لتخزين ومقارنة كلمات المرور
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // إرجاع معلومات المستخدم بدون كلمة المرور
      res.status(200).json({
        message: 'Login successful',
        user: { id: user.id, username: user.username }
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to login', error: (error as Error).message });
    }
  });

  // User preferences API - for storing user preferences server-side
  // Get user preferences
  app.get(`${API_PREFIX}/preferences/:userId`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const userSettings = await storage.getUserSettings(userId);

      if (!userSettings) {
        // إذا لم تكن الإعدادات موجودة، قم بإنشاء إعدادات افتراضية
        const defaultSettings = await storage.createUserSettings({
          userId,
          reciter: 'ar.alafasy',
          translation: 'ar.asad',
          fontSize: 3,
          showTranslation: true,
          autoPlayAudio: false,
          prayerMethod: 2,
          showNextPrayer: true,
          highlightCurrentVerse: true,
          autoSaveLastRead: true
        });

        return res.status(200).json({ preferences: defaultSettings });
      }

      res.status(200).json({ preferences: userSettings });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get user preferences', error: (error as Error).message });
    }
  });

  // Update user preferences
  app.post(`${API_PREFIX}/preferences/:userId`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const preferences = req.body;

      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // تحقق مما إذا كانت الإعدادات موجودة مسبقًا
      const existingSettings = await storage.getUserSettings(userId);

      let updatedSettings;
      if (existingSettings) {
        // تحديث الإعدادات الموجودة
        updatedSettings = await storage.updateUserSettings(userId, preferences);
      } else {
        // إنشاء إعدادات جديدة
        updatedSettings = await storage.createUserSettings({
          userId,
          ...preferences
        });
      }

      res.status(200).json({
        message: 'Preferences updated successfully',
        preferences: updatedSettings
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update user preferences', error: (error as Error).message });
    }
  });

  // API Quran - استخدام الملفات المحلية

  // روت الرئيسية
  app.get(API_PREFIX, (req, res) => {
    res.status(200).json({
      message: "Welcome to Quran App API",
      status: "available",
      version: "1.0.0"
    });
  });
  
  // روت الرئيسية بدون البادئة (أساسية للاختبار)
  app.get("/api", (req, res) => {
    res.status(200).json({
      message: "Quran Application API is running",
      status: "available",
      version: "1.0.0",
      timestamp: new Date().toISOString()
    });
  });

  // نقطة وصول لفحص الاتصال
  app.get(`${API_PREFIX}/connection-test`, (req, res) => {
    const networkInterfaces = os.networkInterfaces() || {};
    const interfaces: Record<string, Array<{
      address: string;
      family: string;
      netmask: string;
    }>> = {};
    
    // استخراج معلومات الواجهات الشبكية
    Object.keys(networkInterfaces).forEach(ifname => {
      const networkInterface = networkInterfaces[ifname];
      if (networkInterface) {
        interfaces[ifname] = networkInterface
          .filter((iface: any) => !iface.internal) // استبعاد الواجهات الداخلية
          .map((iface: any) => ({
            address: iface.address,
            family: iface.family,
            netmask: iface.netmask
          }));
      }
    });
    
    res.status(200).json({
      message: "الاتصال بالخادم يعمل بشكل صحيح",
      timestamp: new Date().toISOString(),
      serverInfo: {
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 'N/A',
        platform: os.platform(),
        hostname: os.hostname(),
        arch: os.arch(),
        memory: {
          total: Math.round(os.totalmem() / (1024 * 1024)) + ' MB',
          free: Math.round(os.freemem() / (1024 * 1024)) + ' MB',
          usage: Math.round((1 - os.freemem() / os.totalmem()) * 100) + '%'
        },
        uptime: Math.round(os.uptime() / 60) + ' minutes',
        cpu: os.cpus().map((cpu: any) => ({
          model: cpu.model,
          speed: cpu.speed + ' MHz'
        }))[0], // نأخذ معلومات المعالج الأول فقط
        network: {
          interfaces
        }
      }
    });
  });

  // روت الرئيسية للقرآن
  app.get(`${API_PREFIX}/quran`, (req, res) => {
    res.status(200).json({
      message: "Welcome to Quran API",
      endpoints: [
        "/api/quran/tafsir/:tafsir_id/:sura/:ayah",
        "/api/quran/translation/:translation_id/:sura/:ayah",
        "/api/quran/page/:page_number",
        "/api/quran/available"
      ]
    });
  });

  // الحصول على قائمة الموارد المتاحة
  app.get(`${API_PREFIX}/quran/available`, (req, res) => {
    try {
      // قائمة التفاسير المتاحة
      const tafsirs = [
        "ar-tafsir-al-jalalayn",
        "ar-tafsir-ibn-kathir",
        "ar-tafsir-muyassar"
      ];

      // قائمة الترجمات المتاحة
      const translations = [
        "ar-muyassar",
        "en-hilali",
        "tr-yazir"
      ];

      // إجمالي عدد صفحات المصحف
      const pages = 604;

      res.status(200).json({
        tafsirs,
        translations,
        pages
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get available resources', error: (error as Error).message });
    }
  });

  // الحصول على تفسير آية محددة
  app.get(`${API_PREFIX}/quran/tafsir/:tafsir_id/:sura/:ayah`, async (req, res) => {
    try {
      const { tafsir_id, sura, ayah } = req.params;

      // استدعاء API الخارجي هنا للحصول على التفسير
      // في هذه الحالة سنستخدم بدائل التفسير من alquran.cloud
      const url = `https://api.alquran.cloud/v1/ayah/${sura}:${ayah}/ar.jalalayn`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === 200 && data.data) {
        res.status(200).json({
          sura: parseInt(sura),
          ayah: parseInt(ayah),
          tafsir_id,
          text: data.data.edition.name === "ar.jalalayn" ? data.data.text : "تفسير غير متوفر حاليًا"
        });
      } else {
        res.status(404).json({ 
          message: "Tafsir not found",
          sura: parseInt(sura),
          ayah: parseInt(ayah),
          tafsir_id,
          text: "تفسير غير متوفر حاليًا"
        });
      }
    } catch (error) {
      res.status(500).json({ 
        message: 'Failed to get tafsir', 
        error: (error as Error).message,
        sura: parseInt(req.params.sura),
        ayah: parseInt(req.params.ayah),
        tafsir_id: req.params.tafsir_id,
        text: "تفسير غير متوفر حاليًا - خطأ في الخادم"
      });
    }
  });

  // الحصول على ترجمة آية محددة
  app.get(`${API_PREFIX}/quran/translation/:translation_id/:sura/:ayah`, async (req, res) => {
    try {
      const { translation_id, sura, ayah } = req.params;
      let edition = "en.hilali"; // افتراضي

      // تحديد الترجمة حسب المعرف
      if (translation_id === "ar-muyassar") {
        edition = "ar.muyassar";
      } else if (translation_id === "en-hilali") {
        edition = "en.hilali";
      } else if (translation_id === "tr-yazir") {
        edition = "tr.yazir";
      }

      const url = `https://api.alquran.cloud/v1/ayah/${sura}:${ayah}/${edition}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === 200 && data.data) {
        res.status(200).json({
          sura: parseInt(sura),
          ayah: parseInt(ayah),
          translation_id,
          text: data.data.text
        });
      } else {
        res.status(404).json({ 
          message: "Translation not found",
          sura: parseInt(sura),
          ayah: parseInt(ayah),
          translation_id,
          text: "الترجمة غير متوفرة حاليًا"
        });
      }
    } catch (error) {
      res.status(500).json({ 
        message: 'Failed to get translation', 
        error: (error as Error).message,
        sura: parseInt(req.params.sura),
        ayah: parseInt(req.params.ayah),
        translation_id: req.params.translation_id,
        text: "الترجمة غير متوفرة حاليًا - خطأ في الخادم"
      });
    }
  });

  // الحصول على صفحة القرآن
  app.get(`${API_PREFIX}/quran/page/:page_number`, async (req, res) => {
    try {
      const { page_number } = req.params;
      const pageNum = parseInt(page_number);

      // التحقق من صحة رقم الصفحة
      if (isNaN(pageNum) || pageNum < 1 || pageNum > 604) {
        return res.status(400).json({ message: 'Invalid page number. Must be between 1 and 604.' });
      }

      // نقوم بتوجيه طلب الصفحة إلى واجهة برمجة التطبيقات الخارجية للحصول على الآيات
      const url = `https://api.alquran.cloud/v1/page/${pageNum}/quran-uthmani`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === 200 && data.data) {
        res.status(200).json(data.data);
      } else {
        res.status(404).json({ message: `Page ${pageNum} not found` });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to get Quran page', error: (error as Error).message });
    }
  });

  // Proxy for Prayer API to avoid CORS issues
  app.get(`${API_PREFIX}/prayer/:endpoint(**)`, async (req, res) => {
    try {
      const endpoint = req.params.endpoint;
      const queryParams = new URLSearchParams(req.query as Record<string, string>).toString();
      const url = `https://api.aladhan.com/v1/${endpoint}${queryParams ? `?${queryParams}` : ''}`;

      const response = await fetch(url);
      const data = await response.json();

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to proxy Prayer API', error: (error as Error).message });
    }
  });

  // Proxy for Hadith API to avoid CORS issues
  app.get(`${API_PREFIX}/hadith/:endpoint(**)`, async (req, res) => {
    try {
      const endpoint = req.params.endpoint;
      const queryParams = new URLSearchParams(req.query as Record<string, string>).toString();
      const url = `https://api.hadith.gading.dev/books/${endpoint}${queryParams ? `?${queryParams}` : ''}`;

      const response = await fetch(url);
      const data = await response.json();

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to proxy Hadith API', error: (error as Error).message });
    }
  });

  // API الإشارات المرجعية
  // الحصول على الإشارات المرجعية للمستخدم
  app.get(`${API_PREFIX}/bookmarks/:userId`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const userBookmarks = await storage.getBookmarks(userId);
      res.status(200).json({ bookmarks: userBookmarks });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get bookmarks', error: (error as Error).message });
    }
  });

  // إضافة إشارة مرجعية جديدة
  app.post(`${API_PREFIX}/bookmarks/:userId`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { surahNumber, ayahNumber, pageNumber, note } = req.body;

      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const newBookmark = await storage.createBookmark({
        userId,
        surahNumber,
        ayahNumber,
        pageNumber,
        note: note || null
      });

      res.status(201).json({
        message: 'Bookmark added successfully',
        bookmark: newBookmark
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to add bookmark', error: (error as Error).message });
    }
  });

  // حذف إشارة مرجعية
  app.delete(`${API_PREFIX}/bookmarks/:userId/:bookmarkId`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const bookmarkId = parseInt(req.params.bookmarkId);

      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const deleted = await storage.deleteBookmark(bookmarkId, userId);

      if (!deleted) {
        return res.status(404).json({ message: 'Bookmark not found or not owned by user' });
      }

      res.status(200).json({
        message: 'Bookmark deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete bookmark', error: (error as Error).message });
    }
  });

  // آخر قراءة API
  // الحصول على آخر قراءة للمستخدم
  app.get(`${API_PREFIX}/last-read/:userId`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const lastReadData = await storage.getLastRead(userId);

      if (!lastReadData) {
        return res.status(404).json({ message: 'No last read data found' });
      }

      res.status(200).json({ lastRead: lastReadData });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get last read data', error: (error as Error).message });
    }
  });

  // تحديث آخر قراءة للمستخدم
  app.post(`${API_PREFIX}/last-read/:userId`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { surahNumber, ayahNumber, pageNumber } = req.body;

      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const updatedLastRead = await storage.updateLastRead({
        userId,
        surahNumber,
        ayahNumber,
        pageNumber
      });

      res.status(200).json({
        message: 'Last read updated successfully',
        lastRead: updatedLastRead
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update last read', error: (error as Error).message });
    }
  });

  // إضافة نقطة نهاية خاصة للاختبار والتشخيص
  app.get(`${API_PREFIX}/server-test`, (req, res) => {
    res.status(200).json({
      status: "success",
      message: "نقطة الاختبار تعمل بشكل صحيح",
      time: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      node_version: process.version,
      memory_usage: process.memoryUsage(),
      uptime: process.uptime()
    });
  });
}