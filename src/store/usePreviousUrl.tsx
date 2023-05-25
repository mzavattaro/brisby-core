import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PreviousUrlStore = {
  previousUrl: string;
  setPreviousUrl: (url: string) => void;
};

export const usePreviousUrlStore = create(
  persist<PreviousUrlStore>(
    (set) => ({
      // initial state
      previousUrl: '',
      // setting previousUrl into state
      setPreviousUrl: (url) => set(() => ({ previousUrl: url })),
    }),
    {
      name: 'previousUrl',
    }
  )
);
