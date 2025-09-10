'use server';
/**
 * @fileOverview A flow for finding cross-tradition parallels for a given verse based on a specific mode.
 *
 * - findSpecificParallels - A function that finds similar verses or teachings from a specified tradition type.
 */

import {ai} from '@/ai/genkit';
import {
  FindSpecificParallelsInput,
  FindSpecificParallelsInputSchema,
  FindSpecificParallelsOutput,
  FindSpecificParallelsOutputSchema,
} from '@/lib/types';

export async function findSpecificParallels(
  input: FindSpecificParallelsInput
): Promise<FindSpecificParallelsOutput> {
  return findSpecificParallelsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findSpecificParallelsPrompt',
  input: {schema: FindSpecificParallelsInputSchema},
  output: {schema: FindSpecificParallelsOutputSchema},
  prompt: `You are a comparative theology and philosophy expert.
For the given verse from a specific tradition, find several parallel teachings, quotes, or verses from other traditions that align with the selected worldview (targetMode).

- If 'targetMode' is Religious, only use sacred scriptures.
- If 'targetMode' is Spiritual, use mystical and reflective texts.
- If 'targetMode' is Non-Religious, use philosophical and secular works.
- If 'targetMode' is Universalist, draw from all categories.

Do not include parallels from the verse's original tradition. Each parallel MUST be a single string containing both the quote and its full reference.

Original Verse: "{{verse}}"
Original Tradition: "{{tradition}}"
Target Worldview: "{{targetMode}}"
`,
});

const findSpecificParallelsFlow = ai.defineFlow(
  {
    name: 'findSpecificParallelsFlow',
    inputSchema: FindSpecificParallelsInputSchema,
    outputSchema: FindSpecificParallelsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
