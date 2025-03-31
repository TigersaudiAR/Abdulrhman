import React, { useState, useEffect, useRef, useCallback } from 'react';
import KingFahdMushafPage from './KingFahdMushafPage';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  ChevronLeft, 
  BookOpen,
  Settings,
  BookmarkPlus,
  Share2,
  Home,
  Search,
  X,
  Info,
  Bookmark
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSwipeable, SwipeableProps } from 'react-swipeable';
import { useApp } from '@/context/AppContext';
import { VersePopover } from './VersePopover';
import { useIsMobile } from '@/hooks/use-mobile';
import { QuranNavSidebar } from './QuranNavSidebar';
import { TOTAL_PAGES } from '@/lib/constants';

interface FullScreenMushafProps {
  initialPage?: number;
  className?: string;
}

/**
 * مكون المصحف بوضع ملء الشاشة - يعرض المصحف الشريف بتنسيق مشابه لتطبيقات المصحف الخاصة.
 * يظهر أدوات التحكم فقط عند تفاعل المستخدم.
 */
export function FullScreenMushaf({ initialPage = 1, className }: FullScreenMushafProps) {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [showVersePopover, setShowVersePopover] = useState<boolean>(false);
  const [versePosition, setVersePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedVerse, setSelectedVerse] = useState<{ surah: number; ayah: number } | null>(null);
  
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();
  const { 
    settings, 
    updateSettings, 
    bookmarks, 
    addBookmark, 
    lastRead,
    updateLastRead 
  } = useApp();

  // إعداد المؤقت لإخفاء أدوات التحكم بعد فترة من عدم التفاعل
  useEffect(() => {
    if (showControls) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      controlsTimeoutRef.current = setTimeout(() => {
        if (!showSidebar && !showVersePopover) {
          setShowControls(false);
        }
      }, 3000); // إخفاء بعد 3 ثوانٍ
    }
    
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, showSidebar, showVersePopover]);

  // التعامل مع التحميل الأولي
  useEffect(() => {
    // مراقبة مفاتيح الأسهم
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handlePreviousPage();
      } else if (e.key === 'ArrowLeft') {
        handleNextPage();
      } else if (e.key === 'Escape') {
        setShowSidebar(false);
        setShowVersePopover(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // حفظ آخر قراءة عند التحميل الأولي
    if (settings.autoSaveLastRead) {
      updateLastRead({
        surahNumber: 1, // يجب تحديث هذه القيمة لاحقًا بناءً على رقم الصفحة
        ayahNumber: 1,
        pageNumber: currentPage
      });
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // التعامل مع النقر على الصفحة
  const handlePageClick = useCallback(() => {
    setShowControls(!showControls);
  }, [showControls]);

  // التنقل بين الصفحات
  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => {
        const newPage = prev - 1;
        
        // حفظ آخر قراءة
        if (settings.autoSaveLastRead) {
          updateLastRead({
            surahNumber: 1, // يجب تحديث هذه القيمة لاحقًا
            ayahNumber: 1,
            pageNumber: newPage
          });
        }
        
        return newPage;
      });
    }
  }, [currentPage, settings.autoSaveLastRead, updateLastRead]);

  const handleNextPage = useCallback(() => {
    if (currentPage < TOTAL_PAGES) {
      setCurrentPage((prev) => {
        const newPage = prev + 1;
        
        // حفظ آخر قراءة
        if (settings.autoSaveLastRead) {
          updateLastRead({
            surahNumber: 1, // يجب تحديث هذه القيمة لاحقًا
            ayahNumber: 1,
            pageNumber: newPage
          });
        }
        
        return newPage;
      });
    }
  }, [currentPage, settings.autoSaveLastRead, updateLastRead]);

  // إضافة الصفحة الحالية للإشارات المرجعية
  const handleAddBookmark = useCallback(() => {
    addBookmark({
      surahNumber: 1, // يجب تحديث هذه القيمة لاحقًا
      ayahNumber: 1,
      pageNumber: currentPage
    });
  }, [currentPage, addBookmark]);

  // التعامل مع اللمس للتنقل بين الصفحات (للأجهزة اللوحية والجوال)
  const swipeHandlers = useSwipeable({
    onSwipedRight: handlePreviousPage,
    onSwipedLeft: handleNextPage,
    // التالي استخدم كخيارات للمكتبة
    trackMouse: true
  } as SwipeableProps);

  // التعامل مع النقر على آية للعرض في نافذة منبثقة
  const handleVerseClick = useCallback((e: React.MouseEvent) => {
    const element = e.target as HTMLElement;
    const verseElement = element.closest('[data-verse]');
    
    if (verseElement) {
      const surah = parseInt(verseElement.getAttribute('data-surah') || '1');
      const ayah = parseInt(verseElement.getAttribute('data-verse') || '1');
      
      setSelectedVerse({ surah, ayah });
      setVersePosition({ 
        x: e.clientX, 
        y: e.clientY 
      });
      setShowVersePopover(true);
      setShowControls(true);
    } else {
      handlePageClick();
    }
  }, [handlePageClick]);

  // التعامل مع تغيير الصفحة من شريط التنقل
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setShowSidebar(false);
  }, []);

  return (
    <div 
      className={cn(
        "relative w-full min-h-screen bg-background mushaf-container flex flex-col items-center justify-center",
        className
      )}
      {...swipeHandlers}
    >
      {/* الصفحة الحالية من المصحف */}
      <div onClick={handlePageClick}>
        <KingFahdMushafPage 
          pageNumber={currentPage} 
          onVerseSelect={(surahNumber, verseNumber, pageNumber) => {
            setSelectedVerse({ surah: surahNumber, ayah: verseNumber });
            const rect = document.body.getBoundingClientRect();
            setVersePosition({ x: rect.width / 2, y: rect.height / 2 });
            setShowVersePopover(true);
            setShowControls(true);
          }}
          className="max-h-[calc(100vh-4rem)]"
        />
      </div>
      
      {/* شريط التنقل الجانبي */}
      <QuranNavSidebar 
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        currentPage={currentPage}
        onPageSelect={handlePageChange}
        bookmarks={bookmarks}
        lastRead={lastRead}
      />
      
      {/* نافذة تفسير الآية المنبثقة */}
      {showVersePopover && selectedVerse && (
        <VersePopover
          surah={selectedVerse.surah}
          ayah={selectedVerse.ayah}
          position={versePosition}
          onClose={() => setShowVersePopover(false)}
        />
      )}
      
      {/* أزرار التحكم - تظهر فقط عند showControls=true */}
      <div 
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* شريط علوي */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent h-16 pointer-events-auto">
          <div className="container flex items-center justify-between h-full px-4">
            <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
              <Home className="h-5 w-5 text-white" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setShowSidebar(true)}>
                <BookOpen className="h-5 w-5 text-white" />
              </Button>
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5 text-white" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* أزرار التنقل بين الصفحات */}
        <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4 pointer-events-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePreviousPage}
            disabled={currentPage <= 1}
            className="rounded-full bg-black/30 hover:bg-black/50"
          >
            <ChevronRight className="h-8 w-8 text-white" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextPage}
            disabled={currentPage >= TOTAL_PAGES}
            className="rounded-full bg-black/30 hover:bg-black/50"
          >
            <ChevronLeft className="h-8 w-8 text-white" />
          </Button>
        </div>
        
        {/* شريط سفلي */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent h-16 pointer-events-auto">
          <div className="container flex items-center justify-between h-full px-4">
            <div className="text-white">
              <span className="font-medium">صفحة {currentPage}</span>
              <span className="text-sm text-white/70 ml-2">من {TOTAL_PAGES}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleAddBookmark}>
                <BookmarkPlus className="h-5 w-5 text-white" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5 text-white" />
              </Button>
              <Button variant="ghost" size="icon">
                <Info className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}