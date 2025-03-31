import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { copyQuranText, shareQuranPage } from '../../lib/quran-share';
import { useToast } from '../../hooks/use-toast';

interface SelectionMenuProps {
  selectedText: string;
  position: { x: number; y: number };
  surahNumber?: number;
  verseNumber?: number;
  pageNumber: number;
  onClose: () => void;
  onShowTafsir?: () => void;
}

/**
 * قائمة الخيارات التي تظهر عند تحديد النص
 * توفر خيارات النسخ والمشاركة والحفظ وعرض التفسير
 */
const SelectionMenu: React.FC<SelectionMenuProps> = ({
  selectedText,
  position,
  surahNumber,
  verseNumber,
  pageNumber,
  onClose,
  onShowTafsir
}) => {
  const { addBookmark } = useApp();
  const { toast } = useToast();
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  // ضبط موقع القائمة حتى لا تخرج عن حدود الشاشة
  useEffect(() => {
    if (menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      let adjustedX = position.x;
      let adjustedY = position.y;
      
      // ضبط الموقع الأفقي
      if (position.x + menuRect.width > windowWidth) {
        adjustedX = windowWidth - menuRect.width - 10;
      }
      
      // ضبط الموقع الرأسي
      if (position.y + menuRect.height > windowHeight) {
        adjustedY = windowHeight - menuRect.height - 10;
      }
      
      setAdjustedPosition({ x: adjustedX, y: adjustedY });
    }
  }, [position]);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // نسخ النص المحدد
  const handleCopyText = async () => {
    try {
      await copyQuranText(selectedText, pageNumber, surahNumber ? `سورة ${surahNumber}` : undefined);
      toast({
        title: "تم النسخ",
        description: "تم نسخ النص إلى الحافظة",
        variant: "default"
      });
      onClose();
    } catch (error) {
      console.error('Error copying text:', error);
      toast({
        title: "خطأ",
        description: "تعذر نسخ النص. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    }
  };

  // مشاركة النص المحدد
  const handleShareText = async () => {
    try {
      await shareQuranPage(pageNumber, surahNumber ? `سورة ${surahNumber}` : undefined, selectedText);
      toast({
        title: "مشاركة",
        description: "تمت مشاركة النص بنجاح",
        variant: "default"
      });
      onClose();
    } catch (error) {
      console.error('Error sharing text:', error);
      toast({
        title: "خطأ",
        description: "تعذر مشاركة النص. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    }
  };

  // إضافة إشارة مرجعية
  const handleAddBookmark = () => {
    if (surahNumber && verseNumber) {
      addBookmark({ 
        surahNumber, 
        ayahNumber: verseNumber, 
        pageNumber 
      });
      
      toast({
        title: "إشارة مرجعية",
        description: "تمت إضافة الإشارة المرجعية بنجاح",
        variant: "default"
      });
      
      onClose();
    } else {
      toast({
        title: "تنبيه",
        description: "لا يمكن إضافة إشارة مرجعية للنص المحدد. يرجى تحديد آية كاملة.",
        variant: "destructive"
      });
    }
  };

  // عرض التفسير
  const handleShowTafsir = () => {
    if (onShowTafsir) {
      onShowTafsir();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'fixed',
          top: `${adjustedPosition.y}px`,
          left: `${adjustedPosition.x}px`,
          zIndex: 1000,
        }}
        className="selection-menu bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 min-w-40"
      >
        <div className="menu-options" dir="rtl">
          <button
            onClick={handleCopyText}
            className="menu-option w-full text-right px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-800 dark:text-gray-200">نسخ</span>
          </button>
          
          <button
            onClick={handleShareText}
            className="menu-option w-full text-right px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="text-gray-800 dark:text-gray-200">مشاركة</span>
          </button>
          
          <button
            onClick={handleAddBookmark}
            className="menu-option w-full text-right px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="text-gray-800 dark:text-gray-200">إضافة إشارة مرجعية</span>
          </button>
          
          {onShowTafsir && (
            <button
              onClick={handleShowTafsir}
              className="menu-option w-full text-right px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-gray-800 dark:text-gray-200">عرض التفسير</span>
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SelectionMenu;