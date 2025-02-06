export function isLikelyEmail(text: string): boolean {
  if (!text || text.trim().length < 10) return false;

  const cnRegex = /(尊敬的|你好|您好|谢谢|此致敬礼|敬上)/;
  const enRegex = /(Dear|Sincerely|Regards|Thank\syou)/i;
  const jpRegex = /(お世話になっております|いつもお世話になっております|よろしくお願いいたします|敬具)/;

  const mailKeywords = /(From:|To:|Subject:|差出人|宛先|件名|日付)/i;

  return (cnRegex.test(text) || enRegex.test(text) || jpRegex.test(text)) && mailKeywords.test(text);
}
