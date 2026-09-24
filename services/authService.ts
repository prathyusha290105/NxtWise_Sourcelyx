import { User, Role } from '../lib/types';
import { INITIAL_USERS, DEMO_PASSWORD } from '../lib/mock-data/users';

export const authService = {
  getUsers: (): User[] => {
    return INITIAL_USERS;
  },

  getUserByEmail: (email: string): User | undefined => {
    return INITIAL_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  },

  login: async (email: string, password: string): Promise<User | null> => {
    // Mock login verification
    const user = INITIAL_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (user && (password === DEMO_PASSWORD || password === 'demo123')) {
      return user;
    }
    // Also accept any valid user password for ease of testing
    if (user && password.length >= 4) {
      return user;
    }
    return null;
  },

  getUserByRole: (role: Role): User | undefined => {
    return INITIAL_USERS.find((u) => u.role === role);
  },
};
