
'use server';
/**
 * @fileOverview A flow for performing a comprehensive search for a verse, its analysis, and parallels.
 *
 * - performSearch - A function that returns a verse, its analysis, and parallels.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  PerformSearchInput,
  PerformSearchInputSchema,
  PerformSearchOutput,
  PerformSearchOutputSchema,
  VerseSchema,
} from '@/lib/types';

const AnalysisSchema = z.object({
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
});

const ParallelsSchema = z.object({
  parallels: z
    .array(z.string())
    .describe('Similar verses or teachings from other traditions.'),
});

const FindVerseOutputSchema = z.object({
  verse: VerseSchema.nullable(),
});

export async function performSearch(
  input: PerformSearchInput
): Promise<PerformSearchOutput> {
  return performSearchFlow(input);
}

// Define prompts for each mode
const religiousPrompt = ai.definePrompt({
  name: 'findReligiousVersePrompt',
  input: {schema: PerformSearchInputSchema},
  output: {schema: FindVerseOutputSchema},
  prompt: `You are an expert theological research assistant. Find the single best verse for the user's topic from a **Religious** text (e.g., Bible, Qur'an, Vedas, Talmud). Return only the verse, source, and tradition. Do not invent verses.
    **Topic**: {{{query}}}
    `,
});

const spiritualPrompt = ai.definePrompt({
  name: 'findSpiritualVersePrompt',
  input: {schema: PerformSearchInputSchema},
  output: {schema: FindVerseOutputSchema},
  prompt: `You are an expert philosophical research assistant. Find the single best quote for the user's topic from a **Spiritual** text (e.g., Rumi, Tao Te Ching, Stoics). Return only the quote, source, and tradition. Do not invent passages.
    **Topic**: {{{query}}}
    `,
});

const nonReligiousPrompt = ai.definePrompt({
  name: 'findNonReligiousVersePrompt',
  input: {schema: PerformSearchInputSchema},
  output: {schema: FindVerseOutputSchema},
  prompt: `You are an expert philosophical research assistant. Find the single best quote for the user's topic from a **Non-Religious** text (e.g., Aristotle, Kant, Russell). Return only the passage, source, and tradition. Do not invent passages.
    **Topic**: {{{query}}}
    `,
});

const universalistPrompt = ai.definePrompt({
  name: 'findUniversalistVersePrompt',
  input: {schema: PerformSearchInputSchema},
  output: {schema: FindVerseOutputSchema},
  prompt: `You are an expert in comparative philosophy. Find the single best quote for the user's topic from **any** text (religious, spiritual, or non-religious). Return only the passage, source, and tradition. Do not invent passages.
    **Topic**: {{{query}}}
    `,
});

const analyzePrompt = ai.definePrompt({
  name: 'analyzeVerseMeaningPrompt',
  input: {schema: z.object({verse: z.string()})},
  output: {schema: AnalysisSchema},
  prompt: `You are a religious and philosophical scholar. For the verse, provide:
  1.  A clear analysis of its meaning.
  2.  A list of key insights.
  3.  A non-religious/secular reflection on its universal themes.
  Verse: {{{verse}}}
  `,
});

const findParallelsPrompt = ai.definePrompt({
  name: 'findCrossTraditionParallelsPrompt',
  input: {schema: z.object({verse: z.string(), tradition: z.string()})},
  output: {schema: ParallelsSchema},
  prompt: `Find similar verses or teachings from other religious and philosophical traditions for the following verse.

Verse: {{{verse}}}
Tradition: {{{tradition}}}

Output the verses in a bulleted list.
`,
});

const performSearchFlow = ai.defineFlow(
  {
    name: 'performSearchFlow',
    inputSchema: PerformSearchInputSchema,
    outputSchema: PerformSearchOutputSchema,
  },
  async input => {
    let findVersePrompt;
    switch (input.mode) {
      case 'Spiritual':
        findVersePrompt = spiritualPrompt;
        break;
      case 'Non-Religious':
        findVersePrompt = nonReligiousPrompt;
        break;
      case 'Universalist':
        findVersePrompt = universalistPrompt;
        break;
      case 'Religious':
      default:
        findVersePrompt = religiousPrompt;
        break;
    }

    // First, find the verse.
    const {output: findVerseOutput} = await findVersePrompt(input);
    if (!findVerseOutput?.verse) {
      return {verse: null, analysis: null, parallels: null};
    }

    const {verse} = findVerseOutput;

    // Now, run analysis and parallels searches in parallel.
    const [analysisResult, parallelsResult] = await Promise.all([
      analyzePrompt({verse: verse.text}),
      findParallelsPrompt({verse: verse.text, tradition: verse.tradition}),
    ]);
    
    return {
      verse,
      analysis: analysisResult.output,
      parallels: parallelsResult.output,
    };
  }
);
