import { useLocation } from 'wouter';

const QuickAccess = () => {
  const [, setLocation] = useLocation();
  
  const quickLinks = [
    {
      path: '/quran',
      icon: 'fas fa-book-quran',
      label: 'القرآن الكريم',
      color: 'text-primary'
    },
    {
      path: '/memorization',
      icon: 'fas fa-brain',
      label: 'الحفظ والمراجعة',
      color: 'text-secondary'
    },
    {
      path: '/tafsir',
      icon: 'fas fa-book-open',
      label: 'التفسير',
      color: 'text-amber-500'
    },
    {
      path: '/hadith',
      icon: 'fas fa-scroll',
      label: 'الأحاديث النبوية',
      color: 'text-teal-500'
    }
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {quickLinks.map((link) => (
        <a 
          key={link.path}
          href={link.path}
          onClick={(e) => {
            e.preventDefault();
            setLocation(link.path);
          }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center transition duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className={`text-3xl ${link.color} mb-2`}>
            <i className={link.icon}></i>
          </div>
          <div className="font-medium">{link.label}</div>
        </a>
      ))}
    </div>
  );
};

export default QuickAccess;
