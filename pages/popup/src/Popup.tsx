import '@src/Popup.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { apiKeyStorage, inputTextStorage, replyStorage } from '@extension/storage';
import { useEffect, useState, type ChangeEvent, type ClipboardEvent } from 'react';
import OpenAI from 'openai';
import { PROMPT, rolePrompt } from './utils/tts';
import { useStorage } from '@extension/shared';
import { Reply } from '@src/components/Reply';
import { Button } from '@src/components/ui/button';
import { cn } from '@src/lib/utils';
import { Header } from '@src/components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { Textarea } from '@src/components/ui/textarea';
import { isLikelyEmail } from './utils/emailDetection';
import { Switch } from './components/ui/switch';
import { Label } from './components/ui/label';
import { Progress } from './components/ui/progress';
import { Input } from './components/ui/input';

const isDev = import.meta.env.MODE === 'development';

const Popup = () => {
  const apiKeyFromStorage = useStorage(apiKeyStorage);
  const inputTextFromStorage = useStorage(inputTextStorage);
  const replyFromStorage = useStorage(replyStorage);

  const [apiKey, setApiKey] = useState(apiKeyFromStorage);
  const [subject, setSubject] = useState('');
  const [inputText, setInputText] = useState(inputTextFromStorage);
  const [reply, setReply] = useState(replyFromStorage);

  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEmailContent, setIsEmailContent] = useState(true);
  const [autoSubject, setAutoSubject] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [progress, setProgress] = useState(0);

  const [expandedSection, setExpandedSection] = useState<PROMPT | null>(null);

  useEffect(() => {
    if (!apiKeyFromStorage) {
      setApiKey(isDev ? import.meta.env.VITE_OPENAI_API_KEY : '');
    }
    if (inputTextFromStorage && replyFromStorage) {
      setIsGenerated(true);
      setExpandedSection(PROMPT.JAPANESE_REPLY);
    }
  }, []);
  console.log(progress);
  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setProgress(oldProgress => {
          const newProgress = Math.min(oldProgress + 10, 100);
          if (newProgress === 100) {
            clearInterval(timer);
          }
          return newProgress;
        });
      }, 800);
      return () => clearInterval(timer);
    }
    return;
  }, [isLoading]);

  useEffect(() => {
    apiKeyStorage.set(apiKey);
    inputTextStorage.set(inputText);
    replyStorage.set(reply);
  }, [apiKey, subject, inputText, reply]);

  const handleReply = async () => {
    if (!apiKey) {
      setIsOpen(true);
      return;
    }
    if (!inputText) {
      return;
    }
    setIsGenerated(false);
    setIsLoading(true);
    setProgress(0);

    const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: 'user', content: rolePrompt(inputText.trim(), subject.trim()) }],
      model: 'gpt-4o-mini',
      temperature: 0.7,
    });

    setReply(chatCompletion.choices[0]?.message?.content || '');

    setIsGenerated(true);
    setIsLoading(false);
    setExpandedSection(PROMPT.JAPANESE_REPLY);
    setProgress(100);
  };

  const handleSetApiKey = (e: ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };
  const handleSetSubject = (e: ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };
  const handleInputTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };
  const handleInputTextClear = () => {
    setInputText('');
    setSubject('');
    setReply('');
    setAutoSubject(true);
    setIsGenerated(false);
    setExpandedSection(null);
  };
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
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
      className={cn(
        'w-[300px] h-[400px] p-2 flex flex-col space-y-2 text-sm transition-colors duration-300',
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black',
      )}
    >
      <Header
        darkMode={darkMode}
        apiKey={apiKey}
        isOpen={isOpen}
        handleToggleDarkMode={handleToggleDarkMode}
        handleSetApiKey={handleSetApiKey}
        setIsOpen={setIsOpen}
      />

      <div className="flex-grow flex flex-col space-y-2 overflow-hidden">
        <div className="relative flex-grow">
          <Textarea
            placeholder="元の日本語メールを入力してください"
            value={inputText}
            disabled={isLoading}
            onChange={handleInputTextChange}
            onPaste={handleOnPaste}
            className="h-full pr-8 resize-none text-xs scrollbar-custom"
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
          <div className="text-yellow-500 flex items-center text-xs">
            <AlertTriangle className="h-3 w-3 mr-1" />
            これはメールの内容ではない可能性があります。正しいテキストを貼り付けたか確認してください。
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              disabled={isLoading}
              id="auto-subject"
              checked={autoSubject}
              onCheckedChange={handleSetAutoSubject}
            />
            <Label htmlFor="auto-subject" className="text-xs">
              件名を自動生成
            </Label>
          </div>
          <Button
            onClick={handleReply}
            disabled={isLoading || !inputText.trim()}
            className="relative overflow-hidden h-7 text-xs bg-green-500 text-white hover:bg-green-600"
          >
            {isLoading ? <span>生成中...</span> : <span>返信を生成</span>}
            {isLoading && <Progress value={progress} className="absolute bottom-0 left-0 right-0 h-1" />}
          </Button>
        </div>

        {!autoSubject && (
          <Input
            placeholder="メールの件名を入力してください"
            value={subject}
            onChange={handleSetSubject}
            className="text-xs"
          />
        )}

        <Reply
          replyOrigin={reply}
          isGenerated={isGenerated}
          expandedSection={expandedSection}
          setExpandedSection={setExpandedSection}
        />
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
