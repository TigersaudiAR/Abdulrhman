interface MemorizationData {
  id: number;
  surahName: string;
  percentage: number;
}

// In a real app, this would come from an API or user data
const memorizationData: MemorizationData[] = [
  { id: 1, surahName: 'سورة البقرة', percentage: 70 },
  { id: 2, surahName: 'سورة آل عمران', percentage: 45 },
  { id: 3, surahName: 'سورة النساء', percentage: 30 },
  { id: 4, surahName: 'سورة المائدة', percentage: 20 },
];

// Calculate total percentage across all surahs
const totalPercentage = Math.round(
  memorizationData.reduce((acc, item) => acc + item.percentage, 0) / memorizationData.length
);

const MemorizationProgress = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-bold text-primary mb-3">تقدم الحفظ</h3>
      <div className="flex flex-col space-y-3">
        {memorizationData.map((item) => (
          <div key={item.id}>
            <div className="flex justify-between mb-1">
              <span className="text-sm">{item.surahName}</span>
              <span className="text-sm">{item.percentage}%</span>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full memorization-progress" 
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">الإجمالي</span>
            <span className="text-sm">{totalPercentage}%</span>
          </div>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-green-500 h-2.5 rounded-full memorization-progress" 
              style={{ width: `${totalPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <a href="/memorization" onClick={(e) => { e.preventDefault(); window.location.href = '/memorization'; }} className="text-primary hover:underline">متابعة الحفظ</a>
      </div>
    </div>
  );
};

export default MemorizationProgress;
