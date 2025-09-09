'use server';

import { performSearch } from '@/ai/flows/perform-search';
import { transcribeAudio } from '@/ai/flows/transcribe-audio';
import { getRandomFact } from '@/ai/flows/get-random-fact';
import type { SearchResult, SearchMode } from '@/lib/types';
import { z } from 'zod';
import { supportedScriptures } from '@/lib/data';
import { Resend } from 'resend';

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

const FeedbackSchema = z.object({
  feedback: z.string().min(10, 'Feedback must be at least 10 characters long.'),
});

export async function sendFeedbackAction(prevState: any, formData: FormData): Promise<{ success: boolean; message: string }> {
  const validatedFields = FeedbackSchema.safeParse({
    feedback: formData.get('feedback'),
  });

  if (!validatedFields.success) {
    return { success: false, message: validatedFields.error.flatten().fieldErrors.feedback?.[0] || 'Invalid feedback.' };
  }

  const { feedback } = validatedFields.data;

  if (!process.env.RESEND_API_KEY) {
    console.error('Resend API key is not set. Please set the RESEND_API_KEY environment variable.');
    return { success: false, message: 'The server is not configured to send emails. Please contact the administrator.' };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'WisdomWayFeedback@resend.dev', // This must be a verified domain in Resend, but resend.dev is allowed for testing.
      to: 'abhijeetpathy30@gmail.com',
      subject: 'New Feedback from The Wisdom Way',
      html: `<p>You have received new feedback:</p><p><strong>${feedback}</strong></p>`,
    });
    return { success: true, message: 'Thank you for your feedback!' };
  } catch (error) {
    console.error('Error sending feedback email:', error);
    return { success: false, message: 'An unexpected error occurred. Please try again later.' };
  }
}
