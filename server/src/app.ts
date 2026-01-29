import express from "express"
import cors from "cors"
import cookiesParser from "cookie-parser"
import routes from "./routes/index.js"
import globalError from "./utils/globalError.js"
import { apiLimiter } from "./utils/rateLimit.js"


export const app = express()

//middlewares for parsing and cors
app.use(cors({
    origin: process.env.CORS_ORIGIN, // EXACT frontend origin
    credentials: true,               // ALLOW cookies
  }))

  // use json and urlencoded middlewares for parsing and set limit and get data in req.body
app.use(express.json())
app.use(express.urlencoded({ extended: true , limit: '16kb' }))

//use cookie parser middleware to parse cookies  for secured routes and authentication
app.use(cookiesParser())
app.use(globalError)
app.use(apiLimiter)


app.use("/api", routes)

