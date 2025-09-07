'use server';

import { performSearch } from '@/ai/flows/perform-search';
import type { SearchResult } from '@/lib/types';
import { z } from 'zod';
import { supportedScriptures } from '@/lib/data';

const SearchSchema = z.object({
    query: z.string().min(3, 'Search query must be at least 3 characters long.'),
    source: z.string(),
});

export async function searchVerseAction(prevState: any, formData: FormData): Promise<{data: SearchResult | null, error: string | null}> {
    const validatedFields = SearchSchema.safeParse({
        query: formData.get('query'),
        source: formData.get('source'),
    });

    if (!validatedFields.success) {
        return { data: null, error: validatedFields.error.flatten().fieldErrors.query?.[0] || 'Invalid input.' };
    }

    const { query, source } = validatedFields.data;

    try {
        const searchResult = await performSearch({ query, source: source === supportedScriptures[0] ? undefined : source });

        if (!searchResult?.verse || !searchResult?.analysis || !searchResult?.parallels) {
            return { data: null, error: 'No verse found matching your query. Please try another search or explore themes.' };
        }
        
        const result: SearchResult = {
            verse: { ...searchResult.verse, id: searchResult.verse.source }, // Use source as a temporary ID
            analysis: searchResult.analysis,
            parallels: searchResult.parallels,
        };

        return { data: result, error: null };
    } catch (e) {
        console.error(e);
        return { data: null, error: 'An error occurred while analyzing the verse. Please try again later.' };
    }
}
