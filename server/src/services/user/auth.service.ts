import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { email } from "zod";

const hashPassword = async (password: string) => {
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)
    return hashedPassword
}

const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcryptjs.compare(password, hashedPassword)
}

const generateAccessToken = (email : string , userId : string , tokenVersion : number , username : string) => {
    const payload = {
        id : userId,
        email,
        username,   
        tokenVersion
    }
    return jwt.sign(payload,
         process.env.JWT_SECRET!,
          { 
            expiresIn: '10m' 
        })
}

const generateRefreshToken = (email : string , userId : string , tokenVersion : number) => {
    const payload = {
        id : userId,
        email,
        tokenVersion
    }
    return jwt.sign(payload,
         process.env.JWT_SECRET!,
          { 
            expiresIn: '7d' 
        })
}

export { hashPassword, comparePassword , generateAccessToken , generateRefreshToken }
