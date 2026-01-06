import { z } from "zod";

const validUsername = z.string()
    .min(6, "Username must be at least 6 characters long")
    .max(10, "Username must be at most 10 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

const validEmail = z.string()
    .email({message: "Invalid email address"});

const validPassword = z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character");

export const signupSchema = z.object({
    username: validUsername,
    email: validEmail,
    password: validPassword,
});