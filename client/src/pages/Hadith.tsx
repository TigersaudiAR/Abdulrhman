import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorDisplay from '../components/common/ErrorDisplay';
import { getHadithBooks, getHadithCollection } from '../lib/hadith-api';

const Hadith = () => {
  const [selectedBook, setSelectedBook] = useState('bukhari');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Fetch hadith books
  const { 
    data: hadithBooks, 
    isLoading: isBooksLoading, 
    error: booksError 
  } = useQuery({
    queryKey: ['hadithBooks'],
    queryFn: getHadithBooks,
  });
  
  // Fetch hadith collection based on selected book
  const { 
    data: hadithCollection,
    isLoading: isCollectionLoading, 
    error: collectionError,
    refetch: refetchCollection
  } = useQuery({
    queryKey: ['hadithCollection', selectedBook, selectedChapter],
    queryFn: () => getHadithCollection(selectedBook, selectedChapter),
    enabled: !!selectedBook,
  });
  
  // Handle book change
  const handleBookChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBook(event.target.value);
    setSelectedChapter(1); // Reset chapter when book changes
  };
  
  // Handle chapter change
  const handleChapterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChapter(parseInt(event.target.value));
  };
  
  // Handle search
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (searchQuery.trim()) {
      setIsSearching(true);
      // In a real app, this would perform a search against the Hadith API
      // For now just show/hide search UI
    } else {
      setIsSearching(false);
    }
  };
  
  const isLoading = isBooksLoading || isCollectionLoading;
  const error = booksError || collectionError;
  
  return (
    <section className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">الأحاديث النبوية</h2>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
          <form onSubmit={handleSearch} className="flex items-center mb-4">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="ابحث في الأحاديث النبوية..." 
                className="w-full py-2 px-4 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring focus:ring-primary focus:ring-opacity-50 focus:border-primary dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute inset-y-0 left-0 pl-3 flex items-center"
              >
                <i className="fas fa-search text-gray-400"></i>
              </button>
            </div>
          </form>
          
          {!isSearching && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  الكتاب
                </label>
                <select 
                  className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={selectedBook}
                  onChange={handleBookChange}
                  disabled={isLoading}
                >
                  {hadithBooks && hadithBooks.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  الباب
                </label>
                <select 
                  className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={selectedChapter}
                  onChange={handleChapterChange}
                  disabled={isLoading || !hadithCollection?.chapters}
                >
                  {hadithCollection?.chapters && hadithCollection.chapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <LoadingSpinner text="جار تحميل الأحاديث..." />
        ) : error ? (
          <ErrorDisplay 
            error={error instanceof Error ? error.message : 'حدث خطأ أثناء تحميل الأحاديث'} 
            onRetry={refetchCollection} 
          />
        ) : (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-primary mb-4">
              {isSearching 
                ? `نتائج البحث عن: ${searchQuery}` 
                : hadithCollection?.chapter 
                  ? `${hadithCollection.book} - ${hadithCollection.chapter}`
                  : 'الأحاديث'
              }
            </h3>
            
            {hadithCollection?.hadiths && hadithCollection.hadiths.length > 0 ? (
              <div className="space-y-6">
                {hadithCollection.hadiths.map((hadith) => (
                  <div key={hadith.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 last:border-0">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-2">
                      <p className="arabic-text text-lg leading-relaxed text-right">{hadith.text}</p>
                    </div>
                    
                    {hadith.translation && (
                      <div className="text-gray-700 dark:text-gray-300 mb-2 text-sm">
                        <p>{hadith.translation}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>الراوي: {hadith.narrator}</span>
                      <span>الدرجة: {hadith.grade}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                  {isSearching 
                    ? 'لا توجد نتائج تطابق البحث' 
                    : 'لا توجد أحاديث متاحة حالياً'}
                </p>
              </div>
            )}
            
            {hadithCollection?.hadiths && hadithCollection.hadiths.length > 0 && !isSearching && (
              <div className="flex justify-between mt-4">
                <button 
                  className="py-2 px-4 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
                  onClick={() => {
                    if (selectedChapter > 1) {
                      setSelectedChapter(selectedChapter - 1);
                    }
                  }}
                  disabled={selectedChapter <= 1}
                >
                  الباب السابق
                </button>
                <button 
                  className="py-2 px-4 bg-primary text-white rounded-lg hover:bg-opacity-90"
                  onClick={() => {
                    if (hadithCollection?.chapters && selectedChapter < hadithCollection.chapters.length) {
                      setSelectedChapter(selectedChapter + 1);
                    }
                  }}
                  disabled={!hadithCollection?.chapters || selectedChapter >= hadithCollection.chapters.length}
                >
                  الباب التالي
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hadith;
