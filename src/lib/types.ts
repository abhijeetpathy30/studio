import { z } from 'zod';

export const VerseSchema = z.object({
  text: z.string().describe('The text of the verse.'),
  source: z.string().describe('The source of the verse (e.g., book, chapter, verse number).'),
  tradition: z.string().describe('The religious or philosophical tradition the verse belongs to.'),
});

export type Verse = z.infer<typeof VerseSchema> & {
  id: string;
};

const AnalysisSchema = z.object({
  analysis: z.string().describe('The analysis of the verse meaning and context.'),
  insights: z.string().describe('Key insights and lessons extracted from the verse.'),
  reflection: z.string().describe('A non-religious, secular, or philosophical reflection on the verse\'s themes and ideas.'),
});

const ParallelsSchema = z.object({
  parallels: z
    .array(z.string())
    .describe('Similar verses or teachings from other traditions.'),
});


export const PerformSearchInputSchema = z.object({
  query: z.string().describe("The user's search query or topic."),
  source: z.string().optional().describe('The primary scripture to search within. If not provided, search all scriptures.'),
});
export type PerformSearchInput = z.infer<typeof PerformSearchInputSchema>;


export const PerformSearchOutputSchema = z.object({
    verse: VerseSchema.nullable(),
    analysis: AnalysisSchema.nullable(),
    parallels: ParallelsSchema.nullable(),
});
export type PerformSearchOutput = z.infer<typeof PerformSearchOutputSchema>;


export type SearchResult = {
  verse: Verse;
  analysis: z.infer<typeof AnalysisSchema>;
  parallels: z.infer<typeof ParallelsSchema>;
};

// User Profile System
export const UserProfileSchema = z.object({
  name: z.string(),
  identity: z.enum(['Religious', 'Spiritual', 'Non-religious']),
  selectedTraditions: z.array(z.string()),
  interests: z.array(z.string()),
  createdAt: z.string(), // Using ISO string for timestamp
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
