import { useState, useEffect } from 'react';

export function useProgress(isActive: boolean, step = 1, interval = 80, max = 95) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setProgress(old => {
        const nextVal = Math.min(old + step, max);
        if (nextVal === max) clearInterval(timer);
        return nextVal;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isActive, step, interval, max]);

  return [progress, setProgress] as const;
}
