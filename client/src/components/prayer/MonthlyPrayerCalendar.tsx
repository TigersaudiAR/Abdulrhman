import { useState, useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import { useDate } from '../../hooks/useGeolocation';
import { useGeolocation } from '../../hooks/useGeolocation';

interface PrayerDay {
  date: string;
  gregorianDate: string;
  hijriDate: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

const MonthlyPrayerCalendar = () => {
  const [monthlyPrayers, setMonthlyPrayers] = useState<PrayerDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { hijriDate, gregorianDate } = useDate();
  const { location } = useGeolocation();
  
  useEffect(() => {
    const fetchMonthlyPrayers = async () => {
      if (!location.latitude || !location.longitude) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`https://api.aladhan.com/v1/calendar/${currentYear}/${currentMonth}?latitude=${location.latitude}&longitude=${location.longitude}&method=2`);
        
        if (!response.ok) {
          throw new Error(`فشل في تحميل مواقيت الصلاة الشهرية: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.code === 200 && data.data) {
          const prayerDays: PrayerDay[] = data.data.map((day: any) => ({
            date: day.date.gregorian.date,
            gregorianDate: day.date.gregorian.date,
            hijriDate: day.date.hijri.date,
            fajr: day.timings.Fajr.slice(0, 5),
            dhuhr: day.timings.Dhuhr.slice(0, 5),
            asr: day.timings.Asr.slice(0, 5),
            maghrib: day.timings.Maghrib.slice(0, 5),
            isha: day.timings.Isha.slice(0, 5),
          }));
          
          setMonthlyPrayers(prayerDays);
        } else {
          throw new Error('بيانات مواقيت الصلاة غير صالحة');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل البيانات');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMonthlyPrayers();
  }, [currentMonth, currentYear, location.latitude, location.longitude]);
  
  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Get month name in Arabic
  const getMonthName = (month: number) => {
    const monthNames = ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    return monthNames[month - 1];
  };
  
  // Check if the date is today
  const isToday = (dateStr: string) => {
    const today = new Date();
    const [day, month, year] = dateStr.split('-').map(Number);
    return day === today.getDate() && month === today.getMonth() + 1 && year === today.getFullYear();
  };
  
  if (isLoading) {
    return <LoadingSpinner text="جار تحميل مواقيت الصلاة الشهرية..." />;
  }
  
  if (error) {
    return <ErrorDisplay error={error} onRetry={() => setIsLoading(true)} />;
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-primary mb-3">تقويم الصلاة الشهري</h3>
      
      <div className="flex justify-between items-center mb-4">
        <button 
          className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
          onClick={goToPreviousMonth}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
        <div className="font-medium">{getMonthName(currentMonth)} {currentYear}</div>
        <button 
          className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
          onClick={goToNextMonth}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-2 px-2 text-right">اليوم</th>
              <th className="py-2 px-2">الفجر</th>
              <th className="py-2 px-2">الظهر</th>
              <th className="py-2 px-2">العصر</th>
              <th className="py-2 px-2">المغرب</th>
              <th className="py-2 px-2">العشاء</th>
            </tr>
          </thead>
          <tbody>
            {monthlyPrayers.map((day, index) => (
              <tr 
                key={index} 
                className={`border-b border-gray-200 dark:border-gray-700 ${isToday(day.gregorianDate) ? 'bg-primary bg-opacity-10' : ''}`}
              >
                <td className="py-2 px-2 text-right">{day.gregorianDate}</td>
                <td className="py-2 px-2">{day.fajr}</td>
                <td className="py-2 px-2">{day.dhuhr}</td>
                <td className="py-2 px-2">{day.asr}</td>
                <td className="py-2 px-2">{day.maghrib}</td>
                <td className="py-2 px-2">{day.isha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-center">
        <button className="py-2 px-4 text-primary hover:underline">
          عرض الشهر كاملاً
        </button>
      </div>
    </div>
  );
};

export default MonthlyPrayerCalendar;
