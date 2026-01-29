import {z, ZodEmail} from "zod";

type SigninSchema = {
    username: string | ZodEmail;
    password: string ;
}

const validEmail = z.string()
    .email({message: "Invalid email address"});
const validPassword = z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character");
const Username = z.string()
    .min(6, "Username must be at least 6 characters long")

const signinSchema = z.object({
    username: Username.or(validEmail), 
    password: validPassword,
});

export default signinSchema;
