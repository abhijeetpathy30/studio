'use server';
/**
 * @fileOverview A comprehensive flow to search for a verse and get a full analysis in one call.
 *
 * - performSearch - Finds a verse, analyzes it, and finds parallels.
 */

import {ai} from '@/ai/genkit';
import {
  PerformSearchInput,
  PerformSearchInputSchema,
  PerformSearchOutput,
  PerformSearchOutputSchema,
} from '@/lib/types';
import {z} from 'genkit';
import { supportedScriptures } from '@/lib/data';


const strictSearchPrompt = ai.definePrompt({
  name: 'performStrictSearchPrompt',
  input: {schema: z.object({query: z.string(), source: z.string()})},
  output: {schema: PerformSearchOutputSchema},
  prompt: `You are an expert theological and philosophical research assistant. Your goal is to perform a comprehensive analysis based on a user's query in a single pass.

    **CRITICAL REQUIREMENT:**
    1.  **Verse Retrieval**: You **MUST** find the single best verse matching the user's topic "{{query}}" from the scripture "{{source}}".
    2.  **Source Priority**: If you cannot find a relevant verse on that topic within "{{source}}", you **MUST** return \`null\` for the 'verse' field and all other fields. Do not look in other scriptures. Your only priority is to obey the user's selected source.
    3.  If a verse is found, and only if a verse is found:
        *   **Verse Analysis**: Provide a clear analysis of its meaning, a list of key insights, and a secular reflection on its themes.
        *   **Cross-Tradition Parallels**: Find and list several similar verses or teachings from *other* religious and philosophical traditions.

    Accuracy is paramount. Do not invent verses. If you are uncertain or cannot find a match, return \`null\` for all fields.

    **Topic**: {{{query}}}
    **Scripture**: {{{source}}}
    `,
});

const generalSearchPrompt = ai.definePrompt({
  name: 'performGeneralSearchPrompt',
  input: {schema: z.object({query: z.string()})},
  output: {schema: PerformSearchOutputSchema},
  prompt: `You are an expert theological and philosophical research assistant. Your goal is to perform a comprehensive analysis based on a user's query in a single pass.

    Your knowledge base includes these texts:
    ${supportedScriptures.join('\n')}

    **INSTRUCTIONS:**
    1.  **Verse Retrieval**: First, you **MUST** find the single best verse matching the user's query: "{{query}}". Find the best match from any of the supported scriptures.
    2.  **Fuzzy Matching**: Use fuzzy matching for misspellings (e.g., "Bhagvad Geeta" -> "Bhagavad Gita", "forgivness" -> "forgiveness").
    3.  If no verse is found anywhere, return \`null\` for all fields.
    4.  If a verse is found, and only if a verse is found:
        *   **Verse Analysis**: Provide a clear analysis of its meaning, a list of key insights, and a secular reflection on its themes.
        *   **Cross-Tradition Parallels**: Find and list several similar verses or teachings from other religious and philosophical traditions.

    Perform all of these steps and return the complete output structure.
    `,
});

const performSearchFlow = ai.defineFlow(
  {
    name: 'performSearchFlow',
    inputSchema: PerformSearchInputSchema,
    outputSchema: PerformSearchOutputSchema,
  },
  async input => {
    if (input.source && input.source !== 'Default (All Scriptures)') {
      const {output} = await strictSearchPrompt(
        input as {query: string; source: string}
      );
      return output!;
    }

    const {output} = await generalSearchPrompt(input);
    return output!;
  }
);

export async function performSearch(
  input: PerformSearchInput
): Promise<PerformSearchOutput> {
  return performSearchFlow(input);
}
