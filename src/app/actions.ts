
'use server';

import { transcribeAudio } from '@/ai/flows/transcribe-audio';
import { getRandomFact } from '@/ai/flows/get-random-fact';
import { findSpecificParallels } from '@/ai/flows/find-specific-parallels';
import { performSearch } from '@/ai/flows/perform-search';
import type { SearchMode, SearchResult } from '@/lib/types';
import { z } from 'zod';

const SearchSchema = z.object({
    query: z.string().min(3, 'Search query must be at least 3 characters long.'),
    mode: z.enum(['Religious', 'Spiritual', 'Non-Religious', 'Universalist']),
});

export async function searchVerseAction(prevState: any, formData: FormData): Promise<{data: SearchResult | null, error: string | null}> {
    const validatedFields = SearchSchema.safeParse({
        query: formData.get('query'),
        mode: formData.get('mode'),
    });

    if (!validatedFields.success) {
        const fieldErrors = validatedFields.error.flatten().fieldErrors;
        const errorMessage = fieldErrors.query?.[0] || fieldErrors.mode?.[0] || 'Invalid input.';
        return { data: null, error: errorMessage };
    }

    const { query, mode } = validatedFields.data;
    
    try {
        const searchResult = await performSearch({ query, mode });

        if (!searchResult || !searchResult.verse) {
            return { data: null, error: 'No verse found matching your query. Please try another search or explore themes.' };
        }
        
        const result: SearchResult = {
            verse: { ...searchResult.verse, id: searchResult.verse.source }, // Use source as a temporary ID
            analysis: searchResult.analysis,
            parallels: searchResult.parallels || { parallels: [] }, // Ensure parallels is not null
            initialMode: mode,
        };

        return { data: result, error: null };
    } catch (e) {
        console.error(e);
        return { data: null, error: 'An error occurred while searching for the verse. Please try again later.' };
    }
}

const TranscribeSchema = z.object({
    audioDataUri: z.string(),
});

export async function transcribeAudioAction(audioDataUri: string): Promise<{text: string | null, error: string | null}> {
    const validatedFields = TranscribeSchema.safeParse({ audioDataUri });

    if (!validatedFields.success) {
        return { text: null, error: 'Invalid audio data.' };
    }

    try {
        const { text } = await transcribeAudio({ audioDataUri: validatedFields.data.audioDataUri });
        return { text, error: null };
    } catch (e) {
        console.error(e);
        return { text: null, error: 'An error occurred during transcription. Please try again.' };
    }
}

export async function getRandomFactAction(): Promise<{ fact: string | null; error: string | null; }> {
    try {
        const { fact } = await getRandomFact();
        return { fact, error: null };
    } catch (e) {
        console.error('Error fetching random fact:', e);
        return { fact: "The Golden Rule, 'Do unto others as you would have them do unto you,' appears in some form in nearly every major religion.", error: 'Could not fetch a new fact.' };
    }
}

const FindParallelsSchema = z.object({
  verse: z.string(),
  tradition: z.string(),
  targetMode: z.enum(['Religious', 'Spiritual', 'Non-Religious', 'Universalist']),
  targetSources: z.array(z.string()).optional(),
});

export async function findParallelsAction(
  verse: string,
  tradition: string,
  targetMode: SearchMode,
  targetSources?: string[],
): Promise<{ parallels: string[] | null; error: string | null }> {
  const validatedFields = FindParallelsSchema.safeParse({
    verse,
    tradition,
    targetMode,
    targetSources,
  });

  if (!validatedFields.success) {
    return { parallels: null, error: 'Invalid input for finding parallels.' };
  }

  try {
    const result = await findSpecificParallels(validatedFields.data);
    return { parallels: result.parallels, error: null };
  } catch (e) {
    console.error('Error finding parallels:', e);
    return { parallels: null, error: 'An error occurred while finding new parallels.' };
  }
}
