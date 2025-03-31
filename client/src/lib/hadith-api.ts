import { APP_CONFIG, HADITH_BOOKS } from './constants';

/**
 * Fetch a list of hadith books
 * @returns Promise with the list of hadith books
 */
export async function getHadithBooks() {
  try {
    const response = await fetch(`${APP_CONFIG.hadithAPI}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch hadith books: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.data) {
      return data.data.map((book: any) => ({
        id: book.id,
        name: book.name,
        available: book.available,
        chapters: book.chapters_count,
        hadiths: book.hadiths_count
      }));
    } else {
      // Fallback to our local data if API fails but returns 200
      return HADITH_BOOKS;
    }
  } catch (error) {
    console.error('Error fetching hadith books:', error);
    // Fallback to local data if API fails
    return HADITH_BOOKS;
  }
}

/**
 * Fetch a list of chapters for a specific hadith book
 * @param bookId The hadith book ID (e.g., 'bukhari')
 * @returns Promise with the list of chapters
 */
export async function getHadithChapters(bookId: string) {
  try {
    const response = await fetch(`${APP_CONFIG.hadithAPI}${bookId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch hadith chapters: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.data && data.data.chapters) {
      return data.data.chapters.map((chapter: any) => ({
        id: chapter.id,
        title: chapter.title,
        hadithCount: chapter.hadiths_count
      }));
    } else {
      throw new Error('Invalid hadith chapters data');
    }
  } catch (error) {
    console.error('Error fetching hadith chapters:', error);
    throw error;
  }
}

/**
 * Fetch hadiths for a specific chapter in a hadith book
 * @param bookId The hadith book ID (e.g., 'bukhari')
 * @param chapterId The chapter ID
 * @param page The page number for paginated results (default: 1)
 * @param limit The number of hadiths per page (default: 20)
 * @returns Promise with the list of hadiths
 */
export async function getHadithsByChapter(
  bookId: string,
  chapterId: number,
  page: number = 1,
  limit: number = 20
) {
  try {
    const response = await fetch(
      `${APP_CONFIG.hadithAPI}${bookId}/${chapterId}?page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch hadiths: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.data && data.data.hadiths) {
      return data.data.hadiths.map((hadith: any) => ({
        id: hadith.id,
        number: hadith.number,
        text: hadith.arab,
        translation: hadith.id ? hadith.translation : null,
        narrator: hadith.narrated || '',
        grade: hadith.grade || ''
      }));
    } else {
      throw new Error('Invalid hadiths data');
    }
  } catch (error) {
    console.error('Error fetching hadiths:', error);
    throw error;
  }
}

/**
 * Search for hadiths matching a specific query
 * @param query The search query
 * @param bookId Optional book ID to limit search to a specific book
 * @param page The page number for paginated results (default: 1)
 * @param limit The number of hadiths per page (default: 20)
 * @returns Promise with the search results
 */
export async function searchHadiths(
  query: string,
  bookId: string | null = null,
  page: number = 1,
  limit: number = 20
) {
  try {
    let endpoint = `${APP_CONFIG.hadithAPI}${bookId || 'all'}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
    
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`Failed to search hadiths: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.data && data.data.hadiths) {
      return {
        hadiths: data.data.hadiths.map((hadith: any) => ({
          id: hadith.id,
          number: hadith.number,
          text: hadith.arab,
          translation: hadith.id ? hadith.translation : null,
          narrator: hadith.narrated || '',
          grade: hadith.grade || '',
          bookId: hadith.book?.id || bookId,
          bookName: hadith.book?.name || ''
        })),
        pagination: {
          total: data.data.pagination?.total || 0,
          totalPages: data.data.pagination?.totalPages || 0,
          currentPage: data.data.pagination?.currentPage || page
        }
      };
    } else {
      throw new Error('Invalid search results data');
    }
  } catch (error) {
    console.error('Error searching hadiths:', error);
    throw error;
  }
}

/**
 * Fetch a specific hadith by its ID
 * @param bookId The hadith book ID (e.g., 'bukhari')
 * @param hadithNumber The hadith number
 * @returns Promise with the hadith data
 */
export async function getHadithById(bookId: string, hadithNumber: number) {
  try {
    const response = await fetch(`${APP_CONFIG.hadithAPI}${bookId}/${hadithNumber}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch hadith: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.data) {
      return {
        id: data.data.id,
        number: data.data.number,
        text: data.data.arab,
        translation: data.data.translation,
        narrator: data.data.narrated || '',
        grade: data.data.grade || '',
        chapterId: data.data.chapterId,
        chapter: data.data.chapterTitle
      };
    } else {
      throw new Error('Invalid hadith data');
    }
  } catch (error) {
    console.error('Error fetching hadith:', error);
    throw error;
  }
}

/**
 * Get a complete hadith collection with information about the book, chapters, and sample hadiths
 * @param bookId The hadith book ID (e.g., 'bukhari')
 * @param chapterNumber The chapter number
 * @returns Promise with the hadith collection
 */
export async function getHadithCollection(bookId: string, chapterNumber: number) {
  try {
    // Get book information and chapters
    const [bookResponse, chapterHadithsResponse] = await Promise.all([
      fetch(`${APP_CONFIG.hadithAPI}${bookId}`),
      fetch(`${APP_CONFIG.hadithAPI}${bookId}/${chapterNumber}?page=1&limit=10`)
    ]);
    
    if (!bookResponse.ok) {
      throw new Error(`Failed to fetch hadith book: ${bookResponse.status}`);
    }
    
    if (!chapterHadithsResponse.ok) {
      throw new Error(`Failed to fetch chapter hadiths: ${chapterHadithsResponse.status}`);
    }
    
    const bookData = await bookResponse.json();
    const chapterHadithsData = await chapterHadithsResponse.json();
    
    if (bookData.data && chapterHadithsData.data) {
      // Find the current chapter
      const currentChapter = bookData.data.chapters?.find((ch: any) => ch.id === chapterNumber);
      
      return {
        book: bookData.data.name,
        bookId: bookData.data.id,
        chapter: currentChapter?.title || `الباب ${chapterNumber}`,
        chapterId: chapterNumber,
        chapters: bookData.data.chapters || [],
        hadiths: chapterHadithsData.data.hadiths?.map((hadith: any) => ({
          id: hadith.id,
          number: hadith.number,
          text: hadith.arab,
          translation: hadith.id ? hadith.translation : null,
          narrator: hadith.narrated || '',
          grade: hadith.grade || ''
        })) || []
      };
    } else {
      throw new Error('Invalid hadith collection data');
    }
  } catch (error) {
    console.error('Error fetching hadith collection:', error);
    throw error;
  }
}
