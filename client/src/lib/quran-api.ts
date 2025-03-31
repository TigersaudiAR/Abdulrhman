/**
 * وحدة للتعامل مع واجهة برمجة تطبيقات القرآن الكريم
 */

/**
 * عنوان واجهة برمجة التطبيقات الأساسي
 * نستخدم Express على منفذ 5000
 */
// في بيئة الإنتاج قد تحتاج إلى تغيير هذا حسب إعدادات الخادم
const API_BASE_URL = '/api';

/**
 * واجهة لبيانات التفسير
 */
export interface TafsirData {
  sura: number;
  ayah: number;
  tafsir_id: string;
  text: string;
}

/**
 * واجهة لبيانات الترجمة
 */
export interface TranslationData {
  sura: number;
  ayah: number;
  translation_id: string;
  text: string;
}

/**
 * واجهة للموارد المتاحة من API
 */
export interface AvailableResources {
  tafsirs: string[];
  translations: string[];
  pages: number;
}

/**
 * الحصول على قائمة بالموارد المتاحة
 */
export async function getAvailableResources(): Promise<AvailableResources> {
  try {
    const response = await fetch(`${API_BASE_URL}/quran/available`);
    if (!response.ok) {
      throw new Error(`Error fetching resources: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch available resources:", error);
    // في حالة الفشل، نعود بقائمة فارغة
    return { tafsirs: [], translations: [], pages: 0 };
  }
}

/**
 * الحصول على تفسير لآية محددة
 */
export async function getTafsir(tafsirId: string, sura: number, ayah: number): Promise<TafsirData> {
  try {
    const response = await fetch(`${API_BASE_URL}/quran/tafsir/${tafsirId}/${sura}/${ayah}`);
    if (!response.ok) {
      throw new Error(`Error fetching tafsir: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch tafsir for sura ${sura}, ayah ${ayah}:`, error);
    throw error;
  }
}

/**
 * الحصول على ترجمة لآية محددة
 */
export async function getTranslation(translationId: string, sura: number, ayah: number): Promise<TranslationData> {
  try {
    const response = await fetch(`${API_BASE_URL}/quran/translation/${translationId}/${sura}/${ayah}`);
    if (!response.ok) {
      throw new Error(`Error fetching translation: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch translation for sura ${sura}, ayah ${ayah}:`, error);
    throw error;
  }
}

/**
 * الحصول على URL لصورة صفحة القرآن
 */
export function getQuranPageUrl(pageNumber: number): string {
  return `${API_BASE_URL}/quran/page/${pageNumber}`;
}

/**
 * الحصول على URL لملف الصورة المحلي
 */
export function getLocalQuranPageUrl(pageNumber: number): string {
  // استخدام مسار واحد فقط لتجنب المشاكل وتكرار الصور
  // استخدام امتداد webp الصحيح للملفات
  
  // التأكد من أن رقم الصفحة بين 1 و 604
  const safePageNumber = Math.max(1, Math.min(604, pageNumber));
  
  return `/images/quran_pages/page_${safePageNumber}.webp`;
}

/**
 * محاولة تحميل صورة من مسار معين
 * يمكن استخدامها للتحقق من توفر الصور عند الحاجة
 */
export function preloadQuranImage(pageNumber: number): Promise<string> {
  // هذه الدالة تقوم بمحاولة تحميل الصورة وإرجاع المسار الصحيح
  return new Promise((resolve, reject) => {
    // التأكد من أن رقم الصفحة بين 1 و 604
    const safePageNumber = Math.max(1, Math.min(604, pageNumber));
    
    if (pageNumber !== safePageNumber) {
      console.log(`تم طلب الصفحة ${pageNumber} ولكن تم استخدام الصفحة ${safePageNumber} بدلاً منها.`);
    }
    
    const imagePath = `/images/quran_pages/page_${safePageNumber}.webp`;
    
    const img = new Image();
    
    // عند نجاح التحميل
    img.onload = () => resolve(imagePath);
    
    // عند فشل التحميل
    img.onerror = () => reject(new Error(`Could not load Quran page ${safePageNumber}`));
    
    // ابدأ بتحميل الصورة
    img.src = imagePath;
  });
}

/**
 * تحقق من توفر واجهة برمجة تطبيقات القرآن
 */
export async function checkQuranApiAvailability(): Promise<boolean> {
  try {
    // استخدام نقطة نهاية الفحص الصحيح
    const response = await fetch(`${API_BASE_URL}/health`, { 
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(3000) // timeout after 3 seconds
    });
    
    if (response.ok) {
      console.log("Quran API is available");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Quran API is not available:", error);
    return false;
  }
}