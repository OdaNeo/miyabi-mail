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
      <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">雅返信</h2>
      <div className="flex space-x-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="w-6 h-6 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                onClick={handleSwitchLanguage}
              >
                <Globe data-testid="globe-icon" className="h-3 w-3" />
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
                className="w-6 h-6 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                onClick={handleToggleDarkMode}
              >
                {darkMode ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
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
              className="w-6 h-6 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <Settings className="h-3 w-3" />
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
