import { useState, useEffect, useCallback } from 'react';
import { useGeolocation } from './useGeolocation';
import { useQuery } from '@tanstack/react-query';

interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  nextPrayer: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | null;
  countdown: string;
}

export function usePrayerTimes() {
  const { location, isLoading: isLoadingLocation, error: locationError, requestGeolocation } = useGeolocation();
  
  const fetchPrayerTimes = useCallback(async () => {
    if (!location.latitude || !location.longitude) {
      throw new Error('الموقع غير متاح، يرجى تفعيل خدمة الموقع');
    }
    
    const date = new Date();
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${location.latitude}&longitude=${location.longitude}&method=2`
    );
    
    if (!response.ok) {
      throw new Error(`فشل في تحميل مواقيت الصلاة: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code === 200 && data.data && data.data.timings) {
      const timings = data.data.timings;
      
      // Format times to just show HH:MM
      const fajr = timings.Fajr.slice(0, 5);
      const dhuhr = timings.Dhuhr.slice(0, 5);
      const asr = timings.Asr.slice(0, 5);
      const maghrib = timings.Maghrib.slice(0, 5);
      const isha = timings.Isha.slice(0, 5);
      
      // Calculate next prayer
      const now = new Date();
      const prayers = [
        { name: 'fajr', time: convertToDate(fajr, now) },
        { name: 'dhuhr', time: convertToDate(dhuhr, now) },
        { name: 'asr', time: convertToDate(asr, now) },
        { name: 'maghrib', time: convertToDate(maghrib, now) },
        { name: 'isha', time: convertToDate(isha, now) },
        // Add Fajr for the next day if we've passed all prayers for today
        { name: 'fajr', time: convertToDate(fajr, new Date(now.getTime() + 24 * 60 * 60 * 1000)) }
      ];
      
      let nextPrayer = null;
      let countdown = '';
      
      for (const prayer of prayers) {
        if (prayer.time > now) {
          nextPrayer = prayer.name;
          
          // Calculate countdown
          const diffMs = prayer.time.getTime() - now.getTime();
          const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
          const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);
          
          countdown = `${String(diffHrs).padStart(2, '0')}:${String(diffMins).padStart(2, '0')}:${String(diffSecs).padStart(2, '0')}`;
          
          break;
        }
      }
      
      return {
        fajr,
        dhuhr,
        asr,
        maghrib,
        isha,
        nextPrayer,
        countdown
      };
    } else {
      throw new Error('بيانات مواقيت الصلاة غير صالحة');
    }
  }, [location.latitude, location.longitude]);
  
  const { data: prayerTimes, isLoading: isLoadingPrayers, error: prayersError, refetch } = useQuery({
    queryKey: ['prayerTimes', location.latitude, location.longitude],
    queryFn: fetchPrayerTimes,
    enabled: !!location.latitude && !!location.longitude,
    refetchInterval: 60000, // Refetch every minute to update countdown
  });
  
  // Helper function to convert time string to Date object
  function convertToDate(timeStr: string, dateObj: Date) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date(dateObj);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
  
  const isLoading = isLoadingLocation || isLoadingPrayers;
  const error = locationError || prayersError ? 
    (locationError || prayersError as Error).message : null;
  
  const defaultPrayerTimes: PrayerTimes = {
    fajr: '--:--',
    dhuhr: '--:--',
    asr: '--:--',
    maghrib: '--:--',
    isha: '--:--',
    nextPrayer: null,
    countdown: '--:--:--'
  };
  
  return {
    prayerTimes: prayerTimes || defaultPrayerTimes,
    location,
    isLoading,
    error,
    refetchPrayerTimes: useCallback(() => {
      requestGeolocation();
      refetch();
    }, [requestGeolocation, refetch])
  };
}
