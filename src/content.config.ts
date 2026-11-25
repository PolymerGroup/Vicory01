import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * PepPedia —— 多肽知识库（文章集合）
 * 全部内容保持实验室/分析方法/采购语境，不涉及疗效、剂量或人体使用。
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
