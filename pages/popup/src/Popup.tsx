import '@src/Popup.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { apiKeyStorage, mainIdeaStorage, inputTextStorage, replyStorage } from '@extension/storage';
import { useEffect, useState, type ChangeEvent } from 'react';
import OpenAI from 'openai';
import { rolePrompt } from './utils/tts';
import { useStorage } from '@extension/shared';
import { Reply } from './component/Reply';

const isDev = import.meta.env.MODE === 'development';

const Popup = () => {
  const apiKeyFromStorage = useStorage(apiKeyStorage);
  const mainIdeaFromStorage = useStorage(mainIdeaStorage);
  const inputTextFromStorage = useStorage(inputTextStorage);
  const replyFromStorage = useStorage(replyStorage);

  const [apiKey, setApiKey] = useState(apiKeyFromStorage);
  const [mainIdea, setMainIdea] = useState(mainIdeaFromStorage);
  const [inputText, setInputText] = useState(inputTextFromStorage);
  const [reply, setReply] = useState(replyFromStorage);

  useEffect(() => {
    if (!apiKeyFromStorage) {
      setApiKey(isDev ? import.meta.env.VITE_OPENAI_API_KEY : '');
    }
  }, []);

  useEffect(() => {
    apiKeyStorage.set(apiKey);
    mainIdeaStorage.set(mainIdea);
    inputTextStorage.set(inputText);
    replyStorage.set(reply);
  }, [apiKey, mainIdea, inputText, reply]);

  const handleReply = async () => {
    if (!apiKey || !inputText) return;

    const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: 'user', content: rolePrompt(inputText.trim(), mainIdea.trim()) }],
      model: 'gpt-4o-mini',
      temperature: 0.7,
    });

    setReply(chatCompletion.choices[0]?.message?.content || '');
  };

  const handleSetApiKey = (e: ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };
  const handleSetMainIdea = (e: ChangeEvent<HTMLInputElement>) => {
    setMainIdea(e.target.value);
  };
  const handleInputTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  return (
    <div className="p-4 w-full max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">雅返信</h1>
      <input
        type="password"
        className="w-full border rounded p-2"
        placeholder="输入你的OpenAI API Key"
        value={apiKey}
        onChange={handleSetApiKey}
      />
      <input
        type="text"
        className="w-full border rounded p-2"
        placeholder="输入你的邮件主旨(可选)"
        value={mainIdea}
        onChange={handleSetMainIdea}
      />
      <textarea
        className="w-full border rounded p-2"
        placeholder="在此输入日文邮件"
        rows={10}
        value={inputText}
        onChange={handleInputTextChange}
      />
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={handleReply}>
        生成回复
      </button>
      {reply && <Reply replyOrigin={reply} />}
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
