import '@src/Popup.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { useState, type ChangeEvent } from 'react';
import OpenAI from 'openai';
import { rolePrompt } from './utils/tts';

const isDev = import.meta.env.MODE === 'development';

const Popup = () => {
  const [apiKey, setApiKey] = useState(isDev ? import.meta.env.VITE_OPENAI_API_KEY : '');
  const [inputText, setInputText] = useState('');
  const [reply, setReply] = useState('');

  const handleReply = async () => {
    if (!apiKey || !inputText) return;

    const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: 'user', content: rolePrompt(inputText) }],
      model: 'text-embedding-3-large',
      temperature: 0.7,
    });
    console.log(chatCompletion);

    setReply(chatCompletion.choices[0]?.message?.content || '');
  };

  const handleSetApiKey = (e: ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };
  const handleInputTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  return (
    <div className="p-4 w-full max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">OpenAI 日文邮件回复</h1>
      <input
        type="text"
        className="w-full border rounded p-2"
        placeholder="输入你的OpenAI API Key"
        value={apiKey}
        onChange={handleSetApiKey}
      />
      <textarea
        className="w-full border rounded p-2"
        placeholder="在此输入日文邮件"
        rows={5}
        value={inputText}
        onChange={handleInputTextChange}
      />
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={handleReply}>
        生成回复
      </button>
      {reply && <div className="mt-4 border p-2 rounded text-sm whitespace-pre-wrap">{reply}</div>}
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
