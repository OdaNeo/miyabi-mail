import { useStorage } from '@extension/shared';
import { apiKeyStorage, darkModeStorage, inputTextStorage, replyStorage, translationStorage } from '@extension/storage';
import { useExpandedSectionStore } from '@/store/expandedSectionStore';
import { useGeneratedStore } from '@/store/generatedStore';
import { useEffect } from 'react';

export const useInitial = () => {
  const apiKey = useStorage(apiKeyStorage);
  const darkMode = useStorage(darkModeStorage);
  const inputTextFromStorage = useStorage(inputTextStorage);
  const translation = useStorage(translationStorage);
  const reply = useStorage(replyStorage);

  const { setIsGenerated } = useGeneratedStore();
  const { setExpandedSection } = useExpandedSectionStore();

  const isDev = import.meta.env.MODE === 'development';

  useEffect(() => {
    if (!apiKey) {
      apiKeyStorage.set(isDev ? import.meta.env.VITE_OPENAI_API_KEY : '');
    }
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (inputTextFromStorage) {
      if (translation) {
        setIsGenerated(true);
        setExpandedSection('TRANSLATION');
      } else if (reply) {
        setIsGenerated(true);
        setExpandedSection('REPLY');
      }
    }
  }, []);
};
