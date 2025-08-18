import { z } from "zod";

export const signUpSchema = z.object({
  username: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export type signupUser = z.infer<typeof signUpSchema>;
