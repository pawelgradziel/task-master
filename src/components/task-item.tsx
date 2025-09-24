'use client';

import * as React from 'react';
import { format, parseISO } from 'date-fns';
import { MoreHorizontal, Pencil, Trash2, Calendar } from 'lucide-react';

import type { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toggleTaskCompletion, deleteTask } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

type TaskItemProps = {
  task: Task;
  onEdit: () => void;
};

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const [isPending, startTransition] = React.useTransition();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const handleToggle = () => {
    startTransition(() => {
      toggleTaskCompletion(task.id, !task.completed);
    });
  };

  const handleDelete = async () => {
    const result = await deleteTask(task.id);
    if (result?.error) {
      toast({
        title: 'Error',
        description: 'Failed to delete task.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Task Deleted',
        description: 'The task has been successfully removed.',
      });
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4 rounded-lg border bg-card transition-all hover:shadow-md',
        task.completed && 'bg-card/60'
      )}
    >
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={handleToggle}
        disabled={isPending}
        className="mt-1 h-5 w-5"
        aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
      />
      <div className="flex-1 grid gap-1">
        <label
          htmlFor={`task-${task.id}`}
          className={cn(
            'font-medium text-lg leading-tight cursor-pointer',
            task.completed && 'line-through text-muted-foreground'
          )}
        >
          {task.title}
        </label>
        {task.description && (
          <p className={cn('text-sm text-muted-foreground', task.completed && 'line-through')}>
            {task.description}
          </p>
        )}
        {task.dueDate && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Calendar className="mr-1.5 h-3.5 w-3.5" />
            <span>{format(parseISO(task.dueDate), 'MMMM d, yyyy')}</span>
          </div>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your task
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
