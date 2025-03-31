import { ReactNode } from 'react';
import { useLocation, Link } from 'wouter';
import { cn } from '../../lib/utils';
import { 
  Book,
  Clock, 
  BookOpen, 
  MessageSquare, 
  Search, 
  Settings, 
  Compass, 
  Home,
  BookMarked,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface MainLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
}

export function MainLayout({ children, showNavigation = true }: MainLayoutProps) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: 'الرئيسية', path: '/', icon: Home },
    { name: 'القرآن', path: '/quran', icon: BookOpen },
    { name: 'الصلاة', path: '/prayer', icon: Clock },
    { name: 'الحديث', path: '/hadith', icon: MessageSquare },
    { name: 'القبلة', path: '/qibla', icon: Compass },
    { name: 'الإعدادات', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* محتوى رئيسي */}
      <div className="flex-1 container py-4 px-4 md:px-6">
        {children}
      </div>

      {/* قائمة تنقل سفلية */}
      {showNavigation && (
        <div className="sticky bottom-0 z-10 border-t bg-background pt-2 pb-safe">
          <div className="container px-4">
            <nav className="flex justify-around">
              {navItems.map((item) => {
                const isActive = location === item.path;
                const Icon = item.icon;
                
                return (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    className="flex flex-col items-center"
                  >
                    <span className={cn(
                      "p-2 rounded-full", 
                      isActive 
                        ? "text-primary bg-primary/10" 
                        : "text-foreground/60 hover:text-foreground/80"
                    )}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className={cn(
                      "text-xs",
                      isActive ? "text-primary font-medium" : "text-foreground/60"
                    )}>
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}