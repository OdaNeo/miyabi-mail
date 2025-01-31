export enum PROMPT {
  TRANSLATION = '你的任务是翻译成简体中文，翻译内容如下：',
  JAPANESE_REPLY = '你的任务是用日文回复邮件，邮件内容如下：',
}

export type PROMPT_KEYS = keyof typeof PROMPT;

export const rolePrompt = (content: string, prompt: PROMPT_KEYS, main_idea?: string) => {
  return (
    `
  你是一个日语语言专家，${PROMPT[prompt]}\n\n
  ${content}\n\n
  ` +
    (main_idea ? `邮件的主要内容在简体中文中的意思是：\n\n${main_idea}\n\n` : '') +
    `请务必认真，准确地回复或者翻译。`
  );
};
