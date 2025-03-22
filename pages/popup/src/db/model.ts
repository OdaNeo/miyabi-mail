import { PROMPT_KEYS } from '@/utils/tts';
import Dexie, { type EntityTable } from 'dexie';

interface TaskHistory {
  id: number;
  sourceContent: string; //inputText
  targetLanguage: string; //language
  taskType: PROMPT_KEYS; //promptKey
  modelVersion: string; //apiVersion
  modelTemperature: number; //temperature
  emailSubject?: string; //subject
  generatedContent: string; //translation reply inputText
  createdAt: Date; //createTime
  completedAt: Date; //completedTime
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
