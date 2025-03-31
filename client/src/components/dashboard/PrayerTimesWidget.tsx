import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';

const PrayerTimesWidget = () => {
  const { 
    prayerTimes, 
    location, 
    isLoading, 
    error, 
    refetchPrayerTimes 
  } = usePrayerTimes();
  
  if (isLoading) {
    return <LoadingSpinner text="جار تحميل مواقيت الصلاة..." />;
  }
  
  if (error) {
    return <ErrorDisplay error={error} onRetry={refetchPrayerTimes} />;
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-primary">مواقيت الصلاة اليوم</h3>
        <span className="text-sm text-gray-600 dark:text-gray-400">{location.cityName}</span>
      </div>
      <div className="grid grid-cols-5 gap-2 text-center">
        <div className={`p-2 rounded-lg ${prayerTimes.nextPrayer === 'fajr' ? 'prayer-active bg-primary bg-opacity-20' : 'bg-gray-100 dark:bg-gray-700'}`}>
          <div className="font-medium">الفجر</div>
          <div className="text-lg font-bold">{prayerTimes.fajr}</div>
        </div>
        <div className={`p-2 rounded-lg ${prayerTimes.nextPrayer === 'dhuhr' ? 'prayer-active bg-primary bg-opacity-20' : 'bg-gray-100 dark:bg-gray-700'}`}>
          <div className="font-medium">الظهر</div>
          <div className="text-lg font-bold">{prayerTimes.dhuhr}</div>
        </div>
        <div className={`p-2 rounded-lg ${prayerTimes.nextPrayer === 'asr' ? 'prayer-active bg-primary bg-opacity-20' : 'bg-gray-100 dark:bg-gray-700'}`}>
          <div className="font-medium">العصر</div>
          <div className="text-lg font-bold">{prayerTimes.asr}</div>
        </div>
        <div className={`p-2 rounded-lg ${prayerTimes.nextPrayer === 'maghrib' ? 'prayer-active bg-primary bg-opacity-20' : 'bg-gray-100 dark:bg-gray-700'}`}>
          <div className="font-medium">المغرب</div>
          <div className="text-lg font-bold">{prayerTimes.maghrib}</div>
        </div>
        <div className={`p-2 rounded-lg ${prayerTimes.nextPrayer === 'isha' ? 'prayer-active bg-primary bg-opacity-20' : 'bg-gray-100 dark:bg-gray-700'}`}>
          <div className="font-medium">العشاء</div>
          <div className="text-lg font-bold">{prayerTimes.isha}</div>
        </div>
      </div>
      <div className="mt-3 text-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          الوقت المتبقي حتى صلاة {prayerTimes.nextPrayer === 'fajr' ? 'الفجر' : 
                                prayerTimes.nextPrayer === 'dhuhr' ? 'الظهر' : 
                                prayerTimes.nextPrayer === 'asr' ? 'العصر' : 
                                prayerTimes.nextPrayer === 'maghrib' ? 'المغرب' : 'العشاء'}: 
        </span>
        <span className="font-bold text-primary"> {prayerTimes.countdown}</span>
      </div>
    </div>
  );
};

export default PrayerTimesWidget;
