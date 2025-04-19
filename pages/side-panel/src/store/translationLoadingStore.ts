import { create } from 'zustand';

type State = {
  isTranslationLoading: boolean;
};

type Actions = {
  setIsTranslationLoading: (qty: boolean) => void;
};

export const useTranslationLoading = create<State & Actions>(set => ({
  isTranslationLoading: false,
  setIsTranslationLoading: (qty: boolean) => set({ isTranslationLoading: qty }),
}));
