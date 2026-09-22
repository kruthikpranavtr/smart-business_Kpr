// Notification Service for SMARTORA
// Handles Smart Alerts (Attendance, Inventory, Expense, Task, Payment, System)

import { storageService } from './storageService';

export const notificationService = {
  getNotifications: () => {
    const keys = storageService.getKeys();
    return storageService.getItem(keys.NOTIFICATIONS, []);
  },

  markAsRead: (id) => {
    const keys = storageService.getKeys();
    const list = storageService.getItem(keys.NOTIFICATIONS, []);
    const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
    storageService.setItem(keys.NOTIFICATIONS, updated);
    return updated;
  },

  markAllAsRead: () => {
    const keys = storageService.getKeys();
    const list = storageService.getItem(keys.NOTIFICATIONS, []);
    const updated = list.map(n => ({ ...n, read: true }));
    storageService.setItem(keys.NOTIFICATIONS, updated);
    return updated;
  },

  deleteNotification: (id) => {
    const keys = storageService.getKeys();
    const list = storageService.getItem(keys.NOTIFICATIONS, []);
    const updated = list.filter(n => n.id !== id);
    storageService.setItem(keys.NOTIFICATIONS, updated);
    return updated;
  },

  addNotification: (alert) => {
    const keys = storageService.getKeys();
    const list = storageService.getItem(keys.NOTIFICATIONS, []);
    const newAlert = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      time: 'Just now',
      read: false,
      severity: 'info',
      ...alert
    };
    list.unshift(newAlert);
    storageService.setItem(keys.NOTIFICATIONS, list);
    return list;
  },

  getUnreadCount: () => {
    const keys = storageService.getKeys();
    const list = storageService.getItem(keys.NOTIFICATIONS, []);
    return list.filter(n => !n.read).length;
  }
};
