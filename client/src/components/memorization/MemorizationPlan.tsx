import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface MemorizationPlanProps {
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
  currentVerse: {
    surah: string;
    ayahFrom: number;
    ayahTo: number;
    text: string[];
  };
}

const MemorizationPlan = ({ dailyGoal, setDailyGoal, currentVerse }: MemorizationPlanProps) => {
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [newGoal, setNewGoal] = useState(dailyGoal);
  const { toast } = useToast();
  
  const handleGoalChange = () => {
    setDailyGoal(newGoal);
    setShowGoalEditor(false);
    
    toast({
      title: "تم التحديث",
      description: `تم تعديل الهدف اليومي إلى ${newGoal} آيات`,
    });
  };
  
  const handleSkipDay = () => {
    // In a real app, this would update the plan in a database
    toast({
      title: "تم تخطي اليوم",
      description: "تم تخطي ورد اليوم، سيتم الانتقال إلى الورد التالي",
    });
  };
  
  const handleComplete = () => {
    // In a real app, this would update the user's progress
    toast({
      title: "تم الحفظ",
      description: "أحسنت! تم تسجيل حفظك بنجاح",
    });
  };
  
  const handleTest = () => {
    // In a real app, this would navigate to the test page
    toast({
      title: "اختبار الحفظ",
      description: "جاري إعداد اختبار الحفظ...",
    });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-bold text-primary mb-4">خطة الحفظ اليومية</h3>
      
      <div className="mb-4">
        {showGoalEditor ? (
          <div className="flex items-center gap-2 mb-2">
            <input 
              type="number" 
              min="1" 
              max="20" 
              value={newGoal}
              onChange={(e) => setNewGoal(parseInt(e.target.value))}
              className="w-16 py-1 px-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-center dark:text-white"
            />
            <span>آيات في اليوم</span>
            <button 
              className="py-1 px-3 bg-primary text-white rounded-lg text-sm hover:bg-opacity-90"
              onClick={handleGoalChange}
            >
              حفظ
            </button>
            <button 
              className="py-1 px-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() => setShowGoalEditor(false)}
            >
              إلغاء
            </button>
          </div>
        ) : (
          <div className="mb-2 font-medium">الهدف اليومي: {dailyGoal} آيات في اليوم</div>
        )}
        
        {!showGoalEditor && (
          <div className="flex gap-2">
            <button 
              className="py-1 px-3 bg-primary text-white rounded-lg text-sm hover:bg-opacity-90"
              onClick={() => setShowGoalEditor(true)}
            >
              تعديل الهدف
            </button>
            <button 
              className="py-1 px-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={handleSkipDay}
            >
              تخطي اليوم
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-green-50 dark:bg-green-900 dark:bg-opacity-20 p-3 rounded-lg border border-green-200 dark:border-green-900 mb-4">
        <div className="font-bold text-green-800 dark:text-green-400 mb-1">ورد اليوم</div>
        <div className="text-green-700 dark:text-green-300">
          {currentVerse.surah} - الآيات {currentVerse.ayahFrom}-{currentVerse.ayahTo}
        </div>
      </div>
      
      <div className="quran-page p-4 rounded-lg arabic-text text-lg mb-4">
        {currentVerse.text.map((ayah, index) => (
          <p key={index}>
            <span>{ayah}</span>
            <span className="inline-flex justify-center items-center w-6 h-6 rounded-full bg-primary bg-opacity-20 text-primary text-sm ms-1">
              {currentVerse.ayahFrom + index}
            </span>
          </p>
        ))}
      </div>
      
      <div className="flex justify-between">
        <button 
          className="flex items-center gap-2 py-2 px-4 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
          onClick={handleComplete}
        >
          <i className="fas fa-check"></i>
          <span>تم الحفظ</span>
        </button>
        
        <button 
          className="flex items-center gap-2 py-2 px-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
          onClick={handleTest}
        >
          <i className="fas fa-brain"></i>
          <span>اختبار الحفظ</span>
        </button>
      </div>
    </div>
  );
};

export default MemorizationPlan;
