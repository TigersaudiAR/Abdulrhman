import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// واجهة سياق السمة
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// إنشاء سياق السمة
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// مزود سياق السمة
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // التعرف على سمة النظام
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // تكوين الحالة الداخلية
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // جلب السمة من التخزين المحلي
    const savedTheme = localStorage.getItem('theme');
    
    // إذا كانت هناك سمة محفوظة، استخدمها
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    
    // وإلا، استخدم سمة النظام
    return prefersDarkMode ? 'dark' : 'light';
  });
  
  // تحديث السمة في التخزين المحلي وتوثيق الصفحة عند تغيير السمة
  useEffect(() => {
    // تحديث سمة التوثيق
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    
    // تحديث التخزين المحلي
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // الاستماع إلى تغييرات سمة النظام
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // تحقق مما إذا كانت هناك سمة مخصصة محفوظة أم لا
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // البديل القديم لمتصفحات قديمة
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);
  
  // تبديل السمة
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  // قيمة السياق
  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// خطاف لاستخدام سياق السمة
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};