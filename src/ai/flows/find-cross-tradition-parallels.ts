'use server';
/**
 * @fileOverview A flow for finding cross-tradition parallels for a given verse.
 *
 * - findCrossTraditionParallels - A function that finds similar verses or teachings from other religious and philosophical traditions.
 * - FindCrossTraditionParallelsInput - The input type for the findCrossTraditionParallels function.
 * - FindCrossTraditionParallelsOutput - The return type for the findCrossTraditionParallels function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindCrossTraditionParallelsInputSchema = z.object({
  verse: z.string().describe('The verse to find parallels for.'),
  tradition: z.string().describe('The tradition the verse belongs to.'),
});
export type FindCrossTraditionParallelsInput = z.infer<typeof FindCrossTraditionParallelsInputSchema>;

const FindCrossTraditionParallelsOutputSchema = z.object({
  parallels: z
    .array(z.string())
    .describe('Similar verses or teachings from other traditions.'),
});
export type FindCrossTraditionParallelsOutput = z.infer<typeof FindCrossTraditionParallelsOutputSchema>;

export async function findCrossTraditionParallels(
  input: FindCrossTraditionParallelsInput
): Promise<FindCrossTraditionParallelsOutput> {
  return findCrossTraditionParallelsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findCrossTraditionParallelsPrompt',
  input: {schema: FindCrossTraditionParallelsInputSchema},
  output: {schema: FindCrossTraditionParallelsOutputSchema},
  prompt: `Find similar verses or teachings from other religious and philosophical traditions for the following verse.

Verse: {{{verse}}}
Tradition: {{{tradition}}}

Output the verses in a bulleted list.
`,
});

const findCrossTraditionParallelsFlow = ai.defineFlow(
  {
    name: 'findCrossTraditionParallelsFlow',
    inputSchema: FindCrossTraditionParallelsInputSchema,
    outputSchema: FindCrossTraditionParallelsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
