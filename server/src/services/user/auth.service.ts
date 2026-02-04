import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

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
    const payload = {
        id : userId,
        email,  
    }
    return jwt.sign(payload,
         process.env.JWT_SECRET!,
          { 
            expiresIn: '30m' 
        })
}

// to generate refresh token
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
