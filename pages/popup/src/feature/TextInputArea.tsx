import { Button, Textarea } from '@extension/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { CopyButton } from '../components/CopyButton';
import { useI18n } from '@/hooks/useI18n';
import type { ChangeEvent, ClipboardEvent } from 'react';

export function TextInputArea({
  inputText,
  isLoading,
  handleInputTextChange,
  handleOnPaste,
  handleInputTextClear,
  handleCopyText,
}: {
  inputText: string;
  isLoading: boolean;
  handleInputTextChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleOnPaste: (e: ClipboardEvent<HTMLTextAreaElement>) => void;
  handleInputTextClear: () => void;
  handleCopyText: () => void;
}) {
  const { INPUT_PLACEHOLDER } = useI18n();

  return (
    <div className="relative flex-grow group">
      <Textarea
        placeholder={INPUT_PLACEHOLDER}
        value={inputText}
        disabled={isLoading}
        data-testid="input-textarea"
        onChange={handleInputTextChange}
        onPaste={handleOnPaste}
        className="h-full resize-none text-sm scrollbar-custom 
      dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 
      bg-white text-slate-900 placeholder-slate-500 pr-6"
      />
      {inputText && (
        <>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-2 right-2"
            >
              <Button
                disabled={isLoading}
                data-testid="text-clear-icon"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleInputTextClear}
              >
                <X className="h-6 w-6" />
              </Button>
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <CopyButton handleCopyText={handleCopyText} />
          </div>
        </>
      )}
    </div>
  );
}
