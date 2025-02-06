import { describe, test, expect } from 'vitest';
import { isLikelyEmail } from './email.detection';

describe('isLikelyEmail', () => {
  test('短文本', () => {
    expect(isLikelyEmail('你好')).toBe(false);
    expect(isLikelyEmail('')).toBe(false);
  });

  test('包含常见中文问候和邮件关键字', () => {
    const cnEmail = `
      尊敬的客户，
      From: admin@example.com
      这是测试邮件内容，谢谢配合。
    `;
    expect(isLikelyEmail(cnEmail)).toBe(true);
  });

  test('包含常见英文问候和邮件关键字', () => {
    const enEmail = `
      Dear John,
      Subject: Meeting Notice
      Thank you for your time.
      Regards,
      Jane
    `;
    expect(isLikelyEmail(enEmail)).toBe(true);
  });

  test('包含常见日文问候和邮件关键字', () => {
    const jpEmail = `
      お世話になっております。
      差出人: tanaka@example.com
      件名: テストメール
      敬具
    `;
    expect(isLikelyEmail(jpEmail)).toBe(true);
  });

  test('仅包含邮件关键字但无问候', () => {
    const noGreeting = 'Subject: Just text...';
    expect(isLikelyEmail(noGreeting)).toBe(false);
  });

  test('仅包含问候但无关键字', () => {
    const noKeywords = '尊敬的领导，您好。';
    expect(isLikelyEmail(noKeywords)).toBe(false);
  });

  test('混合无关文本', () => {
    const mixed = '这是一个和邮件无关的普通文本 Dear.';
    expect(isLikelyEmail(mixed)).toBe(false);
  });
});
