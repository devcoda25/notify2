// src/ai/flows/ai-content-enhancement.js

/**
 * @fileOverview An AI-powered content enhancement flow.
 *
 * - aiContentEnhancement - A function that enhances the given content using AI.
 * - AIContentEnhancementInput - The input type for the aiContentEnhancement function.
 * - AIContentEnhancementOutput - The return type for the aiContentEnhancement function.
 */

import {ai} from '../genkit.js'; // Adjusted path
import {z} from 'genkit';

const AIContentEnhancementInputSchema = z.object({
  content: z.string().describe('The content to be enhanced.'),
  language: z.string().optional().describe('The target language for translation, if any.'),
  channel: z.string().optional().describe('The communication channel (e.g., WhatsApp, SMS, email).'),
  audience: z.string().optional().describe('The intended audience for the content.'),
});

const AIContentEnhancementOutputSchema = z.object({
  enhancedContent: z.string().describe('The AI-enhanced content.'),
});

export async function aiContentEnhancement(input) { // Removed type annotation
  return aiContentEnhancementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiContentEnhancementPrompt',
  input: {schema: AIContentEnhancementInputSchema},
  output: {schema: AIContentEnhancementOutputSchema},
  prompt: `You are an AI assistant designed to enhance the content of messages.\n\n  You will be provided with the original content, the target language (if any), the communication channel, and the intended audience.\n  Based on this information, you will:\n  - Improve grammar and clarity.\n  - Suggest alternative phrasing to better suit the channel and audience.\n  - Translate the message into the specified language, if provided.\n\n  Original Content: {{{content}}}
  Target Language: {{language}}
  Channel: {{channel}}
  Intended Audience: {{audience}}}

  Enhanced Content:`,
});

const aiContentEnhancementFlow = ai.defineFlow(
  {
    name: 'aiContentEnhancementFlow',
    inputSchema: AIContentEnhancementInputSchema,
    outputSchema: AIContentEnhancementOutputSchema,
  },
  async input => {
    const {text} = await prompt(input);
    return {enhancedContent: text};
  }
);
