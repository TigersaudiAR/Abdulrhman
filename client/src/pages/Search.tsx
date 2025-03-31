import React from 'react';
import { useLocation } from 'wouter';
import { Container } from '../components/ui/container';
import { Button } from '../components/ui/button';
import { useApp } from '../context/AppContext';
import AdvancedSearch from '../components/quran/AdvancedSearch';
import { ArrowRight } from 'lucide-react';

/**
 * صفحة البحث المتقدم في القرآن الكريم
 * توفر واجهة متكاملة للبحث مع خيارات متقدمة وفلاتر
 */
const SearchPage: React.FC = () => {
  const { settings } = useApp();
  const [, setLocation] = useLocation();
  
  // معالج اختيار نتيجة بحث والانتقال إليها
  const handleSelectVerse = (surahNumber: number, verseNumber: number) => {
    // الانتقال إلى صفحة القرآن مع تمرير معلومات الآية
    setLocation(`/quran?surah=${surahNumber}&ayah=${verseNumber}`);
  };

  return (
    <Container className="py-6">
      <div className="mb-6 flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="flex items-center text-gray-600 dark:text-gray-400"
          onClick={() => setLocation('/')}
        >
          <ArrowRight className="ml-1 h-4 w-4" />
          الرئيسية
        </Button>
        <h1 className="text-2xl font-bold text-amber-700 dark:text-amber-300">البحث في القرآن الكريم</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <AdvancedSearch 
          onSelectVerse={handleSelectVerse}
          translationId={settings.translation}
        />
      </div>
    </Container>
  );
};

export default SearchPage;