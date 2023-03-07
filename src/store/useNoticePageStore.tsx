import { create } from "zustand";
import { persist } from "zustand/middleware";

type noticePageStore = {
  page: number;
  setNoticePage: (page: number) => void;
};

export const useNoticePageStore = create(
  persist<noticePageStore>(
    (set) => ({
      // initial state
      page: 0,
      // setting noticePage into state
      setNoticePage: (page) => set(() => ({ page: page })),
    }),
    {
      name: "noticePage",
    }
  )
);
