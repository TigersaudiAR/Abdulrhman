import { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';

/**
 * صفحة اختبارية مفصلة للتأكد من عمل التطبيق وتشخيص المشكلات
 */
const DebugPage = () => {
  const [apiStatus, setApiStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [apiResponse, setApiResponse] = useState<string>('');
  const [browserInfo, setBrowserInfo] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<boolean>(navigator.onLine);

  // تحقق من حالة اتصال API
  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setApiStatus('success');
        setApiResponse(JSON.stringify(data, null, 2));
      } catch (error) {
        console.error('API Error:', error);
        setApiStatus('error');
        setApiResponse(error instanceof Error ? error.message : 'خطأ غير معروف');
      }
    };

    // جمع معلومات المتصفح
    const collectBrowserInfo = () => {
      const info = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        online: navigator.onLine,
        cookiesEnabled: navigator.cookieEnabled,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        viewportSize: `${window.screen.width}x${window.screen.height}`,
        pixelRatio: window.devicePixelRatio,
      };
      setBrowserInfo(JSON.stringify(info, null, 2));
    };

    checkApi();
    collectBrowserInfo();

    // مراقبة حالة الاتصال
    const handleOnline = () => setConnectionStatus(true);
    const handleOffline = () => setConnectionStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <MainLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-primary mb-4">صفحة التشخيص</h1>
        <p className="mb-4">هذه صفحة مفصلة للتأكد من عمل النظام وتشخيص المشكلات المحتملة.</p>
        
        {/* حالة توجيه الصفحات */}
        <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800 mb-4">
          <h2 className="font-bold text-green-800 dark:text-green-400 mb-2">✓ نظام التوجيه</h2>
          <p>نظام التوجيه يعمل بشكل صحيح! تم تحميل هذه الصفحة بنجاح.</p>
        </div>
        
        {/* حالة API */}
        <div className={`p-4 rounded-lg border mb-4 ${
          apiStatus === 'loading' ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' : 
          apiStatus === 'success' ? 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800' : 
          'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800'
        }`}>
          <h2 className={`font-bold mb-2 ${
            apiStatus === 'loading' ? 'text-blue-800 dark:text-blue-400' : 
            apiStatus === 'success' ? 'text-green-800 dark:text-green-400' : 
            'text-red-800 dark:text-red-400'
          }`}>
            {apiStatus === 'loading' ? '⏳ API قيد التحميل...' : 
             apiStatus === 'success' ? '✓ API متصل' : 
             '✗ فشل الاتصال بـ API'}
          </h2>
          <pre className="whitespace-pre-wrap text-sm bg-white/50 dark:bg-black/50 p-2 rounded overflow-auto max-h-40">
            {apiResponse || 'جاري التحميل...'}
          </pre>
        </div>

        {/* حالة الاتصال */}
        <div className={`p-4 rounded-lg border mb-4 ${
          connectionStatus ? 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800' : 
          'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800'
        }`}>
          <h2 className={`font-bold mb-2 ${
            connectionStatus ? 'text-green-800 dark:text-green-400' : 
            'text-red-800 dark:text-red-400'
          }`}>
            {connectionStatus ? '✓ متصل بالإنترنت' : '✗ غير متصل بالإنترنت'}
          </h2>
          <p>حالة الشبكة: {connectionStatus ? 'متصل (online)' : 'غير متصل (offline)'}</p>
        </div>

        {/* معلومات المتصفح */}
        <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <h2 className="font-bold text-blue-800 dark:text-blue-400 mb-2">ℹ️ معلومات المتصفح</h2>
          <pre className="whitespace-pre-wrap text-sm bg-white/50 dark:bg-black/50 p-2 rounded overflow-auto max-h-40">
            {browserInfo || 'جاري جمع المعلومات...'}
          </pre>
        </div>
      </div>
    </MainLayout>
  );
};

export default DebugPage;