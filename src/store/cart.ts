"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/lib/types";

interface CartState {
  items: CartLine[];
  add: (line: CartLine) => void;
  remove: (artworkId: string) => void;
  clear: () => void;
  has: (artworkId: string) => boolean;
  subtotalCents: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (line) =>
        set((state) =>
          state.items.some((i) => i.artworkId === line.artworkId)
            ? state
            : { items: [...state.items, line] },
        ),
      remove: (artworkId) =>
        set((state) => ({
          items: state.items.filter((i) => i.artworkId !== artworkId),
        })),
      clear: () => set({ items: [] }),
      has: (artworkId) => get().items.some((i) => i.artworkId === artworkId),
      subtotalCents: () =>
        get().items.reduce((sum, i) => sum + i.priceCents, 0),
    }),
    {
      name: "ekatorissart-cart",
      // Only persist items, not derived state
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
