export enum PROMPT {
  TRANSLATION = '原邮件逐字逐句翻译成简体中文的意思是：',
  JAPANESE_REPLY = '你用日文的回复是：',
  REPLY_TRANSLATION = '你回复的日文邮件在简体中文的意思是：',
}

export const rolePrompt = (content: string, main_idea?: string) => {
  return (
    `
  你是一个日语语言专家，你的任务是回复日语邮件，除了邮件的部分，其他要用简体中文回复我，邮件内容如下：\n\n
  ${content}\n\n
  ` +
    (main_idea ? `邮件的主要内容在简体中文中的意思是：\n\n${main_idea}\n\n` : '') +
    `
  请务必严格按照下面格式回复邮件：\n\n
  ${PROMPT.TRANSLATION}\n\n
  ${PROMPT.JAPANESE_REPLY}\n\n
  ${PROMPT.REPLY_TRANSLATION}
  `
  );
};

export function splitByPrompts(text: string): {
  translation: string;
  japaneseReply: string;
  replyTranslation: string;
} {
  const translationStart = text.indexOf(PROMPT.TRANSLATION);
  const japaneseReplyStart = text.indexOf(PROMPT.JAPANESE_REPLY);
  const replyTranslationStart = text.indexOf(PROMPT.REPLY_TRANSLATION);

  if (translationStart === -1 || japaneseReplyStart === -1 || replyTranslationStart === -1) {
    return { translation: '', japaneseReply: '', replyTranslation: '' };
  }

  const translation = text.substring(translationStart + PROMPT.TRANSLATION.length, japaneseReplyStart).trim();
  const japaneseReply = text.substring(japaneseReplyStart + PROMPT.JAPANESE_REPLY.length, replyTranslationStart).trim();
  const replyTranslation = text.substring(replyTranslationStart + PROMPT.REPLY_TRANSLATION.length).trim();

  return { translation, japaneseReply, replyTranslation };
}
