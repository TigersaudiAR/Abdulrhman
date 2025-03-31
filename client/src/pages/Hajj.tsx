import { useState } from 'react';

// Hajj and Umrah rituals data
const rituals = [
  {
    id: 'ihram',
    name: 'الإحرام',
    description: 'هي نية الدخول في النسك (الحج أو العمرة)، ويتم ارتداء ملابس الإحرام للرجال وهي إزار ورداء أبيضان، وللنساء أي لباس ساتر يجوز لها الصلاة فيه.',
    steps: [
      'الاغتسال والتطيب قبل الإحرام',
      'ارتداء ملابس الإحرام للرجال',
      'النية لأداء النسك',
      'التلبية: "لبيك اللهم لبيك، لبيك لا شريك لك لبيك، إن الحمد والنعمة لك والملك، لا شريك لك"'
    ]
  },
  {
    id: 'tawaf',
    name: 'الطواف',
    description: 'هو الدوران حول الكعبة المشرفة سبعة أشواط، يبدأ من الحجر الأسود وينتهي به في كل شوط.',
    steps: [
      'البدء من الحجر الأسود (استلامه أو الإشارة إليه)',
      'الطواف حول الكعبة سبعة أشواط عكس عقارب الساعة',
      'الرمل (الإسراع) في الأشواط الثلاثة الأولى للرجال فقط في طواف القدوم',
      'الاضطباع (كشف الكتف الأيمن) للرجال في طواف القدوم',
      'الدعاء والذكر أثناء الطواف',
      'صلاة ركعتين خلف مقام إبراهيم بعد الانتهاء من الطواف'
    ]
  },
  {
    id: 'saai',
    name: 'السعي',
    description: 'هو المشي بين الصفا والمروة سبعة أشواط، يبدأ من الصفا وينتهي بالمروة.',
    steps: [
      'البدء من الصفا وقراءة: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ"',
      'الصعود على الصفا واستقبال الكعبة والتكبير والدعاء',
      'النزول والمشي إلى المروة، والهرولة في المنطقة المحددة بين العلامتين الخضراوين للرجال',
      'الصعود على المروة واستقبال الكعبة والتكبير والدعاء',
      'إكمال السعي سبعة أشواط (الصفا إلى المروة شوط، والمروة إلى الصفا شوط آخر)'
    ]
  },
  {
    id: 'wuquf',
    name: 'الوقوف بعرفة',
    description: 'ركن من أركان الحج، وهو الوقوف في عرفات يوم التاسع من ذي الحجة من زوال الشمس إلى غروبها.',
    steps: [
      'التوجه إلى عرفات يوم 9 ذي الحجة',
      'البقاء في حدود عرفة حتى غروب الشمس',
      'الإكثار من الدعاء والتضرع، فهو أفضل الدعاء',
      'الجمع بين صلاتي الظهر والعصر قصراً',
      'التوجه إلى مزدلفة بعد غروب الشمس'
    ]
  },
  {
    id: 'muzdalifah',
    name: 'المبيت بمزدلفة',
    description: 'واجب من واجبات الحج، وهو النزول بمزدلفة والمبيت فيها ليلة العاشر من ذي الحجة إلى ما بعد منتصف الليل.',
    steps: [
      'الوصول إلى مزدلفة بعد الوقوف بعرفة',
      'صلاة المغرب والعشاء جمعاً وقصراً',
      'المبيت حتى صلاة الفجر أو حتى منتصف الليل للضعفة',
      'جمع الحصى للرمي (49 حصاة للحج التمتع، 70 حصاة للحج القران والإفراد)',
      'التوجه إلى منى بعد صلاة الفجر'
    ]
  },
  {
    id: 'rami',
    name: 'رمي الجمرات',
    description: 'واجب من واجبات الحج، وهو رمي الجمرات الثلاث في منى في أيام التشريق.',
    steps: [
      'رمي جمرة العقبة الكبرى يوم النحر بسبع حصيات',
      'رمي الجمرات الثلاث في أيام التشريق بعد الزوال، بدءاً من الصغرى ثم الوسطى ثم الكبرى',
      'كل جمرة ترمى بسبع حصيات مع التكبير مع كل حصاة',
      'الوقوف للدعاء بعد رمي الجمرة الصغرى والوسطى',
      'عدم الوقوف للدعاء بعد الجمرة الكبرى'
    ]
  }
];

// Makkah and Madinah places of interest
const places = [
  {
    id: 'kaaba',
    name: 'الكعبة المشرفة',
    location: 'مكة المكرمة',
    description: 'بيت الله الحرام وقبلة المسلمين، أول بيت وضع للناس في الأرض للعبادة.'
  },
  {
    id: 'rawdah',
    name: 'الروضة الشريفة',
    location: 'المدينة المنورة',
    description: 'ما بين بيت النبي ﷺ ومنبره، وهي روضة من رياض الجنة كما أخبر النبي ﷺ.'
  },
  {
    id: 'safa-marwa',
    name: 'الصفا والمروة',
    location: 'مكة المكرمة',
    description: 'جبلان صغيران في مكة، ويُسعى بينهما سبعة أشواط في الحج والعمرة، إحياءً لذكرى سعي هاجر طلباً للماء لابنها إسماعيل.'
  },
  {
    id: 'arafat',
    name: 'جبل عرفات',
    location: 'مكة المكرمة',
    description: 'موقع الوقوف في الحج، وهو ركن من أركان الحج، وفيه ألقى النبي ﷺ خطبة الوداع.'
  },
  {
    id: 'uhud',
    name: 'جبل أحد',
    location: 'المدينة المنورة',
    description: 'موقع غزوة أحد الشهيرة، وفيه قبور شهداء أحد، منهم حمزة بن عبد المطلب رضي الله عنه.'
  }
];

