import { create } from 'zustand';

export interface AlertButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

interface AlertRequest {
  title: string;
  message?: string;
  buttons: AlertButton[];
}

interface AlertState {
  request: AlertRequest | null;
  show: (title: string, message?: string, buttons?: AlertButton[]) => void;
  hide: () => void;
}

// react-native-web's Alert.alert is a no-op stub (static alert() {}) — calls
// to it silently do nothing on the web target, which is otherwise a fully
// real target for this app (Playwright verification runs against it). This
// store + <AlertHost/> replaces it with an in-app modal that works
// identically on native and web instead of relying on Alert at all.
export const useAlertStore = create<AlertState>((set) => ({
  request: null,
  show: (title, message, buttons) =>
    set({ request: { title, message, buttons: buttons?.length ? buttons : [{ text: 'OK' }] } }),
  hide: () => set({ request: null }),
}));
