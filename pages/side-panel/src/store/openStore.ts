import { create } from 'zustand';

type State = {
  isOpen: boolean;
};

type Actions = {
  setIsOpen: (qty: boolean) => void;
};

export const useOpenStore = create<State & Actions>(set => ({
  isOpen: false,
  setIsOpen: (qty: boolean) => set({ isOpen: qty }),
}));
