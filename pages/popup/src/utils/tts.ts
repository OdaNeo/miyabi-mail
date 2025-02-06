import { detectLanguage, Language } from './language';

export enum PROMPT {
  POLISHING = '你的任务是润色这段文本，文本内容如下：',
  TRANSLATION = '你的任务是翻译成简体中文，内容如下：',
  REPLY = '你的任务是回复这封邮件，邮件内容如下：',
}

export type PROMPT_KEYS = keyof typeof PROMPT;

export const rolePrompt = (content: string, prompt: PROMPT_KEYS, main_idea?: string) => {
  const detectedLanguage = detectLanguage(content) === 'unknown' ? '' : detectLanguage(content);

  let promptText: string = PROMPT[prompt];
  if (detectedLanguage === Language.CN && prompt === 'TRANSLATION') {
    promptText = `你的任务是翻译成日语，内容如下：`;
  }

  const mainIdeaText = main_idea ? `邮件的主要内容在简体中文中的意思是：\n\n${main_idea}\n\n` : '';

  return `
    你是一个${detectedLanguage}语言专家，${promptText}\n\n
    ${content}\n\n
    ${mainIdeaText}
    请务必认真，准确地执行任务。不要有多余的话语，不要有任何拼写错误。
  `.trim();
};
