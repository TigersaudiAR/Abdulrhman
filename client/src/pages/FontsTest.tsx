import React from 'react';

export default function FontsTest() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">اختبار الخطوط والألوان</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gold">خطوط القرآن الكريم</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="font-bold mb-2">UthmanicHafs (خط عثمان حفص)</h3>
            <p className="font-quran text-2xl">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className="font-quran text-xl mt-2">
              الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
            </p>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h3 className="font-bold mb-2">HafsSmart (خط حفص سمارت)</h3>
            <p style={{fontFamily: 'HafsSmart'}} className="text-2xl">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p style={{fontFamily: 'HafsSmart'}} className="text-xl mt-2">
              الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-emerald">خطوط النصوص العربية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="font-bold mb-2">Kitab (خط كتاب)</h3>
            <p className="font-arabic text-xl">
              هذا النص العربي يظهر بخط كتاب، وهو خط جميل مناسب للنصوص العربية.
            </p>
            <p className="font-arabic font-bold text-xl mt-2">
              هذا النص يظهر بخط كتاب العريض
            </p>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h3 className="font-bold mb-2">Scheherazade (خط شهرزاد)</h3>
            <p className="font-tafsir text-xl">
              هذا النص يظهر بخط شهرزاد، وهو مناسب للتفاسير والنصوص التوضيحية.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-navy">العناوين والترويسات</h2>
        <div className="p-6 border rounded-lg">
          <h3 className="font-bold mb-2">ME Quran (خط ام اي قرآن)</h3>
          <p className="font-heading-arabic text-3xl">
            سورة الفاتحة
          </p>
          <p className="font-heading-arabic text-2xl mt-2">
            سورة البقرة
          </p>
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-maroon">الألوان المستخدمة</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg text-white" style={{backgroundColor: 'var(--color-gold)'}}>
            Gold (ذهبي)
          </div>
          <div className="p-4 rounded-lg text-white" style={{backgroundColor: 'var(--color-emerald)'}}>
            Emerald (زمردي)
          </div>
          <div className="p-4 rounded-lg text-white" style={{backgroundColor: 'var(--color-navy)'}}>
            Navy (بحري)
          </div>
          <div className="p-4 rounded-lg text-white" style={{backgroundColor: 'var(--color-maroon)'}}>
            Maroon (عنابي)
          </div>
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">تأثيرات الآيات</h2>
        <div className="quran-page p-8 islamic-pattern">
          <span className="quran-verse font-quran text-2xl">وَإِذَا قِيلَ لَهُمْ آمِنُوا كَمَا آمَنَ النَّاسُ</span>
          <span className="quran-verse selected font-quran text-2xl">قَالُوا أَنُؤْمِنُ كَمَا آمَنَ السُّفَهَاءُ</span>
          <span className="quran-verse font-quran text-2xl">أَلَا إِنَّهُمْ هُمُ السُّفَهَاءُ وَلَكِنْ لَا يَعْلَمُونَ</span>
          <span className="verse-number">١٣</span>
        </div>
      </section>
    </div>
  );
}