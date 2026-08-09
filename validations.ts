import { z } from "zod";

export const POST_MAX_LENGTH = 500;

export const createPostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Postingan tidak boleh kosong")
    .max(POST_MAX_LENGTH, `Maksimal ${POST_MAX_LENGTH} karakter`),
  parentId: z.string().cuid().optional(),
});

export const createCommentSchema = z.object({
  postId: z.string().cuid(),
  content: z.string().trim().min(1, "Komentar tidak boleh kosong").max(500),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
