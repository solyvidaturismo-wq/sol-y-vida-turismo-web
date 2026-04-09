import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = '2xl' }) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => setIsRendered(false), 300);
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isRendered) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  };

  return createPortal(
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Content */}
      <div className={`
        relative w-full ${maxWidthClasses[maxWidth]} bg-slate-900 rounded-[40px] border border-white/10 shadow-2xl overflow-hidden transform transition-all duration-300
        ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}
      `}>
         <div className="flex items-center justify-between p-8 border-b border-white/5">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{title}</h3>
            <button 
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/5 text-slate-500 hover:text-white transition-all hover:rotate-90"
            >
               <X size={20} />
            </button>
         </div>

         <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
            {children}
         </div>
      </div>
    </div>,
    document.body
  );
};
