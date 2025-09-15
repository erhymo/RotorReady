import { z } from "zod";

export const QuizItemSchema = z.object({
  id: z.string(),
  section: z.string(),
  type: z.enum(["single","multi"]),
  question: z.string(),
  options: z.array(z.string()).min(2),
  answer: z.array(z.number()).min(1),
  explanation: z.string().optional(),
  references: z.array(z.string()).optional(),
  difficulty: z.enum(["easy","med","hard"]).optional(),
  tags: z.array(z.string()).optional(),
  source: z.string().optional()
});

export const SectionFileSchema = z.object({
  items: z.array(QuizItemSchema)
});

export type SectionFile = z.infer<typeof SectionFileSchema>;

