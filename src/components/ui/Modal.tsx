import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import { cn } from '@/utils/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw]',
};

export default function Modal({ open, onClose, title, children, size = 'md', className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className={cn(
          'relative w-full bg-lab-card border border-lab-border rounded-2xl shadow-card animate-slide-up',
          SIZES[size],
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-lab-border">
            <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close dialog">
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
        {!title && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-3 right-3 z-10"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
        <div className={cn('overflow-y-auto max-h-[85vh]', title ? '' : 'pt-2')}>
          {children}
        </div>
      </div>
    </div>
  );
}
