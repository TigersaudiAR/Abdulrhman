import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { QuranData, Surah } from '@/types/quran';
import { Search, BookOpen, MapPin, Filter, ChevronDown, X } from 'lucide-react';

interface SurahListProps {
  quranData: QuranData;
  fontFamily: string;
  fontSize: number;
}

export default function SurahList({ quranData, fontFamily, fontSize }: SurahListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [revelationFilter, setRevelationFilter] = useState<string | null>(null);
  const [juzFilter, setJuzFilter] = useState<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // أرقام الأجزاء المتاحة
  const juzNumbers = Array.from({ length: 30 }, (_, i) => i + 1);
  
  // تصفية السور بناءً على البحث وعوامل التصفية
  const filteredSurahs = quranData.surahs.filter(surah => {
    const matchesSearch = 
      searchQuery === '' || 
      surah.name.includes(searchQuery) || 
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      surah.number.toString().includes(searchQuery);
    
    const matchesRevelation = 
      !revelationFilter || 
      (revelationFilter === 'Meccan' && surah.revelationType === 'Meccan') ||
      (revelationFilter === 'Medinan' && surah.revelationType === 'Medinan');
    
    // التصفية حسب الجزء (تقريبي استنادًا إلى رقم الصفحة)
    const matchesJuz = !juzFilter || isInJuz(surah, juzFilter);
    
    return matchesSearch && matchesRevelation && matchesJuz;
  });
  
  // التحقق مما إذا كانت السورة تقع ضمن الجزء المحدد (تقريبي)
  function isInJuz(surah: Surah, juzNumber: number): boolean {
    // ترجمة رقم الجزء إلى نطاق صفحات (تقريبي)
    const startPage = (juzNumber - 1) * 20 + 1;
    const endPage = juzNumber * 20;
    
    // إذا كانت صفحة السورة معروفة
    const page = (surah as any).page;
    if (page) {
      // إذا كانت السورة تبدأ ضمن نطاق الجزء
      return page >= startPage && page <= endPage;
    }
    
    // إذا لم تكن الصفحة معروفة، نستخدم رقم السورة لتقدير تقريبي
    const estimatedPage = Math.ceil((surah.number / 114) * 604);
    return estimatedPage >= startPage && estimatedPage <= endPage;
  }
  
  // التركيز على حقل البحث عند التحميل
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);
  
  // إعادة تعيين عوامل التصفية
  const resetFilters = () => {
    setRevelationFilter(null);
    setJuzFilter(null);
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="surah-list-container">
      <div className="search-and-filter mb-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="ابحث عن سورة بالاسم أو الرقم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 focus:border-amber-500 focus:ring focus:ring-amber-200 dark:focus:ring-amber-700 transition duration-150 ease-in-out"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <div className="filter-controls">
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 mb-2"
          >
            <Filter className="h-4 w-4 mr-1" />
            خيارات التصفية
            <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${filterOpen ? 'transform rotate-180' : ''}`} />
          </button>
          
          {filterOpen && (
            <div className="filter-options bg-amber-50 dark:bg-gray-700 p-3 rounded-md mb-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نوع السورة</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setRevelationFilter(revelationFilter === 'Meccan' ? null : 'Meccan')}
                      className={`px-3 py-1 text-sm rounded-full ${
                        revelationFilter === 'Meccan' 
                          ? 'bg-amber-500 text-white' 
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      مكية
                    </button>
                    <button
                      onClick={() => setRevelationFilter(revelationFilter === 'Medinan' ? null : 'Medinan')}
                      className={`px-3 py-1 text-sm rounded-full ${
                        revelationFilter === 'Medinan' 
                          ? 'bg-amber-500 text-white' 
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      مدنية
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الجزء</label>
                  <select
                    value={juzFilter || ''}
                    onChange={(e) => setJuzFilter(e.target.value ? parseInt(e.target.value) : null)}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200 dark:focus:ring-amber-700 dark:bg-gray-700 text-sm"
                  >
                    <option value="">كل الأجزاء</option>
                    {juzNumbers.map(num => (
                      <option key={num} value={num}>الجزء {num}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {(revelationFilter || juzFilter) && (
                <div className="mt-3 text-right">
                  <button
                    onClick={resetFilters}
                    className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center justify-center mr-auto"
                  >
                    <X className="h-3 w-3 mr-1" />
                    إعادة تعيين التصفية
                  </button>
                </div>
              )}
            </div>
          )}
          
          <div className="filters-summary mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span>إجمالي السور: {filteredSurahs.length}</span>
            {revelationFilter && <span className="mr-2">• {revelationFilter === 'Meccan' ? 'مكية' : 'مدنية'}</span>}
            {juzFilter && <span className="mr-2">• الجزء {juzFilter}</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSurahs.length > 0 ? (
          filteredSurahs.map((surah) => (
            <SurahCard key={surah.number} surah={surah} fontFamily={fontFamily} fontSize={fontSize} />
          ))
        ) : (
          <div className="col-span-full text-center p-8 bg-amber-50 dark:bg-gray-700 rounded-lg">
            <div className="text-amber-500 mb-2 flex justify-center">
              <BookOpen className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">لا توجد نتائج</h3>
            <p className="text-gray-600 dark:text-gray-400">
              لم يتم العثور على سور تطابق معايير البحث. جرب بحثًا مختلفًا أو إعادة تعيين عوامل التصفية.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition duration-150 ease-in-out"
            >
              إعادة تعيين
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface SurahCardProps {
  surah: Surah;
  fontFamily: string;
  fontSize: number;
}

function SurahCard({ surah, fontFamily, fontSize }: SurahCardProps) {
  const [, navigate] = useLocation();
  
  // تحديد الصفحة إذا كانت متوفرة، وإلا استخدام رقم السورة للتنقل
  const pageNumber = (surah as any).page;
  const targetUrl = pageNumber ? `/quran/page/${pageNumber}` : `/quran/surah/${surah.number}`;

  // تحويل رقم السورة إلى أرقام عربية
  const arabicNumber = surah.number.toLocaleString('ar-SA');
  
  // تعيين لون للسورة بناءً على رقمها 
  // لكن نستخدم أسلوبًا ثابتًا مع Tailwind بدلاً من الديناميكي
  
  // اختر أسلوبًا للبطاقة بناءً على فئة السورة (قسمنا السور إلى 5 فئات)
  const cardStyle = () => {
    const category = surah.number % 5;
    switch(category) {
      case 0: 
        return {
          border: "border-t-4 border-amber-500",
          badge: "bg-amber-500 text-white",
          type: "text-amber-700 bg-amber-100 dark:bg-amber-900 dark:text-amber-200"
        };
      case 1: 
        return {
          border: "border-t-4 border-emerald-500",
          badge: "bg-emerald-500 text-white",
          type: "text-emerald-700 bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-200"
        };
      case 2: 
        return {
          border: "border-t-4 border-blue-500",
          badge: "bg-blue-500 text-white",
          type: "text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-200"
        };
      case 3: 
        return {
          border: "border-t-4 border-purple-500",
          badge: "bg-purple-500 text-white",
          type: "text-purple-700 bg-purple-100 dark:bg-purple-900 dark:text-purple-200"
        };
      case 4: 
        return {
          border: "border-t-4 border-rose-500",
          badge: "bg-rose-500 text-white",
          type: "text-rose-700 bg-rose-100 dark:bg-rose-900 dark:text-rose-200"
        };
      default:
        return {
          border: "border-t-4 border-amber-500",
          badge: "bg-amber-500 text-white",
          type: "text-amber-700 bg-amber-100 dark:bg-amber-900 dark:text-amber-200"
        };
    }
  };
  
  const style = cardStyle();

  return (
    <div 
      className="block bg-white dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition duration-150 ease-in-out cursor-pointer overflow-hidden" 
      onClick={() => navigate(targetUrl)}
    >
      <div className={style.border}></div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <div className={`${style.badge} w-9 h-9 flex items-center justify-center rounded-full ml-3 text-sm`}>
              {arabicNumber}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{surah.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{surah.englishName}</p>
            </div>
          </div>
          <div className={`${style.type} text-xs px-2 py-1 rounded-full`}>
            {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
          </div>
        </div>
        <div className="mt-4 text-center py-3 rounded-md bg-amber-50 dark:bg-gray-700" style={{ 
          fontFamily: 'HafsSmart, Hafs, UthmanicHafs, serif', 
          fontSize: `${fontSize}px`,
          color: '#705C3B',
          letterSpacing: '0.02em',
          lineHeight: '1.8'
        }}>
          {surah.number !== 1 && surah.number !== 9 ? 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ' : ''}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
          <span className="flex items-center">
            <BookOpen className="h-3 w-3 mr-1" />
            عدد الآيات: {surah.numberOfAyahs}
          </span>
          <span className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            الصفحة: {(surah as any).page || ''}
          </span>
        </div>
      </div>
    </div>
  );
}