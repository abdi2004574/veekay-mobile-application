import { useAlertStore, type AlertButton } from '../stores/alert-store';

export type { AlertButton };

/** Drop-in for `Alert.alert(title, message, buttons)` that also works on web. */
export function showAlert(title: string, message?: string, buttons?: AlertButton[]) {
  useAlertStore.getState().show(title, message, buttons);
}
