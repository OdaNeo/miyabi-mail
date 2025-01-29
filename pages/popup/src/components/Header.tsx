import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@src/components/ui/tooltip';
import { Button } from '@src/components/ui/button';
import { Settings, Sun, Moon, AlertTriangle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@src/components/ui/popover';
import type { ChangeEvent } from 'react';
import { Input } from '@src/components/ui/input';

export function Header({
  darkMode,
  apiKey,
  isOpen,
  handleToggleDarkMode,
  handleSetApiKey,
  setIsOpen,
}: {
  darkMode: boolean;
  apiKey: string;
  isOpen: boolean;
  handleToggleDarkMode: () => void;
  handleSetApiKey: (e: ChangeEvent<HTMLInputElement>) => void;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const handleClosePopover = () => {
    setIsOpen(false);
  };
  const handleTogglePopover = () => {
    setIsOpen(!isOpen);
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
              <Input
                type="password"
                placeholder="OpenAI API Key"
                value={apiKey}
                onChange={handleSetApiKey}
                className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400"
              />
              <Button
                disabled={!apiKey}
                className="w-full bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-slate-300 dark:disabled:bg-slate-700"
                onClick={handleClosePopover}
              >
                保存
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
