import { Button } from '@extension/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export const CopyButton = ({ handleCopyText }: { handleCopyText: () => void }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (isCopied) {
      return;
    }
    handleCopyText();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      data-testid="copy-icon-group"
      className="h-6 w-6 text-slate-500 hover:text-slate-900 relative"
      onClick={handleCopy}
    >
      <AnimatePresence initial={false} mode="wait">
        {isCopied ? (
          <motion.div
            key="check"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Check className="h-4 w-4 text-green-500" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Copy className="h-4 w-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
};
