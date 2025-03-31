import { useState, useEffect, useRef } from 'react';
import { useQuranAudio } from '../../hooks/useQuranAudio';
import AudioPlayer from './AudioPlayer';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import { SURAH_NAMES } from '../../lib/constants';
import { PopupModal } from './PopupModal';

interface QuranReaderProps {
  fontSize: number;
  surahNumber: number;
  showTranslation: boolean;
  reciter: string;
  translation: string;
  onVerseClick?: (verseNumber: number) => void;
}

interface Verse {
  number: number;
  text: string;
  translation?: string;
  explanation?: string;
}

interface Surah {
  number: number;
  name: string;
  verses: Verse[];
}

const QuranReader: React.FC<QuranReaderProps> = ({
  fontSize,
  surahNumber,
  showTranslation,
  reciter,
  translation,
  onVerseClick
}) => {
  const [surah, setSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [isLoadingExplanation, setIsLoadingExplanation] = useState<boolean>(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const { audioUrl, isPlaying, togglePlay, currentVerse, setCurrentVerse } = useQuranAudio(surahNumber, reciter);

  useEffect(() => {
    const fetchSurah = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/quran/surah/${surahNumber}`);
        const data = await response.json();

        if (data.code === 200 && data.data) {
          // Transform API data into our format
          const verses = data.data.ayahs.map((ayah: any) => ({
            number: ayah.numberInSurah,
            text: ayah.text,
            translation: ayah.translation ? ayah.translation.text : '',
          }));

          setSurah({
            number: data.data.number,
            name: SURAH_NAMES[data.data.number - 1] || data.data.name,
            verses
          });
        } else {
          setError('Failed to load surah data');
        }
      } catch (err) {
        setError('Error fetching surah: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchSurah();
  }, [surahNumber, translation]);

  const handleVerseClick = async (verse: Verse) => {
    setSelectedVerse(verse);
    if (onVerseClick) {
      onVerseClick(verse.number);
    }

    try {
      setIsLoadingExplanation(true);
      // Fetch explanation/tafsir for this verse
      const response = await fetch(`/api/quran/tafsir/${surahNumber}/${verse.number}`);
      const data = await response.json();

      if (data && data.data && data.data.text) {
        setExplanation(data.data.text);
      } else {
        setExplanation('لا يوجد تفسير متاح لهذه الآية');
      }
    } catch (err) {
      setExplanation('حدث خطأ أثناء تحميل التفسير');
      console.error('Error fetching tafsir:', err);
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 1: return 'text-lg';
      case 2: return 'text-xl';
      case 3: return 'text-2xl';
      case 4: return 'text-3xl';
      case 5: return 'text-4xl';
      default: return 'text-2xl';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (!surah) {
    return <div className="text-center p-4">لا توجد بيانات متاحة للسورة</div>;
  }

  return (
    <div className="quran-reader-container h-screen w-full overflow-auto bg-white dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">سورة {surah.name}</h1>
          {surahNumber !== 9 && (
            <div className="bismillah text-2xl mb-4 font-uthmani">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>
          )}
        </div>

        <div ref={contentRef} className="space-y-4">
          {surah.verses.map((verse) => (
            <div 
              key={verse.number}
              className={`verse-container p-3 rounded-lg ${currentVerse === verse.number ? 'bg-amber-100 dark:bg-amber-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              onClick={() => handleVerseClick(verse)}
            >
              <div className={`arabic-text font-uthmani ${getFontSizeClass()} leading-loose`}>
                {verse.text} 
                <span className="verse-number mr-2 text-amber-500">﴿{verse.number}﴾</span>
              </div>

              {showTranslation && verse.translation && (
                <div className="translation mt-2 text-gray-600 dark:text-gray-400 text-lg">
                  {verse.translation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {audioUrl && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg">
          <AudioPlayer 
            audioUrl={audioUrl} 
            isPlaying={isPlaying} 
            togglePlay={togglePlay} 
            currentVerse={currentVerse}
            totalVerses={surah.verses.length}
            onVerseChange={setCurrentVerse}
          />
        </div>
      )}

      {selectedVerse && (
        <PopupModal 
          title={`تفسير الآية ${selectedVerse.number} من سورة ${surah.name}`}
          onClose={() => setSelectedVerse(null)}
        >
          {isLoadingExplanation ? (
            <div className="text-center p-4">
              <LoadingSpinner size="small" />
              <p className="mt-2">جاري تحميل التفسير...</p>
            </div>
          ) : (
            <div>
              <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="font-uthmani text-xl">{selectedVerse.text}</div>
                {showTranslation && selectedVerse.translation && (
                  <div className="mt-2 text-gray-600 dark:text-gray-400">
                    {selectedVerse.translation}
                  </div>
                )}
              </div>
              <div className="mt-4 text-lg leading-relaxed" dir="rtl">
                {explanation}
              </div>
            </div>
          )}
        </PopupModal>
      )}
    </div>
  );
};

export default QuranReader;