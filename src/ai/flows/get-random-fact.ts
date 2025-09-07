'use server';

/**
 * @fileOverview A flow for generating a random, interesting fact about world philosophy or religion.
 *
 * - getRandomFact - Generates a single, bite-sized fact.
 * - GetRandomFactOutput - The return type for the getRandomFact function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetRandomFactOutputSchema = z.object({
  fact: z.string().describe('A single, interesting, bite-sized fact about world religion or philosophy. It should be lesser-known and suitable for a general audience.'),
});
export type GetRandomFactOutput = z.infer<typeof GetRandomFactOutputSchema>;


export async function getRandomFact(): Promise<GetRandomFactOutput> {
  return getRandomFactFlow();
}

const prompt = ai.definePrompt({
  name: 'getRandomFactPrompt',
  output: {schema: GetRandomFactOutputSchema},
  prompt: `Generate a single, interesting, and lesser-known fact about world religions or philosophies. The fact should be concise and easily understandable for a general audience. Do not repeat facts you have given before if possible. Frame it as a standalone statement.`,
});

const getRandomFactFlow = ai.defineFlow(
  {
    name: 'getRandomFactFlow',
    outputSchema: GetRandomFactOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
