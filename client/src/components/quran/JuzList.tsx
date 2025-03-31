import { useState } from 'react';
import { useLocation } from 'wouter';
import { QuranData, Juz, JuzAyah } from '@/types/quran';

interface JuzListProps {
  quranData: QuranData;
  fontFamily: string;
  fontSize: number;
}

export default function JuzList({ quranData, fontFamily, fontSize }: JuzListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // إنشاء مصفوفة الأجزاء
  const juzs = Array.from({ length: 30 }, (_, i) => i + 1);
  
  const filteredJuzs = juzs.filter(juz => 
    juz.toString().includes(searchQuery)
  );

  // إيجاد معلومات الجزء (السور المتضمنة في كل جزء)
  const getJuzInfo = (juzNumber: number) => {
    // نظرًا لعدم وجود بيانات دقيقة للآيات في كل جزء، سنستخدم بيانات تقريبية
    // معلومات عن السور التي تظهر في كل جزء (هذه البيانات تقريبية)
    const juzSurahMap: Record<number, { surah: number, firstAyah: number, lastAyah: number }[]> = {
      1: [{ surah: 1, firstAyah: 1, lastAyah: 7 }, { surah: 2, firstAyah: 1, lastAyah: 141 }],
      2: [{ surah: 2, firstAyah: 142, lastAyah: 252 }],
      3: [{ surah: 2, firstAyah: 253, lastAyah: 286 }, { surah: 3, firstAyah: 1, lastAyah: 92 }],
      4: [{ surah: 3, firstAyah: 93, lastAyah: 200 }, { surah: 4, firstAyah: 1, lastAyah: 23 }],
      5: [{ surah: 4, firstAyah: 24, lastAyah: 147 }],
      6: [{ surah: 4, firstAyah: 148, lastAyah: 176 }, { surah: 5, firstAyah: 1, lastAyah: 81 }],
      7: [{ surah: 5, firstAyah: 82, lastAyah: 120 }, { surah: 6, firstAyah: 1, lastAyah: 110 }],
      8: [{ surah: 6, firstAyah: 111, lastAyah: 165 }, { surah: 7, firstAyah: 1, lastAyah: 87 }],
      9: [{ surah: 7, firstAyah: 88, lastAyah: 206 }, { surah: 8, firstAyah: 1, lastAyah: 40 }],
      10: [{ surah: 8, firstAyah: 41, lastAyah: 75 }, { surah: 9, firstAyah: 1, lastAyah: 92 }],
      11: [{ surah: 9, firstAyah: 93, lastAyah: 129 }, { surah: 10, firstAyah: 1, lastAyah: 109 }, { surah: 11, firstAyah: 1, lastAyah: 5 }],
      12: [{ surah: 11, firstAyah: 6, lastAyah: 123 }, { surah: 12, firstAyah: 1, lastAyah: 52 }],
      13: [{ surah: 12, firstAyah: 53, lastAyah: 111 }, { surah: 13, firstAyah: 1, lastAyah: 43 }, { surah: 14, firstAyah: 1, lastAyah: 52 }],
      14: [{ surah: 15, firstAyah: 1, lastAyah: 99 }, { surah: 16, firstAyah: 1, lastAyah: 128 }],
      15: [{ surah: 17, firstAyah: 1, lastAyah: 111 }, { surah: 18, firstAyah: 1, lastAyah: 74 }],
      16: [{ surah: 18, firstAyah: 75, lastAyah: 110 }, { surah: 19, firstAyah: 1, lastAyah: 98 }, { surah: 20, firstAyah: 1, lastAyah: 135 }],
      17: [{ surah: 21, firstAyah: 1, lastAyah: 112 }, { surah: 22, firstAyah: 1, lastAyah: 78 }],
      18: [{ surah: 23, firstAyah: 1, lastAyah: 118 }, { surah: 24, firstAyah: 1, lastAyah: 64 }, { surah: 25, firstAyah: 1, lastAyah: 20 }],
      19: [{ surah: 25, firstAyah: 21, lastAyah: 77 }, { surah: 26, firstAyah: 1, lastAyah: 227 }, { surah: 27, firstAyah: 1, lastAyah: 55 }],
      20: [{ surah: 27, firstAyah: 56, lastAyah: 93 }, { surah: 28, firstAyah: 1, lastAyah: 88 }, { surah: 29, firstAyah: 1, lastAyah: 45 }],
      21: [{ surah: 29, firstAyah: 46, lastAyah: 69 }, { surah: 30, firstAyah: 1, lastAyah: 60 }, { surah: 31, firstAyah: 1, lastAyah: 34 }, { surah: 32, firstAyah: 1, lastAyah: 30 }, { surah: 33, firstAyah: 1, lastAyah: 30 }],
      22: [{ surah: 33, firstAyah: 31, lastAyah: 73 }, { surah: 34, firstAyah: 1, lastAyah: 54 }, { surah: 35, firstAyah: 1, lastAyah: 45 }, { surah: 36, firstAyah: 1, lastAyah: 27 }],
      23: [{ surah: 36, firstAyah: 28, lastAyah: 83 }, { surah: 37, firstAyah: 1, lastAyah: 182 }, { surah: 38, firstAyah: 1, lastAyah: 88 }, { surah: 39, firstAyah: 1, lastAyah: 31 }],
      24: [{ surah: 39, firstAyah: 32, lastAyah: 75 }, { surah: 40, firstAyah: 1, lastAyah: 85 }, { surah: 41, firstAyah: 1, lastAyah: 46 }],
      25: [{ surah: 41, firstAyah: 47, lastAyah: 54 }, { surah: 42, firstAyah: 1, lastAyah: 53 }, { surah: 43, firstAyah: 1, lastAyah: 89 }, { surah: 44, firstAyah: 1, lastAyah: 59 }, { surah: 45, firstAyah: 1, lastAyah: 37 }],
      26: [{ surah: 46, firstAyah: 1, lastAyah: 35 }, { surah: 47, firstAyah: 1, lastAyah: 38 }, { surah: 48, firstAyah: 1, lastAyah: 29 }, { surah: 49, firstAyah: 1, lastAyah: 18 }, { surah: 50, firstAyah: 1, lastAyah: 45 }, { surah: 51, firstAyah: 1, lastAyah: 30 }],
      27: [{ surah: 51, firstAyah: 31, lastAyah: 60 }, { surah: 52, firstAyah: 1, lastAyah: 49 }, { surah: 53, firstAyah: 1, lastAyah: 62 }, { surah: 54, firstAyah: 1, lastAyah: 55 }, { surah: 55, firstAyah: 1, lastAyah: 78 }, { surah: 56, firstAyah: 1, lastAyah: 96 }, { surah: 57, firstAyah: 1, lastAyah: 29 }],
      28: [{ surah: 58, firstAyah: 1, lastAyah: 22 }, { surah: 59, firstAyah: 1, lastAyah: 24 }, { surah: 60, firstAyah: 1, lastAyah: 13 }, { surah: 61, firstAyah: 1, lastAyah: 14 }, { surah: 62, firstAyah: 1, lastAyah: 11 }, { surah: 63, firstAyah: 1, lastAyah: 11 }, { surah: 64, firstAyah: 1, lastAyah: 18 }, { surah: 65, firstAyah: 1, lastAyah: 12 }, { surah: 66, firstAyah: 1, lastAyah: 12 }],
      29: [{ surah: 67, firstAyah: 1, lastAyah: 30 }, { surah: 68, firstAyah: 1, lastAyah: 52 }, { surah: 69, firstAyah: 1, lastAyah: 52 }, { surah: 70, firstAyah: 1, lastAyah: 44 }, { surah: 71, firstAyah: 1, lastAyah: 28 }, { surah: 72, firstAyah: 1, lastAyah: 28 }, { surah: 73, firstAyah: 1, lastAyah: 20 }, { surah: 74, firstAyah: 1, lastAyah: 56 }, { surah: 75, firstAyah: 1, lastAyah: 40 }, { surah: 76, firstAyah: 1, lastAyah: 31 }, { surah: 77, firstAyah: 1, lastAyah: 50 }],
      30: [{ surah: 78, firstAyah: 1, lastAyah: 40 }, { surah: 79, firstAyah: 1, lastAyah: 46 }, { surah: 80, firstAyah: 1, lastAyah: 42 }, { surah: 81, firstAyah: 1, lastAyah: 29 }, { surah: 82, firstAyah: 1, lastAyah: 19 }, { surah: 83, firstAyah: 1, lastAyah: 36 }, { surah: 84, firstAyah: 1, lastAyah: 25 }, { surah: 85, firstAyah: 1, lastAyah: 22 }, { surah: 86, firstAyah: 1, lastAyah: 17 }, { surah: 87, firstAyah: 1, lastAyah: 19 }, { surah: 88, firstAyah: 1, lastAyah: 26 }, { surah: 89, firstAyah: 1, lastAyah: 30 }, { surah: 90, firstAyah: 1, lastAyah: 20 }, { surah: 91, firstAyah: 1, lastAyah: 15 }, { surah: 92, firstAyah: 1, lastAyah: 21 }, { surah: 93, firstAyah: 1, lastAyah: 11 }, { surah: 94, firstAyah: 1, lastAyah: 8 }, { surah: 95, firstAyah: 1, lastAyah: 8 }, { surah: 96, firstAyah: 1, lastAyah: 19 }, { surah: 97, firstAyah: 1, lastAyah: 5 }, { surah: 98, firstAyah: 1, lastAyah: 8 }, { surah: 99, firstAyah: 1, lastAyah: 8 }, { surah: 100, firstAyah: 1, lastAyah: 11 }, { surah: 101, firstAyah: 1, lastAyah: 11 }, { surah: 102, firstAyah: 1, lastAyah: 8 }, { surah: 103, firstAyah: 1, lastAyah: 3 }, { surah: 104, firstAyah: 1, lastAyah: 9 }, { surah: 105, firstAyah: 1, lastAyah: 5 }, { surah: 106, firstAyah: 1, lastAyah: 4 }, { surah: 107, firstAyah: 1, lastAyah: 7 }, { surah: 108, firstAyah: 1, lastAyah: 3 }, { surah: 109, firstAyah: 1, lastAyah: 6 }, { surah: 110, firstAyah: 1, lastAyah: 3 }, { surah: 111, firstAyah: 1, lastAyah: 5 }, { surah: 112, firstAyah: 1, lastAyah: 4 }, { surah: 113, firstAyah: 1, lastAyah: 5 }, { surah: 114, firstAyah: 1, lastAyah: 6 }]
    };

    // احصل على معلومات الجزء المحدد
    const juzData = juzSurahMap[juzNumber] || [];
    
    // استخراج معلومات كل سورة في الجزء
    return juzData.map(entry => {
      // ابحث عن السورة المطابقة في بيانات القرآن
      const surah = quranData.surahs.find(s => s.number === entry.surah) || 
        { number: entry.surah, name: `سورة ${entry.surah}`, englishName: `Surah ${entry.surah}` };
      
      return {
        surahNumber: surah.number,
        surahName: surah.name,
        firstAyah: entry.firstAyah,
        lastAyah: entry.lastAyah
      };
    });
  };

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="ابحث عن جزء..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJuzs.map((juz) => (
          <JuzCard 
            key={juz} 
            juzNumber={juz} 
            juzInfo={getJuzInfo(juz)} 
            fontFamily={fontFamily}
            fontSize={fontSize}
          />
        ))}
      </div>
    </div>
  );
}

