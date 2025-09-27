'use server';

import { revalidatePath } from 'next/cache';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { z } from 'zod';
import { db } from './firebase';
import { auth } from './firebase-admin';
import { suggestDate } from '@/ai/flows/smart-date-suggestion';
import { cookies } from 'next/headers';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().nullable().optional(),
});

async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    
    if (!sessionCookie) {
      return null;
    }

    const decodedToken = await auth.verifySessionCookie(sessionCookie);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying session:', error);
    return null;
  }
}

export async function addTask(formData: FormData) {
  const user = await getCurrentUser();
  
  if (!user) {
    return { error: 'Authentication required to create tasks.' };
  }

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
    await addDoc(collection(db, 'users', user.uid, 'tasks'), {
      ...validatedFields.data,
      completed: false,
      createdAt: serverTimestamp(),
      userId: user.uid,
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to create task.', error);
    return { error: 'Failed to create task.' };
  }
}

export async function updateTask(id: string, formData: FormData) {
  const user = await getCurrentUser();
  
  if (!user) {
    return { error: 'Authentication required to update tasks.' };
  }

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
    const taskRef = doc(db, 'users', user.uid, 'tasks', id);
    const taskDoc = await getDoc(taskRef);
    
    if (!taskDoc.exists()) {
      return { error: 'Task not found.' };
    }
    
    const taskData = taskDoc.data();
    if (taskData.userId !== user.uid) {
      return { error: 'You can only update your own tasks.' };
    }
    
    await updateDoc(taskRef, validatedFields.data);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update task.' };
  }
}

export async function deleteTask(id: string) {
  const user = await getCurrentUser();
  
  if (!user) {
    return { error: 'Authentication required to delete tasks.' };
  }

  try {
    const taskRef = doc(db, 'users', user.uid, 'tasks', id);
    const taskDoc = await getDoc(taskRef);
    
    if (!taskDoc.exists()) {
      return { error: 'Task not found.' };
    }
    
    const taskData = taskDoc.data();
    if (taskData.userId !== user.uid) {
      return { error: 'You can only delete your own tasks.' };
    }
    
    await deleteDoc(taskRef);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete task.' };
  }
}

export async function toggleTaskCompletion(id: string, completed: boolean) {
  const user = await getCurrentUser();
  
  if (!user) {
    console.error('Authentication required to toggle task completion');
    return;
  }

  try {
    const taskRef = doc(db, 'users', user.uid, 'tasks', id);
    const taskDoc = await getDoc(taskRef);
    
    if (!taskDoc.exists()) {
      console.error('Task not found');
      return;
    }
    
    const taskData = taskDoc.data();
    if (taskData.userId !== user.uid) {
      console.error('You can only toggle your own tasks');
      return;
    }
    
    await updateDoc(taskRef, { completed });
    revalidatePath('/');
  } catch (error) {
    console.error('Failed to toggle task completion:', error);
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
