import React from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'wouter';
import { SURAH_NAMES } from '../../lib/constants';
import { formatArabicDate } from '../../lib/utils';

/**
 * مكوّن عرض الإشارات المرجعية المحفوظة للمستخدم
 * يعرض قائمة بالإشارات المرجعية مع إمكانية الانتقال إليها أو حذفها
 */
const QuranBookmarks: React.FC = () => {
  const { bookmarks, removeBookmark } = useApp();
  
  if (bookmarks.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-amber-50 dark:bg-gray-800 text-center">
        <p className="text-amber-900 dark:text-amber-200">
          لا توجد إشارات مرجعية محفوظة.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200">
        الإشارات المرجعية
      </h3>
      
      <div className="space-y-2">
        {bookmarks.map((bookmark, index) => {
          // البحث عن اسم السورة المناسب من مصفوفة أسماء السور
          const surahInfo = SURAH_NAMES.find(surah => surah.number === bookmark.surahNumber);
          const surahName = surahInfo ? surahInfo.name : `سورة ${bookmark.surahNumber}`;
          const timestamp = new Date(bookmark.timestamp);
          
          return (
            <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-amber-100 dark:border-amber-900/20">
              <div className="flex flex-col">
                <Link href={`/quran/page/${bookmark.pageNumber}`} className="text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-200 font-medium">
                  {surahName} - آية {bookmark.ayahNumber}
                </Link>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>صفحة {bookmark.pageNumber}</span>
                  <span className="mx-2">•</span>
                  <span>{formatArabicDate(timestamp)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Link
                  href={`/quran/page/${bookmark.pageNumber}`}
                  className="p-1 rounded-md hover:bg-amber-50 dark:hover:bg-gray-700 text-amber-700 dark:text-amber-300"
                  title="الانتقال إلى الإشارة المرجعية"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"></path>
                  </svg>
                </Link>
                
                <button
                  onClick={() => removeBookmark(index)}
                  className="p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400"
                  title="حذف الإشارة المرجعية"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuranBookmarks;