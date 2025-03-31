#!/bin/bash
set -e # Exit immediately if any command fails

echo "====== التحقق من التطبيق وإصلاح مشاكل النشر ======"

# التأكد من أن الملف قابل للتنفيذ
chmod +x deploy_solution.sh

# خطوة 1: التأكد من وجود الملفات الضرورية
echo "1. التحقق من الملفات الأساسية..."
if [ ! -f "client/src/main.tsx" ]; then
  echo "خطأ: ملف client/src/main.tsx غير موجود"
  exit 1
fi

if [ ! -f "client/index.html" ]; then
  echo "خطأ: ملف client/index.html غير موجود"
  exit 1
fi

if [ ! -f "server/index.ts" ]; then
  echo "خطأ: ملف server/index.ts غير موجود"
  exit 1
fi

# خطوة 2: تحديث المنافذ للتطبيق
echo "2. تحديث إعدادات المنافذ..."
# التأكد من استخدام 0.0.0.0 بدلاً من localhost في جميع الإعدادات
sed -i 's/localhost:5000/0.0.0.0:5000/g' client/src/lib/queryClient.ts 2>/dev/null || true
sed -i 's/localhost:5000/0.0.0.0:5000/g' client/src/lib/api.ts 2>/dev/null || true
sed -i 's/localhost:5000/0.0.0.0:5000/g' client/src/lib/quran-api.ts 2>/dev/null || true

# خطوة 3: تنفيذ بناء كامل للتطبيق
echo "3. إنشاء ملف تشخيصي للتأكد من عمل التطبيق..."
cat > public/debug-server.html << 'EOL'
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تحقق من حالة الخادم - تطبيق القرآن الكريم</title>
  <style>
    body {
      font-family: 'Arial', 'Tahoma', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
      direction: rtl;
    }
    .container {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin-top: 30px;
      background-color: #f9f9f9;
    }
    h1 {
      color: #1f6e43;
      margin-bottom: 20px;
    }
    .status {
      padding: 15px;
      border-radius: 5px;
      margin: 15px 0;
      font-weight: bold;
    }
    .success {
      background-color: #c2ebd3;
      color: #1f6e43;
      border: 1px solid #1f6e43;
    }
    .error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #721c24;
    }
    .loading {
      background-color: #e9ecef;
      color: #495057;
      border: 1px solid #ced4da;
    }
    .btn {
      background-color: #d4b668;
      color: white;
      border: none;
      padding: 10px 20px;
      margin: 10px;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      transition: background-color 0.3s;
    }
    .btn:hover {
      background-color: #b39245;
    }
    pre {
      background-color: #f5f5f5;
      padding: 10px;
      border-radius: 5px;
      text-align: left;
      overflow-x: auto;
      direction: ltr;
    }
  </style>
