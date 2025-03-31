import { useState, useCallback, useEffect } from 'react';
import { getSurahs } from '../lib/quran-api';
import { QuranData, LastRead, Juz, Surah } from '../types/quran';
import { SURAH_NAMES } from '../lib/constants';

// بيانات ثابتة للأجزاء للاستخدام في حالة فشل الاتصال بالـ API
const staticJuzData: Juz[] = Array.from({ length: 30 }, (_, i) => ({
  number: i + 1,
  ayahs: []
}));

// بيانات ثابتة للسور - تحويل من مصفوفة SURAH_NAMES إلى التنسيق المطلوب للنوع Surah
const staticSurahData: Surah[] = SURAH_NAMES.map((name, index) => ({
  number: index + 1,
  name: String(name), // التأكد من أن name هو نص (string)
  englishName: String(name),
  englishNameTranslation: String(name),
  numberOfAyahs: 0, // عدد آيات السورة الافتراضي
  revelationType: 'Meccan' // نوع النزول الافتراضي
}));

export function useQuranData() {
  const [lastRead, setLastRead] = useState<LastRead | null>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [quranData, setQuranData] = useState<QuranData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // جلب بيانات القرآن الكريم من API
  useEffect(() => {
    const fetchQuranData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // جلب قائمة السور من API
        const surahsResponse = await getSurahs();
        
        // تكوين بيانات القرآن
        setQuranData({
          surahs: surahsResponse?.surahs?.list || staticSurahData,
          juzs: staticJuzData,
          pages: [], 
          editions: []
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching Quran data:', error);
        
        // استخدام البيانات الثابتة في حالة الفشل
        setQuranData({
          surahs: staticSurahData,
          juzs: staticJuzData,
          pages: [],
          editions: []
        });
        
        setError('تعذر الاتصال بالخادم. نستخدم البيانات المخزنة محلياً.');
        setIsLoading(false);
      }
    };

    fetchQuranData();
    
    // استرداد آخر قراءة من التخزين المحلي عند تهيئة الهوك
    const savedLastRead = getLastReadFromStorage();
    if (savedLastRead) {
      setLastRead(savedLastRead);
    }
    
    // استرداد الفواصل من التخزين المحلي
    const savedBookmarks = localStorage.getItem('quran_bookmarks');
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (error) {
        console.error('Error parsing bookmarks:', error);
      }
    }
  }, []);
  
  // استرجاع آخر قراءة من التخزين المحلي
  const getLastReadFromStorage = useCallback((): LastRead | null => {
    const savedLastRead = localStorage.getItem('quran_last_read');
    if (savedLastRead) {
      try {
        return JSON.parse(savedLastRead);
      } catch (error) {
        console.error('Error parsing last read data:', error);
        return null;
      }
    }
    return null;
  }, []);
  
  // تحديث آخر قراءة
  const updateLastRead = useCallback((newLastRead: Partial<LastRead> & { surahNumber: number; ayahNumber: number; pageNumber: number }) => {
    // الحصول على اسم السورة إذا لم يكن موجودًا
    const surahName = newLastRead.surahName || `سورة ${newLastRead.surahNumber}`;
    
    const lastReadData: LastRead = {
      surahName,
      surahNumber: newLastRead.surahNumber,
      ayahNumber: newLastRead.ayahNumber,
      pageNumber: newLastRead.pageNumber,
      text: newLastRead.text || '',
      timestamp: new Date().toISOString(),
      description: newLastRead.description,
    };
    
    // حفظ في التخزين المحلي
    localStorage.setItem('quran_last_read', JSON.stringify(lastReadData));
    
    // تحديث الحالة
    setLastRead(lastReadData);
  }, []);
  
  // إضافة فاصل جديد
  const addBookmark = useCallback((bookmark: { surahNumber: number; ayahNumber: number; pageNumber: number; description?: string }) => {
    const newBookmark = {
      id: Date.now().toString(),
      ...bookmark,
      timestamp: new Date().toISOString(),
    };
    
    setBookmarks(prevBookmarks => {
      const updatedBookmarks = [...prevBookmarks, newBookmark];
      localStorage.setItem('quran_bookmarks', JSON.stringify(updatedBookmarks));
      return updatedBookmarks;
    });
  }, []);
  
  // حذف فاصل
  const removeBookmark = useCallback((bookmarkId: string) => {
    setBookmarks(prevBookmarks => {
      const updatedBookmarks = prevBookmarks.filter(bookmark => bookmark.id !== bookmarkId);
      localStorage.setItem('quran_bookmarks', JSON.stringify(updatedBookmarks));
      return updatedBookmarks;
    });
  }, []);
  
  return {
    quranData,
    isLoading,
    error,
    lastRead,
    updateLastRead,
    bookmarks,
    addBookmark,
    removeBookmark,
  };
}