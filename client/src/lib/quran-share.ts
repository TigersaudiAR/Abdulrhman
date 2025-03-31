import { APP_CONFIG } from './constants';
import { toast } from '../hooks/use-toast';

/**
 * واجهة لتكوين مشاركة الآية
 */
interface VerseShareConfig {
  surahNumber: number;
  verseNumber: number;
  verseText: string;
  translation?: string;
  includeReference?: boolean;
  includeApp?: boolean;
  includeTafsirLink?: boolean;
}

/**
 * مشاركة آية عبر واجهة المشاركة المدمجة في المتصفح
 * @param config تكوين المشاركة
 */
export async function shareVerse(config: VerseShareConfig): Promise<boolean> {
  const {
    surahNumber,
    verseNumber,
    verseText,
    translation,
    includeReference = true,
    includeApp = true,
    includeTafsirLink = false
  } = config;
  
  try {
    if (!navigator.share) {
      // نسخ النص إلى الحافظة إذا كانت واجهة المشاركة غير متوفرة
      return await copyVerseToClipboard(config);
    }
    
    let shareText = verseText;
    
    // إضافة الترجمة إذا كانت متوفرة
    if (translation) {
      shareText += `\n\n${translation}`;
    }
    
    // إضافة المرجع
    if (includeReference) {
      shareText += `\n\n[سورة ${getSurahName(surahNumber)}: ${verseNumber}]`;
    }
    
    // إضافة معلومات التطبيق
    if (includeApp) {
      shareText += `\n\nمشاركة من تطبيق "${APP_CONFIG.APP_NAME}"`;
    }
    
    // إضافة رابط التفسير
    let url;
    if (includeTafsirLink) {
      url = `https://quran.com/${surahNumber}/${verseNumber}`;
    }
    
    await navigator.share({
      title: `آية من سورة ${getSurahName(surahNumber)}`,
      text: shareText,
      url
    });
    
    return true;
  } catch (error) {
    console.error('Error sharing verse:', error);
    
    // محاولة النسخ إلى الحافظة كخطة بديلة
    if ((error as Error).name !== 'AbortError') {
      return await copyVerseToClipboard(config);
    }
    
    return false;
  }
}

/**
 * نسخ نص الآية إلى الحافظة
 * @param config تكوين المشاركة
 */
export async function copyVerseToClipboard(config: VerseShareConfig): Promise<boolean> {
  const {
    surahNumber,
    verseNumber,
    verseText,
    translation,
    includeReference = true,
    includeApp = false
  } = config;
  
  try {
    let textToCopy = verseText;
    
    // إضافة الترجمة إذا كانت متوفرة
    if (translation) {
      textToCopy += `\n\n${translation}`;
    }
    
    // إضافة المرجع
    if (includeReference) {
      textToCopy += `\n\n[سورة ${getSurahName(surahNumber)}: ${verseNumber}]`;
    }
    
    // إضافة معلومات التطبيق
    if (includeApp) {
      textToCopy += `\n\nمشاركة من تطبيق "${APP_CONFIG.APP_NAME}"`;
    }
    
    await navigator.clipboard.writeText(textToCopy);
    
    toast({
      title: "تم النسخ",
      description: "تم نسخ الآية إلى الحافظة بنجاح"
    });
    
    return true;
  } catch (error) {
    console.error('Error copying verse to clipboard:', error);
    
    toast({
      title: "خطأ",
      description: "تعذر نسخ الآية إلى الحافظة",
      variant: "destructive"
    });
    
    return false;
  }
}

/**
 * الحصول على اسم السورة من رقمها
 * @param surahNumber رقم السورة (1-114)
 */
function getSurahName(surahNumber: number): string {
  const SURAH_NAMES = [
    'الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة', 'الأنعام', 'الأعراف',
    'الأنفال', 'التوبة', 'يونس', 'هود', 'يوسف', 'الرعد', 'إبراهيم', 'الحجر',
    'النحل', 'الإسراء', 'الكهف', 'مريم', 'طه', 'الأنبياء', 'الحج', 'المؤمنون',
    'النور', 'الفرقان', 'الشعراء', 'النمل', 'القصص', 'العنكبوت', 'الروم', 'لقمان',
    'السجدة', 'الأحزاب', 'سبأ', 'فاطر', 'يس', 'الصافات', 'ص', 'الزمر', 'غافر',
    'فصلت', 'الشورى', 'الزخرف', 'الدخان', 'الجاثية', 'الأحقاف', 'محمد', 'الفتح',
    'الحجرات', 'ق', 'الذاريات', 'الطور', 'النجم', 'القمر', 'الرحمن', 'الواقعة',
    'الحديد', 'المجادلة', 'الحشر', 'الممتحنة', 'الصف', 'الجمعة', 'المنافقون',
    'التغابن', 'الطلاق', 'التحريم', 'الملك', 'القلم', 'الحاقة', 'المعارج', 'نوح',
    'الجن', 'المزمل', 'المدثر', 'القيامة', 'الإنسان', 'المرسلات', 'النبأ',
    'النازعات', 'عبس', 'التكوير', 'الانفطار', 'المطففين', 'الانشقاق', 'البروج',
    'الطارق', 'الأعلى', 'الغاشية', 'الفجر', 'البلد', 'الشمس', 'الليل', 'الضحى',
    'الشرح', 'التين', 'العلق', 'القدر', 'البينة', 'الزلزلة', 'العاديات',
    'القارعة', 'التكاثر', 'العصر', 'الهمزة', 'الفيل', 'قريش', 'الماعون',
    'الكوثر', 'الكافرون', 'النصر', 'المسد', 'الإخلاص', 'الفلق', 'الناس'
  ];
  
  return surahNumber >= 1 && surahNumber <= 114
    ? SURAH_NAMES[surahNumber - 1]
    : `سورة ${surahNumber}`;
}

/**
 * تكوين رابط لآية في القرآن الكريم
 * @param surahNumber رقم السورة (1-114)
 * @param verseNumber رقم الآية
 */
export function getVerseLink(surahNumber: number, verseNumber: number): string {
  return `https://quran.com/${surahNumber}/${verseNumber}`;
}

/**
 * تكوين رابط لتفسير آية في القرآن الكريم
 * @param surahNumber رقم السورة (1-114)
 * @param verseNumber رقم الآية
 * @param tafsirId معرف التفسير (اختياري)
 */
export function getTafsirLink(
  surahNumber: number,
  verseNumber: number,
  tafsirId: string = 'ar-tafsir-al-jalalayn'
): string {
  return `https://quran.com/${surahNumber}/${verseNumber}/tafsirs/${tafsirId}`;
}