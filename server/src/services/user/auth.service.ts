import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

type AccessTokenPayload = {
    id : string,
    email : string,
}

type RefreshTokenPayload = {
    id : string,
    email : string,
    tokenVersion : number
}

// to hash password before saving to database
const hashPassword = async (password: string) => {
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)
    return hashedPassword
}

// to compare password while login 
const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcryptjs.compare(password, hashedPassword)
}

// to generate access token
const generateAccessToken = (email : string , userId : string  ) => {
    const payload : AccessTokenPayload = {
        id : userId,
        email,  
    }
    return jwt.sign(payload,
         process.env.JWT_SECRET!,
          { 
            expiresIn: '59m' 
        })
}

// to generate refresh token
const generateRefreshToken = (email : string , userId : string , tokenVersion : number) => {
    const payload : RefreshTokenPayload = {
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
