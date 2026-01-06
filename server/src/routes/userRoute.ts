import Router from "express"
import { signupConroller , logoutConroller , loginConroller } from "../controllers/user.controller.js"
import auth from "../middlewares/auth.middleware.js"

const router = Router()

    router.use("/login" , loginConroller)
    router.post("/signup" , signupConroller)
    router.post("/logout" , auth , logoutConroller)



export default router;