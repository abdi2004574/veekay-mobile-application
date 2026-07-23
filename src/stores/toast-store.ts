import { create } from 'zustand';

interface ToastState {
  message: string | null;
  show: (message: string) => void;
  hide: () => void;
}

let hideTimeout: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  show: (message) => {
    if (hideTimeout) clearTimeout(hideTimeout);
    set({ message });
    hideTimeout = setTimeout(() => set({ message: null }), 3500);
  },
  hide: () => {
    if (hideTimeout) clearTimeout(hideTimeout);
    set({ message: null });
  },
}));
