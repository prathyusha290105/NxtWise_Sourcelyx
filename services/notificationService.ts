import { Notification, Role } from '../lib/types';
import { INITIAL_NOTIFICATIONS } from '../lib/mock-data/notifications';

export const notificationService = {
  getAll: (): Notification[] => INITIAL_NOTIFICATIONS,
  getForRole: (role: Role): Notification[] =>
    INITIAL_NOTIFICATIONS.filter(
      (n) => !n.targetRole || n.targetRole === role
    ),
};
