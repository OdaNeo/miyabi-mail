import { PROMPT_KEYS } from '@/utils/tts';
import Dexie, { type EntityTable } from 'dexie';

interface TaskHistory {
  id: number;
  sourceContent: string;
  targetLanguage: string;
  taskType: PROMPT_KEYS;
  modelVersion: string;
  modelTemperature: number;
  emailSubject?: string;
  generatedContent: string;
  createdAt: Date;
  completedAt: Date;
  isVisitable: boolean;
}

const historyDb = new Dexie('MiyabiMailHistory') as Dexie & {
  taskRecords: EntityTable<TaskHistory, 'id'>;
};

historyDb.version(1).stores({
  taskRecords: [
    '++id',
    'createdAt',
    'sourceContent',
    'targetLanguage',
    'taskType',
    'modelVersion',
    'modelTemperature',
    'emailSubject',
    'generatedContent',
    'completedAt',
    'isVisitable',
  ].join(','),
});

export type { TaskHistory };
export { historyDb };
