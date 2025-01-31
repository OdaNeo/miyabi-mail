export function isLikelyEmail(text: string): boolean {
  const japaneseHeaders = /(差出人|宛先|件名|日付|様)/im.test(text);

  const commonGreeting = /(お世話になっております|ご連絡ありがとうございます|いつもお世話になっております)/.test(text);
  const commonClosing = /(よろしくお願いいたします|何卒よろしくお願いいたします|敬具|以上)/.test(text);

  const totalChars = text.length;
  const japaneseChars = (text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g) || []).length;
  const ratio = totalChars > 0 ? japaneseChars / totalChars : 0;

  return ratio > 0.2 && (commonGreeting || commonClosing || japaneseHeaders);
}
