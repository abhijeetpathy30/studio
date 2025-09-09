'use server';

/**
 * @fileOverview A flow for generating an illustrative map of a tradition's origin.
 *
 * - generateOriginMap - Generates a map image for a given tradition.
 * - GenerateOriginMapInput - The input type for the generateOriginMap function.
 * - GenerateOriginMapOutput - The return type for the generateOriginMap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOriginMapInputSchema = z.object({
  tradition: z.string().describe('The religious or philosophical tradition to create a map for.'),
});
export type GenerateOriginMapInput = z.infer<typeof GenerateOriginMapInputSchema>;

const GenerateOriginMapOutputSchema = z.object({
  imageUrl: z.string().describe("URL of the generated map image, as a data URI."),
});
export type GenerateOriginMapOutput = z.infer<typeof GenerateOriginMapOutputSchema>;

export async function generateOriginMap(input: GenerateOriginMapInput): Promise<GenerateOriginMapOutput> {
  return generateOriginMapFlow(input);
}

const generateOriginMapFlow = ai.defineFlow(
  {
    name: 'generateOriginMapFlow',
    inputSchema: GenerateOriginMapInputSchema,
    outputSchema: GenerateOriginMapOutputSchema,
  },
  async ({ tradition }) => {
    const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `Create an artistic and illustrative map showing the origin of ${tradition}. The style should be elegant and slightly vintage, like an old manuscript or map. It must feature:
1. A clear pin or marker on the primary city/region of origin.
2. The name of the region and the approximate date of origin displayed in elegant typography.
3. Subtle artistic elements related to the tradition (e.g., small symbols, stylized borders).
The map should be visually appealing and focus on the specific geographical area of origin, not a full world map. Avoid overly complex details.`,
    });

    if (!media.url) {
      throw new Error('Image generation failed to return a URL.');
    }

    return { imageUrl: media.url };
  }
);
