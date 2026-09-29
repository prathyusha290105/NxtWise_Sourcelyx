import { onSnapshot } from 'firebase/firestore';
import { User } from '../lib/types';
import { COLLECTIONS } from '../lib/firestore/constants';
import { col, getById, listAll, setById, withId } from '../lib/firestore/helpers';

function asUser(id: string, data: User): User {
  return {
    id,
    name: data.name,
    email: data.email,
    role: data.role,
    departmentId: data.departmentId,
    vendorId: data.vendorId,
    avatar: data.avatar,
    title: data.title,
    legacyId: data.legacyId,
  };
}

export const userService = {
  getById: async (uid: string): Promise<User | null> => {
    const row = await getById<User>(COLLECTIONS.users, uid);
    if (!row) return null;
    return asUser(uid, row);
  },

  list: (): Promise<User[]> => listAll<User>(COLLECTIONS.users),

  upsert: async (uid: string, data: Omit<User, 'id'>): Promise<void> => {
    await setById(COLLECTIONS.users, uid, { ...data });
  },

  subscribeAll: (onData: (users: User[]) => void, onError?: (e: Error) => void): (() => void) => {
    return onSnapshot(
      col(COLLECTIONS.users),
      (snap) => {
        onData(snap.docs.map((d) => asUser(d.id, withId<User>(d))));
      },
      (err) => onError?.(err)
    );
  },
};