</head>
<body>
  <h1>فحص حالة خادم تطبيق القرآن الكريم</h1>
  
  <div class="container">
    <h2>حالة الـ API</h2>
    <div id="api-status" class="status loading">جاري التحقق...</div>
    <pre id="api-response"></pre>
    
    <h2>حالة الاتصال</h2>
    <div id="connection-status" class="status loading">جاري التحقق...</div>
    
    <h2>الطلبات الاختبارية</h2>
    <button id="test-api" class="btn">اختبار الـ API</button>
    <button id="test-static" class="btn">اختبار الملفات الثابتة</button>
    <button id="test-fonts" class="btn">اختبار الخطوط</button>
    
    <h2>نتائج الاختبارات</h2>
    <pre id="test-results"></pre>
  </div>
  
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // تحديث حالة الاتصال
      updateConnectionStatus();
      window.addEventListener('online', updateConnectionStatus);
      window.addEventListener('offline', updateConnectionStatus);
      
      // اختبار الـ API تلقائيًا عند تحميل الصفحة
      checkApiHealth();
      
      // إضافة مستمعي الأحداث للأزرار
      document.getElementById('test-api').addEventListener('click', checkApiHealth);
      document.getElementById('test-static').addEventListener('click', testStaticFiles);
      document.getElementById('test-fonts').addEventListener('click', testFonts);
    });
    
    function updateConnectionStatus() {
      const connectionStatus = document.getElementById('connection-status');
      if (navigator.onLine) {
        connectionStatus.className = 'status success';
        connectionStatus.textContent = '✓ متصل بالإنترنت';
      } else {
        connectionStatus.className = 'status error';
        connectionStatus.textContent = '✗ غير متصل بالإنترنت';
      }
    }
    
    async function checkApiHealth() {
      const apiStatus = document.getElementById('api-status');
      const apiResponse = document.getElementById('api-response');
      
      apiStatus.className = 'status loading';
      apiStatus.textContent = 'جاري الاتصال بالخادم...';
      
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        
        apiStatus.className = 'status success';
        apiStatus.textContent = '✓ الخادم يعمل بشكل صحيح';
        apiResponse.textContent = JSON.stringify(data, null, 2);
        
        logResult('اختبار API', 'نجاح', `استجابة: ${JSON.stringify(data)}`);
      } catch (error) {
        apiStatus.className = 'status error';
        apiStatus.textContent = '✗ فشل الاتصال بالخادم';
        apiResponse.textContent = error.message || 'خطأ غير معروف';
        
        logResult('اختبار API', 'فشل', `خطأ: ${error.message || 'خطأ غير معروف'}`);
      }
    }
    
    async function testStaticFiles() {
      try {
        const response = await fetch('/deployment-test.html');
        if (response.ok) {
          logResult('اختبار الملفات الثابتة', 'نجاح', `تم تحميل الملف بنجاح (${response.status})`);
        } else {
          logResult('اختبار الملفات الثابتة', 'فشل', `فشل التحميل (${response.status})`);
        }
      } catch (error) {
        logResult('اختبار الملفات الثابتة', 'فشل', `خطأ: ${error.message || 'خطأ غير معروف'}`);
      }
    }
    
    async function testFonts() {
      try {
        const response = await fetch('/fonts/UthmanicHafs.woff2');
        if (response.ok) {
          logResult('اختبار الخطوط', 'نجاح', `تم تحميل خط UthmanicHafs بنجاح (${response.status})`);
        } else {
          logResult('اختبار الخطوط', 'فشل', `فشل تحميل الخط (${response.status})`);
        }
      } catch (error) {
        logResult('اختبار الخطوط', 'فشل', `خطأ: ${error.message || 'خطأ غير معروف'}`);
      }
    }
    
    function logResult(test, status, message) {
      const resultsEl = document.getElementById('test-results');
      const timestamp = new Date().toLocaleTimeString();
      resultsEl.textContent = `[${timestamp}] ${test}: ${status}\n${message}\n\n` + resultsEl.textContent;
    }
  </script>
</body>
</html>
EOL

