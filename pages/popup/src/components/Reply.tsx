import type { PROMPT_KEYS } from '@src/utils/tts';
import { AnimatePresence, motion } from 'framer-motion';
import { Label } from './ui/label';
import { ChevronDown, ChevronUp, ClipboardCopy } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@src/lib/utils';
import { useState } from 'react';
import { MessageBox } from './ui/MessageBox';
import { replyStorage, translationStorage } from '@extension/storage';
import { useStorage } from '@extension/shared';
import { useGeneratedStore } from '@src/store/generatedStore';
import { useExpandedSectionStore } from '@src/store/expandedSectionStore';

export function Reply() {
  const reply = useStorage(replyStorage);
  const translation = useStorage(translationStorage);

  const { isGenerated } = useGeneratedStore();
  const { expandedSection, setExpandedSection } = useExpandedSectionStore();

  const [copied, setCopied] = useState(false);

  const toggleSection = (section: PROMPT_KEYS) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(reply)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <AnimatePresence>
      {isGenerated && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2 overflow-hidden"
        >
          {(['TRANSLATION', 'REPLY'] as PROMPT_KEYS[]).map(section => (
            <div key={section} className="space-y-1">
              <div
                className="flex justify-between items-center cursor-pointer p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => toggleSection(section)}
                onKeyUp={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    toggleSection(section);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {section === 'TRANSLATION' ? '原文の翻訳：' : '日本語の返信：'}
                </Label>
                <div className="flex items-center space-x-1">
                  {section === 'REPLY' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={e => {
                        e.stopPropagation();
                        handleCopy();
                      }}
                      className={cn(
                        'h-6 text-xs transition-colors',
                        copied
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                          : 'text-slate-600 dark:text-slate-400',
                      )}
                    >
                      {copied ? 'コピー済み' : 'コピー'}
                      <ClipboardCopy className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                  {expandedSection === section ? (
                    <ChevronUp className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                  ) : (
                    <ChevronDown className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                  )}
                </div>
              </div>
              {expandedSection === section && (
                <MessageBox>{section === 'TRANSLATION' ? translation : reply}</MessageBox>
              )}
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
