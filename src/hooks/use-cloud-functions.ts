'use client';

import { useState, useCallback } from 'react';
import { callGetTasks } from '@/lib/functions';
import { useAuth } from '@/contexts/auth-context';
import type { FunctionGetTasksResponse } from '@/lib/types';

export function useCloudFunctions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const getTasks = useCallback(async (): Promise<FunctionGetTasksResponse | null> => {
    if (!user) {
      setError('User must be authenticated to call getTasks');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Calling getTasks Cloud Function...');
      const result = await callGetTasks();
      console.log('✅ getTasks result:', result);
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Error calling getTasks:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    getTasks,
    loading,
    error,
    isAuthenticated: !!user
  };
}
