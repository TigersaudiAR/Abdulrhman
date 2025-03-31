import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * خطاف أساسي لتشغيل صوت القرآن مع معرف القارئ البسيط
 */
export function useQuranAudioBasic(reciterId: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentVerse, setCurrentVerse] = useState<{ surahNumber: number; verseNumber: number } | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // إنشاء عنصر الصوت
    audioRef.current = new Audio();
    
    // تنظيف المصادر عند تفكيك المكون
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);
  
  // التنقل بين حالات التشغيل والإيقاف
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseAudio();
    } else {
      if (currentVerse) {
        playVerse(currentVerse.surahNumber, currentVerse.verseNumber);
      }
    }
  }, [isPlaying, currentVerse]);
  
  // تشغيل الصوت لآية محددة
  const playVerse = useCallback((surahNumber: number, verseNumber: number) => {
    if (!audioRef.current) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // إيقاف أي تشغيل حالي
      audioRef.current.pause();
      
      // تحديث الآية الحالية
      setCurrentVerse({ surahNumber, verseNumber });
      
      // تكوين رابط الصوت - هذا مثال ويجب تعديله حسب API المستخدمة
      // مثال: https://api.alquran.cloud/v1/surah/[surahNumber]/[reciterId]
      const audioUrl = `https://verse.mp3.cdn.qurancdn.com/${reciterId}/${surahNumber}/${verseNumber}.mp3`;
      
      audioRef.current.src = audioUrl;
      
      // عند جاهزية الملف الصوتي
      audioRef.current.oncanplaythrough = () => {
        setIsLoading(false);
        audioRef.current?.play();
        setIsPlaying(true);
      };
      
      // في حالة الخطأ
      audioRef.current.onerror = () => {
        setError('حدث خطأ أثناء تحميل ملف الصوت');
        setIsLoading(false);
        setIsPlaying(false);
      };
      
      // عند انتهاء التشغيل
      audioRef.current.onended = () => {
        setIsPlaying(false);
        
        // انتقل تلقائيًا إلى الآية التالية (اختياري)
        // playVerse(surahNumber, verseNumber + 1);
      };
    } catch (err) {
      console.error('خطأ في تشغيل الصوت:', err);
      setError('حدث خطأ أثناء محاولة تشغيل الصوت');
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, [reciterId]);
  
  // إيقاف مؤقت للصوت
  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);
  
  // استئناف التشغيل
  const resumeAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, []);
  
  // إيقاف كامل للصوت
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);
  
  return {
    isPlaying,
    isLoading,
    error,
    currentVerse,
    playVerse,
    pauseAudio,
    resumeAudio,
    stopAudio,
    togglePlay
  };
}

/**
 * خطاف متقدم لتشغيل القرآن مع ميزات إضافية
 */
export const useQuranAudio = (surahNumber: number, reciter: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAyah, setCurrentAyah] = useState(1);
  const [totalAyahs, setTotalAyahs] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // تهيئة مشغل الصوت
  useEffect(() => {
    audioRef.current = new Audio();
    
    // جلب عدد الآيات في السورة المحددة
    const fetchSurahInfo = async () => {
      try {
        // هنا يمكن جلب معلومات السورة من API أو استخدام البيانات المحلية
        // كمثال بسيط، نستخدم قيمة ثابتة
        const total = surahNumber === 1 ? 7 : 286; // مثال بسيط
        setTotalAyahs(total);
      } catch (err) {
        console.error('خطأ في جلب معلومات السورة:', err);
      }
    };
    
    fetchSurahInfo();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [surahNumber]);
  
  // تشغيل آية محددة
  const playAyah = useCallback((ayahNumber: number) => {
    if (!audioRef.current || ayahNumber > totalAyahs) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // إيقاف أي تشغيل حالي
      audioRef.current.pause();
      
      setCurrentAyah(ayahNumber);
      
      // تكوين رابط الصوت - هذا مثال ويجب تعديله حسب API المستخدمة
      const audioUrl = `https://verse.mp3.cdn.qurancdn.com/${reciter}/${surahNumber}/${ayahNumber}.mp3`;
      
      audioRef.current.src = audioUrl;
      
      audioRef.current.oncanplaythrough = () => {
        setIsLoading(false);
        audioRef.current?.play();
        setIsPlaying(true);
      };
      
      audioRef.current.onerror = () => {
        setError('حدث خطأ أثناء تحميل ملف الصوت');
        setIsLoading(false);
        setIsPlaying(false);
      };
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
        
        // التشغيل التلقائي للآية التالية
        if (autoPlay && ayahNumber < totalAyahs) {
          playAyah(ayahNumber + 1);
        }
      };
    } catch (err) {
      console.error('خطأ في تشغيل الصوت:', err);
      setError('حدث خطأ أثناء محاولة تشغيل الصوت');
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, [surahNumber, reciter, totalAyahs, autoPlay]);
  
  // تشغيل السورة كاملة
  const playFullSurah = useCallback(() => {
    playAyah(1);
  }, [playAyah]);
  
  // الانتقال إلى الآية التالية
  const playNextAyah = useCallback(() => {
    if (currentAyah < totalAyahs) {
      playAyah(currentAyah + 1);
    }
  }, [currentAyah, totalAyahs, playAyah]);
  
  // الانتقال إلى الآية السابقة
  const playPreviousAyah = useCallback(() => {
    if (currentAyah > 1) {
      playAyah(currentAyah - 1);
    }
  }, [currentAyah, playAyah]);
  
  // إيقاف مؤقت للصوت
  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);
  
  // استئناف التشغيل
  const resumeAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, []);
  
  // التنقل بين التشغيل والإيقاف
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseAudio();
    } else {
      resumeAudio();
    }
  }, [isPlaying, pauseAudio, resumeAudio]);
  
  // تبديل التشغيل التلقائي
  const toggleAutoPlay = useCallback(() => {
    setAutoPlay(prev => !prev);
  }, []);
  
  return {
    isPlaying,
    isLoading,
    error,
    currentAyah,
    totalAyahs,
    autoPlay,
    playAyah,
    playFullSurah,
    playNextAyah,
    playPreviousAyah,
    pauseAudio,
    resumeAudio,
    togglePlay,
    toggleAutoPlay
  };
};