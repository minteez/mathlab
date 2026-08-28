import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none';

    const variants = {
      primary:
        'bg-primary-600 hover:bg-primary-500 text-white shadow-glow-blue hover:shadow-lg focus:ring-primary-500/50',
      secondary:
        'bg-lab-card hover:bg-lab-hover border border-lab-border hover:border-primary-500/50 text-slate-200 focus:ring-primary-500/30',
      ghost:
        'text-slate-400 hover:text-slate-200 hover:bg-lab-hover focus:ring-primary-500/30',
      danger:
        'bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 focus:ring-red-500/30',
      cyan:
        'bg-cyan-600 hover:bg-cyan-500 text-white shadow-glow-cyan focus:ring-cyan-500/50',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-7 py-3.5 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
