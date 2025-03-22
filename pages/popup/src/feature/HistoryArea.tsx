import { MessageBox } from '@/components/MessageBox';
import { historyDb } from '@/db/model';
import { deleteTaskRecordById } from '@/db/taskRecordsRepository';
import { useI18n } from '@/hooks/useI18n';
import { taskTypeConfig } from '@/utils/taskTypeConfig';
import { Button, ScrollArea } from '@extension/ui';
import { useLiveQuery } from 'dexie-react-hooks';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Trash2, AlertCircle } from 'lucide-react';

export const HistoryArea = () => {
  const filteredHistory = useLiveQuery(() =>
    historyDb.taskRecords
      .filter(item => item.isVisitable)
      .reverse()
      .sortBy('completedAt'),
  );

  const { NO_HISTORY, HISTORY_IS_HERE } = useI18n();

  const handleDeleteHistory = async (id: number) => {
    await deleteTaskRecordById(id);
  };

  return (
    <ScrollArea className="scrollbar-custom p-5">
      <div className="space-y-3">
        <AnimatePresence>
          {filteredHistory && filteredHistory.length > 0 ? (
            filteredHistory.map(item => (
              <motion.div
                key={item.id}
                data-testid="history-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' }}
                transition={{ duration: 0.2 }}
                className="border border-[#e5e7eb] dark:border-[#2e3238] rounded-lg overflow-hidden transition-all duration-200"
              >
                <div className="flex flex-col">
                  <div
                    className="flex justify-between items-center p-3 border-b px-3 h-9 cursor-pointer
                     bg-slate-100 dark:bg-[#23252b]
                 hover:bg-slate-200 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-center gap-2 text-[#6b7280] dark:text-[#9ca3af]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.completedAt.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full ${taskTypeConfig[item.taskType]?.color || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
                      >
                        {taskTypeConfig[item.taskType]?.label || item.taskType}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        data-testid="delete-history-icon"
                        onClick={() => handleDeleteHistory(item.id)}
                        className="h-6 w-6 p-1.5 rounded-full text-[#9ca3af] hover:text-[#ef4444] dark:text-[#6b7280] dark:hover:text-[#f87171] hover:bg-[#fee2e2]/30 dark:hover:bg-[#450a0a]/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  <MessageBox>{item.sourceContent}</MessageBox>
                  <div className="border-b" />
                  <MessageBox>{item.generatedContent}</MessageBox>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 text-[#6b7280] dark:text-[#9ca3af]"
            >
              <AlertCircle className="w-10 h-10 mb-3 opacity-50" />
              <p className="text-sm">{NO_HISTORY}</p>
              <p className="text-sm mt-1 max-w-xs text-center">{HISTORY_IS_HERE}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
};
