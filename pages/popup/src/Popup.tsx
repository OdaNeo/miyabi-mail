import '@src/Popup.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import {
  apiKeyStorage,
  apiVersionStorage,
  inputTextStorage,
  replyStorage,
  translationStorage,
} from '@extension/storage';
import { useCallback, useEffect, useState, type ChangeEvent, type ClipboardEvent } from 'react';
import OpenAI, { APIConnectionError, APIError, RateLimitError } from 'openai';
import { rolePrompt } from './utils/tts';
import { useStorage } from '@extension/shared';
import { Reply } from '@src/components/Reply';
import { Button } from '@src/components/ui/button';
import { Header } from '@src/components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Languages, Wand2Icon } from 'lucide-react';
import { Textarea } from '@src/components/ui/textarea';
import { isLikelyEmail } from './utils/email';
import { Switch } from './components/ui/switch';
import { Label } from './components/ui/label';
import { Progress } from './components/ui/progress';
import { Input } from './components/ui/input';
import { useProgress } from './hooks/useProgress';
import { useOpenStore } from './store/openStore';
import { useGeneratedStore } from './store/generatedStore';
import { useExpandedSectionStore } from './store/expandedSectionStore';
import { useInitial } from './hooks/useInitial';

const Popup = () => {
  const apiKey = useStorage(apiKeyStorage);
  const inputTextFromStorage = useStorage(inputTextStorage);
  const apiVersion = useStorage(apiVersionStorage);

  const [subject, setSubject] = useState('');
  const [inputText, setInputText] = useState(inputTextFromStorage);

  const { setIsOpen } = useOpenStore();
  const { setIsGenerated } = useGeneratedStore();

  const [isEmailContent, setIsEmailContent] = useState(true);
  const [autoSubject, setAutoSubject] = useState(true);

  const [isReplyLoading, setIsReplyLoading] = useState(false);
  const [isTranslationLoading, setIsTranslationLoading] = useState(false);
  const [isPolishingLoading, setIsPolishingLoading] = useState(false);

  const isLoading = isReplyLoading || isTranslationLoading || isPolishingLoading;

  const [replyProgress, setReplyProgress] = useProgress(isReplyLoading);
  const [translationProgress, setTranslationProgress] = useProgress(isTranslationLoading);
  const [polishingProgress, setPolishingProgress] = useProgress(isPolishingLoading);

  const [errorMsg, setErrorMsg] = useState('');

  const { setExpandedSection } = useExpandedSectionStore();

  useInitial();

  useEffect(() => {
    inputTextStorage.set(inputText);
  }, [inputText]);

  const runOpenAIAction = useCallback(
    async ({
      prompt,
      onStart,
      onFinish,
      onSuccess,
    }: {
      prompt: string;
      onStart?: () => void;
      onFinish?: () => void;
      onSuccess?: (content: string) => void;
    }) => {
      if (!apiKey) {
        setIsOpen(true);
        return;
      }
      if (!inputText) {
        return;
      }
      setIsGenerated(false);
      setErrorMsg('');
      try {
        onStart?.();
        const client = new OpenAI({
          apiKey,
          dangerouslyAllowBrowser: true,
        });
        const resp = await client.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: apiVersion,
          temperature: 0.7,
        });
        onSuccess?.(resp.choices[0]?.message?.content || '');
      } catch (e: unknown) {
        if (e instanceof APIConnectionError) {
          setErrorMsg('Failed to connect to OpenAI API: ' + e.message);
        } else if (e instanceof RateLimitError) {
          setErrorMsg('OpenAI API request exceeded rate limit: ' + e.message);
        } else if (e instanceof APIError) {
          setErrorMsg('OpenAI API returned an API Error: ' + e.message);
        } else {
          setErrorMsg('An unknown error occurred:' + e);
        }
      } finally {
        onFinish?.();
      }
    },
    [apiKey, inputText, apiVersion],
  );

  const handleReply = () => {
    runOpenAIAction({
      prompt: rolePrompt(inputText?.trim(), 'REPLY', subject?.trim()),
      onStart: () => {
        setIsReplyLoading(true), setReplyProgress(0);
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
      prompt: rolePrompt(inputText?.trim(), 'TRANSLATION'),
      onStart: () => {
        setIsTranslationLoading(true), setTranslationProgress(0);
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
        setIsPolishingLoading(true), setPolishingProgress(0);
      },
      onFinish: () => {
        setIsPolishingLoading(false), setPolishingProgress(0);
      },
      onSuccess: content => {
        setIsGenerated(false), setInputText(content), setExpandedSection(null);
      },
    });
  };

  const handleSetSubject = (e: ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };
  const handleInputTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    setErrorMsg('');
  };
  const handleInputTextClear = () => {
    setInputText('');
    setSubject('');
    setErrorMsg('');
    replyStorage.set('');
    translationStorage.set('');
    setAutoSubject(true);
    setIsEmailContent(true);
    setIsGenerated(false);
    setExpandedSection(null);
  };

  const handleOnPaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData('text/plain');
    setIsEmailContent(isLikelyEmail(text));
  };
  const handleSetAutoSubject = (checked: boolean) => {
    setAutoSubject(checked);
    if (checked) {
      setSubject('');
    }
  };

  return (
    <div
      className="w-[500px] h-[400px] p-2 flex flex-col space-y-2 text-sm transition-colors duration-300 
    dark:bg-slate-900 dark:text-slate-100 bg-slate-50 text-slate-900"
    >
      <Header />

      {errorMsg && (
        <div className="text-red-500 flex items-center text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {errorMsg}
        </div>
      )}

      <div className="flex-grow flex flex-col space-y-2 overflow-hidden">
        <div className="relative flex-grow">
          <Textarea
            placeholder="元の日本語メールを入力してください"
            value={inputText}
            disabled={isLoading}
            onChange={handleInputTextChange}
            onPaste={handleOnPaste}
            className="h-full resize-none text-xs scrollbar-custom 
            dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 
            bg-white text-slate-900 placeholder-slate-500"
          />
          <AnimatePresence>
            {inputText && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute top-2 right-2 flex"
              >
                <Button
                  disabled={isLoading}
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6"
                  onClick={handleInputTextClear}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!isEmailContent && inputText && (
          <div className="flex items-center text-xs dark:text-amber-400 text-amber-500">
            <AlertTriangle className="h-3 w-3 mr-1" />
            これはメールの内容ではない可能性があります。
          </div>
        )}

        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <Switch
              disabled={isLoading}
              id="auto-subject"
              checked={autoSubject}
              onCheckedChange={handleSetAutoSubject}
            />
            <Label htmlFor="auto-subject" className="text-xs cursor-pointer">
              件名を自動生成
            </Label>
          </div>
          <div className="flex-1"></div>
          <Button
            onClick={handlePolishing}
            disabled={isLoading || !inputText.trim()}
            className="relative overflow-hidden ml-3 h-7 px-3 text-xs
            bg-slate-200 hover:bg-slate-300 text-slate-900
            dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200"
          >
            <Wand2Icon className="h-4 w-4" />
            {isPolishingLoading ? <span>洗練中...</span> : <span>文章を洗練</span>}
            {isPolishingLoading && (
              <Progress
                value={polishingProgress}
                className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-400 dark:bg-emerald-500"
              />
            )}
          </Button>
          <Button
            onClick={handleTranslation}
            disabled={isLoading || !inputText.trim()}
            className="relative overflow-hidden ml-3 h-7 px-3 text-xs
            bg-slate-200 hover:bg-slate-300 text-slate-900
            dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200"
          >
            <Languages className="h-4 w-4" />
            {isTranslationLoading ? <span>翻訳中...</span> : <span>翻訳</span>}
            {isTranslationLoading && (
              <Progress
                value={translationProgress}
                className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-400 dark:bg-emerald-500"
              />
            )}
          </Button>
          <Button
            onClick={handleReply}
            disabled={isLoading || !inputText.trim()}
            className="relative overflow-hidden ml-3 h-7 px-3 text-xs
            bg-emerald-500 hover:bg-emerald-600 text-white
            dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            {isReplyLoading ? <span>生成中...</span> : <span>返信を生成</span>}
            {isReplyLoading && (
              <Progress
                value={replyProgress}
                className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-300 dark:bg-emerald-400"
              />
            )}
          </Button>
        </div>

        {!autoSubject && (
          <Input
            placeholder="メールの件名を入力してください"
            value={subject}
            disabled={isLoading}
            onChange={handleSetSubject}
            className="text-xs dark:bg-slate-800 
            dark:text-slate-100 dark:placeholder-slate-400 bg-white text-slate-900 placeholder-slate-500"
          />
        )}

        <Reply />
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
