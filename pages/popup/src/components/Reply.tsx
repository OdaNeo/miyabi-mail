import { splitByPrompts, PROMPT } from '@src/utils/tts';
import { AnimatePresence, motion } from 'framer-motion';
import { Label } from './ui/label';
import { ChevronDown, ChevronUp, ClipboardCopy } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@src/lib/utils';
import type React from 'react';
import { useState } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const MessageBox: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-slate-100 dark:bg-slate-800 p-1 rounded max-h-20 overflow-y-auto text-xs scrollbar-custom text-slate-700 dark:text-slate-300',
        ),
      )}
    >
      {children}
    </div>
  );
};

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
          {['TRANSLATION', 'JAPANESE_REPLY', 'REPLY_TRANSLATION'].map(section => (
            <div key={section} className="space-y-1">
              <div
                className="flex justify-between items-center cursor-pointer p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => toggleSection(PROMPT[section as keyof typeof PROMPT])}
                onKeyUp={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    toggleSection(PROMPT[section as keyof typeof PROMPT]);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {section === 'TRANSLATION'
                    ? '原文の翻訳：'
                    : section === 'JAPANESE_REPLY'
                      ? '日本語の返信：'
                      : '返信の翻訳：'}
                </Label>
                <div className="flex items-center space-x-1">
                  {section === 'JAPANESE_REPLY' && (
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
                  {expandedSection === PROMPT[section as keyof typeof PROMPT] ? (
                    <ChevronUp className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                  ) : (
                    <ChevronDown className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                  )}
                </div>
              </div>
              {expandedSection === PROMPT[section as keyof typeof PROMPT] && (
                <MessageBox>
                  {section === 'TRANSLATION'
                    ? translation
                    : section === 'JAPANESE_REPLY'
                      ? japaneseReply
                      : replyTranslation}
                </MessageBox>
              )}
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
