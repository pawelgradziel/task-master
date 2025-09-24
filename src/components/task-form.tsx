'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Loader2, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { addTask, updateTask, getSuggestedDate } from '@/lib/actions';
import type { Task } from '@/lib/types';
import { DatePicker } from './date-picker';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  description: z.string().optional().default(''),
  dueDate: z.date().nullable().optional(),
});

type TaskFormProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  task?: Task | null;
};

export function TaskForm({ isOpen, onOpenChange, task }: TaskFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: null,
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [aiReasoning, setAiReasoning] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
      });
    } else {
      form.reset({
        title: '',
        description: '',
        dueDate: null,
      });
    }
    setAiReasoning(null);
  }, [task, isOpen, form]);

  const handleSuggestDate = async () => {
    const description = form.getValues('description');
    if (!description) {
      toast({
        title: 'Description needed',
        description: 'Please enter a description to get a date suggestion.',
        variant: 'destructive',
      });
      return;
    }

    setIsAiLoading(true);
    setAiReasoning(null);
    const result = await getSuggestedDate(description);
    setIsAiLoading(false);

    if (result.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    } else if (result.suggestedDate) {
      const suggested = new Date(result.suggestedDate);
      // Adjust for timezone offset to prevent date from being off by one day
      const timezoneOffset = suggested.getTimezoneOffset() * 60000;
      form.setValue('dueDate', new Date(suggested.getTime() + timezoneOffset), { shouldValidate: true });
      setAiReasoning(result.reasoning || null);
      toast({
        title: 'Date Suggested!',
        description: 'The AI has suggested a due date for your task.',
      });
    }
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description || '');
    formData.append('dueDate', values.dueDate ? values.dueDate.toISOString().split('T')[0] : '');

    const result = task 
      ? await updateTask(task.id, formData)
      : await addTask(formData);
    
    setIsSubmitting(false);

    if (result?.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success!',
        description: `Task has been ${task ? 'updated' : 'created'}.`,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Add a New Task'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Finalize project report" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add more details about the task..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <FormLabel>Due Date</FormLabel>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleSuggestDate}
                        disabled={isAiLoading}
                        className="text-sm"
                    >
                        {isAiLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
                        )}
                        Suggest Date
                    </Button>
                </div>
                 <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <DatePicker 
                                  value={field.value}
                                  onChange={field.onChange}
                                  disabled={isSubmitting}
                                />
                                {aiReasoning && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0">
                                                <Info className="h-4 w-4"/>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="max-w-xs">{aiReasoning}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                )}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting} style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {task ? 'Save Changes' : 'Create Task'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
