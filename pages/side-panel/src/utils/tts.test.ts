import { describe, it, expect, vi, beforeEach } from 'vitest';
import { rolePrompt, PROMPT_TEMPLATES } from './tts';

describe('rolePrompt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该生成润色提示文本', () => {
    const content = 'テストコンテンツ';
    const result = rolePrompt(content, 'POLISHING');

    expect(result).toContain('你是一个语言专家');
    expect(result).toContain(PROMPT_TEMPLATES.POLISHING());
    expect(result).toContain(content);
  });

  it('应该生成翻译提示文本（带目标语言）', () => {
    const content = 'Test content';
    const result = rolePrompt(content, 'TRANSLATION', 'ja-JP');

    expect(result).toContain('你是一个语言专家');
    expect(result).toContain('你的任务是翻译成日本語');
    expect(result).toContain(content);
  });

  it(`应该生成回复带目标语言`, () => {
    const content = 'Test content';
    const result = rolePrompt(content, 'REPLY', 'fr-FR');

    expect(result).toContain('你是一个语言专家');
    expect(result).toContain('你的任务是回复用Français这封邮件，邮件内容如下：');
    expect(result).toContain(content);
  });

  it('应该生成回复提示文本（带主要意图）', () => {
    const content = '测试内容';
    const mainIdea = '这是一封测试邮件';
    const result = rolePrompt(content, 'REPLY', 'zh-CN', mainIdea);

    expect(result).toContain('你是一个语言专家');
    expect(result).toContain(`你的任务是回复用中文这封邮件，邮件内容如下：`);
    expect(result).toContain(content);
    expect(result).toContain(mainIdea);
  });
});
