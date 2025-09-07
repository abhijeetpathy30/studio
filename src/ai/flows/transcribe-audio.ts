'use server';

/**
 * @fileOverview A flow for transcribing audio to text.
 *
 * - transcribeAudio - Transcribes audio data to text.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { toWav } from '@/lib/audio';

const TranscribeAudioInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "Audio data to transcribe, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeAudioInput = z.infer<typeof TranscribeAudioInputSchema>;

const TranscribeAudioOutputSchema = z.object({
  text: z.string().describe('The transcribed text.'),
});
export type TranscribeAudioOutput = z.infer<typeof TranscribeAudioOutputSchema>;


const prompt = ai.definePrompt({
    name: 'transcribeAudioPrompt',
    input: { schema: TranscribeAudioInputSchema },
    output: { schema: TranscribeAudioOutputSchema },
    prompt: `Transcribe the following audio. The user is speaking a search query for a religious or philosophical topic.
  
  Audio: {{media url=audioDataUri}}`,
});

const transcribeAudioFlow = ai.defineFlow(
  {
    name: 'transcribeAudioFlow',
    inputSchema: TranscribeAudioInputSchema,
    outputSchema: TranscribeAudioOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);


export async function transcribeAudio(
  input: TranscribeAudioInput
): Promise<TranscribeAudioOutput> {
  const audioBuffer = Buffer.from(
    input.audioDataUri.substring(input.audioDataUri.indexOf(',') + 1),
    'base64'
  );

  const wavDataUri = `data:audio/wav;base64,${await toWav(audioBuffer)}`;

  return transcribeAudioFlow({ audioDataUri: wavDataUri });
}
