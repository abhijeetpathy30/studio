'use server';
/**
 * @fileOverview A comprehensive flow to search for a verse and get a full analysis in one call.
 *
 * - performSearch - Finds a verse, analyzes it, and finds parallels.
 */

import {ai} from '@/ai/genkit';
import {
  PerformSearchInput,
  PerformSearchInputSchema,
  PerformSearchOutput,
  PerformSearchOutputSchema,
} from '@/lib/types';
import {z} from 'genkit';


const religiousPrompt = ai.definePrompt({
  name: 'performReligiousSearchPrompt',
  input: {schema: PerformSearchInputSchema},
  output: {schema: PerformSearchOutputSchema},
  prompt: `You are an expert theological research assistant. Your goal is to perform a comprehensive analysis based on a user's query in a single pass, with a focus on **Religious** texts.

    **CRITICAL REQUIREMENT:**
    1.  **Verse Retrieval**: You **MUST** find the single best verse matching the user's topic "{{query}}" from a sacred scripture or primary theological writing (e.g., Bible, Qur'an, Vedas, Talmud, Guru Granth Sahib).
    2.  **Source Priority**: If a specific scripture is selected ("{{source}}"), you **MUST** prioritize it. If you cannot find a relevant verse on that topic within "{{source}}", you **MUST** return \`null\` for all fields. Do not look in other scriptures.
    3.  If a verse is found, and only if a verse is found:
        *   **Verse Analysis**: Provide a clear analysis of its meaning within its original religious context, a list of key insights, and a secular reflection.
        *   **Cross-Tradition Parallels**: Find and list several similar verses or teachings from *other religious* traditions only. Do not include spiritual or non-religious texts. Each parallel MUST be a single string containing both the quote and its full reference.

    Accuracy is paramount. Do not invent verses.
    **Topic**: {{{query}}}
    {{#if source}}**Scripture**: {{{source}}}{{/if}}
    `,
});

const spiritualPrompt = ai.definePrompt({
  name: 'performSpiritualSearchPrompt',
  input: {schema: PerformSearchInputSchema},
  output: {schema: PerformSearchOutputSchema},
  prompt: `You are an expert philosophical and spiritual research assistant. Your goal is to perform a comprehensive analysis based on a user's query in a single pass, with a focus on **Spiritual but not strictly religious** texts.

    **CRITICAL REQUIREMENT:**
    1.  **Verse Retrieval**: You **MUST** find the single best quote/passage matching the user's topic "{{query}}" from mystical, meditative, or reflective texts (e.g., Rumi's poetry, Spinoza's Ethics, Buddhist sutras, Tao Te Ching, works of Kabir, Stoic philosophy). Avoid texts from institutionalized, dogmatic religion unless they have a strong mystical or universally spiritual component.
    2.  **Source Priority**: If a specific scripture is selected ("{{source}}"), you **MUST** prioritize it. If you cannot find a relevant passage on that topic within "{{source}}", you **MUST** return \`null\` for all fields. Do not look in other scriptures.
    3.  If a passage is found, and only if a passage is found:
        *   **Verse Analysis**: Provide a clear analysis of its meaning, a list of key insights, and a secular/philosophical reflection.
        *   **Cross-Tradition Parallels**: Find and list several similar passages from *other spiritual* traditions only. Do not include strictly religious or non-religious texts. Each parallel MUST be a single string containing both the quote and its full reference.

    Accuracy is paramount. Do not invent verses.
    **Topic**: {{{query}}}
    {{#if source}}**Source**: {{{source}}}{{/if}}
    `,
});

const nonReligiousPrompt = ai.definePrompt({
  name: 'performNonReligiousSearchPrompt',
  input: {schema: PerformSearchInputSchema},
  output: {schema: PerformSearchOutputSchema},
  prompt: `You are an expert philosophical and secular research assistant. Your goal is to perform a comprehensive analysis based on a user's query in a single pass, with a focus on **Non-Religious** texts.

    **CRITICAL REQUIREMENT:**
    1.  **Verse Retrieval**: You **MUST** find the single best quote/passage matching the user's topic "{{query}}" from philosophical treatises, scientific works, or humanist writings (e.g., Aristotle, Plato, Bertrand Russell, Sartre, Camus, Kant). Do not use any religious or sacred scriptures.
    2.  **Source Priority**: If a specific source is selected ("{{source}}"), you **MUST** prioritize it. If you cannot find a relevant passage on that topic within "{{source}}", you **MUST** return \`null\` for all fields. Do not look in other scriptures.
    3.  If a passage is found, and only if a passage is found:
        *   **Verse Analysis**: Provide a clear analysis of its meaning within its philosophical context, a list of key insights, and a reflection on its ideas.
        *   **Cross-Tradition Parallels**: Find and list several similar passages from other *non-religious* philosophical traditions only. Do not include religious or spiritual texts. Each parallel MUST be a single string containing both the quote and its full reference.

    Accuracy is paramount. Do not invent passages.
    **Topic**: {{{query}}}
    {{#if source}}**Source**: {{{source}}}{{/if}}
    `,
});

const universalistPrompt = ai.definePrompt({
  name: 'performUniversalistSearchPrompt',
  input: {schema: PerformSearchInputSchema},
  output: {schema: PerformSearchOutputSchema},
  prompt: `You are an expert research assistant specializing in comparative philosophy and religion. Your goal is to perform a comprehensive analysis based on a user's query, drawing from all available texts (religious, spiritual, and non-religious).

    **CRITICAL REQUIREMENT:**
    1.  **Verse Retrieval**: You **MUST** find the single best quote/passage matching the user's topic "{{query}}" from the vast library of human wisdom, regardless of its origin.
    2.  **Source Priority**: If a specific source is selected ("{{source}}"), you **MUST** prioritize it. If you cannot find a relevant passage on that topic within "{{source}}", you **MUST** return \`null\` for all fields. Do not look in other scriptures.
    3.  If a passage is found, and only if a passage is found:
        *   **Verse Aget-random-fact.tsnalysis**: Provide a clear analysis of its meaning within its original context, a list of key insights, and a universal, philosophical reflection accessible to all.
        *   **Cross-Tradition Parallels**: Find and list several similar passages from a diverse range of *other* traditions (religious, spiritual, and non-religious). Each parallel MUST be a single string containing both the quote and its full reference.

    Accuracy is paramount. Do not invent passages.
    **Topic**: {{{query}}}
    {{#if source}}**Source**: {{{source}}}{{/if}}
    `,
});


const performSearchFlow = ai.defineFlow(
  {
    name: 'performSearchFlow',
    inputSchema: PerformSearchInputSchema,
    outputSchema: PerformSearchOutputSchema,
  },
  async input => {
    let activePrompt;
    switch (input.mode) {
      case 'Spiritual':
        activePrompt = spiritualPrompt;
        break;
      case 'Non-Religious':
        activePrompt = nonReligiousPrompt;
        break;
      case 'Universalist':
        activePrompt = universalistPrompt;
        break;
      case 'Religious':
      default:
        activePrompt = religiousPrompt;
        break;
    }

    const {output} = await activePrompt(input);
    return output!;
  }
);

export async function performSearch(
  input: PerformSearchInput
): Promise<PerformSearchOutput> {
  return performSearchFlow(input);
}
