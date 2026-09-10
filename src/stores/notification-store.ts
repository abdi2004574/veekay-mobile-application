import { create } from 'zustand';

type PermissionStatus = 'prompt' | 'denied' | 'authorized' | 'provisional';

interface NotificationState {
  fcmToken: string | null;
  isRegistered: boolean;
  permissionStatus: PermissionStatus;
  setToken: (token: string | null) => void;
  setRegistered: (registered: boolean) => void;
  setPermissionStatus: (status: PermissionStatus) => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  fcmToken: null,
  isRegistered: false,
  permissionStatus: 'prompt',
  setToken: (token) => set({ fcmToken: token }),
  setRegistered: (registered) => set({ isRegistered: registered }),
  setPermissionStatus: (status) => set({ permissionStatus: status }),
  reset: () => set({ fcmToken: null, isRegistered: false, permissionStatus: 'prompt' }),
}));
