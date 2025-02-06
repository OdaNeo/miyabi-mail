import { describe, expect, test, vi } from 'vitest';
import { rolePrompt, PROMPT } from './tts';
import { Language } from './language.detection';

vi.mock('./language-detection', () => ({
  detectLanguage: vi.fn((text: string) => {
    if (text.includes('Hello')) return Language.EN;
    if (text.includes('你好')) return Language.CN;
    if (text.includes('こんにちは')) return Language.JP;
    return 'unknown';
  }),
  Language: {
    EN: '英语',
    CN: '简体中文',
    JP: '日语',
  },
}));

describe('rolePrompt function', () => {
  test('should generate correct prompt for English polishing', () => {
    const result = rolePrompt('Hello, how are you?', 'POLISHING');
    expect(result).toContain('你是一个英语语言专家');
    expect(result).toContain(PROMPT.POLISHING);
  });

  test('should generate correct prompt for Chinese translation', () => {
    const result = rolePrompt('你好，最近怎么样？', 'TRANSLATION');
    expect(result).toContain('你是一个简体中文语言专家');
    expect(result).toContain('你的任务是翻译成日语');
  });

  test('should generate correct prompt for Japanese reply', () => {
    const result = rolePrompt('こんにちは、お元気ですか？', 'REPLY');
    expect(result).toContain('你是一个日语语言专家');
    expect(result).toContain(PROMPT.REPLY);
  });

  test('should include main idea when provided', () => {
    const result = rolePrompt('Hello, how are you?', 'POLISHING', '这是一封问候邮件');
    expect(result).toContain('邮件的主要内容在简体中文中的意思是：');
    expect(result).toContain('这是一封问候邮件');
  });

  test('should handle unknown language', () => {
    const result = rolePrompt('12345', 'POLISHING');
    expect(result).toContain('你是一个语言专家');
  });

  test('should generate correct prompt for English translation', () => {
    const result = rolePrompt('Hello, how are you?', 'TRANSLATION');
    expect(result).toContain('你是一个英语语言专家');
    expect(result).toContain(PROMPT.TRANSLATION);
  });

  test('should generate correct prompt for Chinese polishing', () => {
    const result = rolePrompt('你好，最近怎么样？', 'POLISHING');
    expect(result).toContain('你是一个简体中文语言专家');
    expect(result).toContain(PROMPT.POLISHING);
  });

  test('should generate correct prompt for Japanese translation', () => {
    const result = rolePrompt('こんにちは、お元気ですか？', 'TRANSLATION');
    expect(result).toContain('你是一个日语语言专家');
    expect(result).toContain(PROMPT.TRANSLATION);
  });

  test('should handle empty string input', () => {
    const result = rolePrompt('', 'POLISHING');
    expect(result).toContain('你是一个语言专家');
    expect(result).toContain(PROMPT.POLISHING);
  });

  test('should include all necessary parts in the prompt', () => {
    const result = rolePrompt('Hello, how are you?', 'POLISHING', '这是一封问候邮件');
    expect(result).toContain('你是一个英语语言专家');
    expect(result).toContain(PROMPT.POLISHING);
    expect(result).toContain('Hello, how are you?');
    expect(result).toContain('这是一封问候邮件');
    expect(result).toContain('请务必认真，准确地执行任务。不要有多余的话语，不要有任何拼写错误。');
  });
});
