'use server';

import { revalidatePath } from 'next/cache';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { z } from 'zod';
import { db } from './firebase';
import { suggestDate } from '@/ai/flows/smart-date-suggestion';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().nullable().optional(),
});

export async function addTask(formData: FormData) {
  const values = {
    title: formData.get('title'),
    description: formData.get('description'),
    dueDate: formData.get('dueDate'),
  };

  const validatedFields = taskSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await addDoc(collection(db, 'tasks'), {
      ...validatedFields.data,
      completed: false,
      createdAt: serverTimestamp(),
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to create task.' };
  }
}

export async function updateTask(id: string, formData: FormData) {
  const values = {
    title: formData.get('title'),
    description: formData.get('description'),
    dueDate: formData.get('dueDate'),
  };
  
  const validatedFields = taskSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const taskRef = doc(db, 'tasks', id);
    await updateDoc(taskRef, validatedFields.data);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update task.' };
  }
}

export async function deleteTask(id: string) {
  try {
    await deleteDoc(doc(db, 'tasks', id));
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete task.' };
  }
}

export async function toggleTaskCompletion(id: string, completed: boolean) {
  try {
    const taskRef = doc(db, 'tasks', id);
    await updateDoc(taskRef, { completed });
    revalidatePath('/');
  } catch (error) {
    console.error('Failed to toggle task completion:', error);
    // Optionally return an error object
  }
}

export async function getSuggestedDate(taskDescription: string) {
  if (!taskDescription) {
    return { error: 'Task description is needed to suggest a date.' };
  }

  try {
    const result = await suggestDate({ taskDescription });
    return {
      suggestedDate: result.suggestedDate,
      reasoning: result.reasoning,
    };
  } catch (error) {
    console.error('AI date suggestion failed:', error);
    return { error: 'Failed to get suggestion from AI.' };
  }
}
