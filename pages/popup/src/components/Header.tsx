import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@src/components/ui/tooltip';
import { Button } from '@src/components/ui/button';
import { Settings, Sun, Moon, Globe } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@src/components/ui/popover';
import { useStorage } from '@extension/shared';
import { darkModeStorage, i18nStorage } from '@extension/storage';
import { useOpenStore } from '@src/store/openStore';
import { useI18n } from '@src/hooks/useI18n';
import { SettingPopoverContent } from './SettingPopoverContent';

export function Header() {
  const darkMode = useStorage(darkModeStorage);

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
    <div className="flex justify-between items-center">
      <h1 className="font-bold text-slate-800 dark:text-slate-100 text-xl tracking-widest">雅返信</h1>
      <div className="flex space-x-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="w-7 h-7 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                onClick={handleSwitchLanguage}
              >
                <Globe data-testid="globe-icon" className="h-4 w-4" />
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
                variant="outline"
                size="icon"
                data-testid="toggle-dark-mode"
                className="w-7 h-7 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
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
              variant="outline"
              size="icon"
              data-testid="setting-icon"
              className="w-7 h-7 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <SettingPopoverContent setIsOpen={setIsOpen} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
