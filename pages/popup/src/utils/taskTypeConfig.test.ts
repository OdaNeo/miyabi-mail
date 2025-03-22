import { describe, it, expect } from 'vitest';
import { taskTypeConfig } from './taskTypeConfig';
import { PROMPT_KEYS } from './tts';

describe('taskTypeConfig', () => {
  it('应该为所有的PROMPT_KEYS类型定义配置', () => {
    const promptKeys: PROMPT_KEYS[] = ['TRANSLATION', 'REPLY', 'POLISHING'];

    promptKeys.forEach(key => {
      expect(taskTypeConfig).toHaveProperty(key);
    });
  });

  it('每个配置项应该有正确的结构', () => {
    Object.values(taskTypeConfig).forEach(config => {
      expect(config).toHaveProperty('label');
      expect(config).toHaveProperty('color');
      expect(typeof config.label).toBe('string');
      expect(typeof config.color).toBe('string');
    });
  });

  it('翻译类型应该有正确的标签和颜色', () => {
    const translationConfig = taskTypeConfig.TRANSLATION;
    expect(translationConfig.label).toBe('翻译');
    expect(translationConfig.color).toContain('bg-indigo-100');
    expect(translationConfig.color).toContain('text-indigo-800');
  });

  it('回复类型应该有正确的标签和颜色', () => {
    const replyConfig = taskTypeConfig.REPLY;
    expect(replyConfig.label).toBe('回复');
    expect(replyConfig.color).toContain('bg-emerald-100');
    expect(replyConfig.color).toContain('text-emerald-800');
  });

  it('润色类型应该有正确的标签和颜色', () => {
    const polishingConfig = taskTypeConfig.POLISHING;
    expect(polishingConfig.label).toBe('润色');
    expect(polishingConfig.color).toContain('bg-amber-100');
    expect(polishingConfig.color).toContain('text-amber-800');
  });

  it('颜色应该包含暗色模式样式', () => {
    Object.values(taskTypeConfig).forEach(config => {
      expect(config.color).toContain('dark:');
    });
  });
});
