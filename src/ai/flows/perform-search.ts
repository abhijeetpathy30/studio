'use server';
/**
 * @fileOverview A comprehensive flow to search for a verse and get a full analysis in one call.
 *
 * - performSearch - Finds a verse, analyzes it, and finds parallels.
 * - PerformSearchInput - The input type for the performSearch function.
 * - PerformSearchOutput - The return type for the performSearch function.
 */

import {ai} from '@/ai/genkit';
import {VerseSchema} from '@/lib/types';
import {z} from 'genkit';

const PerformSearchInputSchema = z.object({
  query: z
    .string()
    .describe('The topic or reference to search for (e.g., "love", "justice").'),
  source: z
    .string()
    .optional()
    .describe(
      'A specific scripture to search within (e.g., "Bhagavad Gita"). If not provided, search all supported scriptures.'
    ),
});
export type PerformSearchInput = z.infer<typeof PerformSearchInputSchema>;

const PerformSearchOutputSchema = z.object({
  verse: VerseSchema.nullable().describe(
    'The retrieved verse, or null if not found.'
  ),
  analysis: z
    .object({
      analysis: z
        .string()
        .describe('The analysis of the verse meaning and context.'),
      insights: z
        .string()
        .describe('Key insights and lessons extracted from the verse.'),
      reflection: z
        .string()
        .describe(
          "A non-religious, secular, or philosophical reflection on the verse's themes and ideas."
        ),
    })
    .nullable(),
  parallels: z
    .object({
      parallels: z
        .array(z.string())
        .describe('Similar verses or teachings from other traditions.'),
    })
    .nullable(),
});
export type PerformSearchOutput = z.infer<typeof PerformSearchOutputSchema>;

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

const prompt = ai.definePrompt({
  name: 'performSearchPrompt',
  input: {schema: PerformSearchInputSchema},
  output: {schema: PerformSearchOutputSchema},
  prompt: `You are an expert theological and philosophical research assistant. Your goal is to perform a comprehensive analysis based on a user's query in a single pass.

  Your knowledge base includes these texts:
  ${supportedScriptures}

  **CRITICAL INSTRUCTIONS:**

  1.  **Verse Retrieval**:
      *   First, you **MUST** find the single best verse matching the user's query: "{{query}}".
      *   **Source Priority**: If a specific scripture source is provided ({{#if source}}"{{source}}"{{else}}not provided{{/if}}), you **MUST** find the verse from that source. If no relevant verse is found in the specified source, you **MUST** return \`null\` for the 'verse' field and all other fields. Do not look in other scriptures.
      *   **General Search**: If no source is provided, find the best match from any of the supported scriptures.
      *   **Fuzzy Matching**: Use fuzzy matching for misspellings (e.g., "Bhagvad Geeta" -> "Bhagavad Gita", "forgivness" -> "forgiveness").
      *   If no verse is found anywhere, return \`null\` for all fields.

  2.  **Verse Analysis (if a verse is found)**:
      *   Provide a clear analysis of its meaning within its original context.
      *   List the key insights and lessons that can be drawn from it.
      *   Write a non-religious, secular, or philosophical reflection on the verse's universal themes, accessible to an atheist.

  3.  **Cross-Tradition Parallels (if a verse is found)**:
      *   Find and list several similar verses or teachings from other religious and philosophical traditions that echo the theme of the found verse.

  Perform all of these steps and return the complete output structure.
  `,
});

export async function performSearch(
  input: PerformSearchInput
): Promise<PerformSearchOutput> {
  const {output} = await prompt(input);
  return output!;
}
