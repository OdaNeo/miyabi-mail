import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import type React from 'react';

export const MessageBox: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      className={twMerge(
        clsx(`h-auto overflow-y-auto text-sm scrollbar-custom
           dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 
         bg-white text-slate-900 placeholder-slate-500 ${children && `p-3`}`),
      )}
    >
      {children}
    </div>
  );
};
