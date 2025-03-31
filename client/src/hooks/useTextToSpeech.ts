import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * واجهة إعدادات نطق النص القرآني
 */
export interface QuranTTSOptions {
  voice: string; // صوت القارئ
  rate: number; // سرعة القراءة (0.1 إلى 2.0)
  pitch: number; // طبقة الصوت (0.1 إلى 2.0)
  tajweedMode: 'normal' | 'enhanced' | 'professional'; // نمط التجويد
  pauseBetweenAyahs: number; // فترة الانتظار بين الآيات (بالمللي ثانية)
}

/**
 * واجهة لمعلومات الصوت المتاح
 */
export interface VoiceInfo {
  id: string;
  name: string;
  lang: string;
  gender: string;
  isDefault?: boolean;
}

// الإعدادات الافتراضية
const defaultOptions: QuranTTSOptions = {
  voice: '',
  rate: 1.0,
  pitch: 1.0,
  tajweedMode: 'enhanced',
  pauseBetweenAyahs: 1000
};

/**
 * خطاف للتعامل مع خاصية تحويل النص إلى صوت مع دعم التجويد
 */
export function useTextToSpeech() {
  const [voices, setVoices] = useState<VoiceInfo[]>([]);
  const [options, setOptions] = useState<QuranTTSOptions>({ ...defaultOptions });
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  // مرجع لكائن التحدث
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const verseQueueRef = useRef<string[]>([]);
  const currentVerseIndexRef = useRef<number>(0);
  
  // تحميل الأصوات المتاحة
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setIsAvailable(false);
      return;
    }
    
    setIsAvailable(true);
    
    const loadVoices = () => {
      // جلب جميع الأصوات المتاحة
      const availableVoices = window.speechSynthesis.getVoices();
      
      // تحويل الأصوات المتاحة إلى تنسيق VoiceInfo
      const voiceInfos: VoiceInfo[] = availableVoices.map((voice) => ({
        id: voice.voiceURI,
        name: voice.name,
        lang: voice.lang,
        gender: voice.name.toLowerCase().includes('female') ? 'female' : 'male',
        isDefault: voice.default
      }));
      
      setVoices(voiceInfos);
      
      // تعيين الصوت الافتراضي إذا لم يتم تعيينه من قبل
      if (!options.voice && voiceInfos.length > 0) {
        // البحث عن صوت عربي
        const arabicVoice = voiceInfos.find(v => v.lang.includes('ar'));
        // إذا لم يوجد، استخدم الصوت الافتراضي
        const defaultVoice = arabicVoice || voiceInfos.find(v => v.isDefault) || voiceInfos[0];
        
        setOptions(prev => ({
          ...prev,
          voice: defaultVoice.id
        }));
      }
    };
    
    loadVoices();
    
    // إضافة مستمع لحدث voiceschanged الذي يتم إطلاقه عندما تتغير الأصوات المتاحة
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);
  
  // تطبيق إعدادات التجويد على كائن التحدث
  const applySettings = useCallback((utterance: SpeechSynthesisUtterance, text: string) => {
    // العثور على الصوت المحدد
    const selectedVoice = window.speechSynthesis.getVoices().find(
      voice => voice.voiceURI === options.voice
    );
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = options.rate;
    utterance.pitch = options.pitch;
    
    // تطبيق إعدادات التجويد بناءً على الوضع المحدد
    switch (options.tajweedMode) {
      case 'enhanced':
        // إضافة تحسينات التجويد المتوسطة
        utterance.rate = Math.max(0.8, options.rate); // تبطيء الإيقاع قليلاً للتجويد الأفضل
        break;
      case 'professional':
        // إضافة تحسينات التجويد الاحترافية
        utterance.rate = Math.max(0.7, options.rate * 0.9); // إيقاع أبطأ للتجويد الواضح
        break;
      // الوضع العادي لا يحتاج إلى تعديلات إضافية
    }
    
    // تحسين نطق الكلمات العربية
    // هذه تقنية تحسين بسيطة باستخدام علامات SSML إذا كانت مدعومة
    if (text.match(/[\u0600-\u06FF]/)) {
      utterance.lang = 'ar-SA'; // تعيين اللغة للعربية السعودية للنطق الأفضل
    }
    
    return utterance;
  }, [options]);
  
  // وظيفة قراءة النص المفرد
  const speak = useCallback((text: string) => {
    if (!isAvailable || !window.speechSynthesis) return;
    
    // إيقاف أي كلام سابق
    window.speechSynthesis.cancel();
    
    // إنشاء كائن تحدث جديد
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    // تطبيق الإعدادات
    applySettings(utterance, text);
    
    // إضافة مستمعات الأحداث
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };
    
    // بدء التحدث
    window.speechSynthesis.speak(utterance);
  }, [isAvailable, applySettings]);
  
  // وظيفة قراءة مجموعة من الآيات
  const speakVerses = useCallback((verses: string[]) => {
    if (!isAvailable || !window.speechSynthesis || verses.length === 0) return;
    
    // إيقاف أي كلام سابق
    window.speechSynthesis.cancel();
    
    // تخزين قائمة الآيات
    verseQueueRef.current = [...verses];
    currentVerseIndexRef.current = 0;
    
    // قراءة الآية الأولى
    const firstVerse = verses[0];
    const utterance = new SpeechSynthesisUtterance(firstVerse);
    utteranceRef.current = utterance;
    
    // تطبيق الإعدادات
    applySettings(utterance, firstVerse);
    
    // إضافة مستمعات الأحداث
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };
    
    utterance.onend = () => {
      // التحقق إذا كانت هناك آية أخرى في القائمة
      currentVerseIndexRef.current++;
      
      if (currentVerseIndexRef.current < verseQueueRef.current.length) {
        // الانتظار بين الآيات
        setTimeout(() => {
          const nextVerse = verseQueueRef.current[currentVerseIndexRef.current];
          speak(nextVerse);
        }, options.pauseBetweenAyahs);
      } else {
        // انتهت قائمة الآيات
        setIsPlaying(false);
        setIsPaused(false);
        utteranceRef.current = null;
        verseQueueRef.current = [];
        currentVerseIndexRef.current = 0;
      }
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };
    
    // بدء التحدث
    window.speechSynthesis.speak(utterance);
  }, [isAvailable, speak, options.pauseBetweenAyahs, applySettings]);
  
  // وظيفة إيقاف التحدث مؤقتًا
  const pause = useCallback(() => {
    if (isPlaying && !isPaused && window.speechSynthesis) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isPlaying, isPaused]);
  
  // وظيفة استئناف التحدث
  const resume = useCallback(() => {
    if (isPlaying && isPaused && window.speechSynthesis) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isPlaying, isPaused]);
  
  // وظيفة إيقاف التحدث
  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
      verseQueueRef.current = [];
      currentVerseIndexRef.current = 0;
    }
  }, []);
  
  // وظيفة تحديث الإعدادات
  const updateOptions = useCallback((newOptions: Partial<QuranTTSOptions>) => {
    setOptions(prev => ({
      ...prev,
      ...newOptions
    }));
  }, []);
  
  // إيقاف التحدث عند تفكيك المكون
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  return {
    speak,
    speakVerses,
    pause,
    resume,
    stop,
    voices,
    options,
    updateOptions,
    isAvailable,
    isPlaying,
    isPaused
  };
}