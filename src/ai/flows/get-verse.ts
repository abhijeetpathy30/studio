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
  prompt: `You are a scripture retrieval expert. Your only job is to find a specific verse based on a user's query.

Your knowledge base includes these texts:
${supportedScriptures}

**CRITICAL INSTRUCTIONS:**

1.  **Check for a Primary Source**: Look at the user's query. It may contain a scripture name followed by a colon (e.g., "Bhagavad Gita: Compassion"). This is the **Primary Source**.

2.  **Primary Source is an ABSOLUTE REQUIREMENT**:
    *   If a **Primary Source** is specified, you **MUST** find a relevant verse *from that source only*.
    *   If you cannot find a relevant verse on the topic within the specified **Primary Source**, you **MUST** return \`null\` for the 'verse' field.
    *   **DO NOT** select a verse from a different scripture, even if it seems like a better match. Your priority is to obey the user's selected source.

3.  **No Primary Source**: If the query is just a topic (e.g., "love") or a direct verse reference (e.g., "John 3:16"), find the best match from any of the supported scriptures.

4.  **Fuzzy Matching**: Use fuzzy matching for misspellings (e.g., "Bhagvad Geeta" -> "Bhagavad Gita", "forgivness" -> "forgiveness").

5.  **Accuracy is Paramount**: Do not invent verses. If you are uncertain or cannot find a match, return \`null\`. It is better to return nothing than to return incorrect information.

**User Query**: {{{query}}}
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
