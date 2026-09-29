import { onSnapshot } from 'firebase/firestore';
import { Budget } from '../lib/types';
import { COLLECTIONS } from '../lib/firestore/constants';
import {
  col,
  getById,
  listAll,
  setById,
  withId,
} from '../lib/firestore/helpers';

export const budgetService = {
  getAll: (): Promise<Budget[]> =>
    listAll<Budget>(COLLECTIONS.budgets),

  getById: (
    id: string
  ): Promise<Budget | null> =>
    getById<Budget>(COLLECTIONS.budgets, id),

  getByDepartment: async (
    departmentId: string
  ): Promise<Budget | undefined> => {
    const all = await listAll<Budget>(
      COLLECTIONS.budgets
    );

    return all.find(
      (budget) =>
        budget.departmentId === departmentId
    );
  },

  upsert: (budget: Budget): Promise<void> =>
    setById(
      COLLECTIONS.budgets,
      budget.id,
      { ...budget }
    ),

  subscribeAll: (
    onData: (rows: Budget[]) => void,
    onError?: (error: Error) => void
  ): (() => void) => {
    return onSnapshot(
      col(COLLECTIONS.budgets),
      (snap) => {
        onData(
          snap.docs.map((doc) =>
            withId<Budget>(doc)
          )
        );
      },
      (error) => onError?.(error)
    );
  },
};