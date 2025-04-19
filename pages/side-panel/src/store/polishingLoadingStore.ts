import { create } from 'zustand';

type State = {
  isPolishingLoading: boolean;
};

type Actions = {
  setIsPolishingLoading: (qty: boolean) => void;
};

export const usePolishingLoading = create<State & Actions>(set => ({
  isPolishingLoading: false,
  setIsPolishingLoading: (qty: boolean) => set({ isPolishingLoading: qty }),
}));
