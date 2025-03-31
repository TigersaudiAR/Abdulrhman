import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, BookmarkPlus, Share2, Info } from 'lucide-react';
import { useHighlightAnimation } from '../../hooks/useHighlightAnimation';

interface HighlightedVerseProps {
  verseText: string;
  verseNumber: number;
  surahNumber: number;
  isActive?: boolean;
  isPlaying?: boolean;
  onClick?: () => void;
  onVerseEnter?: () => void;
  onVerseLeave?: () => void;
  fontSize?: number;
  fontFamily?: string;
  withAnimation?: boolean;
  translation?: string;
}

/**
 * مكوّن عرض الآيات مع تأثيرات الإبراز والرسوم المتحركة
 * يقوم بإبراز الآية الحالية أثناء القراءة أو الاستماع
 */
const HighlightedVerse: React.FC<HighlightedVerseProps> = ({
  verseText,
  verseNumber,
  surahNumber,
  isActive = false,
  isPlaying = false,
  onClick,
  onVerseEnter,
  onVerseLeave,
  fontSize = 22,
  fontFamily = 'Hafs',
  withAnimation = true,
  translation
}) => {
  const verseRef = useRef<HTMLDivElement>(null);
  const [showActions, setShowActions] = useState(false);
  const { highlightElement } = useHighlightAnimation();
  
  // تطبيق تأثير الإبراز عند تفعيل الآية
  useEffect(() => {
    if (isActive && verseRef.current && withAnimation) {
      highlightElement(verseRef.current, {
        duration: 2000,
        highlightColor: 'rgba(255, 193, 7, 0.2)'
      });
    }
  }, [isActive, highlightElement, withAnimation]);
  
  // معالجي الأحداث للتمرير فوق الآية
  const handleMouseEnter = () => {
    setShowActions(true);
    onVerseEnter && onVerseEnter();
  };
  
  const handleMouseLeave = () => {
    setShowActions(false);
    onVerseLeave && onVerseLeave();
  };
  
  return (
    <div 
      ref={verseRef}
      className={`
        relative group verse-container p-3 rounded-lg transition-colors duration-300
        ${isActive ? 'bg-amber-50 dark:bg-amber-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}
      `}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="verse-content relative" dir="rtl">
        <p 
          className="verse-text text-right"
          style={{ 
            fontSize: `${fontSize}px`,
            fontFamily: fontFamily,
            lineHeight: 2.2
          }}
        >
          {verseText}
          <span className="verse-number inline-block mr-1 text-amber-700 dark:text-amber-400">
            ﴿{verseNumber}﴾
          </span>
        </p>
        
        {translation && (
          <p className="verse-translation text-sm text-gray-600 dark:text-gray-400 mt-2 text-right">
            {translation}
          </p>
        )}
      </div>
      
      <AnimatePresence>
        {(isActive || showActions) && (
          <motion.div 
            className="verse-actions absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-white dark:bg-gray-800 shadow-md p-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <button 
              className="action-button p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-amber-600 dark:text-amber-400" 
              title={isPlaying ? "إيقاف الاستماع" : "استمع إلى الآية"}
              onClick={(e) => {
                e.stopPropagation();
                // إضافة منطق تشغيل الصوت
              }}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            
            <button 
              className="action-button p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-amber-600 dark:text-amber-400" 
              title="إضافة إلى المفضلة"
              onClick={(e) => {
                e.stopPropagation();
                // إضافة منطق الإضافة إلى المفضلة
              }}
            >
              <BookmarkPlus size={16} />
            </button>
            
            <button 
              className="action-button p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-amber-600 dark:text-amber-400" 
              title="عرض التفسير"
              onClick={(e) => {
                e.stopPropagation();
                // إضافة منطق فتح التفسير
              }}
            >
              <Info size={16} />
            </button>
            
            <button 
              className="action-button p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-amber-600 dark:text-amber-400" 
              title="مشاركة الآية"
              onClick={(e) => {
                e.stopPropagation();
                // إضافة منطق المشاركة
              }}
            >
              <Share2 size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HighlightedVerse;