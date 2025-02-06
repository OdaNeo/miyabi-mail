import { describe, expect, test } from 'vitest';
import { detectLanguage, Language } from './language.detection';

describe('detectLanguage', () => {
  test('空文本返回 unknown', () => {
    expect(detectLanguage('')).toBe('unknown');
    expect(detectLanguage('     ')).toBe('unknown');
  });

  test('仅中文文本', () => {
    expect(detectLanguage('你好，世界')).toBe(Language.CN);
    expect(detectLanguage('中文测试')).toBe(Language.CN);
  });

  test('仅英文文本', () => {
    expect(detectLanguage('Hello world')).toBe(Language.EN);
    expect(detectLanguage('test TEST')).toBe(Language.EN);
  });

  test('仅日文文本', () => {
    expect(detectLanguage('こんにちは')).toBe(Language.JP);
    expect(detectLanguage('おはようございます')).toBe(Language.JP);
  });

  test('混合文本：中英', () => {
    expect(detectLanguage('你好 你好你好 Hello 世界')).toBe(Language.CN);
    expect(detectLanguage('Hello Hello 你好')).toBe(Language.EN);
  });

  test('混合文本：中日', () => {
    expect(detectLanguage('你好 你好 你好 你好 你好 你好 お')).toBe(Language.CN);
    expect(detectLanguage('おはよう 你好 ありがとうございました')).toBe(Language.JP);
  });

  test('混合文本：英日', () => {
    expect(detectLanguage('Hello おはよう world')).toBe(Language.EN);
    expect(detectLanguage('おはよう world こんにちは')).toBe(Language.JP);
  });

  test('没有中英日字符', () => {
    expect(detectLanguage('12345 ,.!@#$')).toBe('unknown');
    expect(detectLanguage('🙂👍🔥💯')).toBe('unknown');
  });

  test('should handle texts with special characters', () => {
    expect(detectLanguage('Résumé and café are English words with accents')).toBe(Language.EN);
    expect(detectLanguage('中文也有特殊字符：【】、；：\'\'"""')).toBe(Language.CN);
  });
});
