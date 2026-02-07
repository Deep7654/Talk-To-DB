
import { Router } from "express";
// import aiChat from "../controllers/agent/aichat.controller.js";
import validate from "../middlewares/validate.middleware.js";
import aiMsgSchema from "../schemas/aiMessageSchema.js";
import authMiddleware from "../middlewares/auth.middleware.js";


const router = Router()

router.post("/chat", validate(aiMsgSchema), authMiddleware)

export default router;