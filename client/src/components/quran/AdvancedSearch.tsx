import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, XCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { SURAH_NAMES } from '../../lib/constants';
import { useQuranSearch } from '../../hooks/useQuranSearch';
import { Skeleton } from '../ui/skeleton';
import { Pagination } from '../ui/pagination';

interface SearchConfig {
  query: string;
  filters: {
    surahs: number[] | null;
    juzs: number[] | null;
    pages: number[] | null;
    revelationType: 'meccan' | 'medinan' | null;
    wordCount: { min: number; max: number } | null;
    withTajweed?: boolean;
    withTranslation?: boolean;
    translationId?: string;
  };
  options: {
    matchWholeWords: boolean;
    includeDerivatives: boolean;
    caseSensitive: boolean;
    searchInTranslations: boolean;
  };
}

interface SearchResults {
  query: string;
  total: number;
  page: number;
  pages: number;
  results: {
    surah: number;
    ayah: number;
    text: string;
    textHighlighted: string;
    translation?: string;
    page: number;
    juz: number;
  }[];
}

interface AdvancedSearchProps {
  onSelectVerse: (surahNumber: number, verseNumber: number) => void;
  translationId?: string;
}

/**
 * مكون البحث المتقدم في القرآن الكريم
 * يوفر خيارات بحث متقدمة مع فلترة النتائج
 */
