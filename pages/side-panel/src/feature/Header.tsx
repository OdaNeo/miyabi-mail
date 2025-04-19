import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@extension/ui';
import { Settings, Sun, Moon, Globe, Feather, Clock } from 'lucide-react';
import { useStorage } from '@extension/shared';
import { darkModeStorage, i18nStorage } from '@extension/storage';
import { useOpenStore } from '@/store/openStore';
import { useI18n } from '@/hooks/useI18n';
import { SettingPopoverContent } from './SettingPopoverContent';
import { useHistoryOpenStore } from '@/store/historyOpenStore';

export function Header() {
  const darkMode = useStorage(darkModeStorage);

  const { toggleIsHistoryOpen } = useHistoryOpenStore();

  const { isOpen, setIsOpen } = useOpenStore();

  const { CHANGE_TO_LIGHT, CHANGE_TO_DARK, CHANGE_LANGUAGE } = useI18n();

  const handleSwitchLanguage = () => {
    i18nStorage.next();
  };

  const handleToggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    darkModeStorage.set(!darkMode);
  };

  const handleTogglePopover = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex justify-between items-center px-5 py-3 bg-gradient-to-r from-[#e9ecf1] to-[#f0f2f5] dark:from-[#23252b] dark:to-[#282a32] border-b border-[#e5e7eb] dark:border-[#2e3238]">
      <Feather className="w-5 h-5 text-[#8b5cf6] dark:text-[#a78bfa] opacity-80" />
      <h1 className="text-xl font-medium tracking-widest flex items-center ml-2">雅返信</h1>
      <div className="flex-1" />
      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-slate-600 dark:text-slate-400 hover:bg-[#e2e3e4] dark:hover:bg-[#2e3238]"
          onClick={() => {
            toggleIsHistoryOpen();
          }}
        >
          <Clock data-testid="clock-icon" />
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-slate-600 dark:text-slate-400 hover:bg-[#e2e3e4] dark:hover:bg-[#2e3238]"
                onClick={handleSwitchLanguage}
              >
                <Globe data-testid="globe-icon" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-700 text-slate-100 dark:bg-slate-200 dark:text-slate-800">
              {CHANGE_LANGUAGE}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                data-testid="toggle-dark-mode"
                className="w-8 h-8 text-slate-600 dark:text-slate-400 hover:bg-[#e2e3e4] dark:hover:bg-[#2e3238]"
                onClick={handleToggleDarkMode}
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-700 text-slate-100 dark:bg-slate-200 dark:text-slate-800">
              <p>{darkMode ? CHANGE_TO_LIGHT : CHANGE_TO_DARK}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              onClick={handleTogglePopover}
              variant="ghost"
              size="icon"
              data-testid="setting-icon"
              className="w-8 h-8 text-slate-600 dark:text-slate-400 hover:bg-[#e2e3e4] dark:hover:bg-[#2e3238]"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <SettingPopoverContent setIsOpen={setIsOpen} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
