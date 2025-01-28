export enum PROMPT {
  ORIGIN = '原邮件逐字逐句翻译成简体中文的意思是：',
  REPLY = '你用日文的回复是：',
  RESULT = '你回复的日文邮件在简体中文的意思是：',
}

export const rolePrompt = (content: string, main_idea?: string) => {
  return (
    `
  你是一个日语语言专家，你的任务是回复日语邮件，邮件内容如下：\n\n
  ${content}\n\n
  ` +
    (main_idea ? `邮件的主要内容在简体中文中的意思是：\n\n${main_idea}\n\n` : '') +
    `
  请务必严格按照下面格式回复邮件：\n\n
  ${PROMPT.ORIGIN}\n\n
  ${PROMPT.REPLY}\n\n
  ${PROMPT.RESULT}
  `
  );
};

export function splitByPrompts(text: string): {
  origin: string;
  reply: string;
  result: string;
} {
  const originStart = text.indexOf(PROMPT.ORIGIN);
  const replyStart = text.indexOf(PROMPT.REPLY);
  const resultStart = text.indexOf(PROMPT.RESULT);

  if (originStart === -1 || replyStart === -1 || resultStart === -1) {
    return { origin: '', reply: '', result: '' };
  }

  const origin = text.substring(originStart + PROMPT.ORIGIN.length, replyStart).trim();
  const reply = text.substring(replyStart + PROMPT.REPLY.length, resultStart).trim();
  const result = text.substring(resultStart + PROMPT.RESULT.length).trim();

  return { origin, reply, result };
}
