import { useState } from 'react';
import MemorizationTabs from '../components/memorization/MemorizationTabs';
import MemorizationPlan from '../components/memorization/MemorizationPlan';
import MemorizationTechniques from '../components/memorization/MemorizationTechniques';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorDisplay from '../components/common/ErrorDisplay';

const Memorization = () => {
  const [activeTab, setActiveTab] = useState('plan');
  const [dailyGoal, setDailyGoal] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Mock data for current verse to memorize
  // In a real app, this would come from an API based on user's progress
  const currentVerse = {
    surah: 'سورة البقرة',
    ayahFrom: 6,
    ayahTo: 10,
    text: [
      'إِنَّ الَّذِينَ كَفَرُوا سَوَاءٌ عَلَيْهِمْ أَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ',
      'خَتَمَ اللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ ۖ وَعَلَىٰ أَبْصَارِهِمْ غِشَاوَةٌ ۖ وَلَهُمْ عَذَابٌ عَظِيمٌ',
      'وَمِنَ النَّاسِ مَن يَقُولُ آمَنَّا بِاللَّهِ وَبِالْيَوْمِ الْآخِرِ وَمَا هُم بِمُؤْمِنِينَ',
      'يُخَادِعُونَ اللَّهَ وَالَّذِينَ آمَنُوا وَمَا يَخْدَعُونَ إِلَّا أَنفُسَهُمْ وَمَا يَشْعُرُونَ',
      'فِي قُلُوبِهِم مَّرَضٌ فَزَادَهُمُ اللَّهُ مَرَضًا ۖ وَلَهُمْ عَذَابٌ أَلِيمٌ بِمَا كَانُوا يَكْذِبُونَ',
    ]
  };
  
  // Components for each tab
  const renderTabContent = () => {
    if (isLoading) {
      return <LoadingSpinner text="جار تحميل البيانات..." />;
    }
    
    if (error) {
      return <ErrorDisplay error={error} onRetry={() => setError(null)} />;
    }
    
    switch (activeTab) {
      case 'plan':
        return (
          <MemorizationPlan 
            dailyGoal={dailyGoal}
            setDailyGoal={setDailyGoal}
            currentVerse={currentVerse}
          />
        );
      
      case 'test':
        return (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-bold text-primary mb-3">اختبار الحفظ</h3>
            <div className="quran-page p-4 rounded-lg mb-4">
              <p className="text-center text-lg mb-4">أكمل الآية التالية:</p>
              <p className="arabic-text text-lg text-right">
                إِنَّ الَّذِينَ كَفَرُوا سَوَاءٌ عَلَيْهِمْ أَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ ...
              </p>
              <textarea 
                className="w-full p-2 mt-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white arabic-text text-lg"
                rows={3}
                placeholder="أكمل الآية هنا..."
              ></textarea>
              <div className="flex justify-center mt-4">
                <button className="py-2 px-4 bg-primary text-white rounded-lg hover:bg-opacity-90 transition">
                  تحقق من الإجابة
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'review':
        return (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-bold text-primary mb-3">مراجعة المحفوظات</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="font-medium mb-1">آخر مراجعة</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  سورة البقرة (1-15) - قبل 3 أيام
                </p>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="font-medium mb-1">المراجعة التالية</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  سورة البقرة (16-25) - اليوم
                </p>
              </div>
            </div>
            <div className="quran-page p-4 rounded-lg arabic-text text-lg mb-4">
              <p>
                <span>أَلَمْ تَرَ إِلَى الَّذِي حَاجَّ إِبْرَاهِيمَ فِي رَبِّهِ أَنْ آتَاهُ اللَّهُ الْمُلْكَ إِذْ قَالَ إِبْرَاهِيمُ رَبِّيَ الَّذِي يُحْيِي وَيُمِيتُ قَالَ أَنَا أُحْيِي وَأُمِيتُ ۖ قَالَ إِبْرَاهِيمُ فَإِنَّ اللَّهَ يَأْتِي بِالشَّمْسِ مِنَ الْمَشْرِقِ فَأْتِ بِهَا مِنَ الْمَغْرِبِ فَبُهِتَ الَّذِي كَفَرَ ۗ وَاللَّهُ لَا يَهْدِي الْقَوْمَ الظَّالِمِينَ</span>
                <span className="inline-flex justify-center items-center w-6 h-6 rounded-full bg-primary bg-opacity-20 text-primary text-sm ms-1">258</span>
              </p>
            </div>
            <div className="flex justify-between">
              <button className="py-2 px-4 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition">
                السابق
              </button>
              <button className="py-2 px-4 bg-primary text-white rounded-lg hover:bg-opacity-90 transition">
                تأكيد المراجعة
              </button>
              <button className="py-2 px-4 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition">
                التالي
              </button>
            </div>
          </div>
        );
      
      case 'techniques':
        return <MemorizationTechniques />;
        
      default:
        return <MemorizationPlan dailyGoal={dailyGoal} setDailyGoal={setDailyGoal} currentVerse={currentVerse} />;
    }
  };
  
  return (
    <section className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">الحفظ والمراجعة</h2>
        
        <MemorizationTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        {renderTabContent()}
      </div>
    </section>
  );
};

export default Memorization;
