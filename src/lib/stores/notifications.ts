/**
 * Store for managing application notifications
 */

import { writable } from 'svelte/store';
import type { Notification, NotificationType } from '$lib/types';

// Generate unique ID for notifications
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Create notification store
function createNotificationStore() {
  const { subscribe, update } = writable<Notification[]>([]);

  return {
    subscribe,
    /**
     * Add a new notification
     * @param message The notification message
     * @param type The notification type
     * @param duration Duration in ms before auto-dismissing (0 for no auto-dismiss)
     */
    add: (message: string, type: NotificationType = 'info', duration: number = 3000): string => {
      const id = generateId();
      
      update(notifications => [
        ...notifications,
        { id, type, message }
      ]);
      
      if (duration > 0) {
        setTimeout(() => {
          update(notifications => notifications.filter(n => n.id !== id));
        }, duration);
      }
      
      return id;
    },
    /**
     * Remove a notification by ID
     * @param id The notification ID to remove
     */
    remove: (id: string): void => {
      update(notifications => notifications.filter(n => n.id !== id));
    },
    /**
     * Clear all notifications
     */
    clear: (): void => {
      update(() => []);
    }
  };
}

// Export the notification store
export const notifications = createNotificationStore();
