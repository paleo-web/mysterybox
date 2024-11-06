import { z } from "zod";

export const signUpSchema = z.object({
  userName: z
    .string()
    .min(2)
    .max(20, 'UserName must not be more than 20 character')
    .regex(/^[a-zA-Z0-9]+$/, "please enter a valid username"),

  email: z
    .string()
    .email("please enter a valid email")
    ,

  password: z
    .string()
    .min(6)
    
});
