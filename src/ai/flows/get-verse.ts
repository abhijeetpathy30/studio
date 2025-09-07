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
  query: z.string().describe('The user\'s topic to find a specific verse for (e.g., "love", "justice").'),
  source: z.string().optional().describe('A specific scripture to search within (e.g., "Bhagavad Gita", "Quran").'),
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

const getVerseFlow = ai.defineFlow(
  {
    name: 'getVerseFlow',
    inputSchema: GetVerseInputSchema,
    outputSchema: GetVerseOutputSchema,
  },
  async ({ query, source }) => {
    let promptToUse;
    let promptInput: any = { query };

    if (source && source !== "Default (All Scriptures)") {
      // Use a strict prompt when a source is specified
      promptToUse = ai.definePrompt({
        name: 'getVerseStrictPrompt',
        input: { schema: z.object({ query: z.string(), source: z.string() }) },
        output: { schema: GetVerseOutputSchema },
        prompt: `You are a scripture retrieval expert. Your ONLY job is to find a relevant verse about a topic from a SINGLE SPECIFIED scripture.

**CRITICAL INSTRUCTIONS:**
1. You **MUST** find a verse related to the topic "{{query}}" from the scripture "{{source}}".
2. If you cannot find a relevant verse on the topic within "{{source}}", you **MUST** return \`null\` for the 'verse' field.
3. **DO NOT** select a verse from a different scripture. Your priority is to obey the user's selected source.
4. Accuracy is paramount. Do not invent verses. If you are uncertain or cannot find a match, return \`null\`.

**Topic**: {{{query}}}
**Scripture**: {{{source}}}
`,
      });
      promptInput = { query, source };
    } else {
      // Use a general prompt when no source is specified
      promptToUse = ai.definePrompt({
        name: 'getVerseGeneralPrompt',
        input: { schema: z.object({ query: z.string() }) },
        output: { schema: GetVerseOutputSchema },
        prompt: `You are a scripture retrieval expert. Your job is to find the best verse matching the user's query from a wide range of world scriptures.

Your knowledge base includes these texts:
${supportedScriptures}

**Instructions**:
1. Use fuzzy matching for misspellings (e.g., "Bhagvad Geeta" -> "Bhagavad Gita", "forgivness" -> "forgiveness").
2. The query may be a direct verse reference (e.g., "John 3:16") or a topic (e.g., "love"). Find the best match.
3. Accuracy is paramount. Do not invent verses. If you are uncertain or cannot find a match, return \`null\`.

**User Query**: {{{query}}}
`,
      });
      promptInput = { query };
    }
    
    const { output } = await promptToUse(promptInput);
    return output!;
  }
);
