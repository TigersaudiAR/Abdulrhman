import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SURAH_NAMES, TOTAL_PAGES } from '@/lib/constants';
import { BookmarkIcon, Clock, BookOpen, Search, ArrowRight } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useApp } from '@/context/AppContext';

// واجهة للإشارة المرجعية من AppContext
interface BookmarkItem {
  surahNumber: number;
  ayahNumber: number;
  pageNumber: number;
  timestamp: string;
}

// واجهة لآخر قراءة من AppContext
interface LastRead {
  surahNumber: number;
  ayahNumber: number;
  pageNumber: number;
  timestamp: string;
}

interface QuranNavSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: number;
  onPageSelect: (page: number) => void;
  bookmarks: BookmarkItem[];
  lastRead: LastRead | null;
}

/**
 * شريط تنقل القرآن - يعرض قائمة السور والإشارات المرجعية وآخر قراءة
 */
export function QuranNavSidebar({
  isOpen,
  onClose,
  currentPage,
  onPageSelect,
  bookmarks,
  lastRead
}: QuranNavSidebarProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('surahs');
  
  // تصفية السور بناءً على البحث
  const filteredSurahs = SURAH_NAMES.filter(surah => 
    surah.name.includes(searchQuery) || 
    surah.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.translation.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // عرض الوقت النسبي منذ آخر قراءة
  const formatRelativeTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return formatDistance(date, new Date(), { 
        addSuffix: true,
        locale: ar
      });
    } catch (e) {
      return 'غير معروف';
    }
  };
  
  // اختيار السورة
  const handleSurahSelect = (surahNumber: number) => {
    // هنا يمكننا تحويل رقم السورة إلى رقم الصفحة
    // هذا مجرد مثال بسيط، يمكن تنفيذ تعيين أكثر دقة
    const estimatedPage = Math.max(1, Math.min(TOTAL_PAGES, surahNumber * 5));
    onPageSelect(estimatedPage);
    onClose();
  };
  
  // اختيار إشارة مرجعية
  const handleBookmarkSelect = (bookmark: BookmarkItem) => {
    onPageSelect(bookmark.pageNumber);
    onClose();
  };
  
  // العودة إلى آخر قراءة
  const handleLastReadSelect = () => {
    if (lastRead) {
      onPageSelect(lastRead.pageNumber);
      onClose();
    }
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[350px]">
        <SheetHeader>
          <SheetTitle className="text-center text-xl">القرآن الكريم</SheetTitle>
        </SheetHeader>
        
        <div className="my-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن سورة..."
              className="pl-8 rtl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="surahs" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="surahs" className="text-xs">
              <BookOpen className="h-4 w-4 mr-1" />
              السور
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="text-xs">
              <BookmarkIcon className="h-4 w-4 mr-1" />
              الإشارات
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs">
              <Clock className="h-4 w-4 mr-1" />
              آخر قراءة
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="surahs" className="mt-0">
            <ScrollArea className="h-[70vh]">
              <div className="space-y-1 rtl">
                {filteredSurahs.map((surah) => (
                  <Button
                    key={surah.number}
                    variant="ghost"
                    className="w-full justify-between font-medium"
                    onClick={() => handleSurahSelect(surah.number)}
                  >
                    <span className="flex items-center">
                      <span className="w-7 h-7 rounded-full border flex items-center justify-center text-xs mr-2">
                        {surah.number}
                      </span>
                      {surah.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{surah.totalVerses} آية</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="bookmarks" className="mt-0">
            <ScrollArea className="h-[70vh]">
              <div className="space-y-4 rtl">
                {bookmarks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookmarkIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>لا توجد إشارات مرجعية محفوظة</p>
                  </div>
                ) : (
                  bookmarks.map((bookmark, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-accent group cursor-pointer"
                      onClick={() => handleBookmarkSelect(bookmark)}
                    >
                      <div>
                        <p className="font-medium">صفحة {bookmark.pageNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatRelativeTime(bookmark.timestamp)}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="history" className="mt-0">
            <div className="space-y-4 rtl">
              {!lastRead ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>لا توجد قراءة سابقة</p>
                </div>
              ) : (
                <div
                  className="flex items-center justify-between p-4 rounded-md border hover:bg-accent group cursor-pointer"
                  onClick={handleLastReadSelect}
                >
                  <div>
                    <p className="font-medium text-lg">استئناف القراءة</p>
                    <p>صفحة {lastRead.pageNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(lastRead.timestamp)}
                    </p>
                  </div>
                  <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    انتقل
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}