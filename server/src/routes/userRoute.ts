import Router from "express"
import {
     getNumberController} from "../controllers/user.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"
import validate from "../middlewares/validate.middleware.js"
import signinSchema from "../schemas/signinSchema.js"
import { signupSchema } from "../schemas/signupSchema.js"
import {forgetPasswordController,
    loginController,
    logoutController,
    signupController,
    verifyUser,
    refreshTokenController} from "../controllers/user/index.js"
import { dbConnect, dbConnectController, dbCrateTable } from "../controllers/db/dbConnect.controller.js"
import { agentChat } from "../controllers/agent/aichat.controller.js"
// import dbConnect from "../db/dbConnect.js"

const router = Router()

    router.use("/login" , validate(signinSchema) , loginController)
    router.post("/signup" ,validate(signupSchema) , signupController)
    router.post("/logout" , authMiddleware , logoutController)
    router.post("/getNumber" , authMiddleware , getNumberController)
    router.get("/verify" , verifyUser)
    router.post("/dbcreate" , dbConnectController)
    router.post("/dbcreateTable" , dbCrateTable)
    router.post("/db" , dbConnect)
    router.post("/agentChat" , authMiddleware , agentChat)

export default router;