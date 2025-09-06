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
  prompt: `You are a scripture reference expert. Your task is to retrieve a specific verse from a religious or philosophical text based on the user's query.

You can retrieve verses from the following texts:
${supportedScriptures}

If the user query is a specific reference (e.g., "Romans 12:21", "Bhagavad Gita 2.47"), return the text for that verse.
If the user query is a topic, find a relevant verse from one of the supported scriptures.

If you can find the verse, populate the 'verse' object with the text, source, tradition, and a list of 1-3 relevant themes (like "Love", "Wisdom", "Peace").
If you cannot find a matching verse for the query, return null for the 'verse' field.

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
