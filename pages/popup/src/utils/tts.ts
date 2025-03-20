import { LANGUAGES } from '@/const/language';
import { detectLanguage } from './language';

export const PROMPT_TEMPLATES = {
  POLISHING: () => '你的任务是润色这段文本，文本内容如下：',
  TRANSLATION: (language: string) => `你的任务是翻译成${language}，内容如下：`,
  REPLY: (language: string) => `你的任务是回复用${language}这封邮件，邮件内容如下：`,
};

export type PROMPT_KEYS = keyof typeof PROMPT_TEMPLATES;

export const rolePrompt = (content: string, promptKey: PROMPT_KEYS, targetLanguage?: string, main_idea?: string) => {
  const detectedLanguage = detectLanguage(content) === 'unknown' ? '' : detectLanguage(content);

  const language = LANGUAGES.find(n => n.value === targetLanguage)?.label || '中文';

  const promptText = PROMPT_TEMPLATES[promptKey](language);

  const mainIdeaText = main_idea ? `邮件的主要内容在简体中文中的意思是：\n\n${main_idea}\n\n` : '';

  return `
    你是一个${detectedLanguage}语言专家，请务必认真，准确地执行任务。不要有多余的话语，不要有任何拼写错误。${promptText}\n\n
    ${content}\n\n
    ${mainIdeaText}\n\n
  `.trim();
};
