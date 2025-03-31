// أنواع البيانات المستخدمة في قسم القرآن الكريم

export interface QuranData {
  surahs: Surah[];
  juzs: Juz[];
  pages: Page[];
  editions: Edition[];
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Juz {
  number: number;
  ayahs: JuzAyah[];
}

export interface JuzAyah {
  number: number;
  surah: {
    number: number;
    name: string;
    englishName: string;
  };
  numberInSurah: number;
}

export interface Page {
  number: number;
  ayahs: PageAyah[];
}

export interface PageAyah {
  number: number;
  surah: {
    number: number;
    name: string;
    englishName: string;
  };
  numberInSurah: number;
  juz: number;
  page: number;
  hizbQuarter?: number;
  sajda?: boolean;
}

export interface Edition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
}

export interface AyahData {
  number: number;
  numberInQuran: number;
  numberInSurah: number;
  text: string;
  translation?: string;
  surah: {
    number: number;
    name: string;
    englishName: string;
  };
  juz: number;
  page: number;
  sajda?: boolean;
  hizbQuarter?: number;
}

export interface SurahData {
  surahInfo: Surah;
  ayahs: AyahData[];
}

export interface LastRead {
  surahName: string;
  surahNumber: number;
  ayahNumber: number;
  pageNumber: number;
  text: string;
  timestamp: string;
  description?: string;
}

export interface QuranBookmark {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  pageNumber: number;
  timestamp: string;
  description?: string;
}