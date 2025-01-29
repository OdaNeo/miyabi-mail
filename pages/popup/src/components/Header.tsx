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
      <h2 className="text-base font-bold">雅返信</h2>
      <div className="flex space-x-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="w-6 h-6" onClick={handleToggleDarkMode}>
                {darkMode ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{darkMode ? '切换到亮色模式' : '切换到暗色模式'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button onClick={handleTogglePopover} variant="outline" size="icon" className="w-6 h-6">
              <Settings className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60">
            <div className="space-y-2">
              <h3 className="font-medium">設定 OpenAI API Key</h3>
              {!apiKey && (
                <div className="text-red-500 flex items-center text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  APIキーを設定してください。
                </div>
              )}
              <Input type="password" placeholder="OpenAI API Key" value={apiKey} onChange={handleSetApiKey} />
              <Button disabled={!apiKey} className="w-full" onClick={handleClosePopover}>
                保存
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
