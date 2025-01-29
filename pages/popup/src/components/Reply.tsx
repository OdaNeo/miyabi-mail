import { splitByPrompts, PROMPT } from '@src/utils/tts';
import { AnimatePresence, motion } from 'framer-motion';
import { Label } from './ui/label';
import { ChevronDown, ChevronUp, ClipboardCopy } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@src/lib/utils';
import { useState } from 'react';

export function Reply({
  replyOrigin,
  isGenerated,
  expandedSection,
  setExpandedSection,
}: {
  replyOrigin: string;
  isGenerated: boolean;
  expandedSection: PROMPT | null;
  setExpandedSection: (section: PROMPT | null) => void;
}) {
  const { translation, japaneseReply, replyTranslation } = splitByPrompts(replyOrigin);

  const [copied, setCopied] = useState(false);

  const toggleSection = (section: PROMPT) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(japaneseReply)
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
          <div className="space-y-1">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection(PROMPT.TRANSLATION)}
              onKeyUp={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleSection(PROMPT.TRANSLATION);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <Label className="text-xs">原文の翻訳：</Label>
              {expandedSection === PROMPT.TRANSLATION ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </div>
            {expandedSection === PROMPT.TRANSLATION && (
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded max-h-20 overflow-y-auto text-xs scrollbar-custom">
                {translation}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection(PROMPT.JAPANESE_REPLY)}
              onKeyUp={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleSection(PROMPT.JAPANESE_REPLY);
                }
              }}
            >
              <Label className="text-xs">日本語の返信：</Label>
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={e => {
                    e.stopPropagation();
                    handleCopy();
                  }}
                  className={cn(
                    'h-6 text-xs transition-colors',
                    copied && 'bg-green-500 text-white hover:bg-green-600',
                  )}
                >
                  {copied ? 'コピー済み' : 'コピー'}
                  <ClipboardCopy className="h-3 w-3 ml-1" />
                </Button>
                {expandedSection === PROMPT.JAPANESE_REPLY ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </div>
            </div>
            {expandedSection === PROMPT.JAPANESE_REPLY && (
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded max-h-20 overflow-y-auto text-xs scrollbar-custom">
                {japaneseReply}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection(PROMPT.REPLY_TRANSLATION)}
              onKeyUp={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleSection(PROMPT.REPLY_TRANSLATION);
                }
              }}
            >
              <Label className="text-xs">返信の翻訳：</Label>
              {expandedSection === PROMPT.REPLY_TRANSLATION ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </div>
            {expandedSection === PROMPT.REPLY_TRANSLATION && (
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded max-h-20 overflow-y-auto text-xs scrollbar-custom">
                {replyTranslation}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
