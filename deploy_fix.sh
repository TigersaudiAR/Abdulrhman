#!/bin/bash
set -e # Exit immediately if any command fails

echo "====== تنفيذ إصلاحات النشر للتطبيق ======"

# التأكد من أن الملف قابل للتنفيذ
chmod +x deploy_fix.sh

# خطوة 1: إنشاء ملفات التحقق الإضافية
echo "1. إنشاء ملفات رمزية للتحقق من النشر..."
cat > public/deployment-test.html << 'EOL'
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>فحص النشر</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
      direction: rtl;
    }
    .success {
      color: green;
      font-weight: bold;
    }
    .btn {
      display: inline-block;
      margin: 10px;
      padding: 10px 20px;
      background-color: #d4b668;
      color: white;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <h1>نجاح النشر!</h1>
  <p class="success">✓ تم نشر التطبيق بنجاح</p>
  <p>الخادم يعمل بشكل صحيح ويمكن الوصول إلى الصفحات الثابتة.</p>
  
  <div>
    <a href="/" class="btn">الصفحة الرئيسية</a>
    <a href="/test.html" class="btn">صفحة الاختبار</a>
    <a href="/api/health" class="btn">فحص الـ API</a>
  </div>
</body>
</html>
EOL

# خطوة 2: تحديث إعدادات المنافذ في التطبيق (إذا لزم الأمر)
echo "2. تأكيد استخدام العنوان 0.0.0.0 في إعدادات الخادم..."
# محاولة تحديث أي مراجع قد تستخدم localhost بدلاً من 0.0.0.0
sed -i 's/localhost/0.0.0.0/g' server/index.ts 2>/dev/null || true
sed -i 's/127.0.0.1/0.0.0.0/g' server/index.ts 2>/dev/null || true

# خطوة 3: إضافة ملف اختبار بسيط للمصحف
echo "3. إضافة ملف اختبار لعرض صفحات المصحف..."
cat > public/test-quran-page.html << 'EOL'
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>اختبار عرض صفحة المصحف</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif;
      text-align: center;
      margin: 0;
      padding: 20px;
      direction: rtl;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background-color: #fff9e6;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 0 15px rgba(0,0,0,0.1);
      border: 2px solid #d4b668;
    }
    h1 {
      color: #8b5a2b;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .quran-page {
      width: 100%;
      max-width: 500px;
      height: auto;
      margin: 20px auto;
      border: 1px solid #d4b668;
    }
    .controls {
      display: flex;
      justify-content: center;
      margin-top: 20px;
      gap: 10px;
    }
    .btn {
      padding: 10px 20px;
      background-color: #d4b668;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
    }
    .btn:hover {
      background-color: #c0a55c;
    }
    .page-number {
      font-size: 18px;
      margin: 0 15px;
      padding: 10px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>اختبار عرض صفحات المصحف الشريف</h1>
    
    <img id="quranPage" class="quran-page" src="/images/quran_pages/page_1.webp" alt="صفحة من المصحف الشريف">
    
    <div class="controls">
      <button id="prevBtn" class="btn">الصفحة السابقة</button>
      <span id="pageDisplay" class="page-number">الصفحة: 1 / 604</span>
      <button id="nextBtn" class="btn">الصفحة التالية</button>
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const quranPage = document.getElementById('quranPage');
      const pageDisplay = document.getElementById('pageDisplay');
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      
      let currentPage = 1;
      const totalPages = 604;
      
      // تحديث عرض الصفحة
      function updatePage() {
        quranPage.src = `/images/quran_pages/page_${currentPage}.webp`;
        pageDisplay.textContent = `الصفحة: ${currentPage} / ${totalPages}`;
        
        // تعطيل الأزرار عند الوصول للحدود
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
      }
      
      // التنقل بين الصفحات
      prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
          currentPage--;
          updatePage();
        }
      });
      
      nextBtn.addEventListener('click', function() {
        if (currentPage < totalPages) {
          currentPage++;
          updatePage();
        }
      });
      
      // معالجة الخطأ في حالة عدم توفر الصورة
      quranPage.addEventListener('error', function() {
        // استبدال بصورة بديلة أو رسالة
        quranPage.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="700" viewBox="0 0 500 700"><rect width="100%" height="100%" fill="%23f8f8f8"/><text x="50%" y="50%" font-family="Arial" font-size="20" text-anchor="middle" fill="%23999">لم يتم العثور على الصفحة</text></svg>';
      });
      
      // تحديث الصفحة عند البدء
      updatePage();
    });
  </script>
</body>
</html>
EOL

echo "====== اكتمل تنفيذ إصلاحات النشر بنجاح ======"
echo ""
echo "يمكنك الآن زيارة:"
echo "  - http://0.0.0.0:5000/deployment-test.html (للتحقق من نجاح النشر)"
echo "  - http://0.0.0.0:5000/test-quran-page.html (لاختبار عرض صفحات المصحف)"
echo "  - http://0.0.0.0:5000/ (للصفحة الرئيسية للتطبيق)"