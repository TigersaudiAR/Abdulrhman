import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import { useDate } from '../../hooks/useGeolocation';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';

const PrayerTimesDetailed = () => {
  const { 
    prayerTimes, 
    location, 
    isLoading, 
    error, 
    refetchPrayerTimes 
  } = usePrayerTimes();
  
  const { hijriDate, gregorianDate } = useDate();
  
  if (isLoading) {
    return <LoadingSpinner text="جار تحميل مواقيت الصلاة..." />;
  }
  
  if (error) {
    return <ErrorDisplay error={error} onRetry={refetchPrayerTimes} />;
  }
  
  const getPrayerNameArabic = (name: string) => {
    switch(name) {
      case 'fajr': return 'الفجر';
      case 'dhuhr': return 'الظهر';
      case 'asr': return 'العصر';
      case 'maghrib': return 'المغرب';
      case 'isha': return 'العشاء';
      default: return name;
    }
  };
  
  const getPrayerIcon = (name: string) => {
    switch(name) {
      case 'fajr': return <i className="fas fa-sun-rays text-3xl text-primary mb-2"></i>;
      case 'dhuhr': return <i className="fas fa-sun text-3xl text-amber-500 mb-2"></i>;
      case 'asr': return <i className="fas fa-sun text-3xl text-amber-400 mb-2"></i>;
      case 'maghrib': return <i className="fas fa-sun text-3xl text-orange-500 mb-2"></i>;
      case 'isha': return <i className="fas fa-moon text-3xl text-blue-900 dark:text-blue-400 mb-2"></i>;
      default: return <i className="fas fa-clock text-3xl mb-2"></i>;
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-primary">مواقيت الصلاة اليوم</h3>
          <div className="text-gray-600 dark:text-gray-400">{gregorianDate} - {hijriDate}</div>
        </div>
        
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <i className="fas fa-location-dot text-primary"></i>
          <span>{location.cityName}</span>
          <button 
            className="p-1 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            onClick={refetchPrayerTimes}
          >
            <i className="fas fa-arrows-rotate text-sm"></i>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map((prayer) => (
          <div 
            key={prayer}
            className={`${prayerTimes.nextPrayer === prayer ? 'prayer-active bg-primary bg-opacity-20' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg flex flex-col items-center`}
          >
            {getPrayerIcon(prayer)}
            <div className="font-medium">{getPrayerNameArabic(prayer)}</div>
            <div className="text-2xl font-bold">{prayerTimes[prayer as keyof typeof prayerTimes]}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {prayerTimes.nextPrayer === prayer ? `متبقي ${prayerTimes.countdown}` : '-'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrayerTimesDetailed;
