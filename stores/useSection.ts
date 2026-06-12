import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type Section = "connections" | "code";

interface State {
  section: Section;
  setSection: (section: Section) => void;
}

export const useSection = create<State>()(
  devtools(
    (set) => ({
      section: "connections",
      setSection: (section) => set({ section }),
    }),
    { name: "SectionStore" },
  ),
);
