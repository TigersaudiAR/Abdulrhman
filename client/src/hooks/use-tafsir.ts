import { useState, useCallback } from 'react';
import { getTafsir } from '../lib/quran-api';
import { useToast } from './use-toast';

interface UseTafsirProps {
  defaultSource?: string;
}

interface TafsirData {
  surahNumber: number;
  ayahNumber: number;
  tafsirId: string;
  tafsirName: string;
  tafsirText: string;
  ayahText: string;
}

/**
 * خطاف للتعامل مع جلب وعرض بيانات التفسير
 * يدعم تغيير مصدر التفسير والتنقل بين الآيات
 */
export function useTafsir({ defaultSource = 'ar-tafsir-al-jalalayn' }: UseTafsirProps = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tafsirSource, setTafsirSource] = useState(defaultSource);
  const [tafsirData, setTafsirData] = useState<TafsirData | null>(null);
  const { toast } = useToast();

  /**
   * جلب تفسير آية محددة
   * @param surahNumber رقم السورة
   * @param ayahNumber رقم الآية
   */
  const fetchTafsir = useCallback(async (surahNumber: number, ayahNumber: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getTafsir(surahNumber, ayahNumber, tafsirSource);
      setTafsirData(data);
    } catch (err) {
      console.error('Failed to fetch tafsir:', err);
      setError('حدث خطأ أثناء جلب التفسير. يرجى المحاولة مرة أخرى.');
      toast({
        title: "خطأ",
        description: "تعذر جلب التفسير. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [tafsirSource, toast]);

  /**
   * التنقل إلى الآية السابقة في نفس السورة
   */
  const goToPreviousAyah = useCallback(() => {
    if (!tafsirData) return;
    
    const { surahNumber, ayahNumber } = tafsirData;
    
    if (ayahNumber > 1) {
      // الانتقال إلى الآية السابقة في نفس السورة
      fetchTafsir(surahNumber, ayahNumber - 1);
    } else {
      // تنبيه المستخدم بأنه في أول آية
      toast({
        title: "تنبيه",
        description: "أنت في أول آية من السورة",
        variant: "default"
      });
    }
  }, [tafsirData, fetchTafsir, toast]);

  /**
   * التنقل إلى الآية التالية في نفس السورة
   * @param totalAyahsInSurah إجمالي عدد الآيات في السورة
   */
  const goToNextAyah = useCallback((totalAyahsInSurah: number) => {
    if (!tafsirData) return;
    
    const { surahNumber, ayahNumber } = tafsirData;
    
    if (ayahNumber < totalAyahsInSurah) {
      // الانتقال إلى الآية التالية في نفس السورة
      fetchTafsir(surahNumber, ayahNumber + 1);
    } else {
      // تنبيه المستخدم بأنه في آخر آية
      toast({
        title: "تنبيه",
        description: "أنت في آخر آية من السورة",
        variant: "default"
      });
    }
  }, [tafsirData, fetchTafsir, toast]);

  /**
   * إعادة تحميل التفسير عند تغيير مصدر التفسير
   */
  const changeTafsirSource = useCallback((newSource: string) => {
    setTafsirSource(newSource);
    
    if (tafsirData) {
      const { surahNumber, ayahNumber } = tafsirData;
      fetchTafsir(surahNumber, ayahNumber);
    }
  }, [tafsirData, fetchTafsir]);

  return {
    loading,
    error,
    tafsirData,
    tafsirSource,
    fetchTafsir,
    goToPreviousAyah,
    goToNextAyah,
    changeTafsirSource
  };
}