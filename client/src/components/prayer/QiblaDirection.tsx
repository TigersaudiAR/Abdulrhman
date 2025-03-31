import { useQibla } from '../../hooks/useQibla';
import { useGeolocation } from '../../hooks/useGeolocation';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';

const QiblaDirection = () => {
  const { 
    qiblaDirection, 
    distance, 
    compassDirection, 
    isLoading, 
    error, 
    refetchQibla 
  } = useQibla();
  
  const { requestGeolocation } = useGeolocation();
  
  if (isLoading) {
    return <LoadingSpinner text="جار تحميل اتجاه القبلة..." />;
  }
  
  if (error) {
    return <ErrorDisplay error={error} onRetry={refetchQibla} />;
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-bold text-primary mb-3">اتجاه القبلة</h3>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-48 h-48 rounded-full border-4 border-primary flex items-center justify-center bg-gray-100 dark:bg-gray-700">
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="fas fa-compass text-6xl text-gray-300 dark:text-gray-600"></i>
          </div>
          <div 
            className="w-1 h-24 bg-primary absolute top-0 transform origin-bottom"
            style={{ transform: `rotate(${qiblaDirection}deg)` }}
          ></div>
          <div className="absolute">
            <i className="fas fa-kaaba text-3xl text-primary"></i>
          </div>
        </div>
        
        <div>
          <div className="text-center sm:text-right mb-2">
            <div className="text-xl font-bold">{Math.round(qiblaDirection)}°</div>
            <div className="text-gray-600 dark:text-gray-400">{compassDirection}</div>
          </div>
          
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p>تأكد من وجودك في مكان مفتوح بعيد عن المعادن للحصول على قراءة دقيقة للبوصلة.</p>
            <p className="mt-2">المسافة إلى مكة المكرمة: ~{Math.round(distance)} كم</p>
          </div>
          
          <button 
            className="mt-3 py-2 px-4 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
            onClick={requestGeolocation}
          >
            تحديث الموقع
          </button>
        </div>
      </div>
    </div>
  );
};

export default QiblaDirection;
