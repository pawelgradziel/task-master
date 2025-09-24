'use server';

/**
 * @fileOverview A smart date suggestion AI agent.
 *
 * - suggestDate - A function that suggests a reasonable completion date for a task based on its description.
 * - SmartDateSuggestionInput - The input type for the suggestDate function.
 * - SmartDateSuggestionOutput - The return type for the suggestDate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartDateSuggestionInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task.'),
});
export type SmartDateSuggestionInput = z.infer<typeof SmartDateSuggestionInputSchema>;

const SmartDateSuggestionOutputSchema = z.object({
  suggestedDate: z.string().describe('The suggested completion date for the task in ISO format (YYYY-MM-DD).'),
  reasoning: z.string().describe('The reasoning behind the suggested date.'),
});
export type SmartDateSuggestionOutput = z.infer<typeof SmartDateSuggestionOutputSchema>;

export async function suggestDate(input: SmartDateSuggestionInput): Promise<SmartDateSuggestionOutput> {
  return smartDateSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartDateSuggestionPrompt',
  input: {schema: SmartDateSuggestionInputSchema},
  output: {schema: SmartDateSuggestionOutputSchema},
  prompt: `You are a helpful assistant that suggests a reasonable completion date for a task based on its description.

  Task Description: {{{taskDescription}}}

  Consider the task description and suggest a completion date in ISO format (YYYY-MM-DD). Also, provide a brief reasoning for the suggested date.

  Output the date and reasoning in JSON format.
  `,
});

const smartDateSuggestionFlow = ai.defineFlow(
  {
    name: 'smartDateSuggestionFlow',
    inputSchema: SmartDateSuggestionInputSchema,
    outputSchema: SmartDateSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
