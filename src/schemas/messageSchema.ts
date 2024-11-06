import { z } from "zod";

export const MessageSchema = z.object({
  content: z
    .string()
    .min(10, "Content must be at least 10 character")
    .max(300, "Content must be no longer than 300 character"),
});
