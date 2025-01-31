import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@src/components/ui/tooltip';
import { Button } from '@src/components/ui/button';
import { Settings, Sun, Moon, AlertTriangle, EyeOff, Eye, Copy, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@src/components/ui/popover';
import { useRef, useState } from 'react';
import { Input } from '@src/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useStorage } from '@extension/shared';
import { apiKeyStorage, apiVersionStorage, darkModeStorage } from '@extension/storage';
import type React from 'react';
import { useOpenStore } from '@src/store/openStore';

export function Header() {
  const darkMode = useStorage(darkModeStorage);
  const apiKey = useStorage(apiKeyStorage);

  const { isOpen, setIsOpen } = useOpenStore();

  const [showKey, setShowKey] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const apiVersion = useStorage(apiVersionStorage);

  const handleToggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    darkModeStorage.set(!darkMode);
  };

  const handleClosePopover = () => {
    setIsOpen(false);
  };
  const handleTogglePopover = () => {
    setIsOpen(!isOpen);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const clipboardData = e.clipboardData;
    if (clipboardData) {
      const pastedData = clipboardData.getData('text');
      apiKeyStorage.set(pastedData);
    }
  };

  const handleInputClick = () => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
  };

  const handleDelete = () => {
    apiKeyStorage.set('');
  };

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">雅返信</h2>
      <div className="flex space-x-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="w-6 h-6 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                onClick={handleToggleDarkMode}
              >
                {darkMode ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-700 text-slate-100 dark:bg-slate-200 dark:text-slate-800">
              <p>{darkMode ? '切换到亮色模式' : '切换到暗色模式'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              onClick={handleTogglePopover}
              variant="outline"
              size="icon"
              className="w-6 h-6 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <Settings className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <div className="space-y-2">
              <h3 className="font-medium text-slate-800 dark:text-slate-200">設定 OpenAI API Key</h3>
              {!apiKey && (
                <div className="text-red-500 flex items-center text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  APIキーを設定してください。
                </div>
              )}
              <div className="relative">
                <Input
                  ref={inputRef}
                  type={showKey ? 'text' : 'password'}
                  placeholder="OpenAI API Key"
                  value={apiKey}
                  readOnly
                  onPaste={handlePaste}
                  onClick={handleInputClick}
                  className="pr-20 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 cursor-pointer"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:text-slate-900"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  {apiKey && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-500 hover:text-slate-900"
                      onClick={handleCopyKey}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <Select value={apiVersion} onValueChange={apiVersionStorage.set}>
                <SelectTrigger className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  <SelectValue placeholder="Select API Version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o-mini">GPT-4o-mini</SelectItem>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="o1-mini">GPT-o1-mini</SelectItem>
                  <SelectItem value="o1">GPT-o1</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  disabled={!apiKey}
                  className="flex-1 bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-slate-300 dark:disabled:bg-slate-700"
                  onClick={handleClosePopover}
                >
                  保存
                </Button>
                {apiKey && (
                  <Button variant="destructive" size="icon" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
