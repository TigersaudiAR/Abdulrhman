import React, { useState, useEffect, useCallback } from 'react';
import { getLocalQuranPageUrl } from '../../lib/quran-api';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';

interface HighlightedVerse {
  surahNumber: number;
  verseNumber?: number;
  pageNumber: number;
}

interface KingFahdMushafPageProps {
  pageNumber: number;
  onVerseSelect?: (surahNumber: number, verseNumber: number, pageNumber: number) => void;
  highlightedVerse?: HighlightedVerse;
  className?: string;
}

/**
 * مكون صفحة المصحف - يعرض صفحة واحدة من المصحف الشريف بتنسيق مجمع الملك فهد.
 */
const KingFahdMushafPage: React.FC<KingFahdMushafPageProps> = ({
  pageNumber,
  onVerseSelect,
  highlightedVerse,
  className,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // استخدم مسار مباشر لملفات الصور الثابتة - نختار المسار المحلي الموحد
  const imageSource = getLocalQuranPageUrl(pageNumber);

  // التحقق من توفر الصورة
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // التحقق من وجود ملف الصورة محليًا
    const img = new Image();
    img.onload = () => {
      setLoading(false);
    };
    img.onerror = () => {
      console.error(`فشل تحميل الصورة: ${imageSource}`);
      setError('تعذر تحميل صفحة المصحف');
      setLoading(false);
    };
    img.src = imageSource;
    
    // تنظيف عند إلغاء تحميل المكون
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [pageNumber, imageSource]);
  
  // معالجة النقر على صفحة المصحف
  const handlePageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (onVerseSelect) {
      // هنا يمكن إضافة منطق تحديد الآية بناءً على موقع النقر
      // لأغراض العرض، سنستخدم قيمًا ثابتة
      const surahNumber = 1; // سيتم تحديثه لاحقًا بمنطق الكشف الفعلي
      const verseNumber = 1; // سيتم تحديثه لاحقًا بمنطق الكشف الفعلي
      onVerseSelect(surahNumber, verseNumber, pageNumber);
    }
  }, [onVerseSelect, pageNumber]);

  // تسجيل مسار الصورة للتصحيح (فقط في بيئة التطوير)
  useEffect(() => {
    console.log('مسار الصورة:', { imageSource, pageNumber });
  }, [imageSource, pageNumber]);

  return (
    <div
      className={cn(
        'relative flex items-center justify-center mushaf-page w-full max-w-xl mx-auto',
        className
      )}
      onClick={handlePageClick}
    >
      {loading && (
        <Skeleton className="w-full min-h-[600px] aspect-[0.7/1] rounded-md" />
      )}
      
      {error && !loading && (
        <div className="text-center p-4 text-red-500 bg-red-100 rounded-md my-4 w-full">
          <p className="text-lg font-semibold">{error}</p>
          <p className="text-sm">يرجى التحقق من الاتصال بالإنترنت أو المحاولة مرة أخرى لاحقًا.</p>
        </div>
      )}

      {!loading && !error && (
        <img
          src={imageSource}
          alt={`صفحة القرآن رقم ${pageNumber}`}
          className={cn(
            'w-full h-auto object-contain mushaf-page-image',
            'opacity-100 transition-opacity duration-500',
            highlightedVerse && highlightedVerse.pageNumber === pageNumber ? 'highlighted-page' : ''
          )}
          loading="eager"
        />
      )}
    </div>
  );
};

export default KingFahdMushafPage;