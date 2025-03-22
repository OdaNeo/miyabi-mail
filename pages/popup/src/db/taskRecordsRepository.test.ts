import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getAllTaskRecords,
  findTaskRecordById,
  deleteTaskRecordById,
  updateTaskRecordById,
  addTaskRecord,
} from '../db/taskRecordsRepository';
import { historyDb, TaskHistory } from '../db/model';

vi.mock('../db/model', () => {
  const mockTaskRecords = [
    {
      id: 1,
      sourceContent: '原始内容1',
      targetLanguage: 'en',
      taskType: 'TRANSLATION',
      modelVersion: 'gpt-4o',
      modelTemperature: 0.7,
      generatedContent: '翻译结果1',
      createdAt: new Date('2023-05-15'),
      completedAt: new Date('2023-05-15'),
      isVisitable: true,
    },
    {
      id: 2,
      sourceContent: '原始内容2',
      targetLanguage: 'ja',
      taskType: 'POLISHING',
      modelVersion: 'gpt-3.5-turbo',
      modelTemperature: 0.5,
      emailSubject: '测试邮件',
      generatedContent: '润色结果2',
      createdAt: new Date('2023-05-16'),
      completedAt: new Date('2023-05-16'),
      isVisitable: false,
    },
  ];

  return {
    historyDb: {
      taskRecords: {
        filter: vi.fn().mockImplementation(filterFn => ({
          toArray: () => Promise.resolve(mockTaskRecords.filter(filterFn)),
        })),
        get: vi.fn().mockImplementation(id => Promise.resolve(mockTaskRecords.find(record => record.id === id))),
        update: vi.fn().mockResolvedValue(1),
        add: vi.fn().mockResolvedValue(3),
      },
    },
  };
});

describe('taskRecordsRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllTaskRecords', () => {
    it('应该返回所有可见的任务记录', async () => {
      const records = await getAllTaskRecords();

      expect(historyDb.taskRecords.filter).toHaveBeenCalled();

      expect(records).toHaveLength(1);
      expect(records[0].id).toBe(1);
      expect(records[0].isVisitable).toBe(true);
    });
  });

  describe('findTaskRecordById', () => {
    it('应该通过ID查找任务记录', async () => {
      const record = await findTaskRecordById(1);

      expect(historyDb.taskRecords.get).toHaveBeenCalledWith(1);
      expect(record).toBeDefined();
      expect(record?.id).toBe(1);
    });

    it('不存在的ID应该返回undefined', async () => {
      const record = await findTaskRecordById(999);

      expect(historyDb.taskRecords.get).toHaveBeenCalledWith(999);
      expect(record).toBeUndefined();
    });
  });

  describe('deleteTaskRecordById', () => {
    it('应该将记录标记为不可见', async () => {
      await deleteTaskRecordById(1);

      expect(historyDb.taskRecords.update).toHaveBeenCalledWith(1, { isVisitable: false });
    });
  });

  describe('updateTaskRecordById', () => {
    it('应该使用新数据更新记录', async () => {
      const updateData: Partial<Omit<TaskHistory, 'id'>> = {
        sourceContent: '更新后的内容',
        modelTemperature: 0.8,
      };

      await updateTaskRecordById(1, updateData);

      expect(historyDb.taskRecords.update).toHaveBeenCalledWith(1, updateData);
    });
  });

  describe('addTaskRecord', () => {
    it('应该添加新的任务记录', async () => {
      const newRecord: Omit<TaskHistory, 'id'> = {
        sourceContent: '新内容',
        targetLanguage: 'fr',
        taskType: 'REPLY',
        modelVersion: 'gpt-4o',
        modelTemperature: 0.6,
        generatedContent: '新生成的内容',
        createdAt: new Date(),
        completedAt: new Date(),
        isVisitable: true,
      };

      await addTaskRecord(newRecord);

      expect(historyDb.taskRecords.add).toHaveBeenCalledWith(newRecord);
    });
  });
});
