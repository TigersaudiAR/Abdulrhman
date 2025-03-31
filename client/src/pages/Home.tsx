import { Link } from 'wouter';
import { MainLayout } from '../components/layout/MainLayout';
import { 
  BookOpen, 
  Clock, 
  MessageSquare, 
  Compass, 
  BookMarked, 
  PenLine, 
  BookText,
  ListChecks,
  Landmark
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

export default function Home() {
  const { lastRead } = useApp();

  const featuredItems = [
    { 
      name: 'القرآن الكريم', 
      description: 'قراءة القرآن بإصدار مجمع الملك فهد', 
      path: '/quran', 
      icon: BookOpen,
      color: 'bg-green-500/20 text-green-600'
    },
    { 
      name: 'مواقيت الصلاة', 
      description: 'أوقات الصلاة حسب موقعك الحالي', 
      path: '/prayer', 
      icon: Clock,
      color: 'bg-blue-500/20 text-blue-600'
    },
    { 
      name: 'الحديث الشريف', 
      description: 'تصفح الأحاديث النبوية الشريفة', 
      path: '/hadith', 
      icon: MessageSquare,
      color: 'bg-purple-500/20 text-purple-600'
    },
    { 
      name: 'اتجاه القبلة', 
      description: 'تحديد اتجاه القبلة من موقعك', 
      path: '/qibla', 
      icon: Compass,
      color: 'bg-amber-500/20 text-amber-600'
    },
  ];

  const secondaryItems = [
    { name: 'التفسير', path: '/tafsir', icon: BookText, color: 'bg-orange-500/20 text-orange-600' },
    { name: 'الأدعية', path: '/duas', icon: PenLine, color: 'bg-sky-500/20 text-sky-600' },
    { name: 'الحفظ', path: '/memorization', icon: BookMarked, color: 'bg-pink-500/20 text-pink-600' },
    { name: 'الحج', path: '/hajj', icon: Landmark, color: 'bg-indigo-500/20 text-indigo-600' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-2">تطبيق القرآن الكريم</h1>
        </div>

        {lastRead && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">آخر قراءة</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">{lastRead.surahNumber}. سورة الفاتحة</div>
                  <div className="text-sm text-muted-foreground">الآية {lastRead.ayahNumber}</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  صفحة {lastRead.pageNumber}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Link
                to={`/quran/${lastRead.pageNumber}`}
                className="text-primary font-medium text-sm"
              >
                متابعة القراءة
              </Link>
            </CardFooter>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-medium">الأقسام الرئيسية</h2>
          <div className="grid grid-cols-2 gap-4">
            {featuredItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <div className="border rounded-lg p-4 h-full hover:bg-accent/50 transition-colors">
                  <div className="flex flex-col h-full">
                    <div className={cn(
                      "p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3",
                      item.color
                    )}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex-1">
                      {item.description}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-medium">أقسام أخرى</h2>
          <div className="grid grid-cols-4 gap-3">
            {secondaryItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <div className="border rounded-lg p-3 flex flex-col items-center text-center hover:bg-accent/50 transition-colors">
                  <div className={cn(
                    "p-2 rounded-full w-10 h-10 flex items-center justify-center mb-2",
                    item.color
                  )}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="text-sm font-medium">{item.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}