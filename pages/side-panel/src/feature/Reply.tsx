import type { PROMPT_KEYS } from '@/utils/tts';
import { AnimatePresence, motion } from 'framer-motion';
import { Label } from '@extension/ui';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MessageBox } from '../components/MessageBox';
import { replyStorage, translationStorage } from '@extension/storage';
import { useStorage } from '@extension/shared';
import { useGeneratedStore } from '@/store/generatedStore';
import { useExpandedSectionStore } from '@/store/expandedSectionStore';
import { useI18n } from '@/hooks/useI18n';
import { CopyButton } from '@/components/CopyButton';

export function Reply() {
  const reply = useStorage(replyStorage);
  const translation = useStorage(translationStorage);

  const { isGenerated } = useGeneratedStore();
  const { expandedSection, setExpandedSection } = useExpandedSectionStore();

  const { ORIGINAL_TRANSLATION, REPLY } = useI18n();

  const toggleSection = (section: PROMPT_KEYS) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleCopy = (section: PROMPT_KEYS) => {
    navigator.clipboard.writeText(section === 'REPLY' ? reply : translation);
  };

  return (
    <AnimatePresence>
      {isGenerated && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-y-auto scrollbar-custom rounded-lg border border-[#e5e7eb] dark:border-[#2e3238]
        dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 bg-white text-slate-900 placeholder-slate-500"
        >
          {(['TRANSLATION', 'REPLY'] as PROMPT_KEYS[]).map(section => (
            <div key={section}>
              <div
                className="flex justify-between items-center px-3 h-9 cursor-pointer bg-slate-100 dark:bg-[#23252b]
                 hover:bg-slate-200 dark:hover:bg-slate-800"
                onClick={() => toggleSection(section)}
                onKeyUp={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    toggleSection(section);
                  }
                }}
                data-testid={`section-${section.toLocaleLowerCase()}`}
                role="button"
                tabIndex={0}
              >
                <Label className="font-medium text-[#4b5563] dark:text-[#d1d5db]">
                  {section === 'TRANSLATION' ? ORIGINAL_TRANSLATION : REPLY}
                </Label>
                <div className="flex items-center space-x-2">
                  <CopyButton handleCopyText={() => handleCopy(section)} />
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
