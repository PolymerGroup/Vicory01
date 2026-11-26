import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * PepPedia - peptide knowledge base (article collection)
 * All copy stays in laboratory / analytical / procurement framing; no efficacy, dosing or human-use claims.
 */
const peppedia = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/peppedia' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['fundamentals', 'analytics', 'handling', 'sourcing', 'chemistry']),
    tags: z.array(z.string()).default([]),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    readingMinutes: z.number().default(6),
    featured: z.boolean().default(false),
    relatedPeptides: z.array(z.string()).default([]),
    faqs: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .default([]),
  }),
});

export const collections = { peppedia };
