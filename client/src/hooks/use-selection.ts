import { useState, useEffect, useCallback } from 'react';

interface SelectionPosition {
  x: number;
  y: number;
}

/**
 * خطاف لتتبع تحديد النص في المستند
 * يستخدم لعرض قائمة الخيارات عند تحديد النص
 */
export function useSelection() {
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState<SelectionPosition | null>(null);
  const [selectedVerseInfo, setSelectedVerseInfo] = useState<{
    surahNumber?: number;
    verseNumber?: number;
    pageNumber?: number;
  } | null>(null);

  /**
   * الحصول على معلومات الآية المحددة من العناصر المحيطة
   */
  const getVerseInfoFromSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    
    const range = selection.getRangeAt(0);
    
    // البحث عن أقرب حاوية للآية
    let verseContainer = range.commonAncestorContainer;
    while (
      verseContainer && 
      verseContainer.nodeType === Node.TEXT_NODE || 
      !(verseContainer instanceof HTMLElement) ||
      !verseContainer.hasAttribute('data-surah') ||
      !verseContainer.hasAttribute('data-verse')
    ) {
      if (!verseContainer.parentElement) break;
      verseContainer = verseContainer.parentElement;
    }
    
    // إذا وجدنا حاوية آية
    if (
      verseContainer instanceof HTMLElement && 
      verseContainer.hasAttribute('data-surah') && 
      verseContainer.hasAttribute('data-verse')
    ) {
      const surahNumber = parseInt(verseContainer.getAttribute('data-surah') || '0', 10);
      const verseNumber = parseInt(verseContainer.getAttribute('data-verse') || '0', 10);
      const pageNumber = parseInt(verseContainer.getAttribute('data-page') || '0', 10);
      
      return {
        surahNumber: surahNumber > 0 ? surahNumber : undefined,
        verseNumber: verseNumber > 0 ? verseNumber : undefined,
        pageNumber: pageNumber > 0 ? pageNumber : undefined
      };
    }
    
    return null;
  };

  /**
   * الحصول على موقع التحديد للعرض
   */
  const getSelectionPosition = (): SelectionPosition | null => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    return {
      x: rect.left + window.scrollX + (rect.width / 2),
      y: rect.bottom + window.scrollY
    };
  };

  /**
   * معالج حدث تغيير التحديد
   */
  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    if (!selection) return;
    
    const text = selection.toString().trim();
    
    if (text) {
      setSelectedText(text);
      setSelectionPosition(getSelectionPosition());
      setSelectedVerseInfo(getVerseInfoFromSelection());
    } else {
      // إذا كان هناك نقر عادي بدون تحديد نص
      setSelectedText('');
      setSelectionPosition(null);
      setSelectedVerseInfo(null);
    }
  }, []);

  /**
   * معالج النقر على المستند
   */
  const handleDocumentClick = useCallback((e: MouseEvent) => {
    // إذا كان النقر خارج التحديد
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') {
      setSelectedText('');
      setSelectionPosition(null);
      setSelectedVerseInfo(null);
    }
  }, []);

  // تسجيل المستمعين لأحداث التحديد والنقر
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('click', handleDocumentClick);
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [handleSelectionChange, handleDocumentClick]);

  /**
   * إعادة تعيين التحديد الحالي
   */
  const clearSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection) selection.removeAllRanges();
    
    setSelectedText('');
    setSelectionPosition(null);
    setSelectedVerseInfo(null);
  }, []);

  return {
    selectedText,
    selectionPosition,
    selectedVerseInfo,
    clearSelection
  };
}