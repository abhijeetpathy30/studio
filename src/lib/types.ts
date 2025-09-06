import { z } from 'zod';
import type { AnalyzeVerseMeaningOutput } from '@/ai/flows/analyze-verse-meaning';
import type { FindCrossTraditionParallelsOutput } from '@/ai/flows/find-cross-tradition-parallels';

export const VerseSchema = z.object({
  text: z.string().describe('The text of the verse.'),
  source: z.string().describe('The source of the verse (e.g., book, chapter, verse number).'),
  tradition: z.string().describe('The religious or philosophical tradition the verse belongs to.'),
  themes: z.array(z.string()).describe('A list of themes associated with the verse.'),
});

export type Verse = z.infer<typeof VerseSchema> & {
  id: string;
};

export type SearchResult = {
  verse: Verse;
  analysis: AnalyzeVerseMeaningOutput;
  parallels: FindCrossTraditionParallelsOutput;
}
