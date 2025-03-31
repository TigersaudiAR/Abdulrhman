import { useState, useCallback, useEffect } from 'react';
import { searchQuran } from '../lib/quran-api';
import { toast } from './use-toast';

// واجهة لخيارات البحث
export interface SearchOptions {
  query: string;
  page: number;
  limit: number;
  translationId?: string;
  filters?: {
    surahs?: number[] | null;
    juzs?: number[] | null;
    pages?: number[] | null;
    revelationType?: 'meccan' | 'medinan' | null;
    wordCount?: { min: number; max: number } | null;
  };
  options?: {
    matchWholeWords: boolean;
    includeDerivatives: boolean;
    caseSensitive: boolean;
    searchInTranslations: boolean;
  };
}

// واجهة لنتائج البحث
export interface SearchResult {
  verse_id: number;
  verse_key: string;
  text: string;
  highlighted: string;
  translations?: { [key: string]: string };
}

// واجهة لنتائج البحث بعد المعالجة
export interface ProcessedSearchResult {
  surahNumber: number;
  verseNumber: number;
  text: string;
  highlightedText: string;
  translation?: string;
  juzNumber?: number;
  pageNumber?: number;
  revelationType?: 'meccan' | 'medinan';
}

// واجهة لحالة البحث
export interface SearchState {
  results: ProcessedSearchResult[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

/**
 * خطاف للبحث في القرآن الكريم مع خيارات متقدمة
 * @param initialOptions خيارات البحث المبدئية
 */
export function useQuranSearch(initialOptions: Partial<SearchOptions> = {}) {
  // الخيارات الافتراضية
  const defaultOptions: SearchOptions = {
    query: '',
    page: 1,
    limit: 10,
    options: {
      matchWholeWords: false,
      includeDerivatives: true,
      caseSensitive: false,
      searchInTranslations: false
    }
  };
  
  // دمج الخيارات المبدئية مع الافتراضية
  const mergedOptions = { ...defaultOptions, ...initialOptions };
  
  // حالة البحث
  const [searchOptions, setSearchOptions] = useState<SearchOptions>(mergedOptions);
  const [searchState, setSearchState] = useState<SearchState>({
    results: [],
    totalResults: 0,
    currentPage: 1,
    totalPages: 0,
    loading: false,
    error: null
  });
  
  // وظيفة تحديث خيارات البحث
  const updateSearchOptions = useCallback((options: Partial<SearchOptions>) => {
    setSearchOptions(prev => ({ ...prev, ...options }));
  }, []);
  
  // وظيفة تغيير الصفحة
  const changePage = useCallback((page: number) => {
    setSearchOptions(prev => ({ ...prev, page }));
  }, []);
  
  // وظيفة معالجة نتائج البحث
  const processSearchResults = useCallback((results: SearchResult[]): ProcessedSearchResult[] => {
    return results.map(result => {
      const [surahStr, verseStr] = result.verse_key.split(':');
      const surahNumber = parseInt(surahStr);
      const verseNumber = parseInt(verseStr);
      
      return {
        surahNumber,
        verseNumber,
        text: result.text,
        highlightedText: result.highlighted,
        translation: result.translations ? Object.values(result.translations)[0] : undefined
      };
    });
  }, []);
  
  // وظيفة تطبيق الفلاتر على النتائج
  const applyFilters = useCallback((results: ProcessedSearchResult[]): ProcessedSearchResult[] => {
    if (!searchOptions.filters) return results;
    
    let filteredResults = results;
    
    // فلتر السور
    if (searchOptions.filters.surahs && searchOptions.filters.surahs.length > 0) {
      filteredResults = filteredResults.filter(result => 
        searchOptions.filters!.surahs!.includes(result.surahNumber)
      );
    }
    
    // فلتر الأجزاء
    if (searchOptions.filters.juzs && searchOptions.filters.juzs.length > 0 && filteredResults[0].juzNumber) {
      filteredResults = filteredResults.filter(result => 
        result.juzNumber && searchOptions.filters!.juzs!.includes(result.juzNumber)
      );
    }
    
    // فلتر الصفحات
    if (searchOptions.filters.pages && searchOptions.filters.pages.length > 0 && filteredResults[0].pageNumber) {
      filteredResults = filteredResults.filter(result => 
        result.pageNumber && searchOptions.filters!.pages!.includes(result.pageNumber)
      );
    }
    
    // فلتر نوع النزول
    if (searchOptions.filters.revelationType && filteredResults[0].revelationType) {
      filteredResults = filteredResults.filter(result => 
        result.revelationType === searchOptions.filters!.revelationType
      );
    }
    
    return filteredResults;
  }, [searchOptions.filters]);
  
  // وظيفة إجراء البحث
  const performSearch = useCallback(async () => {
    const { query, page, limit, translationId } = searchOptions;
    
    if (!query.trim()) {
      setSearchState(prev => ({ 
        ...prev, 
        error: 'الرجاء إدخال نص للبحث', 
        loading: false 
      }));
      return;
    }
    
    setSearchState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const searchResults = await searchQuran(query, page, limit, translationId);
      
      // معالجة النتائج
      const processedResults = processSearchResults(searchResults.results);
      
      // تطبيق الفلاتر
      const filteredResults = applyFilters(processedResults);
      
      setSearchState({
        results: filteredResults,
        totalResults: searchResults.total_results,
        currentPage: searchResults.page,
        totalPages: searchResults.total_pages,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Search error:', error);
      setSearchState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.' 
      }));
      
      toast({
        title: "خطأ في البحث",
        description: "تعذّر إكمال عملية البحث. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.",
        variant: "destructive"
      });
    }
  }, [searchOptions, processSearchResults, applyFilters]);
  
  // إجراء البحث عند تغيير الصفحة
  useEffect(() => {
    if (searchOptions.query.trim() && searchState.results.length > 0) {
      performSearch();
    }
  }, [searchOptions.page, performSearch, searchOptions.query, searchState.results.length]);
  
  return {
    searchOptions,
    searchState,
    updateSearchOptions,
    performSearch,
    changePage
  };
}