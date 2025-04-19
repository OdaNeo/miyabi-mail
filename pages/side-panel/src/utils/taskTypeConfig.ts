import { PROMPT_KEYS } from './tts';

const taskTypeConfig: Record<PROMPT_KEYS, { label: string; color: string }> = {
  TRANSLATION: {
    label: '翻译',
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  },
  REPLY: {
    label: '回复',
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  },
  POLISHING: {
    label: '润色',
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  },
};

export { taskTypeConfig };
