import { Button, Progress, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@extension/ui';
import { Languages, Wand2Icon } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { rolePrompt } from '../utils/tts';
import { useProgress } from '../hooks/useProgress';
import { useGeneratedStore } from '../store/generatedStore';
import { useExpandedSectionStore } from '../store/expandedSectionStore';
import { languageStorage, replyStorage, translationStorage } from '@extension/storage';
import { useReplyLoading } from '@/store/replyLoadingStore';
import { useTranslationLoading } from '@/store/translationLoadingStore';
import { usePolishingLoading } from '@/store/polishingLoadingStore';
import { useStorage } from '@extension/shared';
import { LANGUAGES } from '@/const/language';

export function AIActionControls({
  inputText,
  subject,
  setInputText,
  runOpenAIAction,
  handleOnClick,
}: {
  inputText: string;
  subject: string;
  setInputText: (text: string) => void;
  runOpenAIAction: ({
    prompt,
    onStart,
    onFinish,
    onSuccess,
  }: {
    prompt: string;
    onStart?: () => void;
    onFinish?: () => void;
    onSuccess?: (content: string) => void;
  }) => Promise<void>;
  handleOnClick: () => void;
}) {
  const { IS_POLISHING, POLISH, IS_TRANSLATING, TRANSLATION, IS_GENERATING, GENERATE } = useI18n();

  const language = useStorage(languageStorage);

  const { setIsGenerated } = useGeneratedStore();
  const { setExpandedSection } = useExpandedSectionStore();
  const { isReplyLoading, setIsReplyLoading } = useReplyLoading();
  const { isTranslationLoading, setIsTranslationLoading } = useTranslationLoading();
  const { isPolishingLoading, setIsPolishingLoading } = usePolishingLoading();

  const [replyProgress, setReplyProgress] = useProgress(isReplyLoading);
  const [translationProgress, setTranslationProgress] = useProgress(isTranslationLoading);
  const [polishingProgress, setPolishingProgress] = useProgress(isPolishingLoading);

  const isLoading = isReplyLoading || isTranslationLoading || isPolishingLoading;

  const handleReply = () => {
    runOpenAIAction({
      prompt: rolePrompt(inputText?.trim(), 'REPLY', language, subject?.trim()),
      onStart: () => {
        setIsGenerated(false), setIsReplyLoading(true), setReplyProgress(0);
      },
      onFinish: () => {
        setIsReplyLoading(false), setReplyProgress(0);
      },
      onSuccess: content => {
        setIsGenerated(true), replyStorage.set(content), setExpandedSection('REPLY');
      },
    });
  };

  const handleTranslation = () => {
    runOpenAIAction({
      prompt: rolePrompt(inputText?.trim(), 'TRANSLATION', language),
      onStart: () => {
        setIsGenerated(false), setIsTranslationLoading(true), setTranslationProgress(0);
      },
      onFinish: () => {
        setIsTranslationLoading(false), setTranslationProgress(0);
      },
      onSuccess: content => {
        setIsGenerated(true), translationStorage.set(content), setExpandedSection('TRANSLATION');
      },
    });
  };

  const handlePolishing = () => {
    runOpenAIAction({
      prompt: rolePrompt(inputText?.trim(), 'POLISHING'),
      onStart: () => {
        setIsGenerated(false), setIsPolishingLoading(true), setPolishingProgress(0);
      },
      onFinish: () => {
        setIsPolishingLoading(false), setPolishingProgress(0);
      },
      onSuccess: content => {
        setIsGenerated(false), setInputText(content), setExpandedSection(null);
      },
    });
  };

  return (
    <div className="flex items-center" onClick={handleOnClick}>
      <Select value={language} onValueChange={languageStorage.set}>
        <SelectTrigger className="w-32 h-8 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
          <SelectValue placeholder="选择语言" />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map(lang => (
            <SelectItem key={lang.value} value={lang.value} className="text-sm">
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex-1" />
      <Button
        onClick={handlePolishing}
        disabled={isLoading || !inputText?.trim()}
        className="relative overflow-hidden ml-2 h-8 px-3 text-ms
          bg-slate-200 hover:bg-slate-300 text-slate-900
          dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200"
      >
        <Wand2Icon className="h-4 w-4" />
        {isPolishingLoading ? <span>{IS_POLISHING}</span> : <span>{POLISH}</span>}
        {isPolishingLoading && (
          <Progress
            value={polishingProgress}
            className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-400 dark:bg-emerald-500"
          />
        )}
      </Button>
      <Button
        onClick={handleTranslation}
        disabled={isLoading || !inputText?.trim()}
        className="relative overflow-hidden ml-2 h-8 px-3 text-ms
          bg-slate-200 hover:bg-slate-300 text-slate-900
          dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200"
      >
        <Languages className="h-4 w-4" />
        {isTranslationLoading ? <span>{IS_TRANSLATING}</span> : <span>{TRANSLATION}</span>}
        {isTranslationLoading && (
          <Progress
            value={translationProgress}
            className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-400 dark:bg-emerald-500"
          />
        )}
      </Button>
      <Button
        onClick={handleReply}
        data-testid="reply-button"
        disabled={isLoading || !inputText?.trim()}
        className="relative overflow-hidden ml-2 h-8 px-3 text-ms
          bg-emerald-500 hover:bg-emerald-600 text-white
          dark:bg-emerald-600 dark:hover:bg-emerald-700"
      >
        {isReplyLoading ? <span>{IS_GENERATING}</span> : <span>{GENERATE}</span>}
        {isReplyLoading && (
          <Progress
            value={replyProgress}
            className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-300 dark:bg-emerald-400"
          />
        )}
      </Button>
    </div>
  );
}
