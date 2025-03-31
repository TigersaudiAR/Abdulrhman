interface MemorizationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MemorizationTabs = ({ activeTab, setActiveTab }: MemorizationTabsProps) => {
  const tabs = [
    { id: 'plan', label: 'خطة الحفظ' },
    { id: 'test', label: 'اختبار الحفظ' },
    { id: 'review', label: 'المراجعة' },
    { id: 'techniques', label: 'تقنيات الحفظ' },
  ];
  
  return (
    <div className="mb-6 border-b border-gray-300 dark:border-gray-700">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            className={`py-2 px-4 ${
              activeTab === tab.id 
                ? 'border-b-2 border-primary text-primary font-medium' 
                : 'text-gray-700 dark:text-gray-300 hover:text-primary'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MemorizationTabs;