const Hajj = () => {
  const [activeTab, setActiveTab] = useState('rituals');
  const [selectedRitual, setSelectedRitual] = useState('ihram');
  
  return (
    <section className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">الحج والعمرة</h2>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              className={`py-2 px-4 rounded-lg ${activeTab === 'rituals' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              onClick={() => setActiveTab('rituals')}
            >
              مناسك الحج والعمرة
            </button>
            <button 
              className={`py-2 px-4 rounded-lg ${activeTab === 'map' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              onClick={() => setActiveTab('map')}
            >
              خريطة المشاعر
            </button>
            <button 
              className={`py-2 px-4 rounded-lg ${activeTab === 'places' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              onClick={() => setActiveTab('places')}
            >
              أماكن الزيارة
            </button>
            <button 
              className={`py-2 px-4 rounded-lg ${activeTab === 'guide' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              onClick={() => setActiveTab('guide')}
            >
              دليل الحاج
            </button>
          </div>
          
          {activeTab === 'rituals' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1 border-r border-gray-200 dark:border-gray-700 pr-4">
                <h3 className="font-bold text-lg mb-3">المناسك</h3>
                <ul className="space-y-2">
                  {rituals.map(ritual => (
                    <li key={ritual.id}>
                      <button 
                        className={`w-full text-right p-2 rounded-lg ${selectedRitual === ritual.id ? 'bg-primary bg-opacity-10 text-primary font-medium' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        onClick={() => setSelectedRitual(ritual.id)}
                      >
                        {ritual.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="md:col-span-3">
                {rituals.map(ritual => ritual.id === selectedRitual && (
                  <div key={ritual.id}>
                    <h3 className="font-bold text-xl mb-2 text-primary">{ritual.name}</h3>
                    <p className="mb-4 text-gray-700 dark:text-gray-300">{ritual.description}</p>
                    
                    <h4 className="font-medium mb-2">خطوات أداء {ritual.name}:</h4>
                    <ul className="space-y-2 list-disc pr-6">
                      {ritual.steps.map((step, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">{step}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'map' && (
            <div>
              <h3 className="font-bold text-lg mb-3">خريطة المشاعر المقدسة</h3>
              <div className="hajj-map-container rounded-lg overflow-hidden mb-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 h-full flex items-center justify-center">
                  <div className="text-center">
                    <i className="fas fa-map-location-dot text-5xl text-primary mb-3"></i>
                    <p className="text-gray-700 dark:text-gray-300">خريطة تفاعلية للمشاعر المقدسة</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <h4 className="font-medium mb-1">المسجد الحرام</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">مركز مكة المكرمة، ويضم الكعبة المشرفة</p>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <h4 className="font-medium mb-1">منى</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">مكان المبيت في أيام التشريق، ورمي الجمرات</p>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <h4 className="font-medium mb-1">عرفات</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">موقع الوقوف، ركن من أركان الحج</p>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <h4 className="font-medium mb-1">مزدلفة</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">مكان المبيت بعد عرفة، وجمع الحصى للرمي</p>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <h4 className="font-medium mb-1">الجمرات</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">الجمرة الصغرى والوسطى والكبرى في منى</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'places' && (
            <div>
              <h3 className="font-bold text-lg mb-3">أماكن الزيارة في مكة والمدينة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {places.map(place => (
                  <div key={place.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-bold text-primary mb-1">{place.name}</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{place.location}</div>
                    <p className="text-gray-700 dark:text-gray-300">{place.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'guide' && (
            <div>
              <h3 className="font-bold text-lg mb-3">دليل الحاج والمعتمر</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-primary mb-2">نصائح عامة:</h4>
                <ul className="space-y-2 list-disc pr-6">
                  <li>احمل معك بطاقة التعريف والتأكد من صلاحية التصاريح</li>
                  <li>أخذ قسط كافٍ من الراحة والحرص على شرب كميات كافية من الماء</li>
                  <li>الالتزام بتعليمات الجهات المنظمة والحرص على الوجود في الأماكن المخصصة</li>
                  <li>استخدام كمامة واتباع الإجراءات الوقائية</li>
                  <li>تجنب الازدحام قدر الإمكان وخاصة كبار السن والمرضى</li>
                </ul>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-medium mb-2">الأدوية الضرورية</h4>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>أدوية خافضة للحرارة ومسكنات الألم</li>
                    <li>مراهم للحروق الشمسية والتهابات الجلد</li>
                    <li>محلول معقم للجروح ولاصقات</li>
                    <li>أدوية الأمراض المزمنة لمن يحتاجها</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-medium mb-2">أرقام الطوارئ</h4>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>الطوارئ الموحد: 911</li>
                    <li>الهلال الأحمر: 997</li>
                    <li>الدفاع المدني: 998</li>
                    <li>خدمات الحجاج: 1966</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-primary bg-opacity-10 p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-3">
            <i className="fas fa-lightbulb text-primary text-xl mr-2"></i>
            <h3 className="font-bold text-lg">أهمية الحج والعمرة</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            الحج هو الركن الخامس من أركان الإسلام، وهو فرض على كل مسلم بالغ عاقل مستطيع مرة واحدة في العمر. قال تعالى: "وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلًا".
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            أما العمرة فهي سنة مؤكدة، وتسمى الحج الأصغر، ويمكن أداؤها في أي وقت من السنة. وقد قال النبي ﷺ: "العمرة إلى العمرة كفارة لما بينهما، والحج المبرور ليس له جزاء إلا الجنة".
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hajj;