# خطوة 4: إنشاء ملف اختباري بسيط للمصحف
echo "4. إنشاء صفحة اختبار المصحف..."
cat > public/quran-test.html << 'EOL'
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>اختبار عرض المصحف</title>
  <style>
    @font-face {
      font-family: 'UthmanicHafs';
      src: url('/fonts/UthmanicHafs.woff2') format('woff2'),
           url('/fonts/UthmanicHafs.woff') format('woff');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    
    body {
      font-family: 'Arial', sans-serif;
      text-align: center;
      margin: 20px;
      background-color: #f9f9f9;
    }
    
    .page-container {
      max-width: 800px;
      margin: 0 auto;
      background-color: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    
    h1 {
      color: #8b5a2b;
      margin-bottom: 30px;
    }
    
    .quran-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 30px;
    }
    
    .page-image {
      max-width: 100%;
      height: auto;
      margin-bottom: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 5px;
    }
    
    .page-nav {
      display: flex;
      justify-content: center;
      margin-top: 20px;
      gap: 10px;
    }
    
    .page-button {
      background-color: #8b5a2b;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      transition: background-color 0.3s;
    }
    
    .page-button:hover {
      background-color: #6a4423;
    }
    
    .page-number {
      display: inline-block;
      margin: 0 10px;
      font-size: 18px;
      font-weight: bold;
      min-width: 50px;
    }
  </style>
</head>
<body>
  <div class="page-container">
    <h1>اختبار عرض صفحات المصحف</h1>
    
    <div class="quran-page">
      <img id="page-image" class="page-image" src="/images/quran_pages/page_1.webp" alt="صفحة من المصحف الشريف">
      
      <div class="page-nav">
        <button id="prev-page" class="page-button">السابق</button>
        <span id="page-number" class="page-number">1</span>
        <button id="next-page" class="page-button">التالي</button>
      </div>
    </div>
  </div>

  <script>
    let currentPage = 1;
    const totalPages = 604;
    
    const pageImage = document.getElementById('page-image');
    const pageNumber = document.getElementById('page-number');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    
    // تحديث الصفحة
    function updatePage() {
      pageImage.src = `/images/quran_pages/page_${currentPage}.webp`;
      pageNumber.textContent = currentPage;
      
      // تعطيل الأزرار عند الوصول للحدود
      prevPageBtn.disabled = currentPage <= 1;
      nextPageBtn.disabled = currentPage >= totalPages;
    }
    
    // التنقل بين الصفحات
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        updatePage();
      }
    });
    
    nextPageBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        updatePage();
      }
    });
    
    // التحقق من تحميل الصورة بشكل صحيح
    pageImage.addEventListener('error', () => {
      pageImage.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%221000%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%201000%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_16b495b57c0%20text%20%7B%20fill%3A%23ff0000%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_16b495b57c0%22%3E%3Crect%20width%3D%22800%22%20height%3D%221000%22%20fill%3D%22%23eeeeee%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22270%22%20y%3D%22500%22%3E%D9%81%D8%B4%D9%84%20%D8%AA%D8%AD%D9%85%D9%8A%D9%84%20%D8%A7%D9%84%D8%B5%D9%81%D8%AD%D8%A9%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
      console.error(`فشل تحميل الصفحة ${currentPage}`);
    });
    
    // تحديث الصفحة عند بدء التشغيل
    updatePage();
  </script>
</body>
</html>
EOL

# خطوة 5: تحديث إعدادات التحكم في المنافذ
echo "5. تحديث إعدادات الـ CORS وضبط العناوين..."
# تجاوز إنشاء مجلد .replit نظرًا لوجود ملف بنفس الاسم

