import { describe, expect, test } from 'vitest';
import { isLikelyEmail } from './emailDetection';

describe('isLikelyEmail function', () => {
  test('识别典型日文邮件', () => {
    const emailText = 'お世話になっております。昨日の会議の件についてですが… よろしくお願いいたします。';
    expect(isLikelyEmail(emailText)).toBe(true);
  });

  test('日文字符比例不足，不被识别为邮件', () => {
    const shortText = 'こんにちは。你好，这是我们命名的测试文本，用汉语来填充不足的日文。';
    expect(isLikelyEmail(shortText)).toBe(false);
  });

  test('包含邮件头部信息', () => {
    const headerText = '件名: 会議について\nお世話になっております。';
    expect(isLikelyEmail(headerText)).toBe(true);
  });

  test('仅包含少量日文字符，不被识别', () => {
    const lowRatioText = 'Hello, これはテストです。';
    expect(isLikelyEmail(lowRatioText)).toBe(false);
  });

  test('识别正式日文邮件结尾', () => {
    const closingText = '何卒よろしくお願いいたします。\n敬具';
    expect(isLikelyEmail(closingText)).toBe(true);
  });

  test('纯英文文本不应被识别', () => {
    const englishText = 'Hello, how are you? Best regards.';
    expect(isLikelyEmail(englishText)).toBe(false);
  });

  test('纯符号或空文本', () => {
    expect(isLikelyEmail('')).toBe(false);
    expect(isLikelyEmail('?????')).toBe(false);
  });
});
