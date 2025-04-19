import { create } from 'zustand';

type State = {
  isReplyLoading: boolean;
};

type Actions = {
  setIsReplyLoading: (qty: boolean) => void;
};

export const useReplyLoading = create<State & Actions>(set => ({
  isReplyLoading: false,
  setIsReplyLoading: (qty: boolean) => set({ isReplyLoading: qty }),
}));
