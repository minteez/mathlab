import { cn } from '@/utils/cn';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center p-12 gap-4', className)}>
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-lab-surface border border-lab-border flex items-center justify-center text-slate-500">
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-lg font-semibold text-slate-300 mb-1">{title}</h3>
        {description && <p className="text-slate-500 text-sm max-w-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}
