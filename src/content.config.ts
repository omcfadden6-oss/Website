import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const writing = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/writing" }),
    schema: z.object({
        title: z.string(),
        date: z.coerce.date(),
        description: z.string(),
        category: z.string(),
    }),
});


const learningLog = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/learning" }),
    schema: z.object({
        title: z.string(),
        date: z.coerce.date(),
        description: z.string(),
    }),
});

export const collections = {
    writing,
    learningLog,
};

