import React, { ReactNode } from 'react';
import { XIcon } from '../icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-80 z-50 flex justify-center items-center transition-opacity duration-300" 
      aria-modal="true" 
      role="dialog"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl w-full max-w-2xl m-4 flex flex-col max-h-[90vh] transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 flex justify-between items-center p-5 border-b border-secondary-200 dark:border-secondary-700">
          <h3 className="text-xl font-bold text-secondary-800 dark:text-secondary-100">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 hover:text-secondary-600 dark:hover:text-secondary-200 transition-colors" aria-label="Close modal">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Modal;