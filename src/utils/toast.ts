import { useToastStore } from '../stores/toast-store';

export function showToast(message: string) {
  useToastStore.getState().show(message);
}
