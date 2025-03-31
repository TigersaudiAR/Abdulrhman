import React from 'react';

interface ErrorDisplayProps {
  message: string;
  retry?: () => void;
}

/**
 * مكوّن عرض الخطأ
 * يستخدم لعرض رسائل الخطأ مع إمكانية إعادة المحاولة
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, retry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <div className="text-red-500 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-10 h-10 mx-auto"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;