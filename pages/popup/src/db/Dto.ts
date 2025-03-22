import { PROMPT_KEYS } from '@/utils/tts';
import { TaskHistory } from './model';

export interface TaskHistoryDTO {
  inputText: string;
  language: string;
  promptKey: PROMPT_KEYS;
  apiVersion: string;
  temperature: number;
  subject?: string;
  result: string;
  createTime: string;
  completedTime: string;
}

export class TaskHistoryMapper {
  static toEntity(dto: TaskHistoryDTO): Omit<TaskHistory, 'id'> {
    return {
      sourceContent: dto.inputText,
      targetLanguage: dto.language,
      taskType: dto.promptKey,
      modelVersion: dto.apiVersion,
      modelTemperature: dto.temperature,
      emailSubject: dto?.subject || undefined,
      generatedContent: dto.result,
      createdAt: new Date(dto.createTime),
      completedAt: new Date(dto.completedTime),
      isVisitable: true,
    };
  }
  static toViewModel(entity: TaskHistory): TaskHistoryDTO {
    return {
      inputText: entity.sourceContent,
      language: entity.targetLanguage,
      promptKey: entity.taskType,
      apiVersion: entity.modelVersion,
      temperature: entity.modelTemperature,
      subject: entity?.emailSubject || undefined,
      result: entity.generatedContent,
      createTime: entity.createdAt.toLocaleString(),
      completedTime: entity.completedAt.toLocaleString(),
    };
  }
}
