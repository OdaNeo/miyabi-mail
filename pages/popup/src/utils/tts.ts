enum PROMPT {
  ORIGIN = '原邮件逐字逐句翻译成中文的意思是：',
  REPLY = '你用日文的回复是：',
  RESULT = '你回复的日文邮件在中文的意思是：',
}

export const rolePrompt = (content: string) => {
  return `
  你是一个日语语言专家，你的任务是回复日语邮件，邮件内容如下：\n\n
  ${content}\n\n
  请务必严格按照下面格式回复邮件：\n\n
  ${PROMPT.ORIGIN}\n\n
  ${PROMPT.REPLY}\n\n
  ${PROMPT.RESULT}
  `;
};
