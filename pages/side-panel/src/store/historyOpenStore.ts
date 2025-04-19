import { create } from 'zustand';

type State = {
  isHistoryOpen: boolean;
};

type Actions = {
  toggleIsHistoryOpen: () => void;
};

export const useHistoryOpenStore = create<State & Actions>(set => ({
  isHistoryOpen: false,
  toggleIsHistoryOpen: () => set(state => ({ isHistoryOpen: !state.isHistoryOpen })),
}));
