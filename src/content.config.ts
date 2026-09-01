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

const projects = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./src/content/projects"
    }),
    schema: z.object({
        number: z.string(),
        title: z.string(),
        category: z.string(),
        description: z.string(),
        subtitle: z.string(),
        featured: z.boolean().default(false),
    }),
});


export const collections = {
    writing,
    learningLog,
    projects,
};

