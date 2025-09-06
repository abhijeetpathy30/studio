'use server';
/**
 * @fileOverview A flow for retrieving a verse from a specified scripture.
 *
 * - getVerse - A function that retrieves a verse based on a user query.
 * - GetVerseInput - The input type for the getVerse function.
 * - GetVerseOutput - The return type for the getVerse function.
 */

import {ai} from '@/ai/genkit';
import { VerseSchema } from '@/lib/types';
import {z} from 'genkit';
export type { Verse } from '@/lib/types';


const GetVerseInputSchema = z.object({
  query: z.string().describe('The user\'s query to find a specific verse, (e.g., "John 3:16", "Quran 2:255", "Dhammapada 1").'),
});
export type GetVerseInput = z.infer<typeof GetVerseInputSchema>;

const GetVerseOutputSchema = z.object({
  verse: VerseSchema.nullable().describe('The retrieved verse, or null if not found.'),
});
export type GetVerseOutput = z.infer<typeof GetVerseOutputSchema>;

const supportedScriptures = `
- Christianity: Bible (Old & New Testament)
- Islam: Quran, Hadith (Sahih al-Bukhari, Sahih Muslim)
- Judaism: Tanakh (Hebrew Bible), Talmud, Mishnah
- Hinduism: Bhagavad Gita, Upanishads, Vedas, Ramayana, Mahabharata
- Buddhism: Dhammapada, Pali Canon (Tipitaka), Mahayana Sutras
- Sikhism: Guru Granth Sahib
- Jainism: Agamas, Tattvartha Sutra
- Taoism: Tao Te Ching, Zhuangzi
- Confucianism: Analects
- Shinto: Kojiki, Nihon Shoki
- Baháʼí Faith: Writings of Bahá’u’lláh
- Zoroastrianism: Avesta
- Indigenous / Other: Popol Vuh (Maya)
`;

export async function getVerse(input: GetVerseInput): Promise<GetVerseOutput> {
  return getVerseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getVersePrompt',
  input: {schema: GetVerseInputSchema},
  output: {schema: GetVerseOutputSchema},
  prompt: `You are a scripture reference expert. Your task is to act as a reliable tool for retrieving a specific verse from a religious or philosophical text based on the user's query. Your primary goal is accuracy. Do not invent or hallucinate information.

You can retrieve verses from the following texts:
${supportedScriptures}

If the user query is a specific reference (e.g., "Romans 12:21", "Bhagavad Gita 2.47"), use your knowledge to find the exact text for that verse.
If the user query is a topic, find a single, highly relevant verse from one of the supported scriptures.

CRITICAL INSTRUCTIONS:
1.  **ACCURACY FIRST**: Only return a verse if you can confidently and accurately identify it from the specified texts.
2.  **NO HALLUCINATION**: If you are not certain about a verse, or if the user's query is ambiguous or not found in your knowledge base, you MUST return null for the 'verse' field. It is better to return nothing than to return incorrect information.
3.  **FORMATTING**: If you find the verse, populate the 'verse' object with the exact text, the specific source (e.g., book, chapter, verse), the tradition it belongs to, and a list of 1-3 relevant themes (like "Love", "Wisdom", "Peace").

Query: {{{query}}}
`,
});

const getVerseFlow = ai.defineFlow(
  {
    name: 'getVerseFlow',
    inputSchema: GetVerseInputSchema,
    outputSchema: GetVerseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
