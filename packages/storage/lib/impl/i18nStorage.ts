import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';

export enum I18nLanguage {
  EN = 'en',
  JA = 'ja',
  CN = 'cn',
}

class LanguageNode {
  value: string;
  next: LanguageNode | null;

  constructor(value: I18nLanguage) {
    this.value = value;
    this.next = null;
  }
}

class LanguageList {
  head: LanguageNode;

  constructor() {
    const zh = new LanguageNode(I18nLanguage.CN);
    const ja = new LanguageNode(I18nLanguage.JA);
    const en = new LanguageNode(I18nLanguage.EN);

    zh.next = ja;
    ja.next = en;
    en.next = zh;

    this.head = zh;
  }
}

const languageList = new LanguageList();

const storage = createStorage<LanguageNode>('i18n-key', languageList.head, {
  storageEnum: StorageEnum.Local,
  liveUpdate: false,
});

export const i18nStorage = {
  ...storage,
  next: async () => {
    await storage.set(currentLanguage => {
      return currentLanguage.next!;
    });
  },
};
