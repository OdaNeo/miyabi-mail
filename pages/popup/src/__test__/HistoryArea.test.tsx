import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HistoryArea } from '../feature/HistoryArea';
import { useLiveQuery } from 'dexie-react-hooks';
import { useI18n } from '@/hooks/useI18n';
import { TaskHistory } from '@/db/model';
import React from 'react';
import { deleteTaskRecordById } from '@/db/taskRecordsRepository';

vi.mock('dexie-react-hooks', () => ({
  useLiveQuery: vi.fn(),
}));

vi.mock('@/db/taskRecordsRepository', () => ({
  deleteTaskRecordById: vi.fn(),
}));

vi.mock('@/hooks/useI18n', () => ({
  useI18n: vi.fn(),
}));

vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: any) => (
      <div data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
}));

describe('HistoryArea 组件', () => {
  const mockI18n = {
    NO_HISTORY: '没有历史记录',
    HISTORY_IS_HERE: '历史记录将显示在这里',
  };

  const mockHistoryItems: TaskHistory[] = [
    {
      id: 1,
      sourceContent: '测试内容1',
      targetLanguage: 'en',
      taskType: 'TRANSLATION',
      modelVersion: 'gpt-4o',
      modelTemperature: 0.7,
      generatedContent: '翻译结果1',
      createdAt: new Date('2023-01-01T10:00:00'),
      completedAt: new Date('2023-01-01T10:01:00'),
      isVisitable: true,
    },
    {
      id: 2,
      sourceContent: '测试内容2',
      targetLanguage: 'zh',
      taskType: 'REPLY',
      modelVersion: 'gpt-3.5-turbo',
      modelTemperature: 0.5,
      emailSubject: '测试邮件',
      generatedContent: '回复结果2',
      createdAt: new Date('2023-01-02T11:00:00'),
      completedAt: new Date('2023-01-02T11:02:00'),
      isVisitable: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useI18n as any).mockReturnValue(mockI18n);
  });

  it('应该正确渲染历史记录列表', () => {
    (useLiveQuery as any).mockReturnValue(mockHistoryItems);

    render(<HistoryArea />);

    expect(screen.getAllByTestId('history-item')).toHaveLength(2);

    expect(screen.getByText('测试内容1')).toBeInTheDocument();
    expect(screen.getByText('翻译结果1')).toBeInTheDocument();
    expect(screen.getByText('测试内容2')).toBeInTheDocument();
    expect(screen.getByText('回复结果2')).toBeInTheDocument();

    expect(screen.getByText('2023/1/1 10:01:00')).toBeInTheDocument();
    expect(screen.getByText('2023/1/2 11:02:00')).toBeInTheDocument();

    expect(screen.getByText('翻译')).toBeInTheDocument();
    expect(screen.getByText('回复')).toBeInTheDocument();
  });

  it('应该在无历史记录时显示空状态', () => {
    (useLiveQuery as any).mockReturnValue([]);

    const { container } = render(<HistoryArea />);
    expect(container).toMatchSnapshot();
  });

  it('应该调用删除函数当点击删除按钮', async () => {
    (useLiveQuery as any).mockReturnValue(mockHistoryItems);

    render(<HistoryArea />);

    const deleteButtons = screen.getAllByTestId('delete-history-icon');
    fireEvent.click(deleteButtons[0]);
    expect(deleteTaskRecordById).toHaveBeenCalledWith(1);
  });
});
