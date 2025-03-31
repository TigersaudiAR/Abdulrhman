import { APP_CONFIG } from './constants';
import { formatTimeToAMPM, formatCountdown } from './utils';

/**
 * Fetch prayer times for a specific date and location
 * @param date Date in format DD-MM-YYYY (default: today)
 * @param latitude Latitude coordinates
 * @param longitude Longitude coordinates
 * @param method Calculation method (default: 2, Umm al-Qura University, Makkah)
 * @returns Promise with the prayer times data
 */
export async function getPrayerTimes(
  date: string | null = null,
  latitude: number,
  longitude: number,
  method: number = 2
) {
  try {
    if (!latitude || !longitude) {
      throw new Error('Latitude and longitude are required');
    }
    
    // Format date or use current date
    const formattedDate = date || formatCurrentDate();
    
    const response = await fetch(
      `${APP_CONFIG.prayerAPI}timings/${formattedDate}?latitude=${latitude}&longitude=${longitude}&method=${method}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch prayer times: ${response.status}`);
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
      
      // Calculate next prayer and countdown
      const { nextPrayer, countdown } = calculateNextPrayer(
        fajr, dhuhr, asr, maghrib, isha
      );
      
      return {
        fajr,
        dhuhr,
        asr,
        maghrib,
        isha,
        nextPrayer,
        countdown,
        date: data.data.date
      };
    } else {
      throw new Error('Invalid prayer times data');
    }
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
}

/**
 * Fetch prayer times for a whole month
 * @param year Year (e.g., 2023)
 * @param month Month (1-12)
 * @param latitude Latitude coordinates
 * @param longitude Longitude coordinates
 * @param method Calculation method (default: 2, Umm al-Qura University, Makkah)
 * @returns Promise with the monthly prayer times data
 */
export async function getMonthlyPrayerTimes(
  year: number,
  month: number,
  latitude: number,
  longitude: number,
  method: number = 2
) {
  try {
    if (!latitude || !longitude) {
      throw new Error('Latitude and longitude are required');
    }
    
    const response = await fetch(
      `${APP_CONFIG.prayerAPI}calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=${method}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch monthly prayer times: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code === 200 && data.data) {
      // Process and format the data
      const formattedData = data.data.map((day: any) => ({
        date: day.date.gregorian.date,
        gregorianDate: day.date.gregorian.date,
        hijriDate: day.date.hijri.date,
        fajr: day.timings.Fajr.slice(0, 5),
        dhuhr: day.timings.Dhuhr.slice(0, 5),
        asr: day.timings.Asr.slice(0, 5),
        maghrib: day.timings.Maghrib.slice(0, 5),
        isha: day.timings.Isha.slice(0, 5),
      }));
      
      return formattedData;
    } else {
      throw new Error('Invalid monthly prayer times data');
    }
  } catch (error) {
    console.error('Error fetching monthly prayer times:', error);
    throw error;
  }
}

/**
 * Get Qibla direction from a specific location
 * @param latitude Latitude coordinates
 * @param longitude Longitude coordinates
 * @returns Promise with the Qibla direction
 */
export async function getQiblaDirection(latitude: number, longitude: number) {
  try {
    if (!latitude || !longitude) {
      throw new Error('Latitude and longitude are required');
    }
    
    const response = await fetch(
      `${APP_CONFIG.prayerAPI}qibla/${latitude}/${longitude}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Qibla direction: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code === 200 && data.data) {
      return data.data.direction;
    } else {
      throw new Error('Invalid Qibla direction data');
    }
  } catch (error) {
    console.error('Error fetching Qibla direction:', error);
    throw error;
  }
}

/**
 * Convert Gregorian date to Hijri date
 * @param gregorianDate Date in format DD-MM-YYYY (default: today)
 * @returns Promise with the Hijri date
 */
export async function getHijriDate(gregorianDate: string | null = null) {
  try {
    // Format date or use current date
    const formattedDate = gregorianDate || formatCurrentDate();
    
    const response = await fetch(
      `${APP_CONFIG.prayerAPI}gToH?date=${formattedDate}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Hijri date: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code === 200 && data.data) {
      return data.data.hijri;
    } else {
      throw new Error('Invalid Hijri date data');
    }
  } catch (error) {
    console.error('Error fetching Hijri date:', error);
    throw error;
  }
}

/**
 * Get address/location information from coordinates
 * @param latitude Latitude coordinates
 * @param longitude Longitude coordinates
 * @returns Promise with the location information
 */
export async function getLocationFromCoordinates(latitude: number, longitude: number) {
  try {
    if (!latitude || !longitude) {
      throw new Error('Latitude and longitude are required');
    }
    
    const response = await fetch(
      `${APP_CONFIG.prayerAPI}geocode?latitude=${latitude}&longitude=${longitude}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch location: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code === 200 && data.data) {
      return {
        city: data.data.city || 'Unknown',
        country: data.data.country || 'Unknown',
        countryCode: data.data.countryCode || '',
      };
    } else {
      throw new Error('Invalid location data');
    }
  } catch (error) {
    console.error('Error fetching location:', error);
    throw error;
  }
}

// Helper functions

/**
 * Format current date as DD-MM-YYYY
 * @returns Formatted date string
 */
function formatCurrentDate(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  
  return `${day}-${month}-${year}`;
}

/**
 * Calculate the next prayer and countdown time
 * @param fajr Fajr prayer time (HH:MM)
 * @param dhuhr Dhuhr prayer time (HH:MM)
 * @param asr Asr prayer time (HH:MM)
 * @param maghrib Maghrib prayer time (HH:MM)
 * @param isha Isha prayer time (HH:MM)
 * @returns Object with next prayer name and countdown
 */
function calculateNextPrayer(
  fajr: string,
  dhuhr: string,
  asr: string,
  maghrib: string,
  isha: string
): { nextPrayer: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | null, countdown: string } {
  const now = new Date();
  
  // Convert prayer times to Date objects
  const prayers = [
    { name: 'fajr', time: convertToDate(fajr, now) },
    { name: 'dhuhr', time: convertToDate(dhuhr, now) },
    { name: 'asr', time: convertToDate(asr, now) },
    { name: 'maghrib', time: convertToDate(maghrib, now) },
    { name: 'isha', time: convertToDate(isha, now) },
    // Add Fajr for the next day if all prayers have passed
    { name: 'fajr', time: convertToDate(fajr, new Date(now.getTime() + 24 * 60 * 60 * 1000)) }
  ];
  
  let nextPrayer = null;
  let countdown = '--:--:--';
  
  for (const prayer of prayers) {
    if (prayer.time > now) {
      nextPrayer = prayer.name;
      
      // Calculate countdown
      const diffMs = prayer.time.getTime() - now.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      countdown = formatCountdown(diffHrs * 3600 + diffMins * 60 + diffSecs);
      
      break;
    }
  }
  
  return {
    nextPrayer: nextPrayer as 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | null,
    countdown
  };
}

/**
 * Convert time string to Date object
 * @param timeStr Time in format HH:MM
 * @param dateObj Reference date object
 * @returns Date object with the specified time
 */
function convertToDate(timeStr: string, dateObj: Date): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date(dateObj);
  date.setHours(hours, minutes, 0, 0);
  return date;
}
