import type { PROMPT_KEYS } from '@/utils/tts';
import { AnimatePresence, motion } from 'framer-motion';
import { Label, Button, cn } from '@extension/ui';
import { ChevronDown, ChevronUp, ClipboardCopy } from 'lucide-react';
import { useState } from 'react';
import { MessageBox } from '../components/MessageBox';
import { replyStorage, translationStorage } from '@extension/storage';
import { useStorage } from '@extension/shared';
import { useGeneratedStore } from '@/store/generatedStore';
import { useExpandedSectionStore } from '@/store/expandedSectionStore';
import { useI18n } from '@/hooks/useI18n';

export function Reply() {
  const reply = useStorage(replyStorage);
  const translation = useStorage(translationStorage);

  const { isGenerated } = useGeneratedStore();
  const { expandedSection, setExpandedSection } = useExpandedSectionStore();

  const [copied, setCopied] = useState(false);
  const { ORIGINAL_TRANSLATION, REPLY, COPY, COPIED } = useI18n();

  const toggleSection = (section: PROMPT_KEYS) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reply).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <AnimatePresence>
      {isGenerated && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2 overflow-y-auto scrollbar-custom"
        >
          {(['TRANSLATION', 'REPLY'] as PROMPT_KEYS[]).map(section => (
            <div key={section} className="space-y-1">
              <div
                className="flex justify-between items-center cursor-pointer h-8 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => toggleSection(section)}
                onKeyUp={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    toggleSection(section);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <Label className="font-medium text-slate-700 dark:text-slate-300">
                  {section === 'TRANSLATION' ? ORIGINAL_TRANSLATION : REPLY}
                </Label>
                <div className="flex items-center space-x-1">
                  {section === 'REPLY' && (
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid="copy-button"
                      onClick={e => {
                        e.stopPropagation();
                        handleCopy();
                      }}
                      className={cn(
                        'h-6 text-sm transition-colors',
                        copied
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                          : 'text-slate-600 dark:text-slate-400',
                      )}
                    >
                      {copied ? COPIED : COPY}
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
