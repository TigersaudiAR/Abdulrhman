import { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { MapPin, Clock, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import { useApp } from '../context/AppContext';

interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  nextPrayer: string;
  countdown: string;
}

interface Location {
  cityName: string;
  countryCode: string;
}

interface DateInfo {
  currentDate: string;
  hijriDate: string;
}

// بيانات مؤقتة - يتم استبدالها بالواجهة الحقيقية عند توفرها
const defaultPrayerTimes: PrayerTimes = {
  fajr: '04:25',
  dhuhr: '12:30',
  asr: '15:45',
  maghrib: '18:32',
  isha: '20:00',
  nextPrayer: 'fajr',
  countdown: '03:25:10'
};

// معلومات الموقع المؤقتة
const defaultLocation: Location = {
  cityName: 'مكة المكرمة',
  countryCode: 'SA'
};

// معلومات التاريخ المؤقتة
const defaultDate: DateInfo = {
  currentDate: new Date().toLocaleDateString('ar-SA'),
  hijriDate: '١٥ رمضان ١٤٤٦ هـ'
};

export default function Prayer() {
  const { settings } = useApp();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes>(defaultPrayerTimes);
  const [location, setLocation] = useState<Location>(defaultLocation);
  const [date, setDate] = useState<DateInfo>(defaultDate);
  
  // قائمة الصلوات مع الأيقونات
  const prayerList = [
    { name: 'الفجر', time: prayerTimes.fajr, icon: '🌅', isNext: prayerTimes.nextPrayer === 'fajr' },
    { name: 'الظهر', time: prayerTimes.dhuhr, icon: '☀️', isNext: prayerTimes.nextPrayer === 'dhuhr' },
    { name: 'العصر', time: prayerTimes.asr, icon: '🌇', isNext: prayerTimes.nextPrayer === 'asr' },
    { name: 'المغرب', time: prayerTimes.maghrib, icon: '🌆', isNext: prayerTimes.nextPrayer === 'maghrib' },
    { name: 'العشاء', time: prayerTimes.isha, icon: '🌙', isNext: prayerTimes.nextPrayer === 'isha' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">مواقيت الصلاة</h1>
        </div>

        {/* معلومات الموقع والتاريخ */}
        <div className="flex flex-col md:flex-row gap-4">
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                الموقع
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-lg font-semibold">
                {location.cityName || 'جاري تحديد الموقع...'}
              </div>
              <div className="text-sm text-muted-foreground">
                {location.countryCode || ''}
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                التاريخ
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-lg font-semibold">
                {date.currentDate}
              </div>
              <div className="text-sm text-muted-foreground">
                {date.hijriDate}
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex-1 border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                الصلاة القادمة
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-lg font-semibold">
                {prayerList.find(p => p.isNext)?.name || 'الفجر'}
              </div>
              <div className="text-sm text-muted-foreground">
                متبقي: {prayerTimes.countdown}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* مواقيت الصلاة */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {prayerList.map((prayer) => (
            <Card 
              key={prayer.name}
              className={cn(
                prayer.isNext && "border-primary/20 bg-primary/5"
              )}
            >
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-center">
                  <span className="text-2xl">{prayer.icon}</span>
                  <div className="mt-1">{prayer.name}</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-2">
                <div className={cn(
                  "text-xl font-bold",
                  prayer.isNext && "text-primary"
                )}>
                  {prayer.time}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* طريقة الحساب */}
        <div className="text-center text-sm text-muted-foreground mt-6">
          تم حساب المواقيت باستخدام طريقة: رابطة العالم الإسلامي
        </div>
      </div>
    </MainLayout>
  );
}