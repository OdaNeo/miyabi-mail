import { i18nStorage } from '@extension/storage';
import { useStorage } from '@extension/shared';
import { useEffect, useState } from 'react';

export enum I18n {
  ORIGINAL_TRANSLATION = 'ORIGINAL_TRANSLATION',
  REPLY = 'REPLY',
  COPY = 'COPY',
  COPIED = 'COPIED',
  PASTE_API_KEY = 'PASTE_API_KEY',
  IS_NOT_MAIL_CONTEST = 'IS_NOT_MAIL_CONTEST',
  GENERATE_SUBJECT = 'GENERATE_SUBJECT',
  INPUT_PLACEHOLDER = 'INPUT_PLACEHOLDER',
  IS_POLISHING = 'IS_POLISHING',
  POLISH = 'POLISH',
  TRANSLATION = 'TRANSLATION',
  IS_TRANSLATING = 'IS_TRANSLATING',
  IS_GENERATING = 'IS_GENERATING',
  GENERATE = 'GENERATE',
  INPUT_SUBJECT = 'INPUT_SUBJECT',
  CHANGE_TO_LIGHT = 'CHANGE_TO_LIGHT',
  CHANGE_TO_DARK = 'CHANGE_TO_DARK',
  API_KEY_SETTING = 'API_KEY_SETTING',
  PLEASE_SET_API_KEY = 'PLEASE_SET_API_KEY',
  SAVE = 'SAVE',
  CHANGE_LANGUAGE = 'CHANGE_LANGUAGE',
}

export const useI18n = () => {
  const lang = useStorage(i18nStorage);

  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    import(`../i18n/${lang.value}.json`)
      .then(module => setTranslations(module.default))
      .catch(() => import('../i18n/cn.json').then(fallback => setTranslations(fallback.default)));
  }, [lang.value]);

  return translations;
};
