import { useLocation } from 'wouter';
import { useTheme } from '../../context/ThemeContext';
import { APP_CONFIG } from '../../lib/constants';

const Sidebar = () => {
  const [location, setLocation] = useLocation();
  const { toggleTheme, theme, setTheme } = useTheme();
  
  const navItems = [
    { path: '/', icon: 'fas fa-home', label: 'الرئيسية' },
    { path: '/quran', icon: 'fas fa-book-quran', label: 'القرآن الكريم' },
    { path: '/prayer', icon: 'fas fa-mosque', label: 'مواقيت الصلاة' },
    { path: '/memorization', icon: 'fas fa-brain', label: 'الحفظ والمراجعة' },
    { path: '/tafsir', icon: 'fas fa-book-open', label: 'التفسير' },
    { path: '/hadith', icon: 'fas fa-scroll', label: 'الأحاديث النبوية' },
    { path: '/duas', icon: 'fas fa-hands-praying', label: 'الأدعية والأذكار' },
    { path: '/hajj', icon: 'fas fa-kaaba', label: 'الحج والعمرة' },
    { path: '/settings', icon: 'fas fa-gear', label: 'الإعدادات' }
  ];
  
  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };
  
  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log(`Changing theme from ${theme} to ${newTheme}`);
    setTheme(newTheme);
    
    // إضافة تغيير وضع الألوان على مستوى HTML أيضًا للتأكد من التطبيق الصحيح
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    
    // حفظ الإعداد في التخزين المحلي
    localStorage.setItem('quranAppTheme', newTheme);
  };
  
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 shadow-lg z-10">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">القرآن التعليمي</h1>
        <button 
          className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300" 
          onClick={handleThemeToggle}
          aria-label={theme === 'dark' ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
        >
          {theme === 'dark' ? (
            <i className="fas fa-sun"></i>
          ) : (
            <i className="fas fa-moon"></i>
          )}
        </button>
      </div>
      
      <div className="overflow-y-auto flex-1">
        <nav className="p-2">
          <ul>
            {navItems.map((item) => (
              <li className="mb-1" key={item.path}>
                <a 
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    setLocation(item.path);
                  }}
                  className={`flex items-center p-3 rounded-lg ${
                    isActive(item.path) 
                      ? 'bg-primary bg-opacity-10 text-primary font-medium dark:bg-primary dark:bg-opacity-20 dark:text-primary-foreground' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <i className={`${item.icon} w-6`}></i>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <div>إصدار {APP_CONFIG.version}</div>
          <div>© {new Date().getFullYear()} {APP_CONFIG.developer}</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
