'use server';

import { analyzeVerseMeaning } from '@/ai/flows/analyze-verse-meaning';
import { findCrossTraditionParallels } from '@/ai/flows/find-cross-tradition-parallels';
import { getVerse } from '@/ai/flows/get-verse';
import type { SearchResult } from '@/lib/types';
import { z } from 'zod';

const SearchSchema = z.object({
    query: z.string().min(3, 'Search query must be at least 3 characters long.'),
});

export async function searchVerseAction(prevState: any, formData: FormData): Promise<{data: SearchResult | null, error: string | null}> {
    const validatedFields = SearchSchema.safeParse({
        query: formData.get('query'),
    });

    if (!validatedFields.success) {
        return { data: null, error: validatedFields.error.flatten().fieldErrors.query?.[0] || 'Invalid input.' };
    }

    const { query } = validatedFields.data;

    try {
        const { verse } = await getVerse({ query });

        if (!verse) {
            return { data: null, error: 'No verse found matching your query. Please try another search or explore themes.' };
        }

        // Run AI flows in parallel for performance
        const [analysis, parallels] = await Promise.all([
            analyzeVerseMeaning({ verse: verse.text }),
            findCrossTraditionParallels({ verse: verse.text, tradition: verse.tradition })
        ]);
        
        const result: SearchResult = {
            verse: { ...verse, id: verse.source }, // Use source as a temporary ID
            analysis,
            parallels,
        };

        return { data: result, error: null };
    } catch (e) {
        console.error(e);
        return { data: null, error: 'An error occurred while analyzing the verse. Please try again later.' };
    }
}
