import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { User } from '../lib/types';
import { getFirebaseAuth } from '../lib/firebase';
import { userService } from './userService';
import { ADMIN_BOOTSTRAP_EMAIL } from '../lib/firestore/constants';

export class ProfileMissingError extends Error {
  readonly uid: string;
  readonly email: string;

  constructor(uid: string, email: string) {
    super('PROFILE_MISSING');
    this.name = 'ProfileMissingError';
    this.uid = uid;
    this.email = email;
  }
}

export function mapAuthError(error: unknown): string {
  if (error instanceof ProfileMissingError) {
    if (error.email.toLowerCase() === ADMIN_BOOTSTRAP_EMAIL) {
      return 'This admin account has no Firestore profile yet. Open Setup to import demo data.';
    }
    return 'This account is authenticated but has no Sourcelyx user profile. Ask an administrator to complete setup.';
  }

  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/invalid-email':
      case 'auth/user-disabled':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-login-credentials':
        return 'Invalid email or password.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait and try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';
      case 'auth/network-request-failed':
        return 'Network error. Check your connection and Firebase configuration.';
      case 'auth/operation-not-allowed':
        return 'Email/password sign-in is not enabled in Firebase Authentication.';
      default:
        return error.message || 'Authentication failed.';
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Authentication failed.';
}

function toAppUser(uid: string, data: Omit<User, 'id'> | User): User {
  const { id: _ignored, ...rest } = data as User;
  return { ...rest, id: uid };
}

export const authService = {
  mapAuthError,

  getCurrentAuthUser(): FirebaseUser | null {
    return getFirebaseAuth().currentUser;
  },

  async getProfile(uid: string): Promise<User | null> {
    const profile = await userService.getById(uid);
    if (!profile) return null;
    return toAppUser(uid, profile);
  },

  async signIn(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
    const profile = await this.getProfile(credential.user.uid);
    if (!profile) {
      throw new ProfileMissingError(credential.user.uid, credential.user.email || email);
    }
    return profile;
  },

  async signOut(): Promise<void> {
    await firebaseSignOut(getFirebaseAuth());
  },

  async registerVendorAccount(email: string, password: string): Promise<FirebaseUser> {
    const credential = await createUserWithEmailAndPassword(
      getFirebaseAuth(),
      email.trim(),
      password
    );
    return credential.user;
  },

  async deleteCurrentAuthUser(): Promise<void> {
    const current = getFirebaseAuth().currentUser;
    if (current) {
      await current.delete();
    }
  },

  subscribeAuth(callback: (firebaseUser: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(getFirebaseAuth(), callback);
  },
};
