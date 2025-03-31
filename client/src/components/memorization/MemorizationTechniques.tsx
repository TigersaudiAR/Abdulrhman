const techniques = [
  {
    id: 1,
    title: 'طريقة التكرار',
    description: 'تكرار الآيات بصوت مسموع مع التركيز على المعاني والترابط بين الآيات.'
  },
  {
    id: 2,
    title: 'طريقة الاستماع والمحاكاة',
    description: 'الاستماع إلى قارئ متقن ثم محاكاته والتسميع معه بشكل متكرر.'
  },
  {
    id: 3,
    title: 'ربط الآيات بالتفسير',
    description: 'فهم معاني الآيات وتفسيرها مما يساعد على الترابط وسهولة الحفظ.'
  },
  {
    id: 4,
    title: 'الكتابة والرسم الذهني',
    description: 'كتابة الآيات وتخيلها ذهنياً مع رسم خرائط ذهنية لربط الآيات ببعضها.'
  }
];

const MemorizationTechniques = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-primary mb-3">تقنيات الحفظ</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {techniques.map((technique) => (
          <div 
            key={technique.id} 
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:border-primary transition-colors"
          >
            <div className="font-medium mb-1 text-primary">{technique.title}</div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {technique.description}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <a href="#" className="text-primary hover:underline">عرض المزيد من تقنيات الحفظ</a>
      </div>
    </div>
  );
};

export default MemorizationTechniques;
