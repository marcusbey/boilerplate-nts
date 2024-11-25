import { openai } from "@ai-sdk/openai";

/**
 * Usage :
 *
 * ```ts
 * const result = await generateText({
 *   model: openaiModel,
 *   prompt: 'Invent a new holiday and describe its traditions.',
 * });
 * ```
 *
 * Src :
 *
 * Prompt : https://sdk.vercel.ai/docs/foundations/prompts
 * Tools : https://sdk.vercel.ai/docs/foundations/tools
 */

if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    "If you want use openai model you must define OPENAI_API_KEY (https://platform.openai.com/docs/quickstart)",
  );
}

export const openaiModel = openai("gpt-4o");
