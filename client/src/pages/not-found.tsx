import { useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { MainLayout } from '../components/layout/MainLayout';

/**
 * صفحة 404 - الصفحة غير موجودة
 */
const NotFound = () => {
  const [, navigate] = useLocation();
  
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">الصفحة غير موجودة</h2>
        
        <p className="text-muted-foreground max-w-md mb-8">
          عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. قد يكون الرابط خاطئ أو قد تكون الصفحة قد تم نقلها.
        </p>
        
        <div className="flex gap-4">
          <Button onClick={() => navigate('/')}>
            العودة للصفحة الرئيسية
          </Button>
          
          <Button variant="outline" onClick={() => window.history.back()}>
            الرجوع للصفحة السابقة
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;