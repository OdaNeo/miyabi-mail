import { create } from 'zustand';

type State = {
  isGenerated: boolean;
};

type Actions = {
  setIsGenerated: (qty: boolean) => void;
};

export const useGeneratedStore = create<State & Actions>(set => ({
  isGenerated: false,
  setIsGenerated: (qty: boolean) => set({ isGenerated: qty }),
}));
