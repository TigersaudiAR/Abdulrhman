import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { APP_CONFIG, RECITERS } from '../lib/constants';

// واجهة إعدادات التطبيق
interface AppSettings {
  reciter: string;
  translation: string;
  fontSize: number;
  showTranslation: boolean;
  autoPlayAudio: boolean;
  prayerMethod: number;
  showNextPrayer: boolean;
  highlightCurrentVerse: boolean;
  autoSaveLastRead: boolean;
}

// واجهة عنصر الإشارة المرجعية
interface BookmarkItem {
  surahNumber: number;
  ayahNumber: number;
  pageNumber: number;
  timestamp: string;
}

// واجهة آخر قراءة
interface LastRead {
  surahNumber: number;
  ayahNumber: number;
  pageNumber: number;
  timestamp: string;
}

// واجهة سياق التطبيق
interface AppContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  bookmarks: BookmarkItem[];
  addBookmark: (bookmark: { surahNumber: number; ayahNumber: number; pageNumber: number }) => void;
  removeBookmark: (index: number) => void;
  lastRead: LastRead | null;
  updateLastRead: (lastRead: { surahNumber: number; ayahNumber: number; pageNumber: number }) => void;
}

// الإعدادات الافتراضية
const defaultSettings: AppSettings = {
  reciter: APP_CONFIG.DEFAULT_RECITER,
  translation: APP_CONFIG.DEFAULT_TRANSLATION,
  fontSize: 16, // Default font size
  showTranslation: true,
  autoPlayAudio: false,
  prayerMethod: 2, // Default prayer calculation method (2 is for Islamic Society of North America)
  showNextPrayer: true,
  highlightCurrentVerse: true,
  autoSaveLastRead: true,
};

// إنشاء سياق التطبيق
export const AppContext = createContext<AppContextType | undefined>(undefined);

// مزود سياق التطبيق
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // الحالة الداخلية
  const [settings, setSettings] = useState<AppSettings>(() => {
    // جلب الإعدادات من التخزين المحلي، أو استخدام الإعدادات الافتراضية
    const savedSettings = localStorage.getItem('quranAppSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });
  
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    // جلب الإشارات المرجعية من التخزين المحلي، أو استخدام مصفوفة فارغة
    const savedBookmarks = localStorage.getItem('quranAppBookmarks');
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  });
  
  const [lastRead, setLastRead] = useState<LastRead | null>(() => {
    // جلب آخر قراءة من التخزين المحلي، أو استخدام null
    const savedLastRead = localStorage.getItem('quranAppLastRead');
    return savedLastRead ? JSON.parse(savedLastRead) : null;
  });
  
  // حفظ الإعدادات في التخزين المحلي عند تغييرها
  useEffect(() => {
    localStorage.setItem('quranAppSettings', JSON.stringify(settings));
  }, [settings]);
  
  // حفظ الإشارات المرجعية في التخزين المحلي عند تغييرها
  useEffect(() => {
    localStorage.setItem('quranAppBookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);
  
  // حفظ آخر قراءة في التخزين المحلي عند تغييرها
  useEffect(() => {
    if (lastRead) {
      localStorage.setItem('quranAppLastRead', JSON.stringify(lastRead));
    }
  }, [lastRead]);
  
  // تحديث الإعدادات
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings,
    }));
  };
  
  // إضافة إشارة مرجعية
  const addBookmark = (bookmark: { surahNumber: number; ayahNumber: number; pageNumber: number }) => {
    const newBookmark: BookmarkItem = {
      ...bookmark,
      timestamp: new Date().toISOString(),
    };
    setBookmarks(prevBookmarks => [...prevBookmarks, newBookmark]);
  };
  
  // إزالة إشارة مرجعية
  const removeBookmark = (index: number) => {
    setBookmarks(prevBookmarks => prevBookmarks.filter((_, i) => i !== index));
  };
  
  // تحديث آخر قراءة
  const updateLastRead = (lastReadData: { surahNumber: number; ayahNumber: number; pageNumber: number }) => {
    const newLastRead: LastRead = {
      ...lastReadData,
      timestamp: new Date().toISOString(),
    };
    setLastRead(newLastRead);
  };
  
  // قيمة السياق
  const contextValue: AppContextType = {
    settings,
    updateSettings,
    bookmarks,
    addBookmark,
    removeBookmark,
    lastRead,
    updateLastRead,
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// خطاف لاستخدام سياق التطبيق
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};