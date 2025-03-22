import { withErrorBoundary, withSuspense } from '@extension/shared';
import { inputTextStorage, replyStorage, translationStorage } from '@extension/storage';
import { useEffect, useState, type ChangeEvent, type ClipboardEvent } from 'react';
import { useStorage } from '@extension/shared';
import { Reply } from '@/feature/Reply';
import { Header } from '@/feature/Header';
import { AlertTriangle } from 'lucide-react';
import { isLikelyEmail } from './utils/email';
import { Input, Label, Switch } from '@extension/ui';
import { useGeneratedStore } from './store/generatedStore';
import { useExpandedSectionStore } from './store/expandedSectionStore';
import { useInitial } from './hooks/useInitial';
import { useI18n } from './hooks/useI18n';
import { useOpenAIAction } from './hooks/useOpenAIAction';
import { AIActionControls } from './feature/AIActionControls';
import { useReplyLoading } from './store/replyLoadingStore';
import { useTranslationLoading } from './store/translationLoadingStore';
import { usePolishingLoading } from './store/polishingLoadingStore';
import { TextInputArea } from './feature/TextInputArea';
import './Popup.css';
import { useHistoryOpenStore } from './store/historyOpenStore';
import { HistoryArea } from './feature/HistoryArea';

export const Popup = () => {
  const inputTextFromStorage = useStorage(inputTextStorage);

  const [subject, setSubject] = useState('');
  const [inputText, setInputText] = useState(inputTextFromStorage);

  const { setIsGenerated } = useGeneratedStore();

  const [isEmailContent, setIsEmailContent] = useState(true);
  const [autoSubject, setAutoSubject] = useState(true);

  const { isReplyLoading } = useReplyLoading();
  const { isTranslationLoading } = useTranslationLoading();
  const { isPolishingLoading } = usePolishingLoading();
  const { isHistoryOpen } = useHistoryOpenStore();

  const isLoading = isReplyLoading || isTranslationLoading || isPolishingLoading;

  const { setExpandedSection } = useExpandedSectionStore();

  useInitial();

  const [errorMsg, setErrorMsg, runOpenAIAction] = useOpenAIAction(inputText);

  const { IS_NOT_MAIL_CONTEST, GENERATE_SUBJECT, INPUT_SUBJECT } = useI18n();

  useEffect(() => {
    inputTextStorage.set(inputText);
  }, [inputText]);

  const handleSetSubject = (e: ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };
  const handleErrorMessagesClear = () => {
    setIsEmailContent(true);
    setErrorMsg('');
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

  const handleCopyText = () => {
    navigator.clipboard.writeText(inputText);
  };

  return (
    <div
      id="popup"
      className="flex flex-col
       bg-[#f9fafb] dark:bg-[#1a1c20] border-[#e5e7eb] dark:border-[#2e3238] 
       border overflow-hidden shadow-sm text-[#4b5563] dark:text-[#d1d5db]"
    >
      <Header />
      {isHistoryOpen ? (
        <HistoryArea />
      ) : (
        <>
          <div className="flex-grow flex-1 flex flex-col space-y-2 px-5 pt-5 pb-3 max-h-[calc(100vh-7.5rem)] overflow-y-auto overflow-x-hidden">
            <TextInputArea
              inputText={inputText}
              isLoading={isLoading}
              handleInputTextChange={handleInputTextChange}
              handleOnPaste={handleOnPaste}
              handleInputTextClear={handleInputTextClear}
              handleCopyText={handleCopyText}
            />

            <Reply data-testid="text-reply" />

            {errorMsg && (
              <div data-testid="error-msg" className="flex items-center text-red-500">
                <AlertTriangle className="h-3 w-3 mx-1" />
                {errorMsg}
              </div>
            )}
            {!isEmailContent && inputText && (
              <div data-testid="error-mail-content" className="flex items-center dark:text-amber-400 text-amber-500">
                <AlertTriangle className="h-3 w-3 mx-1" />
                {IS_NOT_MAIL_CONTEST}
              </div>
            )}

            <div className="flex items-center">
              <div
                className={`flex items-center space-x-2 shrink-0 mr-3 transition-all duration-300 ease-in-out ${autoSubject ? 'w-full' : 'w-36'}`}
              >
                <Switch
                  disabled={isLoading}
                  id="auto-subject"
                  data-testid="auto-subject-toggle"
                  checked={autoSubject}
                  className="data-[state=checked]:bg-[#8b5cf6] dark:data-[state=checked]:bg-[#a78bfa]"
                  onCheckedChange={handleSetAutoSubject}
                />
                <Label htmlFor="auto-subject" className="cursor-pointer whitespace-nowrap">
                  {GENERATE_SUBJECT}
                </Label>
              </div>
              <div
                className={`transition-all duration-300 ease-in-out ${autoSubject ? 'w-0 opacity-0' : 'w-full opacity-100'}`}
              >
                <Input
                  placeholder={INPUT_SUBJECT}
                  value={subject}
                  data-testid="subject-input"
                  disabled={isLoading}
                  onChange={handleSetSubject}
                  className="w-full text-sm dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 bg-white text-slate-900 placeholder-slate-500"
                />
              </div>
            </div>
          </div>

          <AIActionControls
            inputText={inputText}
            subject={subject}
            setInputText={setInputText}
            runOpenAIAction={runOpenAIAction}
            handleOnClick={handleErrorMessagesClear}
          />
        </>
      )}
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
