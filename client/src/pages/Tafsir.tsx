import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorDisplay from '../components/common/ErrorDisplay';
import { getTafsir } from '../lib/quran-api';

interface TafsirSelection {
  surahNumber: number;
  ayahNumber: number;
  tafsirId: string;
}

const Tafsir = () => {
  const [selection, setSelection] = useState<TafsirSelection>({
    surahNumber: 1,
    ayahNumber: 1,
    tafsirId: 'ar-tafsir-al-jalalayn',
  });
  
  const [surahsList, setSurahsList] = useState<{ number: number; name: string; ayahs: number }[]>([]);
  
  // Fetch surahs list
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        if (!response.ok) {
          throw new Error(`فشل في تحميل قائمة السور: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.code === 200 && data.data) {
          setSurahsList(data.data.map((surah: any) => ({
            number: surah.number,
            name: surah.name,
            ayahs: surah.numberOfAyahs,
          })));
        }
      } catch (error) {
        console.error('Error fetching surahs:', error);
      }
    };
    
    fetchSurahs();
  }, []);
  
  // Fetch tafsir data
  const { data: tafsirData, isLoading, error, refetch } = useQuery({
    queryKey: ['tafsir', selection.surahNumber, selection.ayahNumber, selection.tafsirId],
    queryFn: () => getTafsir(selection.surahNumber, selection.ayahNumber, selection.tafsirId),
  });
  
  const handleSurahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const surahNumber = parseInt(e.target.value);
    setSelection((prev) => ({
      ...prev,
      surahNumber,
      ayahNumber: 1, // Reset ayah number when surah changes
    }));
  };
  
  const handleAyahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelection((prev) => ({
      ...prev,
      ayahNumber: parseInt(e.target.value),
    }));
  };
  
  const handleTafsirChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelection((prev) => ({
      ...prev,
      tafsirId: e.target.value,
    }));
  };
  
  // Get current surah ayahs count
  const currentSurahAyahs = surahsList.find(s => s.number === selection.surahNumber)?.ayahs || 0;
  
  return (
    <section className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">تفسير القرآن الكريم</h2>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                السورة
              </label>
              <select 
                className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                value={selection.surahNumber}
                onChange={handleSurahChange}
              >
                {surahsList.map((surah) => (
                  <option key={surah.number} value={surah.number}>
                    {surah.number}. {surah.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                الآية
              </label>
              <select 
                className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                value={selection.ayahNumber}
                onChange={handleAyahChange}
              >
                {[...Array(currentSurahAyahs)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                التفسير
              </label>
              <select 
                className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                value={selection.tafsirId}
                onChange={handleTafsirChange}
              >
                <option value="ar-tafsir-al-jalalayn">تفسير الجلالين</option>
                <option value="ar-tafsir-ibn-kathir">تفسير ابن كثير</option>
                <option value="ar-tafsir-al-qurtubi">تفسير القرطبي</option>
                <option value="ar-tafsir-al-tabari">تفسير الطبري</option>
              </select>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <LoadingSpinner text="جار تحميل التفسير..." />
        ) : error ? (
          <ErrorDisplay 
            error={error instanceof Error ? error.message : 'حدث خطأ أثناء تحميل التفسير'} 
            onRetry={refetch} 
          />
        ) : tafsirData ? (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="quran-page p-4 rounded-lg mb-6">
              <h3 className="text-lg font-bold text-primary mb-2">الآية</h3>
              <p className="arabic-text text-lg text-right leading-loose">
                {tafsirData.ayahText}
                <span className="inline-flex justify-center items-center w-6 h-6 rounded-full bg-primary bg-opacity-20 text-primary text-sm ms-1">
                  {selection.ayahNumber}
                </span>
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-bold text-primary mb-2">التفسير</h3>
              <div className="arabic-text text-right bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="mb-4 leading-relaxed">{tafsirData.tafsirText}</p>
                <div className="text-sm text-gray-600 dark:text-gray-400 text-left">
                  المصدر: {tafsirData.tafsirName}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                className="py-2 px-4 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
                onClick={() => {
                  if (selection.ayahNumber > 1) {
                    setSelection((prev) => ({
                      ...prev,
                      ayahNumber: prev.ayahNumber - 1,
                    }));
                  } else if (selection.surahNumber > 1) {
                    const prevSurah = selection.surahNumber - 1;
                    const prevSurahAyahs = surahsList.find(s => s.number === prevSurah)?.ayahs || 1;
                    setSelection({
                      surahNumber: prevSurah,
                      ayahNumber: prevSurahAyahs,
                      tafsirId: selection.tafsirId,
                    });
                  }
                }}
                disabled={selection.surahNumber === 1 && selection.ayahNumber === 1}
              >
                الآية السابقة
              </button>
              <button 
                className="py-2 px-4 bg-primary text-white rounded-lg hover:bg-opacity-90"
                onClick={() => {
                  if (selection.ayahNumber < currentSurahAyahs) {
                    setSelection((prev) => ({
                      ...prev,
                      ayahNumber: prev.ayahNumber + 1,
                    }));
                  } else if (selection.surahNumber < 114) {
                    setSelection({
                      surahNumber: selection.surahNumber + 1,
                      ayahNumber: 1,
                      tafsirId: selection.tafsirId,
                    });
                  }
                }}
                disabled={selection.surahNumber === 114 && selection.ayahNumber === currentSurahAyahs}
              >
                الآية التالية
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
            <p>اختر سورة وآية لعرض التفسير</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Tafsir;
