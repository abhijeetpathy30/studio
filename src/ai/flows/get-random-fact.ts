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
  prompt: `Generate a single, interesting, and lesser-known fact about world religions or philosophies. 

  Ensure the facts are drawn from a wide and diverse range of traditions, including but not limited to:
  - Abrahamic religions (Christianity, Judaism, Islam)
  - Dharmic religions (Hinduism, Buddhism, Jainism, Sikhism)
  - East Asian philosophies (Taoism, Confucianism, Shinto)
  - Indigenous spiritual traditions from various cultures (e.g., Native American, African, Australian Aboriginal)
  - Ancient philosophies (Stoicism, Platonism, Epicureanism)
  - Zoroastrianism
  - Newer religious movements or syncretic faiths.

  The fact should be concise and easily understandable for a general audience. Do not repeat facts you have given before if possible. Frame it as a standalone statement.`,
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
