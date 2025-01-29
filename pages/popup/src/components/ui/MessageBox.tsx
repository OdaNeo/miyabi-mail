import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import type React from 'react';

export const MessageBox: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-slate-100 dark:bg-slate-800 p-1 rounded max-h-20 overflow-y-auto text-xs scrollbar-custom text-slate-700 dark:text-slate-300',
        ),
      )}
    >
      {children}
    </div>
  );
};
