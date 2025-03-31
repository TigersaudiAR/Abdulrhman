
import React from 'react';
import { IoClose } from 'react-icons/io5';

interface PopupModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
}

export const PopupModal: React.FC<PopupModalProps> = ({ children, onClose, title }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">{title || 'تفسير الآية'}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          >
            <IoClose size={24} />
          </button>
        </div>
        <div className="p-4 overflow-auto max-h-[calc(80vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
};