const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSelectVerse, translationId }) => {
  // إعداد خطاف البحث
  const { 
    searchOptions, 
    searchState, 
    updateSearchOptions, 
    performSearch, 
    changePage 
  } = useQuranSearch({
    translationId,
    options: {
      matchWholeWords: false,
      includeDerivatives: true,
      caseSensitive: false,
      searchInTranslations: false
    }
  });
  
  // حالة البحث المحلية
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedSurahs, setSelectedSurahs] = useState<number[]>([]);
  const [selectedJuzs, setSelectedJuzs] = useState<number[]>([]);
  const [revelationType, setRevelationType] = useState<'meccan' | 'medinan' | null>(null);
  
  // حالة خيارات البحث
  const [matchWholeWords, setMatchWholeWords] = useState(false);
  const [includeDerivatives, setIncludeDerivatives] = useState(true);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [searchInTranslations, setSearchInTranslations] = useState(false);
  
  // معالج تغيير نص البحث
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // معالج تحديد سورة
  const handleSurahSelect = (surahNumber: number) => {
    setSelectedSurahs(prev => {
      if (prev.includes(surahNumber)) {
        return prev.filter(num => num !== surahNumber);
      } else {
        return [...prev, surahNumber];
      }
    });
  };
  
  // معالج تحديد جزء
  const handleJuzSelect = (juzNumber: number) => {
    setSelectedJuzs(prev => {
      if (prev.includes(juzNumber)) {
        return prev.filter(num => num !== juzNumber);
      } else {
        return [...prev, juzNumber];
      }
    });
  };
  
  // معالج تحديد نوع النزول
  const handleRevelationTypeChange = (type: 'meccan' | 'medinan' | null) => {
    setRevelationType(type);
  };
  
  // معالج إزالة جميع الفلاتر
  const handleClearFilters = () => {
    setSelectedSurahs([]);
    setSelectedJuzs([]);
    setRevelationType(null);
    setMatchWholeWords(false);
    setIncludeDerivatives(true);
    setCaseSensitive(false);
    setSearchInTranslations(false);
  };
  
  // معالج تنفيذ البحث
  const handleSearch = () => {
    // تحديث خيارات البحث
    updateSearchOptions({
      query: searchQuery,
      page: 1,
      filters: {
        surahs: selectedSurahs.length > 0 ? selectedSurahs : undefined,
        juzs: selectedJuzs.length > 0 ? selectedJuzs : undefined,
        pages: undefined,
        revelationType: revelationType || undefined,
        wordCount: undefined
      },
      options: {
        matchWholeWords,
        includeDerivatives,
        caseSensitive,
        searchInTranslations
      }
    });
    
    // تنفيذ البحث
    performSearch();
  };
  
  // معالج تغيير الصفحة
  const handlePageChange = (page: number) => {
    changePage(page);
  };
  
  // تنسيق نص الآية مع إبراز كلمات البحث
  const formatHighlightedText = (text: string) => {
    return { __html: text };
  };
  
  // توليد قائمة السور
  const renderSurahList = () => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2 max-h-48 overflow-y-auto">
        {SURAH_NAMES.map((surah, index) => (
          <div key={index + 1} className="flex items-center space-x-2 rtl:space-x-reverse">
            <Checkbox 
              id={`surah-${index + 1}`}
              checked={selectedSurahs.includes(index + 1)}
              onCheckedChange={() => handleSurahSelect(index + 1)}
            />
            <Label 
              htmlFor={`surah-${index + 1}`}
              className="text-sm cursor-pointer"
            >
              {index + 1}. {surah}
            </Label>
          </div>
        ))}
      </div>
    );
  };
  
  // توليد قائمة الأجزاء
  const renderJuzList = () => {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2 mt-2">
        {Array.from({ length: 30 }, (_, i) => i + 1).map(juzNumber => (
          <div key={juzNumber} className="flex items-center space-x-2 rtl:space-x-reverse">
            <Checkbox 
              id={`juz-${juzNumber}`}
              checked={selectedJuzs.includes(juzNumber)}
              onCheckedChange={() => handleJuzSelect(juzNumber)}
            />
            <Label 
              htmlFor={`juz-${juzNumber}`}
              className="text-sm cursor-pointer"
            >
              جزء {juzNumber}
            </Label>
          </div>
        ))}
      </div>
    );
  };
  
  // توليد نتائج البحث
  const renderSearchResults = () => {
    if (searchState.loading) {
      return (
        <div className="space-y-4 py-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      );
    }
    
    if (searchState.error) {
      return (
        <div className="py-10 text-center">
          <p className="text-red-500">{searchState.error}</p>
          <Button 
            variant="outline"
            className="mt-2"
            onClick={handleSearch}
          >
            إعادة المحاولة
          </Button>
        </div>
      );
    }
    
    if (searchState.results.length === 0 && searchOptions.query) {
      return (
        <div className="py-10 text-center">
          <p className="text-gray-500">لا توجد نتائج بحث</p>
          <p className="text-sm text-gray-400 mt-1">جرب عبارة بحث أخرى أو تعديل الفلاتر</p>
        </div>
      );
    }
    
    if (searchState.results.length === 0) {
      return (
        <div className="py-10 text-center">
          <p className="text-gray-500">ابدأ البحث عن الآيات في القرآن الكريم</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4 py-4">
        <p className="text-sm text-gray-500 mb-2">
          {searchState.totalResults} نتيجة بحث لـ "{searchOptions.query}"
        </p>
        
        {searchState.results.map((result, index) => (
          <div 
            key={index}
            className="border rounded-md p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            onClick={() => onSelectVerse(result.surahNumber, result.verseNumber)}
          >
            <div className="flex justify-between items-center mb-2">
              <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700/50">
                {SURAH_NAMES[result.surahNumber - 1]} {result.surahNumber}:{result.verseNumber}
              </Badge>
              {result.juzNumber && (
                <span className="text-xs text-gray-500">
                  جزء {result.juzNumber}
                </span>
              )}
            </div>
            <p 
              className="text-lg font-arabic leading-loose text-right mb-2"
              dangerouslySetInnerHTML={formatHighlightedText(result.highlightedText)}
            ></p>
            {result.translation && (
              <p className="text-sm text-gray-600 dark:text-gray-400 border-t dark:border-gray-700 pt-2 mt-2">
                {result.translation}
              </p>
            )}
          </div>
        ))}
        
        {searchState.totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination
              currentPage={searchState.currentPage}
              totalPages={searchState.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="relative w-full">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ابحث في آيات القرآن الكريم..."
              value={searchQuery}
              onChange={handleQueryChange}
              className="pr-9 w-full text-right"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={searchState.loading}>
            {searchState.loading ? (
              <Loader2 className="h-4 w-4 animate-spin ml-1" />
            ) : (
              'بحث'
            )}
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="text-gray-500 flex items-center"
          >
            <Filter className="h-4 w-4 ml-1" />
            خيارات متقدمة
            {filtersOpen ? (
              <ChevronUp className="h-4 w-4 mr-1" />
            ) : (
              <ChevronDown className="h-4 w-4 mr-1" />
            )}
          </Button>
          
          {(selectedSurahs.length > 0 || selectedJuzs.length > 0 || revelationType !== null) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-red-500 flex items-center"
            >
              <XCircle className="h-4 w-4 ml-1" />
              مسح الفلاتر
            </Button>
          )}
        </div>
      </div>
      
      <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
        <CollapsibleContent>
          <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800/50 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">حسب السورة</h3>
                {renderSurahList()}
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">حسب الجزء</h3>
                {renderJuzList()}
              </div>
            </div>
            
            <div className="pt-4 border-t dark:border-gray-700">
              <h3 className="font-medium mb-4">حسب نوع النزول</h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant={revelationType === 'meccan' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleRevelationTypeChange(revelationType === 'meccan' ? null : 'meccan')}
                >
                  مكية
                </Button>
                <Button
                  variant={revelationType === 'medinan' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleRevelationTypeChange(revelationType === 'medinan' ? null : 'medinan')}
                >
                  مدنية
                </Button>
              </div>
            </div>
            
            <div className="pt-4 border-t dark:border-gray-700">
              <h3 className="font-medium mb-4">خيارات البحث</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Switch
                    id="match-whole-words"
                    checked={matchWholeWords}
                    onCheckedChange={setMatchWholeWords}
                  />
                  <Label htmlFor="match-whole-words">تطابق الكلمات بالكامل</Label>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Switch
                    id="include-derivatives"
                    checked={includeDerivatives}
                    onCheckedChange={setIncludeDerivatives}
                  />
                  <Label htmlFor="include-derivatives">تضمين المشتقات</Label>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Switch
                    id="case-sensitive"
                    checked={caseSensitive}
                    onCheckedChange={setCaseSensitive}
                  />
                  <Label htmlFor="case-sensitive">مطابقة حالة الأحرف</Label>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Switch
                    id="search-in-translations"
                    checked={searchInTranslations}
                    onCheckedChange={setSearchInTranslations}
                  />
                  <Label htmlFor="search-in-translations">البحث في الترجمات</Label>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {renderSearchResults()}
    </div>
  );
};

export default AdvancedSearch;