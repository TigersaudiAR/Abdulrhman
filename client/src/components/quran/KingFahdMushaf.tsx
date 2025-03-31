import { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'wouter';
import KingFahdMushafPage from './KingFahdMushafPage';
// Using absolute path to fix import issue
import VersePopover from '../../components/quran/VersePopover';
import QuranNavSidebar from './QuranNavSidebar';
import { useApp } from '../../context/AppContext';
import { SURAH_NAMES, APP_CONFIG } from '../../lib/constants';
import { cn } from '../../lib/utils';
import { 
  ChevronRight, 
  ChevronLeft, 
  Settings, 
  BookmarkPlus, 
  Share2, 
  Volume2,
  PlayCircle,
  PauseCircle,
  Menu
} from 'lucide-react';
import { Button } from '../ui/button';
import { useQuranAudioBasic } from '../../hooks/useQuranAudio';
import { useToast } from '../../hooks/use-toast';

interface KingFahdMushafProps {
  initialPage?: number;
  initialSurah?: number;
  initialAyah?: number;
  className?: string;
}

/**
 * مكون المصحف الرئيسي لعرض واجهة القرآن الكريم مع إصدار الملك فهد
 */
const KingFahdMushaf = ({
  initialPage = 1,
  initialSurah,
  initialAyah,
  className
}: KingFahdMushafProps) => {
  // استخدام السياق والهوكس
  const { settings, lastRead, updateLastRead, addBookmark } = useApp();
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // حالة المصحف
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedVerse, setSelectedVerse] = useState<{ surahNumber: number; verseNumber: number; pageNumber: number } | null>(null);
  const [showControls, setShowControls] = useState(false); // إخفاء عناصر التحكم في البداية
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [lastInteraction, setLastInteraction] = useState<number>(Date.now());
  
  // خطاف تشغيل صوت القرآن
  const {
    isPlaying,
    togglePlay,
    playVerse,
    currentVerse,
    isLoading: audioLoading
  } = useQuranAudioBasic(settings.reciter);
  
  // تحميل الصفحة الأولية بناءً على المعلمات
  useEffect(() => {
    let targetPage = initialPage;
    
    // إذا كان هناك معلمات من الرابط، استخدمها
    if (params.pageNumber) {
      const pageNum = parseInt(params.pageNumber, 10);
      // نتحقق من صحة الرقم
      if (!isNaN(pageNum)) {
        targetPage = pageNum;
      }
    } else if (params.surahNumber) {
      // إذا كان هناك رقم سورة، ابحث عن الصفحة المناسبة
      const surahNumber = parseInt(params.surahNumber, 10);
      
      // نتحقق من صحة الرقم
      if (!isNaN(surahNumber) && surahNumber >= 1 && surahNumber <= 114) {
        // نستخدم تقدير مؤقت لأرقام الصفحات
        // في التطبيق النهائي، يجب أن تكون هذه البيانات دقيقة من مصدر موثوق
        targetPage = Math.min(surahNumber * 5, APP_CONFIG.TOTAL_PAGES);
      }
    }
    
    // التأكد من أن رقم الصفحة ضمن النطاق الصحيح
    if (targetPage < 1) targetPage = 1;
    if (targetPage > APP_CONFIG.TOTAL_PAGES) targetPage = APP_CONFIG.TOTAL_PAGES;
    
    // نمنع الحلقة اللانهائية من خلال التحقق من تغير الصفحة فعلياً
    if (currentPage !== targetPage) {
      setCurrentPage(targetPage);
      
      // تحديث آخر صفحة مقروءة
      if (settings.autoSaveLastRead) {
        updateLastRead({
          surahNumber: 1, // سيتم تحديثه عند معرفة رقم السورة بشكل صحيح
          ayahNumber: 1, // سيتم تحديثه عند معرفة رقم الآية بشكل صحيح
          pageNumber: targetPage
        });
      }
    }
  }, [params.pageNumber, params.surahNumber, initialPage, settings.autoSaveLastRead, updateLastRead, currentPage]);
  
  // التنقل إلى الصفحة التالية
  const goToNextPage = () => {
    if (currentPage < APP_CONFIG.TOTAL_PAGES) {
      setCurrentPage(prev => prev + 1);
      setLocation(`/page/${currentPage + 1}`);
    }
  };
  
  // التنقل إلى الصفحة السابقة
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      setLocation(`/page/${currentPage - 1}`);
    }
  };
  
  // عند اختيار آية
  const handleVerseSelect = useCallback((surahNumber: number, verseNumber: number, pageNumber: number) => {
    setSelectedVerse({ surahNumber, verseNumber, pageNumber });
    
    // اختياريًا: تشغيل صوت الآية
    if (settings.autoPlayAudio) {
      playVerse(surahNumber, verseNumber);
    }
  }, [settings.autoPlayAudio, playVerse]);
  
  // إضافة إشارة مرجعية
  const handleAddBookmark = () => {
    if (selectedVerse) {
      const bookmarkData = {
        surahNumber: selectedVerse.surahNumber,
        ayahNumber: selectedVerse.verseNumber, // تحويل verseNumber إلى ayahNumber
        pageNumber: selectedVerse.pageNumber
      };
      addBookmark(bookmarkData);
      toast({
        title: "تمت الإضافة",
        description: "تمت إضافة الإشارة المرجعية بنجاح",
        variant: "default",
      });
    } else {
      // إضافة إشارة مرجعية للصفحة الحالية
      const bookmarkData = {
        surahNumber: 1, // سيتم تحديثه عند معرفة رقم السورة بشكل صحيح
        ayahNumber: 1, 
        pageNumber: currentPage
      };
      addBookmark(bookmarkData);
      toast({
        title: "تمت الإضافة",
        description: "تمت إضافة الصفحة إلى الإشارات المرجعية",
        variant: "default",
      });
    }
  };
  
  // مشاركة الآية أو الصفحة
  const handleShare = () => {
    if (selectedVerse) {
      // مشاركة الآية
      const url = `${window.location.origin}/surah/${selectedVerse.surahNumber}/${selectedVerse.verseNumber}`;
      navigator.clipboard.writeText(url);
      toast({
        title: "تم النسخ",
        description: "تم نسخ رابط الآية إلى الحافظة",
        variant: "default",
      });
    } else {
      // مشاركة الصفحة
      const url = `${window.location.origin}/page/${currentPage}`;
      navigator.clipboard.writeText(url);
      toast({
        title: "تم النسخ",
        description: "تم نسخ رابط الصفحة إلى الحافظة",
        variant: "default",
      });
    }
  };
  
  // التبديل بين إظهار وإخفاء أدوات التحكم
  const toggleControls = () => {
    // تحديث وقت آخر تفاعل
    setLastInteraction(Date.now());
    setShowControls(prev => !prev);
  };
  
  // إخفاء عناصر التحكم تلقائيًا بعد مرور فترة من الزمن
  useEffect(() => {
    if (!showControls) return; // لا نحتاج إلى المؤقت إذا كانت عناصر التحكم مخفية بالفعل
    
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 5000); // 5 ثوانٍ بعد آخر تفاعل
    
    return () => clearTimeout(timer);
  }, [showControls, lastInteraction]);
  
  return (
    <div 
      className={cn(
        "quran-mushaf h-screen flex flex-col bg-[#f8f7f2] overflow-hidden",
        className
      )}
      onClick={toggleControls}
    >
      {/* شريط التنقل العلوي - يظهر فقط عند تفعيل أدوات التحكم */}
      {showControls && (
        <header className="mushaf-header bg-white shadow-sm p-4 transition-all">
          <div className="container mx-auto flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setIsNavbarOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
            
            <h1 className="text-xl font-bold text-center flex-1">
              {SURAH_NAMES.find(s => s.number === (selectedVerse?.surahNumber || 1))?.name || 'القرآن الكريم'} 
            </h1>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setLocation('/settings')}>
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>
      )}
      
      {/* المحتوى الرئيسي */}
      <main className="mushaf-content flex-1 overflow-auto relative">
        <KingFahdMushafPage 
          pageNumber={currentPage}
          onVerseSelect={handleVerseSelect}
          highlightedVerse={currentVerse || selectedVerse || undefined}
          className="min-h-[80vh]"
        />
        
        {/* الشريط الجانبي للتنقل بين السور */}
        <QuranNavSidebar 
          isOpen={isNavbarOpen}
          onClose={() => setIsNavbarOpen(false)}
          currentPage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page);
            setLocation(`/page/${page}`);
            setIsNavbarOpen(false);
          }}
        />
        
        {/* ظهور التفسير عند اختيار آية */}
        {selectedVerse && (
          <VersePopover 
            surahNumber={selectedVerse.surahNumber}
            verseNumber={selectedVerse.verseNumber}
            onClose={() => setSelectedVerse(null)}
          />
        )}
      </main>
      
      {/* شريط التنقل السفلي - يظهر فقط عند تفعيل أدوات التحكم */}
      {showControls && (
        <footer className="mushaf-footer bg-white shadow-sm p-3 transition-all">
          <div className="container mx-auto flex items-center justify-between">
            <Button 
              variant="outline" 
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                goToPreviousPage();
              }}
              disabled={currentPage <= 1}
              className="bg-white/95 hover:bg-white shadow-sm"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={(e) => {
                e.stopPropagation();
                handleAddBookmark();
              }}
              className="bg-white/95 hover:bg-white shadow-sm">
                <BookmarkPlus className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="icon" onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="bg-white/95 hover:bg-white shadow-sm">
                <Share2 className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                disabled={audioLoading}
                className="bg-white/95 hover:bg-white shadow-sm"
              >
                {isPlaying ? (
                  <PauseCircle className="h-5 w-5" />
                ) : (
                  <PlayCircle className="h-5 w-5" />
                )}
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                goToNextPage();
              }}
              disabled={currentPage >= APP_CONFIG.TOTAL_PAGES}
              className="bg-white/95 hover:bg-white shadow-sm"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="text-center text-xs text-gray-500 mt-2">
            صفحة {currentPage} من {APP_CONFIG.TOTAL_PAGES}
          </div>
        </footer>
      )}
      
      {/* زر العودة للأعلى - يظهر عند النزول في الصفحة */}
      <div className="floating-button" onClick={(e) => {
        e.stopPropagation();
        document.querySelector('.mushaf-content')?.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }}>
        <ChevronRight className="h-6 w-6 rotate-90" />
      </div>
    </div>
  );
};

export default KingFahdMushaf;