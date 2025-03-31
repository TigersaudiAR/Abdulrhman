import { useLocation } from 'wouter';
import { useQuranData } from '../../hooks/useQuranData';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import { Button } from '@/components/ui/button';

const LastReadSection = () => {
  const [, setLocation] = useLocation();
  const { lastRead } = useQuranData();
  
  // إذا لم تكن هناك قراءة سابقة
  if (!lastRead) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-primary mb-3">آخر قراءة</h3>
        <div className="text-center py-6">
          <p className="mb-4 text-gray-600 dark:text-gray-400">لم تقم بأي قراءة حتى الآن</p>
          <Button 
            onClick={() => setLocation('/quran')}
            className="bg-primary text-white"
          >
            ابدأ القراءة الآن
          </Button>
        </div>
      </div>
    );
  }
  
  // Format date to Arabic locale
  const formattedDate = new Date(lastRead.timestamp).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Format time to Arabic locale
  const formattedTime = new Date(lastRead.timestamp).toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-primary mb-3">آخر قراءة</h3>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-medium">{lastRead.surahName} - الآية {lastRead.ayahNumber} {lastRead.description && `(${lastRead.description})`}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{formattedDate}، {formattedTime}</div>
        </div>
        <Button
          onClick={() => setLocation('/quran')}
          className="bg-primary text-white"
        >
          متابعة القراءة
        </Button>
      </div>
      <div className="quran-page p-4 rounded-lg arabic-text text-lg text-center leading-loose">
        {lastRead.text}
      </div>
    </div>
  );
};

export default LastReadSection;
