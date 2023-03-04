import { create } from "zustand";
import { persist } from "zustand/middleware";

type buildingComplexStore = {
  id: string;
  setBuildingComplexId: (id: string) => void;
};

export const useBuildingComplexIdStore = create(
  persist<buildingComplexStore>(
    (set) => ({
      // initial state
      id: "",
      // setting buildingComplexId into state
      setBuildingComplexId: (id) => set(() => ({ id: id })),
    }),
    {
      name: "buildingComplexId",
    }
  )
);
