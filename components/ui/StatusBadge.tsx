import React from 'react';
import { cn, getStatusColor, formatStatusLabel } from '../../lib/utils';

export interface StatusBadgeProps {
  status: string;
  className?: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  showDot = true,
}) => {
  const { bg, text, border } = getStatusColor(status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        bg,
        text,
        border,
        className
      )}
    >
      {showDot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            text.replace('text-', 'bg-')
          )}
        />
      )}
      <span>{formatStatusLabel(status)}</span>
    </span>
  );
};
