import { onSnapshot, orderBy, query } from 'firebase/firestore';
import {
  Notification,
  Role,
} from '../lib/types';
import { COLLECTIONS } from '../lib/firestore/constants';
import {
  col,
  getById,
  listAll,
  mergeById,
  setById,
  withId,
} from '../lib/firestore/helpers';

function createNotificationId(): string {
  return `notif-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export const notificationService = {
  getAll: (): Promise<Notification[]> =>
    listAll<Notification>(
      COLLECTIONS.notifications
    ),

  getById: (
    id: string
  ): Promise<Notification | null> =>
    getById<Notification>(
      COLLECTIONS.notifications,
      id
    ),

  getForRole: async (
    role: Role
  ): Promise<Notification[]> => {
    const all = await listAll<Notification>(
      COLLECTIONS.notifications
    );

    return all.filter(
      (notification) =>
        !notification.targetRole ||
        notification.targetRole === role
    );
  },

  create: async (
    notification: Omit<Notification, 'id'>
  ): Promise<Notification> => {
    const newNotification: Notification = {
      ...notification,
      id: createNotificationId(),
    };

    await setById(
      COLLECTIONS.notifications,
      newNotification.id,
      { ...newNotification }
    );

    return newNotification;
  },

  upsert: (
    notification: Notification
  ): Promise<void> =>
    setById(
      COLLECTIONS.notifications,
      notification.id,
      { ...notification }
    ),

  markAsRead: (
    id: string
  ): Promise<void> =>
    mergeById(
      COLLECTIONS.notifications,
      id,
      { isRead: true }
    ),

  markAllAsRead: async (
    notifications: Notification[]
  ): Promise<void> => {
    const relevant = notifications.filter(
      (notification) => !notification.isRead
    );

    await Promise.all(
      relevant.map((notification) =>
        notificationService.markAsRead(
          notification.id
        )
      )
    );
  },

  subscribeAll: (
    onData: (rows: Notification[]) => void,
    onError?: (error: Error) => void
  ): (() => void) => {
    const q = query(
      col(COLLECTIONS.notifications),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(
      q,
      (snap) => {
        onData(
          snap.docs.map((doc) =>
            withId<Notification>(doc)
          )
        );
      },
      (error) => onError?.(error)
    );
  },
};