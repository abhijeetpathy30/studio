import type { AnalyzeVerseMeaningOutput } from '@/ai/flows/analyze-verse-meaning';
import type { FindCrossTraditionParallelsOutput } from '@/ai/flows/find-cross-tradition-parallels';

export type Verse = {
  id: string;
  text: string;
  source: string;
  tradition: string;
  themes: string[];
};

export type SearchResult = {
  verse: Verse;
  analysis: AnalyzeVerseMeaningOutput;
  parallels: FindCrossTraditionParallelsOutput;
}
