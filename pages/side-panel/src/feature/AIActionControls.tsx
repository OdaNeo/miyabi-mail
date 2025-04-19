import { Button, Progress, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@extension/ui';
import { Languages, Wand2Icon } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { rolePrompt } from '../utils/tts';
import { useProgress } from '../hooks/useProgress';
import { useGeneratedStore } from '../store/generatedStore';
import { useExpandedSectionStore } from '../store/expandedSectionStore';
import {
  apiVersionStorage,
  languageStorage,
  replyStorage,
  temperatureStorage,
  translationStorage,
} from '@extension/storage';
import { useReplyLoading } from '@/store/replyLoadingStore';
import { useTranslationLoading } from '@/store/translationLoadingStore';
import { usePolishingLoading } from '@/store/polishingLoadingStore';
import { useStorage } from '@extension/shared';
import { LANGUAGES } from '@/const/language';
import { addTaskRecord } from '@/db/taskRecordsRepository';
import { TaskHistoryMapper } from '@/db/Dto';

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

  const apiVersion = useStorage(apiVersionStorage);
  const temperature = useStorage(temperatureStorage);

  const handleReply = () => {
    const createTime = new Date().toISOString();
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
        addTaskRecord(
          TaskHistoryMapper.toEntity({
            inputText,
            language,
            promptKey: 'REPLY',
            apiVersion,
            temperature,
            subject,
            result: content,
            createTime,
            completedTime: new Date().toISOString(),
          }),
        );
      },
    });
  };

  const handleTranslation = () => {
    const createTime = new Date().toISOString();
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
        addTaskRecord(
          TaskHistoryMapper.toEntity({
            inputText,
            language,
            promptKey: 'TRANSLATION',
            apiVersion,
            temperature,
            result: content,
            createTime,
            completedTime: new Date().toISOString(),
          }),
        );
      },
    });
  };

  const handlePolishing = () => {
    const createTime = new Date().toISOString();
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
        addTaskRecord(
          TaskHistoryMapper.toEntity({
            inputText,
            language,
            promptKey: 'POLISHING',
            apiVersion,
            temperature,
            result: content,
            createTime,
            completedTime: new Date().toISOString(),
          }),
        );
      },
    });
  };

  return (
    <div
      className="flex items-center px-5 py-3 border-t border-[#e5e7eb] dark:border-[#2e3238] bg-[#f3f4f6] dark:bg-[#23252b]"
      onClick={handleOnClick}
    >
      <Select disabled={isLoading} value={language} onValueChange={languageStorage.set}>
        <SelectTrigger className="w-26 h-9 rounded-md border-[#e5e7eb] dark:border-[#2e3238] bg-white dark:bg-[#1f2128]">
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
        className="relative ml-2 h-9 px-3 text-ms
          bg-slate-200 dark:bg-slate-700 hover:bg-[#f9fafb] dark:hover:bg-[#2e3238]"
      >
        <Wand2Icon className="h-4 w-4 text-[#8b5cf6] dark:text-[#a78bfa] opacity-80" />
        {isPolishingLoading ? <span>{IS_POLISHING}</span> : <span>{POLISH}</span>}
        {isPolishingLoading && (
          <Progress
            value={polishingProgress}
            className="absolute bottom-0 left-0 right-0 h-1 bg-[#e5e7eb] dark:bg-[#2e3238]"
            indicatorClassName="bg-[#8b5cf6] dark:bg-[#a78bfa]"
          />
        )}
      </Button>
      <Button
        onClick={handleTranslation}
        disabled={isLoading || !inputText?.trim()}
        className="relative ml-2 h-9 px-3 text-ms
          bg-slate-200 dark:bg-slate-700 hover:bg-[#f9fafb] dark:hover:bg-[#2e3238]"
      >
        <Languages className="h-4 w-4 text-[#8b5cf6] dark:text-[#a78bfa] opacity-80" />
        {isTranslationLoading ? <span>{IS_TRANSLATING}</span> : <span>{TRANSLATION}</span>}
        {isTranslationLoading && (
          <Progress
            value={translationProgress}
            className="absolute bottom-0 left-0 right-0 h-1 bg-[#e5e7eb] dark:bg-[#2e3238]"
            indicatorClassName="bg-[#8b5cf6] dark:bg-[#a78bfa]"
          />
        )}
      </Button>
      <Button
        onClick={handleReply}
        data-testid="reply-button"
        disabled={isLoading || !inputText?.trim()}
        className="relative overflow-hidden ml-2 h-9 px-3 text-ms text-white font-normal
          rounded-md shadow-sm hover:shadow
          bg-[#8b5cf6] hover:bg-[#7c3aed] dark:bg-[#a78bfa] dark:hover:bg-[#9061f9]"
      >
        {isReplyLoading ? <span>{IS_GENERATING}</span> : <span>{GENERATE}</span>}
        {isReplyLoading && (
          <Progress
            value={replyProgress}
            className="absolute bottom-0 left-0 right-0 h-1 bg-[#8b5cf6] dark:bg-[#a78bfa]"
            indicatorClassName="bg-[#e5e7eb] dark:bg-[#2e3238]"
          />
        )}
      </Button>
    </div>
  );
}
