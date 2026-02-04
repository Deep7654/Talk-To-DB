import jwt from "jsonwebtoken";
import { z } from "zod";

const validateToken = <T>(token : string , zodSchema : z.ZodType<T> ) :T => {
    const payload = jwt.verify(token, process.env.JWT_SECRET!)
    const validatedPayload  = zodSchema.parse(payload);

    return validatedPayload;
}

export default validateToken;
