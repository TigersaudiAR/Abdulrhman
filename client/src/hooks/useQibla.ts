import { useState, useEffect, useCallback } from 'react';
import { useGeolocation } from './useGeolocation';
import { useQuery } from '@tanstack/react-query';

export function useQibla() {
  const { location, isLoading: isLoadingLocation, error: locationError, requestGeolocation } = useGeolocation();
  
  const fetchQiblaDirection = useCallback(async () => {
    if (!location.latitude || !location.longitude) {
      throw new Error('الموقع غير متاح، يرجى تفعيل خدمة الموقع');
    }
    
    const response = await fetch(
      `https://api.aladhan.com/v1/qibla/${location.latitude}/${location.longitude}`
    );
    
    if (!response.ok) {
      throw new Error(`فشل في تحميل اتجاه القبلة: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code === 200 && data.data && data.data.direction) {
      // Mecca coordinates for distance calculation
      const meccaLat = 21.422487;
      const meccaLng = 39.826206;
      
      // Calculate distance to Mecca (Haversine formula)
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        meccaLat,
        meccaLng
      );
      
      // Convert direction to compass direction
      const compassDirection = degreesToCompassDirection(data.data.direction);
      
      return {
        direction: data.data.direction,
        distance,
        compassDirection
      };
    } else {
      throw new Error('بيانات اتجاه القبلة غير صالحة');
    }
  }, [location.latitude, location.longitude]);
  
  const { data: qiblaData, isLoading: isLoadingQibla, error: qiblaError, refetch } = useQuery({
    queryKey: ['qiblaDirection', location.latitude, location.longitude],
    queryFn: fetchQiblaDirection,
    enabled: !!location.latitude && !!location.longitude,
  });
  
  // Calculate distance between two points using Haversine formula
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }
  
  // Convert degrees to compass direction in Arabic
  function degreesToCompassDirection(degrees: number) {
    const directions = [
      "شمال",
      "شمال شرق",
      "شرق",
      "جنوب شرق",
      "جنوب",
      "جنوب غرب",
      "غرب",
      "شمال غرب"
    ];
    
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }
  
  const isLoading = isLoadingLocation || isLoadingQibla;
  const error = locationError || qiblaError ? 
    (locationError || qiblaError as Error).message : null;
  
  return {
    qiblaDirection: qiblaData?.direction || 0,
    distance: qiblaData?.distance || 0,
    compassDirection: qiblaData?.compassDirection || '',
    isLoading,
    error,
    refetchQibla: useCallback(() => {
      requestGeolocation();
      refetch();
    }, [requestGeolocation, refetch])
  };
}
