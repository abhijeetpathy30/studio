
import { z } from 'zod';

export const VerseSchema = z.object({
  text: z.string().describe('The text of the verse.'),
  source: z.string().describe('The source of the verse (e.g., book, chapter, verse number).'),
  tradition: z.string().describe('The religious or philosophical tradition the verse belongs to.'),
});

export type Verse = z.infer<typeof VerseSchema> & {
  id: string;
};

export const AnalysisSchema = z.object({
  analysis: z.string().describe('The analysis of the verse meaning and context.'),
  insights: z.string().describe('Key insights and lessons extracted from the verse.'),
  reflection: z.string().describe('A non-religious, secular, or philosophical reflection on the verse\'s themes and ideas.'),
}).nullable();
export type Analysis = z.infer<typeof AnalysisSchema>;

export const ParallelsSchema = z.object({
  parallels: z
    .array(z.string())
    .describe('Similar verses or teachings from other traditions.'),
}).nullable();
export type Parallels = z.infer<typeof ParallelsSchema>;


export const SearchModeSchema = z.enum(['Religious', 'Spiritual', 'Non-Religious', 'Universalist']);
export type SearchMode = z.infer<typeof SearchModeSchema>;

export const PerformSearchInputSchema = z.object({
  query: z.string().describe("The user's search query or topic."),
  mode: SearchModeSchema.describe('The philosophical mode for the search.'),
});
export type PerformSearchInput = z.infer<typeof PerformSearchInputSchema>;


export const PerformSearchOutputSchema = z.object({
    verse: VerseSchema.nullable(),
    analysis: AnalysisSchema,
    parallels: ParallelsSchema,
});
export type PerformSearchOutput = z.infer<typeof PerformSearchOutputSchema>;

export const FindSpecificParallelsInputSchema = z.object({
  verse: z.string().describe('The original verse to find parallels for.'),
  tradition: z
    .string()
    .describe('The tradition the original verse belongs to.'),
  targetMode: SearchModeSchema.describe(
    'The target worldview to find parallels in.'
  ),
  targetSources: z.array(z.string()).optional().describe('An optional list of specific texts within the target worldview to find parallels in.'),
});
export type FindSpecificParallelsInput = z.infer<
  typeof FindSpecificParallelsInputSchema
>;

export const FindSpecificParallelsOutputSchema = z.object({
  parallels: z
    .array(z.string())
    .describe('Similar verses or teachings from the target tradition type.'),
});
export type FindSpecificParallelsOutput = z.infer<
  typeof FindSpecificParallelsOutputSchema
>;


export type SearchResult = {
  verse: Verse;
  analysis: Analysis;
  parallels: Parallels;
  initialMode: SearchMode;
};
