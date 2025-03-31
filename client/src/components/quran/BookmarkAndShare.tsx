import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { copyQuranText, shareQuranPage } from '../../lib/quran-share';
import { useToast } from '../../hooks/use-toast';

interface BookmarkAndShareProps {
  surahNumber: number;
  ayahNumber: number;
  pageNumber: number;
  surahName: string;
  selectedText?: string;
}

/**
 * مكوّن الإشارات المرجعية ومشاركة النصوص
 * يوفر واجهة مستخدم لإضافة إشارة مرجعية ونسخ/مشاركة النص
 */
const BookmarkAndShare: React.FC<BookmarkAndShareProps> = ({
  surahNumber,
  ayahNumber,
  pageNumber,
  surahName,
  selectedText
}) => {
  const { addBookmark, bookmarks } = useApp();
  const { toast } = useToast();
  const [description, setDescription] = useState('');
  const [showBookmarkForm, setShowBookmarkForm] = useState(false);
  
  // التحقق ما إذا كانت الآية الحالية موجودة في الإشارات المرجعية
  const isBookmarked = bookmarks.some(
    bookmark => bookmark.surahNumber === surahNumber && bookmark.ayahNumber === ayahNumber
  );
  
  // إضافة إشارة مرجعية جديدة
  const handleAddBookmark = () => {
    addBookmark({
      surahNumber,
      ayahNumber,
      pageNumber
    });
    
    toast({
      title: 'تمت الإضافة',
      description: 'تمت إضافة الإشارة المرجعية بنجاح',
      variant: 'default',
    });
    
    setDescription('');
    setShowBookmarkForm(false);
  };
  
  // نسخ النص المحدد
  const handleCopy = async () => {
    const text = selectedText || '';
    const success = await copyQuranText(text, pageNumber, surahName);
    
    if (success) {
      toast({
        title: 'تم النسخ',
        description: 'تم نسخ النص إلى الحافظة',
        variant: 'default',
      });
    } else {
      toast({
        title: 'خطأ في النسخ',
        description: 'لم يتم نسخ النص بنجاح، حاول مرة أخرى',
        variant: 'destructive',
      });
    }
  };
  
  // مشاركة الصفحة الحالية
  const handleShare = async () => {
    const success = await shareQuranPage(pageNumber, surahName, selectedText);
    
    if (success) {
      toast({
        title: 'تمت المشاركة',
        description: 'تمت مشاركة الصفحة بنجاح',
        variant: 'default',
      });
    } else {
      toast({
        title: 'تم نسخ الرابط',
        description: 'تم نسخ رابط المشاركة إلى الحافظة',
        variant: 'default',
      });
    }
  };
  
  return (
    <div className="flex flex-col space-y-2 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200">
          الإشارات المرجعية والمشاركة
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        <button
          onClick={() => setShowBookmarkForm(!showBookmarkForm)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
            isBookmarked 
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200' 
              : 'bg-white text-amber-900 border border-amber-200 hover:bg-amber-50 dark:bg-gray-700 dark:text-amber-100 dark:border-amber-900/30 dark:hover:bg-gray-600'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
          </svg>
          {isBookmarked ? 'تمت الإضافة للإشارات' : 'إضافة إشارة مرجعية'}
        </button>
        
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-white text-amber-900 border border-amber-200 hover:bg-amber-50 dark:bg-gray-700 dark:text-amber-100 dark:border-amber-900/30 dark:hover:bg-gray-600"
          disabled={!selectedText}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
            <path d="M4 16c0-1.1.9-2 2-2h2"></path>
            <path d="M4 12c0-1.1.9-2 2-2h2"></path>
            <path d="M4 8c0-1.1.9-2 2-2h2"></path>
          </svg>
          نسخ
        </button>
        
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-white text-amber-900 border border-amber-200 hover:bg-amber-50 dark:bg-gray-700 dark:text-amber-100 dark:border-amber-900/30 dark:hover:bg-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
          مشاركة
        </button>
      </div>
      
      {showBookmarkForm && !isBookmarked && (
        <div className="mt-3 p-3 rounded-md bg-amber-50 dark:bg-amber-900/20">
          <div className="flex flex-col space-y-2">
            <label htmlFor="bookmark-description" className="text-sm font-medium text-amber-900 dark:text-amber-200">
              وصف الإشارة المرجعية (اختياري)
            </label>
            <input
              id="bookmark-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="أضف وصفًا اختياريًا لهذه الإشارة"
              className="px-3 py-2 rounded-md border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-800 dark:border-amber-900/30 dark:text-white"
            />
            <div className="flex justify-end">
              <button
                onClick={handleAddBookmark}
                className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:bg-amber-600 dark:hover:bg-amber-700"
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarkAndShare;