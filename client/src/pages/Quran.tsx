import { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { FullScreenMushaf } from '../components/quran/FullScreenMushaf';
import { useApp } from '../context/AppContext';
import { APP_CONFIG } from '../lib/constants';

/**
 * صفحة القرآن الكريم الرئيسية
 * تعرض المصحف بتنسيق مجمع الملك فهد في وضع ملء الشاشة
 * 
 * تخطيط خاص: لاحظ أننا لا نستخدم MainLayout هنا للحصول على واجهة كاملة الشاشة للمصحف
 * مع إظهار أدوات التحكم فقط عند التفاعل مع الصفحة.
 */
const Quran = () => {
  const params = useParams();
  const { lastRead, settings } = useApp();
  const [initialPage, setInitialPage] = useState<number>(APP_CONFIG.DEFAULT_PAGE);
  
  // تحديد الصفحة الأولية استنادًا إلى المعلمات أو آخر قراءة
  useEffect(() => {
    console.log('تحديث معلمات القرآن:', { params, lastRead });
    
    // نستخدم متغيراً مؤقتاً لتخزين الصفحة لمنع التحديثات المتكررة
    let newPage = APP_CONFIG.DEFAULT_PAGE;
    let shouldUpdate = false;
    
    // إذا كان هناك رقم صفحة في المعلمات
    if (params.pageNumber) {
      newPage = parseInt(params.pageNumber, 10);
      shouldUpdate = newPage !== initialPage;
    } 
    // إذا كان هناك رقم سورة في المعلمات
    else if (params.surahNumber) {
      // نحتاج إلى تنفيذ منطق إضافي لتحويل رقم السورة والآية إلى رقم الصفحة
      // هذا سيتطلب بيانات إضافية عن توزيع السور والآيات بين صفحات المصحف
      // حالياً سنعود إلى الصفحة الافتراضية
      console.log('التنقل بالسورة والآية قيد التطوير');
    } 
    // إذا كان هناك آخر قراءة محفوظة وتم تفعيل خيار "حفظ آخر قراءة"
    else if (lastRead && settings.autoSaveLastRead) {
      newPage = lastRead.pageNumber;
      shouldUpdate = newPage !== initialPage;
    }
    
    // نقوم بالتحديث فقط إذا كانت القيم الجديدة مختلفة
    if (shouldUpdate) {
      console.log('تحديث صفحة القرآن:', { newPage });
      setInitialPage(newPage);
    }
  }, [params.pageNumber, params.surahNumber, params.ayahNumber, lastRead, settings.autoSaveLastRead, initialPage]);
  
  // نعرض المصحف مباشرة بدون تخطيط إضافي للحصول على تجربة غامرة كاملة الشاشة
  return (
    <FullScreenMushaf initialPage={initialPage} />
  );
};

export default Quran;