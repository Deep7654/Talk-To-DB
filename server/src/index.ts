import "dotenv/config"
import {app} from "./app.js"
import dbConnect from "./db/dbConnect.js"


async function startServer() {

  //db connection
  // await dbConnect()

  //start server
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
  })
}

startServer()
