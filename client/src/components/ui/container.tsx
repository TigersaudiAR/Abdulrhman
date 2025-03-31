import React from 'react';
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * مكون الحاوية - يحافظ على تنسيق متناسق للمحتوى
 * يوفر حدودًا للمحتوى بعرض متجاوب وتنسيق متناسق
 */
export const Container: React.FC<ContainerProps> = ({ 
  children, 
  className, 
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl", 
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};