import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorDisplay from '../components/common/ErrorDisplay';

// Categories of duas and adhkar
const categories = [
  { id: 'morning', name: 'أذكار الصباح' },
  { id: 'evening', name: 'أذكار المساء' },
  { id: 'salah', name: 'أذكار الصلاة' },
  { id: 'sleep', name: 'أذكار النوم' },
  { id: 'food', name: 'أذكار الطعام' },
  { id: 'travel', name: 'أذكار السفر' },
  { id: 'quran', name: 'أدعية قرآنية' },
  { id: 'prophetic', name: 'أدعية نبوية' },
  { id: 'masjid', name: 'أذكار المسجد' },
  { id: 'daily', name: 'أذكار يومية' },
];

interface Dua {
  id: string;
  text: string;
  translation?: string;
  transliteration?: string;
  reference: string;
  benefit?: string;
  repeat?: number;
}

const fetchDuas = async (category: string): Promise<Dua[]> => {
  // In a full implementation, this would fetch from an API
  // For now, we'll return some hardcoded data for the selected category
  
  switch (category) {
    case 'morning':
      return [
        {
          id: 'morning-1',
          text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
          translation: 'We have reached the morning and at this very time all sovereignty belongs to Allah. Praise be to Allah. None has the right to be worshipped except Allah, alone, without any partner. To Allah belongs all sovereignty and praise and He is over all things omnipotent.',
          reference: 'رواه أبو داود',
          repeat: 1
        },
        {
          id: 'morning-2',
          text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
          translation: 'O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection.',
          reference: 'رواه الترمذي',
          repeat: 1
        },
        {
          id: 'morning-3',
          text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.',
          translation: 'Glory is to Allah and praise is to Him.',
          reference: 'رواه مسلم',
          benefit: 'من قالها مائة مرة حين يصبح وحين يمسي، لم يأت أحد يوم القيامة بأفضل مما جاء به إلا أحد قال مثل ما قال أو زاد عليه',
          repeat: 100
        }
      ];
    
    case 'evening':
      return [
        {
          id: 'evening-1',
          text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
          translation: 'We have reached the evening and at this very time all sovereignty belongs to Allah. Praise be to Allah. None has the right to be worshipped except Allah, alone, without any partner. To Allah belongs all sovereignty and praise and He is over all things omnipotent.',
          reference: 'رواه أبو داود',
          repeat: 1
        },
        {
          id: 'evening-2',
          text: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
          translation: 'O Allah, by Your leave we have reached the evening and by Your leave we have reached the morning, by Your leave we live and die and unto You is our return.',
          reference: 'رواه الترمذي',
          repeat: 1
        }
      ];
    
    case 'quran':
      return [
        {
          id: 'quran-1',
          text: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
          translation: 'Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.',
          reference: 'البقرة: 201',
          repeat: 1
        },
        {
          id: 'quran-2',
          text: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً ۚ إِنَّكَ أَنْتَ الْوَهَّابُ',
          translation: 'Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower.',
          reference: 'آل عمران: 8',
          repeat: 1
        }
      ];
      
    default:
      return [];
  }
};

const Duas = () => {
  const [selectedCategory, setSelectedCategory] = useState('morning');
  const [filter, setFilter] = useState('');
  
  const { data: duas, isLoading, error, refetch } = useQuery({
    queryKey: ['duas', selectedCategory],
    queryFn: () => fetchDuas(selectedCategory),
  });
  
  // Filter duas based on search
  const filteredDuas = duas?.filter(dua => 
    dua.text.includes(filter) || 
    (dua.translation && dua.translation.toLowerCase().includes(filter.toLowerCase()))
  );
  
  return (
    <section className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">الأدعية والأذكار</h2>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
          <div className="relative mb-4">
            <input 
              type="text" 
              placeholder="ابحث في الأدعية والأذكار..." 
              className="w-full py-2 px-4 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring focus:ring-primary focus:ring-opacity-50 focus:border-primary dark:text-white"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`py-2 px-4 rounded-lg ${
                  selectedCategory === category.id 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {isLoading ? (
          <LoadingSpinner text="جار تحميل الأدعية..." />
        ) : error ? (
          <ErrorDisplay 
            error={error instanceof Error ? error.message : 'حدث خطأ أثناء تحميل الأدعية'} 
            onRetry={refetch} 
          />
        ) : filteredDuas && filteredDuas.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            {filteredDuas.map((dua) => (
              <div key={dua.id} className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <div className="quran-page p-4 rounded-lg mb-3">
                  <p className="arabic-text text-xl text-right leading-loose">{dua.text}</p>
                  {dua.repeat && dua.repeat > 1 && (
                    <div className="text-primary text-left mt-2">
                      يكرر {dua.repeat} مرات
                    </div>
                  )}
                </div>
                
                {dua.translation && (
                  <div className="mb-3 text-gray-700 dark:text-gray-300">
                    <h4 className="font-medium mb-1">المعنى:</h4>
                    <p>{dua.translation}</p>
                  </div>
                )}
                
                {dua.benefit && (
                  <div className="mb-3 text-green-700 dark:text-green-400">
                    <h4 className="font-medium mb-1">الفضل:</h4>
                    <p>{dua.benefit}</p>
                  </div>
                )}
                
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  المصدر: {dua.reference}
                </div>
                
                <div className="flex justify-end mt-2">
                  <button className="py-1 px-3 text-sm bg-primary text-white rounded-lg hover:bg-opacity-90">
                    <i className="fas fa-volume-high mr-1"></i> استماع
                  </button>
                  <button className="py-1 px-3 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 mr-2">
                    <i className="fas fa-share mr-1"></i> مشاركة
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
            <i className="fas fa-prayer-hands text-5xl text-gray-400 mb-3"></i>
            <p className="text-gray-600 dark:text-gray-400">
              {filter ? 'لا توجد نتائج تطابق البحث' : 'لا توجد أدعية متاحة حالياً في هذه الفئة'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Duas;
