import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning';
  onClose: () => void;
}

const Toast = ({ message, type = 'success', onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className={`fixed bottom-4 right-4 z-50 p-3 rounded-lg shadow-lg flex items-center gap-2 ${
      type === 'success' ? 'bg-emerald-600 text-white' :
      type === 'error' ? 'bg-red-600 text-white' :
      'bg-amber-600 text-white'
    }`}>
      {type === 'success' ? <i className="fas fa-check w-5 h-5"></i> :
       type === 'error' ? <i className="fas fa-x w-5 h-5"></i> :
       <i className="fas fa-triangle-exclamation w-5 h-5"></i>}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 p-1 hover:bg-white hover:bg-opacity-20 rounded-full">
        <i className="fas fa-x w-4 h-4"></i>
      </button>
    </div>
  );
};

export default Toast;
