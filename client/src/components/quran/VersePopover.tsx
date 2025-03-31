import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, X, CopyCheck, Share2, Bookmark, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTafsir, getTranslation } from '@/lib/quran-api';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/context/AppContext';
import TajweedSpeechControls from './TajweedSpeechControls';

interface VersePopoverProps {
  surah: number;
  ayah: number;
  position: { x: number; y: number };
  onClose: () => void;
}

/**
 * نافذة منبثقة لعرض معلومات الآية وتفسيرها وترجمتها
 */
export function VersePopover({ surah, ayah, position, onClose }: VersePopoverProps) {
  const [tafsir, setTafsir] = useState<string>('');
  const [translation, setTranslation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('tafsir');
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [verseText, setVerseText] = useState<string>('');
  
  const { toast } = useToast();
  const { settings } = useApp();
  
  // تحديد موقع النافذة المنبثقة
  useEffect(() => {
    const handleResize = () => {
      calculatePosition();
    };
    
    calculatePosition();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [position]);
  
  // حساب موقع النافذة المنبثقة
  const calculatePosition = () => {
    const popoverWidth = 350;
    const popoverHeight = 400;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    let top = position.y;
    let left = position.x;
    
    // التأكد من أن النافذة المنبثقة لا تتجاوز حدود الشاشة
    if (left + popoverWidth > windowWidth) {
      left = left - popoverWidth;
    }
    
    if (top + popoverHeight > windowHeight) {
      top = top - popoverHeight;
    }
    
    // التأكد من أن النافذة لا تخرج عن حدود الشاشة من الجهة العلوية واليسرى
    if (left < 0) left = 10;
    if (top < 0) top = 10;
    
    setPopoverPosition({ top, left });
  };
  
  // جلب بيانات التفسير والترجمة
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // استخدام نص مؤقت بدلاً من الاتصال بالAPI
        // يمكن تعديل هذا لاحقًا عندما يكون API متاحًا بالكامل
        setTimeout(() => {
          // النص القرآني
          const sampleVerseText = `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ وَالْعَصْرِ إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ`;
          setVerseText(sampleVerseText);
          
          // التفسير والترجمة
          setTafsir(`تفسير الآية ${ayah} من سورة ${surah} - نص تفسير مؤقت حتى يتم ربط API التفسير بشكل صحيح.`);
          setTranslation(`Translation of verse ${ayah} from Surah ${surah} - Temporary translation text until the translation API is properly connected.`);
          setLoading(false);
        }, 1000);
        
        // عند تفعيل API يمكن استخدام الكود التالي:
        /*
        // جلب التفسير
        const tafsirData = await getTafsir('ar-muyassar', surah, ayah);
        setTafsir(tafsirData.text);
        
        // جلب الترجمة
        const translationData = await getTranslation('en-sahih', surah, ayah);
        setTranslation(translationData.text);
        
        // جلب نص الآية
        const verseData = await getVerse(surah, ayah);
        setVerseText(verseData.text);
        */
      } catch (err) {
        console.error('Error fetching verse data:', err);
        setError('حدث خطأ أثناء تحميل المعلومات');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [surah, ayah]);
  
  // نسخ نص الآية
  const handleCopyText = () => {
    const textToCopy = `سورة ${surah}، آية ${ayah}`;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        toast({
          title: 'تم النسخ',
          description: 'تم نسخ الآية إلى الحافظة',
        });
      })
      .catch(err => {
        console.error('Failed to copy text:', err);
        toast({
          title: 'خطأ',
          description: 'لم يتم نسخ النص',
          variant: 'destructive',
        });
      });
  };
  
  return (
    <div
      className="fixed z-50 select-none"
      style={{
        top: popoverPosition.top + 'px',
        left: popoverPosition.left + 'px',
      }}
    >
      <Card className="w-[350px] max-h-[400px] shadow-lg overflow-hidden">
        <CardHeader className="p-3 pb-0 flex flex-row justify-between items-center">
          <CardTitle className="text-lg">
            سورة {surah} : {ayah}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        {/* عرض نص الآية مع أدوات التجويد الصوتي */}
        {!loading && !error && verseText && (
          <div className="px-3 pt-2 pb-0">
            <div className="p-3 bg-amber-50/30 rounded-md border border-amber-200/50 mb-2">
              <p className="text-right text-lg leading-relaxed rtl font-quran">{verseText}</p>
              <div className="flex justify-center mt-2">
                <TajweedSpeechControls
                  text={verseText}
                  size="sm"
                  variant="ghost"
                  className="justify-center" 
                />
              </div>
            </div>
          </div>
        )}
        
        <Tabs defaultValue="tafsir" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-3 pt-2">
            <TabsList className="w-full">
              <TabsTrigger value="tafsir" className="flex-1">التفسير</TabsTrigger>
              <TabsTrigger value="translation" className="flex-1">الترجمة</TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="p-3 h-[210px] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500 p-4">
                <p>{error}</p>
              </div>
            ) : (
              <>
                <TabsContent value="tafsir" className="mt-0">
                  <div className="text-right leading-relaxed rtl">
                    {tafsir || 'لا يوجد تفسير متاح لهذه الآية'}
                  </div>
                </TabsContent>
                
                <TabsContent value="translation" className="mt-0">
                  <div className="text-left leading-relaxed">
                    {translation || 'No translation available for this verse'}
                  </div>
                </TabsContent>
              </>
            )}
          </CardContent>
        </Tabs>
        
        <CardFooter className="flex justify-between p-3 pt-0 border-t">
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleCopyText}>
              <CopyCheck className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm">
            <Bookmark className="h-4 w-4 mr-2" />
            حفظ الإشارة المرجعية
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}