# خطوة 6: إضافة معلومات التشخيص للتطبيق
cat > test.html << 'EOL'
<!DOCTYPE html>
<html lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>صفحة الفحص - تطبيق القرآن الكريم</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f7f7f7;
      color: #333;
      direction: rtl;
      text-align: right;
    }
    h1 {
      color: #05668d;
      border-bottom: 2px solid #05668d;
      padding-bottom: 10px;
    }
    .section {
      background-color: white;
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .success {
      color: #28a745;
      font-weight: bold;
    }
    .error {
      color: #dc3545;
      font-weight: bold;
    }
    pre {
      background-color: #f8f9fa;
      padding: 10px;
      border-radius: 3px;
      overflow-x: auto;
      direction: ltr;
      text-align: left;
    }
    .btn {
      background-color: #05668d;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn:hover {
      background-color: #044e6c;
    }
  </style>
</head>
<body>
  <h1>صفحة الفحص - تطبيق القرآن الكريم</h1>
  
  <div class="section">
    <h2>فحص الاتصال بالخادم</h2>
    <div id="api-status">جاري الفحص...</div>
    <pre id="api-result"></pre>
    <button id="check-api" class="btn">فحص الخادم</button>
  </div>
  
  <div class="section">
    <h2>فحص الملفات الثابتة</h2>
    <div id="static-status">جاري الفحص...</div>
    <button id="check-static" class="btn">فحص الملفات</button>
  </div>

  <div class="section">
    <h2>روابط مفيدة</h2>
    <ul>
      <li><a href="/debug-server.html">صفحة تشخيص الخادم</a></li>
      <li><a href="/quran-test.html">اختبار صفحات المصحف</a></li>
      <li><a href="/api/health">اختبار صحة الـ API</a></li>
      <li><a href="/api/debug">معلومات التصحيح</a></li>
    </ul>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // فحص الـ API
      document.getElementById('check-api').addEventListener('click', checkAPI);
      
      // فحص الملفات الثابتة
      document.getElementById('check-static').addEventListener('click', checkStatic);
      
      // فحص تلقائي عند التحميل
      checkAPI();
      checkStatic();
    });
    
    async function checkAPI() {
      const statusElement = document.getElementById('api-status');
      const resultElement = document.getElementById('api-result');
      
      statusElement.textContent = 'جاري الفحص...';
      statusElement.className = '';
      
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        
        statusElement.textContent = '✓ الخادم يعمل بشكل صحيح';
        statusElement.className = 'success';
        resultElement.textContent = JSON.stringify(data, null, 2);
      } catch (error) {
        statusElement.textContent = '✗ فشل الاتصال بالخادم';
        statusElement.className = 'error';
        resultElement.textContent = error.toString();
      }
    }
    
    async function checkStatic() {
      const statusElement = document.getElementById('static-status');
      
      statusElement.textContent = 'جاري الفحص...';
      statusElement.className = '';
      
      try {
        const response = await fetch('/images/quran_pages/page_1.webp');
        
        if (response.ok) {
          statusElement.textContent = '✓ الملفات الثابتة متاحة بشكل صحيح';
          statusElement.className = 'success';
        } else {
          statusElement.textContent = '✗ فشل تحميل الملفات الثابتة (رمز الاستجابة: ' + response.status + ')';
          statusElement.className = 'error';
        }
      } catch (error) {
        statusElement.textContent = '✗ فشل تحميل الملفات الثابتة';
        statusElement.className = 'error';
      }
    }
  </script>
</body>
</html>
EOL

# خطوة 7: تحديث ./pre-build.sh
echo "7. تحديث إعدادات ما قبل البناء..."
if [ -f "pre-build.sh" ]; then
  # تحديث ملف pre-build.sh لتضمين التعديلات
  sed -i 's/# Verify/# إضافة صفحة الاختبار\ncp deploy_solution.sh dist\/\nchmod +x dist\/deploy_solution.sh\necho "تم نسخ ملف الحل للتوزيع"\n\n# Verify/g' pre-build.sh
  echo "تم تحديث ملف pre-build.sh"
fi

# خطوة 8: تحديث ملف توافق الخطوط
echo "8. إنشاء وتحديث ملف توافق الخطوط..."
mkdir -p public/fonts
cat > public/fonts/UthmanicHafs.css << 'EOL'
@font-face {
  font-family: 'UthmanicHafs';
  src: url('UthmanicHafs.woff2') format('woff2'),
       url('UthmanicHafs.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'UthmanTN1B';
  src: url('UthmanTN1B.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
EOL

echo "====== اكتمل إنشاء ملف الحل ======"
echo "يرجى تنفيذ الأمرين التاليين:"
echo "  1. chmod +x deploy_solution.sh"
echo "  2. ./deploy_solution.sh"
echo ""
echo "ثم تحقق من التطبيق من خلال زيارة:"
echo "  - /test.html لصفحة الاختبار الرئيسية"
echo "  - /debug-server.html لتشخيص الخادم"
echo "  - /quran-test.html لاختبار عرض المصحف"