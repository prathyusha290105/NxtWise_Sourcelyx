import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { getFirebaseDb } from '../firebase';

export function stripUndefined<T extends Record<string, unknown>>(value: T): T {
  const entries = Object.entries(value).filter(([, v]) => v !== undefined);
  return Object.fromEntries(entries) as T;
}

export function toIsoString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return new Date().toISOString();
}

export function withId<T>(snap: QueryDocumentSnapshot<DocumentData>): T {
  const data = snap.data();
  return { id: snap.id, ...data } as T;
}

export function col(name: string) {
  return collection(getFirebaseDb(), name);
}

export function docRef(name: string, id: string) {
  return doc(getFirebaseDb(), name, id);
}

export async function getById<T>(name: string, id: string): Promise<T | null> {
  const snap = await getDoc(docRef(name, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T;
}

export async function setById<T extends Record<string, unknown>>(
  name: string,
  id: string,
  data: T
): Promise<void> {
  const { id: _id, ...rest } = data as T & { id?: string };
  await setDoc(docRef(name, id), stripUndefined(rest as Record<string, unknown>));
}

export async function mergeById(
  name: string,
  id: string,
  data: Record<string, unknown>
): Promise<void> {
  await updateDoc(docRef(name, id), stripUndefined(data));
}

export async function removeById(name: string, id: string): Promise<void> {
  await deleteDoc(docRef(name, id));
}

export async function listAll<T>(name: string): Promise<T[]> {
  const snaps = await getDocs(col(name));
  return snaps.docs.map((d) => withId<T>(d));
}
