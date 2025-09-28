import { onCall } from 'firebase-functions/v2/https';
import { db } from './lib/firebase-admin';
import { Task, FunctionGetTasksResponse } from './lib/types'

const functionsConfig = {
  region: 'europe-central2'
}

/**
 * Cloud Function to get tasks for a specific user
 * Returns tasks from /users/{uid}/tasks collection
 */
export const getTasks = onCall(functionsConfig, async (request): Promise<FunctionGetTasksResponse> => {
  console.log('🚀 getTasks function called from region: europe-central2');
  console.log('📊 Request details:', { 
    auth: !!request.auth, 
    uid: request.auth?.uid,
    timestamp: new Date().toISOString()
  });
  
  // Check if user is authenticated
  if (!request.auth) {
    throw new Error('The function must be called while authenticated.');
  }

  const uid = request.auth.uid;
  
  try {
    // Get tasks from the user's tasks collection
    const tasksSnapshot = await db
      .collection('users')
      .doc(uid)
      .collection('tasks')
      .orderBy('createdAt', 'desc')
      .get();

    const tasks: Task[] = tasksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Task));

    return {
      success: true,
      data: tasks,
      count: tasks.length
    };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('An error occurred while fetching tasks.');
  }
});
