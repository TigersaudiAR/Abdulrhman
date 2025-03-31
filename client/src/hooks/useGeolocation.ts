import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Location {
  latitude: number | null;
  longitude: number | null;
  cityName: string;
  countryCode: string;
}

export function useGeolocation() {
  const [isRequesting, setIsRequesting] = useState(false);
  
  const fetchLocation = useCallback(async (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('خدمة تحديد الموقع غير مدعومة في متصفحك'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Get city name and country code from reverse geocoding
            const response = await fetch(
              `https://api.aladhan.com/v1/geocode?latitude=${latitude}&longitude=${longitude}`
            );
            
            if (!response.ok) {
              throw new Error(`فشل في تحميل بيانات الموقع: ${response.status}`);
            }
            
            const data = await response.json();
            let cityName = 'غير معروف';
            let countryCode = '';
            
            if (data.code === 200 && data.data) {
              cityName = data.data.city || 'غير معروف';
              countryCode = data.data.countryCode || '';
            }
            
            resolve({
              latitude,
              longitude,
              cityName,
              countryCode
            });
          } catch (error) {
            // If geocoding fails, still return coordinates
            resolve({
              latitude,
              longitude,
              cityName: 'غير معروف',
              countryCode: ''
            });
          }
        },
        (error) => {
          reject(new Error('فشل في الوصول إلى موقعك. يرجى التأكد من تفعيل خدمة الموقع.'));
        }
      );
    });
  }, []);
  
  const { data: location, isLoading, error, refetch } = useQuery({
    queryKey: ['geolocation'],
    queryFn: fetchLocation,
    retry: false,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
  
  const requestGeolocation = useCallback(() => {
    setIsRequesting(true);
    refetch().finally(() => setIsRequesting(false));
  }, [refetch]);
  
  const defaultLocation: Location = {
    latitude: 24.7136,
    longitude: 46.6753,
    cityName: 'جاري تحديد الموقع...',
    countryCode: 'SA'
  };
  
  return {
    location: location || defaultLocation,
    isLoading: isLoading || isRequesting,
    error: error ? (error as Error).message : null,
    requestGeolocation
  };
}

// Helper hook to get formatted date in Hijri and Gregorian
export function useDate() {
  const [date, setDate] = useState({
    hijriDate: '',
    gregorianDate: ''
  });
  
  useEffect(() => {
    const fetchDate = async () => {
      try {
        const today = new Date();
        const response = await fetch(
          `https://api.aladhan.com/v1/gToH?date=${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`
        );
        
        if (!response.ok) {
          throw new Error(`فشل في تحميل التاريخ: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.code === 200 && data.data) {
          const hijriDate = `${data.data.hijri.day} ${data.data.hijri.month.ar} ${data.data.hijri.year}`;
          
          // Format Gregorian date in Arabic
          const gregorianDate = today.toLocaleDateString('ar-SA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          setDate({ hijriDate, gregorianDate });
        }
      } catch (error) {
        console.error('Error fetching date:', error);
        
        // Fallback to current date
        const today = new Date();
        const gregorianDate = today.toLocaleDateString('ar-SA', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        setDate({
          hijriDate: 'غير متاح',
          gregorianDate
        });
      }
    };
    
    fetchDate();
  }, []);
  
  return date;
}
