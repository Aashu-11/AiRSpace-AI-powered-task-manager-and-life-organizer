
import { create } from 'zustand';
import { Notification } from './models';
import { saveToLocalStorage, getFromLocalStorage, STORAGE_KEYS } from './localStorage';

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'read'>) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  deleteNotification: (id: number) => void;
}

// Initial demo notifications
const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "Welcome to Airavat",
    description: "Your AI productivity assistant is ready to help you achieve more.",
    type: "info",
    time: new Date().toISOString(),
    read: false
  },
  {
    id: 2,
    title: "Task Due Soon",
    description: "Complete Project Proposal is due in 2 hours.",
    type: "warning",
    time: new Date().toISOString(),
    read: false
  },
  {
    id: 3,
    title: "AI Recommendations Ready",
    description: "View your personalized productivity recommendations.",
    type: "success",
    time: new Date(Date.now() - 3600000).toISOString(),
    read: true
  }
];

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: getFromLocalStorage(STORAGE_KEYS.NOTIFICATIONS, initialNotifications),
  
  addNotification: (notification) => set((state) => {
    const newNotification: Notification = {
      id: Date.now(),
      title: notification.title,
      description: notification.description,
      type: notification.type,
      time: new Date().toISOString(),
      read: false
    };
    
    const updatedNotifications = [newNotification, ...state.notifications];
    saveToLocalStorage(STORAGE_KEYS.NOTIFICATIONS, updatedNotifications);
    
    return { notifications: updatedNotifications };
  }),
  
  markAsRead: (id) => set((state) => {
    const updatedNotifications = state.notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    saveToLocalStorage(STORAGE_KEYS.NOTIFICATIONS, updatedNotifications);
    
    return { notifications: updatedNotifications };
  }),
  
  markAllAsRead: () => set((state) => {
    const updatedNotifications = state.notifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    saveToLocalStorage(STORAGE_KEYS.NOTIFICATIONS, updatedNotifications);
    
    return { notifications: updatedNotifications };
  }),
  
  clearNotifications: () => set(() => {
    const emptyNotifications: Notification[] = [];
    saveToLocalStorage(STORAGE_KEYS.NOTIFICATIONS, emptyNotifications);
    
    return { notifications: emptyNotifications };
  }),
  
  deleteNotification: (id) => set((state) => {
    const updatedNotifications = state.notifications.filter(
      notification => notification.id !== id
    );
    
    saveToLocalStorage(STORAGE_KEYS.NOTIFICATIONS, updatedNotifications);
    
    return { notifications: updatedNotifications };
  }),
}));

// Utility function to create a system notification
export const createSystemNotification = (
  title: string,
  description: string,
  type: 'info' | 'warning' | 'success' | 'error' = 'info'
): void => {
  const notificationStore = useNotificationStore.getState();
  notificationStore.addNotification({
    title,
    description,
    type
  });
};
