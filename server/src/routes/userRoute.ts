import Router from "express"
import { signupController , logoutController , loginController } from "../controllers/user.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"
import validate from "../middlewares/validate.middleware.js"
import signinSchema from "../schemas/signinSchema.js"
import { signupSchema } from "../schemas/signupSchema.js"


const router = Router()

    router.use("/login" , validate(signinSchema) , loginController)
    router.post("/signup" ,validate(signupSchema) , signupController)
    router.post("/logout" , authMiddleware , logoutController)

export default router;