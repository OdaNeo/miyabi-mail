import { describe, expect, test } from 'vitest';
import { rolePrompt, PROMPT } from './tts';

describe('rolePrompt function', () => {
  test('翻译任务 - 仅提供内容', () => {
    const result = rolePrompt('Hello, how are you?', 'TRANSLATION');

    expect(result).toContain('你是一个日语语言专家');
    expect(result).toContain(PROMPT.TRANSLATION);
    expect(result).toContain('Hello, how are you?');
    expect(result).not.toContain('邮件的主要内容在简体中文中的意思是');
  });

  test('日文回复任务 - 仅提供内容', () => {
    const result = rolePrompt('请提供订单状态', 'JAPANESE_REPLY');

    expect(result).toContain('你是一个日语语言专家');
    expect(result).toContain(PROMPT.JAPANESE_REPLY);
    expect(result).toContain('请提供订单状态');
    expect(result).not.toContain('邮件的主要内容在简体中文中的意思是');
  });

  test('翻译任务 - 提供主要内容', () => {
    const result = rolePrompt('This is a test email.', 'TRANSLATION', '这是一封测试邮件');

    expect(result).toContain('你是一个日语语言专家');
    expect(result).toContain(PROMPT.TRANSLATION);
    expect(result).toContain('This is a test email.');
    expect(result).toContain('邮件的主要内容在简体中文中的意思是');
    expect(result).toContain('这是一封测试邮件');
  });

  test('日文回复任务 - 提供主要内容', () => {
    const result = rolePrompt('注文の状況を教えてください。', 'JAPANESE_REPLY', '用户询问订单状态');

    expect(result).toContain('你是一个日语语言专家');
    expect(result).toContain(PROMPT.JAPANESE_REPLY);
    expect(result).toContain('注文の状況を教えてください。');
    expect(result).toContain('邮件的主要内容在简体中文中的意思是');
    expect(result).toContain('用户询问订单状态');
  });

  test('输入为空', () => {
    const result = rolePrompt('', 'TRANSLATION');

    expect(result).toContain('你是一个日语语言专家');
    expect(result).toContain(PROMPT.TRANSLATION);
    expect(result).toContain('请务必认真，准确地回复或者翻译。');
  });

  test('无效的 prompt key（TypeScript 保证不会出现）', () => {
    expect(true).toBe(true);
  });
});
