// import dbConnectController from "../controllers/dbconnect.controller.js"
import auth from "../middlewares/auth.middleware.js"
import router from "./index.js"

const dbConnectRoute = async (req: any, res: any, next: any) => {
    // // Database connection logic here
    router.post("/Connect", auth )
    router.post("/disconnect", auth)
    
}

export default dbConnectRoute;