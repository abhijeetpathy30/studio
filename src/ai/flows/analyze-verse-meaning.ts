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
  reflection: z.string().describe('A non-religious, secular, or philosophical reflection on the verse\'s themes and ideas.'),
});
export type AnalyzeVerseMeaningOutput = z.infer<typeof AnalyzeVerseMeaningOutputSchema>;

export async function analyzeVerseMeaning(input: AnalyzeVerseMeaningInput): Promise<AnalyzeVerseMeaningOutput> {
  return analyzeVerseMeaningFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeVerseMeaningPrompt',
  input: {schema: AnalyzeVerseMeaningInputSchema},
  output: {schema: AnalyzeVerseMeaningOutputSchema},
  prompt: `You are a religious and philosophical scholar skilled in analyzing texts from multiple perspectives.

  For the following verse, provide three things:
  1.  A clear analysis of its meaning within its original context.
  2.  A list of key insights and lessons that can be drawn from it.
  3.  A non-religious, secular, or philosophical reflection on the verse's universal themes and ideas. This reflection should be accessible to someone who does not follow any specific religion, including an atheist perspective.

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
