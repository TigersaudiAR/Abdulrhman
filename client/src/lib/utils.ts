import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// تحويل رقم صفحة إلى صفحة قرآنية (604 صفحة)
export function padPageNumber(pageNumber: number): string {
  return pageNumber.toString().padStart(3, '0');
}

// تحويل رقم سورة إلى رقم سورة مبطن (114 سورة)
export function padSurahNumber(surahNumber: number): string {
  return surahNumber.toString().padStart(3, '0');
}

// الحصول على مسار صورة صفحة المصحف بناءً على رقم الصفحة
export function getPageImagePath(pageNumber: number): string {
  // استخدام صورة مؤقتة للتطوير
  return `https://mushaf.quranksu.sa/Quran/assets/Page${pageNumber}.bmp`;
}

// تنسيق الوقت للعرض
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

// تحويل أرقام إلى أرقام عربية
export function toArabicNumbers(num: number): string {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/[0-9]/g, (w) => arabicNumbers[+w]);
}

// تحويل رقم إلى كلمة عربية
export const numberToArabicWord = (num: number): string => {
  const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const hundreds = ['', 'مئة', 'مئتان', 'ثلاثمئة', 'أربعمئة', 'خمسمئة', 'ستمئة', 'سبعمئة', 'ثمانمئة', 'تسعمئة'];
  
  if (num === 0) return 'صفر';
  if (num < 20) return ones[num];
  if (num < 100) {
    return num % 10 !== 0 ? `${ones[num % 10]} و ${tens[Math.floor(num / 10)]}` : tens[Math.floor(num / 10)];
  }
  if (num < 1000) {
    return num % 100 !== 0
      ? `${hundreds[Math.floor(num / 100)]} و ${numberToArabicWord(num % 100)}`
      : hundreds[Math.floor(num / 100)];
  }
  return num.toString(); // للأرقام الأكبر من 999
};

// تحويل التاريخ إلى تنسيق عربي
export function formatDate(date: Date): string {
  return date.toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}