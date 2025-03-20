import type { PROMPT_KEYS } from '@/utils/tts';
import { create } from 'zustand';

type State = {
  expandedSection: PROMPT_KEYS | null;
};

type Actions = {
  setExpandedSection: (qty: PROMPT_KEYS | null) => void;
};

export const useExpandedSectionStore = create<State & Actions>(set => ({
  expandedSection: null,
  setExpandedSection: (qty: PROMPT_KEYS | null) => set({ expandedSection: qty }),
}));
