import { useState } from 'react';
import { useLocation } from 'wouter';

export default function QuranNavigation() {
  const [goToSurah, setGoToSurah] = useState('');
  const [goToJuz, setGoToJuz] = useState('');
  const [goToPage, setGoToPage] = useState('');
  const [, navigate] = useLocation();

  const handleGoToSurah = (e: React.FormEvent) => {
    e.preventDefault();
    if (goToSurah && parseInt(goToSurah) >= 1 && parseInt(goToSurah) <= 114) {
      navigate(`/quran/surah/${goToSurah}`);
    }
  };

  const handleGoToJuz = (e: React.FormEvent) => {
    e.preventDefault();
    if (goToJuz && parseInt(goToJuz) >= 1 && parseInt(goToJuz) <= 30) {
      navigate(`/quran/juz/${goToJuz}`);
    }
  };

  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (goToPage && parseInt(goToPage) >= 1 && parseInt(goToPage) <= 604) {
      navigate(`/quran/page/${goToPage}`);
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      <form onSubmit={handleGoToSurah} className="flex items-center">
        <label htmlFor="go-to-surah" className="text-sm ml-2">
          الانتقال إلى سورة:
        </label>
        <input
          id="go-to-surah"
          type="number"
          min="1"
          max="114"
          value={goToSurah}
          onChange={(e) => setGoToSurah(e.target.value)}
          className="w-16 p-1 border border-gray-300 dark:border-gray-600 rounded"
          placeholder="1-114"
        />
        <button
          type="submit"
          className="mr-2 px-2 py-1 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          انتقل
        </button>
      </form>

      <form onSubmit={handleGoToJuz} className="flex items-center">
        <label htmlFor="go-to-juz" className="text-sm ml-2">
          الانتقال إلى جزء:
        </label>
        <input
          id="go-to-juz"
          type="number"
          min="1"
          max="30"
          value={goToJuz}
          onChange={(e) => setGoToJuz(e.target.value)}
          className="w-16 p-1 border border-gray-300 dark:border-gray-600 rounded"
          placeholder="1-30"
        />
        <button
          type="submit"
          className="mr-2 px-2 py-1 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          انتقل
        </button>
      </form>

      <form onSubmit={handleGoToPage} className="flex items-center">
        <label htmlFor="go-to-page" className="text-sm ml-2">
          الانتقال إلى صفحة:
        </label>
        <input
          id="go-to-page"
          type="number"
          min="1"
          max="604"
          value={goToPage}
          onChange={(e) => setGoToPage(e.target.value)}
          className="w-16 p-1 border border-gray-300 dark:border-gray-600 rounded"
          placeholder="1-604"
        />
        <button
          type="submit"
          className="mr-2 px-2 py-1 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          انتقل
        </button>
      </form>
    </div>
  );
}