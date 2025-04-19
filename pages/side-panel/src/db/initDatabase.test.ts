import indexedDB from 'fake-indexeddb';
import Dexie, { EntityTable } from 'dexie';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { TaskHistory } from './model';
import { initDatabase } from './initDatabase';
import { seed } from './seed';

describe('initDatabase', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await db.delete();
    await db.open();
  });

  afterAll(async () => {
    await db.close();
    await db.delete();
  });

  const db = new Dexie('MiyabiMailHistory', { indexedDB: indexedDB }) as Dexie & {
    taskRecords: EntityTable<TaskHistory, 'id'>;
  };
  db.version(1).stores({
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

  it('should initialize the database', () => {
    expect(db).toBeDefined();
  });
  it('在开发环境且taskRecords为空时，应添加seed数据', async () => {
    vi.stubEnv('MODE', 'development');
    await initDatabase();
    const list = await db.taskRecords.toArray();

    expect(list.length).toBe(seed.length);
  });

  it('在其他环境且taskRecords为空时，不应添加seed数据', async () => {
    vi.stubEnv('MODE', 'production');
    await initDatabase();
    const list = await db.taskRecords.toArray();

    expect(list.length).toBe(0);
  });
});
