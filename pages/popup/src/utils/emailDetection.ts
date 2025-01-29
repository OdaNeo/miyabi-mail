export function isLikelyEmail(text: string): boolean {
  const hasEmailHeaders = /^(差出人|宛先|件名|日付|様):/im.test(text);

  const hasEmailAddress = /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);

  const hasSignature = /(よろしくお願いします|敬具|以上)/m.test(text);

  const hasDateTime = /\d{4}年\d{1,2}月\d{1,2}日/.test(text);

  return [hasEmailHeaders, hasEmailAddress, hasSignature, hasDateTime].filter(Boolean).length >= 2;
}
