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
  prompt: `You are a theological and philosophical historian. Generate a single, interesting, and lesser-known fact about world religions or philosophies.

  **CRITICAL INSTRUCTIONS:**
  1.  **DO NOT REPEAT FACTS.** You must provide a new and unique fact each time.
  2.  **ENSURE DIVERSITY.** You MUST draw from a wide and diverse range of traditions. Do not focus on one region or type of belief. You must rotate through the following categories:
      - Abrahamic religions (e.g., Christianity, Judaism, Islam, Baháʼí Faith)
      - Dharmic religions (e.g., Hinduism, Buddhism, Jainism, Sikhism)
      - East Asian philosophies (e.g., Taoism, Confucianism, Shinto)
      - Indigenous spiritual traditions (e.g., Native American, African, Australian Aboriginal, Polynesian)
      - Ancient philosophies (e.g., Stoicism, Platonism, Epicureanism, Ancient Egyptian beliefs)
      - Other traditions (e.g., Zoroastrianism, Shamanism, Syncretic faiths)

  The fact should be concise, easily understandable for a general audience, and framed as a standalone statement.
  `,
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
