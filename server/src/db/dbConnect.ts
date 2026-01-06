import mongoose from "mongoose"

async function dbConnect() {
  //check if mongoose is connected
  if (mongoose.connection.readyState === 1) {
    console.log("MongoDB already connected")
    return
  }

  //if not connected, connect to the database
  try {
    const connect = await mongoose.connect(process.env.DATABASE_URL!, {
      bufferCommands: false,
    })
    console.log(`MongoDB connected successfully`)
    return connect;
  } catch (err) {
    console.error("MongoDB connection failed", err)
    throw err
  }
}

export default dbConnect
