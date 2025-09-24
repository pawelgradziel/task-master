'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';

import { useTasks } from '@/hooks/use-tasks';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TaskItem } from './task-item';
import { TaskForm } from './task-form';
import type { Task } from '@/lib/types';

export default function TaskList() {
  const { tasks, loading } = useTasks();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground font-headline">Your Tasks</h2>
        <Button onClick={handleOpenAdd} style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-lg border">
                <Skeleton className="h-5 w-5 mt-1 rounded-sm" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold text-muted-foreground">No tasks yet!</h3>
          <p className="text-muted-foreground mt-2">Click "Add Task" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={() => handleOpenEdit(task)}
            />
          ))}
        </div>
      )}

      <TaskForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        task={editingTask}
      />
    </div>
  );
}