interface JuzInfo {
  surahNumber: number;
  surahName: string;
  firstAyah: number;
  lastAyah: number;
}

interface JuzCardProps {
  juzNumber: number;
  juzInfo: JuzInfo[];
  fontFamily: string;
  fontSize: number;
}

function JuzCard({ juzNumber, juzInfo, fontFamily, fontSize }: JuzCardProps) {
  const [, navigate] = useLocation();
  const firstSurah = juzInfo[0];
  
  return (
    <div 
      onClick={() => navigate(`/quran/juz/${juzNumber}`)}
      className="block bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg p-4 transition duration-150 ease-in-out cursor-pointer">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className="bg-primary-600 text-white w-8 h-8 flex items-center justify-center rounded-full ml-2">
            {juzNumber}
          </div>
          <div>
            <h3 className="font-bold text-lg">الجزء {juzNumber}</h3>
            {firstSurah && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                يبدأ من سورة {firstSurah.surahName}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-2 text-center" style={{ 
        fontFamily: 'HafsSmart, Hafs, UthmanicHafs, serif', 
        fontSize: `${fontSize}px`,
        color: '#705C3B',
        letterSpacing: '0.02em',
        lineHeight: '1.8'
      }}>
        {firstSurah && (
          <span>الجزء {juzNumber}</span>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        {juzInfo.length > 0 && (
          <ul className="divide-y divide-gray-200 dark:divide-gray-600">
            {juzInfo.map((info) => (
              <li key={info.surahNumber} className="py-1">
                سورة {info.surahName}: من الآية {info.firstAyah} إلى الآية {info.lastAyah}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}