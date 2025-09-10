
'use server';

import { performSearch } from '@/ai/flows/perform-search';
import { transcribeAudio } from '@/ai/flows/transcribe-audio';
import { getRandomFact } from '@/ai/flows/get-random-fact';
import { findSpecificParallels } from '@/ai/flows/find-specific-parallels';
import type { SearchResult, SearchMode } from '@/lib/types';
import { z } from 'zod';
import { supportedScriptures } from '@/lib/data';

const SearchSchema = z.object({
    query: z.string().min(3, 'Search query must be at least 3 characters long.'),
    source: z.string(),
    mode: z.enum(['Religious', 'Spiritual', 'Non-Religious', 'Universalist']),
});

export async function searchVerseAction(prevState: any, formData: FormData): Promise<{data: SearchResult | null, error: string | null}> {
    const validatedFields = SearchSchema.safeParse({
        query: formData.get('query'),
        source: formData.get('source'),
        mode: formData.get('mode'),
    });

    if (!validatedFields.success) {
        const fieldErrors = validatedFields.error.flatten().fieldErrors;
        const errorMessage = fieldErrors.query?.[0] || fieldErrors.mode?.[0] || 'Invalid input.';
        return { data: null, error: errorMessage };
    }

    const { query, source, mode } = validatedFields.data;
    
    const defaultSourceForMode = supportedScriptures[mode][0];

    try {
        // If the selected source is the "Default" option for that mode, pass `undefined`,
        // otherwise, pass the selected source.
        const searchSource = source === defaultSourceForMode ? undefined : source;
        const searchResult = await performSearch({ query, source: searchSource, mode });

        if (!searchResult?.verse || !searchResult?.analysis || !searchResult?.parallels) {
            return { data: null, error: 'No verse found matching your query. Please try another search or explore themes.' };
        }
        
        const result: SearchResult = {
            verse: { ...searchResult.verse, id: searchResult.verse.source }, // Use source as a temporary ID
            analysis: searchResult.analysis,
            parallels: searchResult.parallels,
            initialMode: mode,
        };

        return { data: result, error: null };
    } catch (e) {
        console.error(e);
        return { data: null, error: 'An error occurred while analyzing the verse. Please try again later.' };
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
        // Return a default fact or an error message.
        return { fact: "The Golden Rule, 'Do unto others as you would have them do unto you,' appears in some form in nearly every major religion.", error: 'Could not fetch a new fact.' };
    }
}

const FindParallelsSchema = z.object({
  verse: z.string(),
  tradition: z.string(),
  targetMode: z.enum(['Religious', 'Spiritual', 'Non-Religious', 'Universalist']),
});

export async function findParallelsAction(
  verse: string,
  tradition: string,
  targetMode: SearchMode
): Promise<{ parallels: string[] | null; error: string | null }> {
  const validatedFields = FindParallelsSchema.safeParse({
    verse,
    tradition,
    targetMode,
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
