import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase'
import { FunctionGetTasksResponse } from './types';
import { auth } from './firebase';

export const callGetTasks = async () => {
  console.log('🌐 Frontend calling getTasks function...');
  console.log('📍 Functions region: europe-central2');
  console.log('🔗 Emulator URL: http://localhost:5001/studio-4444518969-8ccb5/europe-central2/getTasks');
  
  // Check if user is authenticated
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to call getTasks');
  }
  
  console.log('👤 Authenticated user:', auth.currentUser.uid);
  
  const getTasks = httpsCallable<FunctionGetTasksResponse>(functions, 'getTasks');
  const result = await getTasks();
  
  console.log('✅ Function call successful:', result);
  return result;
}
