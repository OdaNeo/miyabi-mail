import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { rolePrompt, PROMPT_TEMPLATES } from './tts';
import { detectLanguage } from './language';

vi.mock('./language', () => ({
  detectLanguage: vi.fn(),
}));

describe('rolePrompt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该生成润色提示文本', () => {
    const mockDetectLanguage = detectLanguage as Mock;
    mockDetectLanguage.mockReturnValue('日语');

    const content = 'テストコンテンツ';
    const result = rolePrompt(content, 'POLISHING');

    expect(result).toContain('你是一个日语语言专家');
    expect(result).toContain(PROMPT_TEMPLATES.POLISHING());
    expect(result).toContain(content);
  });

  it('应该生成翻译提示文本（带目标语言）', () => {
    const mockDetectLanguage = detectLanguage as Mock;
    mockDetectLanguage.mockReturnValue('英语');

    const content = 'Test content';
    const result = rolePrompt(content, 'TRANSLATION', 'ja-JP');

    expect(result).toContain('你是一个英语语言专家');
    expect(result).toContain('你的任务是翻译成日本語');
    expect(result).toContain(content);
  });

  it(`应该生成回复带目标语言`, () => {
    const mockDetectLanguage = detectLanguage as Mock;
    mockDetectLanguage.mockReturnValue('简体中文');

    const content = 'Test content';
    const result = rolePrompt(content, 'REPLY', 'fr-FR');

    expect(result).toContain('你是一个简体中文语言专家');
    expect(result).toContain('你的任务是回复用Français这封邮件，邮件内容如下：');
    expect(result).toContain(content);
  });

  it('应该生成回复提示文本（带主要意图）', () => {
    const mockDetectLanguage = detectLanguage as Mock;
    mockDetectLanguage.mockReturnValue('简体中文');

    const content = '测试内容';
    const mainIdea = '这是一封测试邮件';
    const result = rolePrompt(content, 'REPLY', 'zh-CN', mainIdea);

    expect(result).toContain('你是一个简体中文语言专家');
    expect(result).toContain(`你的任务是回复用中文这封邮件，邮件内容如下：`);
    expect(result).toContain(content);
    expect(result).toContain(mainIdea);
  });

  it('当检测到未知语言时应处理正确', () => {
    const mockDetectLanguage = detectLanguage as Mock;
    mockDetectLanguage.mockReturnValue('unknown');

    const content = '???';
    const result = rolePrompt(content, 'POLISHING');

    expect(result).toContain('你是一个语言专家');
    expect(result).not.toContain('unknown');
  });
});
