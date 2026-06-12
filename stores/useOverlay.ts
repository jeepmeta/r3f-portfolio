// /stores/useOverlay.ts
import { create } from "zustand";

interface OverlayRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface OverlayState {
  overlayOpen: boolean;
  overlayTicker: string | null;
  originRect: OverlayRect | null;
  openOverlay: (ticker: string, rect: OverlayRect) => void;
  closeOverlay: () => void;
}

export const useOverlay = create<OverlayState>((set) => ({
  overlayOpen: false,
  overlayTicker: null,
  originRect: null,

  openOverlay: (ticker, rect) =>
    set({
      overlayOpen: true,
      overlayTicker: ticker,
      originRect: rect,
    }),

  closeOverlay: () =>
    set({
      overlayOpen: false,
      overlayTicker: null,
      originRect: null,
    }),
}));
