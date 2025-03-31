import { useCallback } from 'react';

interface HighlightOptions {
  duration?: number;
  highlightColor?: string;
  scrollBehavior?: ScrollBehavior;
  scrollOffset?: number;
}

/**
 * خطاف لإضافة تأثيرات إبراز الآيات مع التمرير التلقائي
 * يستخدم في تحديد الآية الحالية أثناء القراءة أو الاستماع
 */
export function useHighlightAnimation() {
  /**
   * تحديد عنصر مع تأثير رسومي وتمرير تلقائي
   * @param element العنصر المراد إبرازه
   * @param options خيارات الإبراز والتمرير
   */
  const highlightElement = useCallback((element: HTMLElement | null, options: HighlightOptions = {}) => {
    if (!element) return;
    
    const {
      duration = 1500,
      highlightColor = 'rgba(255, 193, 7, 0.2)',
      scrollBehavior = 'smooth',
      scrollOffset = 100
    } = options;
    
    // حفظ الخلفية الأصلية
    const originalBackground = element.style.background;
    const originalTransition = element.style.transition;
    
    // تطبيق تأثير الإبراز
    element.style.background = highlightColor;
    element.style.transition = `background ${duration / 1000}s ease-in-out`;
    
    // التمرير إلى العنصر
    const rect = element.getBoundingClientRect();
    const isAboveViewport = rect.top < scrollOffset;
    const isBelowViewport = rect.bottom > window.innerHeight - scrollOffset;
    
    if (isAboveViewport || isBelowViewport) {
      const offset = isAboveViewport 
        ? window.scrollY + rect.top - scrollOffset 
        : window.scrollY + rect.bottom - window.innerHeight + scrollOffset;
      
      window.scrollTo({
        top: offset,
        behavior: scrollBehavior
      });
    }
    
    // إزالة التأثير بعد انتهاء المدة
    setTimeout(() => {
      element.style.background = originalBackground;
      element.style.transition = originalTransition;
    }, duration);
  }, []);
  
  /**
   * إزالة التأثير البصري من العنصر
   * @param element العنصر المراد إزالة التأثير منه
   */
  const clearHighlight = useCallback((element?: HTMLElement | null) => {
    if (!element) return;
    // إعادة العنصر إلى حالته الأصلية
    element.style.background = '';
    element.style.transition = '';
  }, []);
  
  return { highlightElement, clearHighlight };
}