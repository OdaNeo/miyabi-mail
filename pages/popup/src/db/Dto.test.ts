import { describe, it, expect } from 'vitest';
import { TaskHistoryMapper, TaskHistoryDTO } from '../db/Dto';
import { TaskHistory } from '../db/model';
import { PROMPT_KEYS } from '@/utils/tts';
import { seed } from './seed';

const mockDTOs: TaskHistoryDTO[] = [
  {
    inputText: '今日は良い天気ですね。',
    language: 'en',
    promptKey: 'TRANSLATION' as PROMPT_KEYS,
    apiVersion: 'gpt-4o',
    temperature: 0.7,
    subject: 'Weather discussion',
    result: 'Today is nice weather.',
    createTime: '2023/5/15 10:30:00',
    completedTime: '2023/5/15 10:30:05',
  },
  {
    inputText: 'Hello, I would like to inquire about your product.',
    language: 'ja',
    promptKey: 'REPLY' as PROMPT_KEYS,
    apiVersion: 'gpt-3.5-turbo',
    temperature: 0.5,
    result: 'こんにちは、お問い合わせありがとうございます。',
    createTime: '2023/5/16 14:20:00',
    completedTime: '2023/5/16 14:20:12',
  },
];

const mockEntities: TaskHistory[] = [
  {
    id: 1,
    sourceContent: '今日は良い天気ですね。',
    targetLanguage: 'en',
    taskType: 'TRANSLATION' as PROMPT_KEYS,
    modelVersion: 'gpt-4o',
    modelTemperature: 0.7,
    emailSubject: 'Weather discussion',
    generatedContent: 'Today is nice weather.',
    createdAt: new Date('2023-05-15T10:30:00'),
    completedAt: new Date('2023-05-15T10:30:05'),
    isVisitable: true,
  },
  {
    id: 2,
    sourceContent: 'Hello, I would like to inquire about your product.',
    targetLanguage: 'ja',
    taskType: 'REPLY' as PROMPT_KEYS,
    modelVersion: 'gpt-3.5-turbo',
    modelTemperature: 0.5,
    generatedContent: 'こんにちは、お問い合わせありがとうございます。',
    createdAt: new Date('2023-05-16T14:20:00'),
    completedAt: new Date('2023-05-16T14:20:12'),
    isVisitable: true,
  },
];

describe('TaskHistoryMapper', () => {
  describe('toEntity method', () => {
    it('应该正确将 DTO 转换为实体', () => {
      const dto = mockDTOs[0];
      const entity = TaskHistoryMapper.toEntity(dto);

      expect(entity).toEqual({
        sourceContent: dto.inputText,
        targetLanguage: dto.language,
        taskType: dto.promptKey,
        modelVersion: dto.apiVersion,
        modelTemperature: dto.temperature,
        emailSubject: dto.subject,
        generatedContent: dto.result,
        createdAt: new Date(dto.createTime),
        completedAt: new Date(dto.completedTime),
        isVisitable: true,
      });
    });

    it('应该处理缺少可选字段的情况', () => {
      const dto = { ...mockDTOs[1] }; // 没有 subject 字段
      const entity = TaskHistoryMapper.toEntity(dto);

      expect(entity.emailSubject).toBeUndefined();
      expect(entity).toEqual({
        sourceContent: dto.inputText,
        targetLanguage: dto.language,
        taskType: dto.promptKey,
        modelVersion: dto.apiVersion,
        modelTemperature: dto.temperature,
        emailSubject: undefined,
        generatedContent: dto.result,
        createdAt: new Date(dto.createTime),
        completedAt: new Date(dto.completedTime),
        isVisitable: true,
      });
    });

    it('应该正确处理日期转换', () => {
      const dto = mockDTOs[0];
      const entity = TaskHistoryMapper.toEntity(dto);

      expect(entity.createdAt).toBeInstanceOf(Date);
      expect(entity.completedAt).toBeInstanceOf(Date);
      expect(entity.createdAt.getTime()).toBe(new Date(dto.createTime).getTime());
      expect(entity.completedAt.getTime()).toBe(new Date(dto.completedTime).getTime());
    });
  });

  describe('toViewModel method', () => {
    it('应该正确将实体转换为 DTO', () => {
      const entity = mockEntities[0];
      const dto = TaskHistoryMapper.toViewModel(entity);

      expect(dto).toEqual({
        inputText: entity.sourceContent,
        language: entity.targetLanguage,
        promptKey: entity.taskType,
        apiVersion: entity.modelVersion,
        temperature: entity.modelTemperature,
        subject: entity.emailSubject,
        result: entity.generatedContent,
        createTime: entity.createdAt.toLocaleString(),
        completedTime: entity.completedAt.toLocaleString(),
      });
    });

    it('应该处理缺少可选字段的情况', () => {
      const entity = { ...seed[1], emailSubject: undefined };
      const dto = TaskHistoryMapper.toViewModel(entity);

      expect(dto.subject).toBeUndefined();
      expect(dto.inputText).toBe(seed[1].sourceContent);
    });

    it('应该使用日本区域设置格式化日期', () => {
      const entity = mockEntities[0];
      const dto = TaskHistoryMapper.toViewModel(entity);

      const expectedDateFormat = entity.createdAt.toLocaleString();

      expect(dto.createTime).toBe(expectedDateFormat);
      expect(dto.completedTime).toBe(entity.completedAt.toLocaleString());
    });

    it('应该形成完整的转换循环（DTO → 实体 → DTO）', () => {
      const originalDto = mockDTOs[0];
      const entity = TaskHistoryMapper.toEntity(originalDto);
      const entityWithId = { ...entity, id: 1 };
      const resultDto = TaskHistoryMapper.toViewModel(entityWithId);

      expect(resultDto.inputText).toBe(originalDto.inputText);
      expect(resultDto.language).toBe(originalDto.language);
      expect(resultDto.promptKey).toBe(originalDto.promptKey);
      expect(resultDto.apiVersion).toBe(originalDto.apiVersion);
      expect(resultDto.temperature).toBe(originalDto.temperature);
      expect(resultDto.subject).toBe(originalDto.subject);
      expect(resultDto.result).toBe(originalDto.result);
    });
  });
});
