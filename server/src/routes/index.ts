import { Router } from "express"
import UserRoute from "./userRoute.js"
import dbConnectRoute from "./dbConnectRoute.js"
import aiRoute from "./aiRoute.js"


const router = Router()

// index route for evrey routes 
router.use("/user", UserRoute )
router.use("/db" , dbConnectRoute) 
router.use("/ai" , aiRoute)


export default router
