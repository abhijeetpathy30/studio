'use server';

/**
 * @fileOverview Provides an analysis of a religious verse's meaning and context.
 *
 * - analyzeVerseMeaning - Analyzes the meaning and context of a religious verse.
 * - AnalyzeVerseMeaningInput - The input type for the analyzeVerseMeaning function.
 * - AnalyzeVerseMeaningOutput - The return type for the analyzeVerseMeaning function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeVerseMeaningInputSchema = z.object({
  verse: z.string().describe('The religious verse to analyze.'),
});
export type AnalyzeVerseMeaningInput = z.infer<typeof AnalyzeVerseMeaningInputSchema>;

const AnalyzeVerseMeaningOutputSchema = z.object({
  analysis: z.string().describe('The analysis of the verse meaning and context.'),
  insights: z.string().describe('Key insights and lessons extracted from the verse.'),
});
export type AnalyzeVerseMeaningOutput = z.infer<typeof AnalyzeVerseMeaningOutputSchema>;

export async function analyzeVerseMeaning(input: AnalyzeVerseMeaningInput): Promise<AnalyzeVerseMeaningOutput> {
  return analyzeVerseMeaningFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeVerseMeaningPrompt',
  input: {schema: AnalyzeVerseMeaningInputSchema},
  output: {schema: AnalyzeVerseMeaningOutputSchema},
  prompt: `You are a religious scholar skilled in analyzing religious texts.

  Analyze the meaning and context of the following verse, extracting key insights and lessons.

  Verse: {{{verse}}}
  `,
});

const analyzeVerseMeaningFlow = ai.defineFlow(
  {
    name: 'analyzeVerseMeaningFlow',
    inputSchema: AnalyzeVerseMeaningInputSchema,
    outputSchema: AnalyzeVerseMeaningOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
