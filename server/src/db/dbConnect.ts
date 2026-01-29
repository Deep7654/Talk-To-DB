import mongoose from "mongoose"

async function dbConnect() {
  //check if mongoose is connected
  if (mongoose.connection.readyState === 1) {
    console.log("MongoDB already connected")
    return
  }

  //if not connected, connect to the database
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }
    console.log(`Attempting to connect to MongoDB at: ${dbUrl.replace(/:([^:@]+)@/, ":****@")}`); // Mask password
    const connect = await mongoose.connect(dbUrl, {
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
