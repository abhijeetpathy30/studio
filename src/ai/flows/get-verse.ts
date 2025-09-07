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
  query: z.string().describe('The user\'s query to find a specific verse, (e.g., "John 3:16", "Quran 2:255", "Dhammapada 1"). It may be prefixed with a scripture name like "Bhagavad Gita: love".'),
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
- Philosophy: Works of Plato, Aristotle, Confucius, Marcus Aurelius
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

INTELLIGENT SEARCH INSTRUCTIONS:
1.  **ABSOLUTE REQUIREMENT - PRIMARY SOURCE**: If the query contains a scripture name followed by a colon (e.g., "Bhagavad Gita: Justice"), you MUST find a verse related to the topic ("Justice") from within that specified scripture ("Bhagavad Gita"). The main result MUST come from the specified scripture. If you cannot find a relevant verse within the specified scripture, you MUST return null for the 'verse' field. DO NOT select a verse from a different scripture.
2.  **FUZZY MATCHING**: The user may misspell names, topics, or references. Use intelligent "fuzzy matching" to find the correct verse. For example:
    *   "Bhagvad Geeta" should map to "Bhagavad Gita".
    *   "forgivness" should map to "forgiveness".
    *   "Jon 3 16" should map to "John 3:16".
3.  **TOPIC SEARCH**: If the user query is a topic without a specified scripture (e.g., "love", "justice"), find a single, highly relevant verse from any of the supported scriptures.
4.  **APPROXIMATE RESULTS**: If an exact match is not found, return the closest relevant passage, but ALWAYS respect the primary source if one is specified.

CRITICAL OUTPUT INSTRUCTIONS:
1.  **ACCURACY FIRST**: Only return a verse if you can confidently and accurately identify it.
2.  **NO HALLUCINATION**: If you are not certain, or if the user's query is too ambiguous or not found in your knowledge base, you MUST return null for the 'verse' field. It is better to return nothing than to return incorrect information.
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
