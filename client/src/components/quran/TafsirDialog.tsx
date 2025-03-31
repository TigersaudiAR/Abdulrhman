import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TAFSIR_SOURCES, SURAH_NAMES } from '../../lib/constants';
import { useTafsir } from '../../hooks/use-tafsir';
import { Loader2 } from 'lucide-react';

interface TafsirDialogProps {
  isOpen: boolean;
  onClose: () => void;
  surahNumber: number;
  ayahNumber: number;
  totalAyahsInSurah: number;
}

/**
 * مكون حوار عرض تفسير الآيات
 * يوفر واجهة لعرض تفسير الآيات من مصادر متعددة مع إمكانية التنقل بين الآيات
 */
const TafsirDialog: React.FC<TafsirDialogProps> = ({
  isOpen,
  onClose,
  surahNumber,
  ayahNumber,
  totalAyahsInSurah
}) => {
  const {
    loading,
    error,
    tafsirData,
    tafsirSource,
    fetchTafsir,
    goToPreviousAyah,
    goToNextAyah,
    changeTafsirSource
  } = useTafsir();

  // جلب التفسير عند فتح النافذة أو تغيير الآية
  useEffect(() => {
    if (isOpen && surahNumber && ayahNumber) {
      fetchTafsir(surahNumber, ayahNumber);
    }
  }, [isOpen, surahNumber, ayahNumber, fetchTafsir]);

  // معالج تغيير مصدر التفسير
  const handleSourceChange = (value: string) => {
    changeTafsirSource(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-amber-700 dark:text-amber-300 flex items-center justify-between">
            <span>تفسير</span>
            {tafsirData && (
              <span className="text-lg font-medium">
                سورة {SURAH_NAMES[tafsirData.surahNumber - 1] || tafsirData.surahNumber}، الآية {tafsirData.ayahNumber}
              </span>
            )}
          </DialogTitle>
          
          <DialogDescription>
            <div className="tafsir-select-container mt-2 mb-4">
              <Select value={tafsirSource} onValueChange={handleSourceChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر مصدر التفسير" />
                </SelectTrigger>
                <SelectContent>
                  {TAFSIR_SOURCES.map((source) => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="tafsir-content py-2">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
              <span className="mr-3 text-amber-700 dark:text-amber-300">جارِ تحميل التفسير...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
              {error}
            </div>
          ) : tafsirData ? (
            <Tabs defaultValue="tafsir" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ayah">الآية الكريمة</TabsTrigger>
                <TabsTrigger value="tafsir">التفسير</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ayah" className="mt-4">
                <div className="ayah-text-container p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <p 
                    className="text-xl font-arabic text-right leading-relaxed" 
                    dir="rtl"
                    style={{ lineHeight: 2 }}
                  >
                    {tafsirData.ayahText}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="tafsir" className="mt-4">
                <div className="tafsir-text-container p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-right text-gray-800 dark:text-gray-200" dir="rtl">
                    {tafsirData.tafsirText}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center p-8 text-gray-500 dark:text-gray-400">
              اختر آية لعرض تفسيرها
            </div>
          )}
        </div>
        
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <div className="navigation-buttons flex items-center gap-2">
            <Button
              variant="outline"
              onClick={goToPreviousAyah}
              disabled={loading || !tafsirData || tafsirData.ayahNumber <= 1}
            >
              الآية السابقة
            </Button>
            
            <Button
              variant="outline"
              onClick={() => goToNextAyah(totalAyahsInSurah)}
              disabled={loading || !tafsirData || tafsirData.ayahNumber >= totalAyahsInSurah}
            >
              الآية التالية
            </Button>
          </div>
          
          <Button variant="default" onClick={onClose}>
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TafsirDialog;