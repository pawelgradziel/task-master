import type { Timestamp } from 'firebase/firestore';

export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Timestamp;
  dueDate: string | null;
  userId: string;
};
