import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // عدد الأزرار المرئية في وحدة التنقل بين الصفحات
  const maxVisibleButtons = 5;
  
  // حساب نطاق الأزرار المرئية
  const getPageRange = () => {
    // إذا كان عدد الصفحات أقل من عدد الأزرار المرئية، أظهر كل الصفحات
    if (totalPages <= maxVisibleButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // حساب نصف عدد الأزرار المرئية (للأزرار التي ستظهر قبل وبعد الصفحة الحالية)
    const halfVisible = Math.floor(maxVisibleButtons / 2);
    
    // حالة الصفحات الأولى (الصفحة الحالية قريبة من البداية)
    if (currentPage <= halfVisible + 1) {
      return Array.from({ length: maxVisibleButtons }, (_, i) => i + 1);
    }
    
    // حالة الصفحات الأخيرة (الصفحة الحالية قريبة من النهاية)
    if (currentPage >= totalPages - halfVisible) {
      return Array.from({ length: maxVisibleButtons }, (_, i) => totalPages - maxVisibleButtons + i + 1);
    }
    
    // الحالة العامة (الصفحة الحالية في الوسط)
    return Array.from({ length: maxVisibleButtons }, (_, i) => currentPage - halfVisible + i);
  };
  
  // معالج الصفحة السابقة
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  
  // معالج الصفحة التالية
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  // إذا كان هناك صفحة واحدة فقط، لا تعرض أي شيء
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <nav className="flex items-center justify-center space-x-1 rtl:space-x-reverse">
      {/* زر الصفحة السابقة */}
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">السابق</span>
      </Button>
      
      {/* زر الصفحة الأولى (إذا كان بعيدًا عن البداية) */}
      {currentPage > 3 && totalPages > maxVisibleButtons && (
        <>
          <Button
            variant={currentPage === 1 ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(1)}
          >
            1
          </Button>
          {currentPage > 4 && <span className="px-2">...</span>}
        </>
      )}
      
      {/* أزرار الصفحات الوسطى */}
      {getPageRange().map(page => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
      
      {/* زر الصفحة الأخيرة (إذا كان بعيدًا عن النهاية) */}
      {currentPage < totalPages - 2 && totalPages > maxVisibleButtons && (
        <>
          {currentPage < totalPages - 3 && <span className="px-2">...</span>}
          <Button
            variant={currentPage === totalPages ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}
      
      {/* زر الصفحة التالية */}
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">التالي</span>
      </Button>
    </nav>
  );
};