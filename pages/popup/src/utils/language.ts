export enum Language {
  EN = '英语',
  CN = '简体中文',
  JP = '日语',
}

export function detectLanguage(text: string): Language | unknown {
  if (!text.trim()) return 'unknown';

  const cnMatch = text.match(/[\u4E00-\u9FA5]/g) || [];
  const jpMatch = text.match(/[\u3040-\u309F\u30A0-\u30FF]/g) || [];
  const enMatch = text.match(/[A-Za-z]/g) || [];

  const cnCount = cnMatch.length;
  const jpCount = jpMatch.length;
  const enCount = enMatch.length;
  const sum = cnCount + jpCount + enCount;

  if (sum === 0) return 'unknown';

  const cnRatio = cnCount / sum;
  const jpRatio = jpCount / sum;
  const enRatio = enCount / sum;

  const maxRatio = Math.max(cnRatio, jpRatio, enRatio);
  if (maxRatio === cnRatio) return Language.CN;
  if (maxRatio === jpRatio) return Language.JP;
  if (maxRatio === enRatio) return Language.EN;

  return 'unknown';
}
