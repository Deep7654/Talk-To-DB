import {streamText , ModelMessage} from "ai"
import {google} from "@ai-sdk/google"
import { app } from "../../app.js"


// const googleModel = google({
//   model: "gemini-1.5-pro",
//   apiKey: process.env.GOOGLE_API_KEY!,
// })



const msg : ModelMessage[] = [
    {
        role: "user",
        content: "Write a poem about the sea"
    }
]



app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  // 1) SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Optional: flush headers immediately
  res.flushHeaders?.();

  try {
    const result = await streamText({
      model: google("gemini-1.5-flash"),
      messages
    });

    // 2) Stream FULL structured events
    for await (const event of result.fullStream) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }

    // 3) End SSE
    res.write("event: end\ndata: {}\n\n");
    res.end();
  } catch (err) {
    res.write(`event: error\ndata: ${JSON.stringify({ message: "failed" })}\n\n`);
    res.end();
  }
});


// const result = await streamText({
//     model: "gemini-1.5-pro",
//     messages: msg
// })

// app.post("/ai-chat", async (req, res)=>{
//     try{
//         aiChat()
//         .then(()=>res.status(200).json({message: "AI Chat completed"}))
//     } catch(err){
//         res.status(500).json({message: "Internal Server Error"})
//     }})    


const aiChat = async ()=>{
    const result = await streamText({
    model: google("gemini-2.5-flash"),
    messages: msg
})
    let fullresponse = ""

    for await (const part of result.textStream) {
        fullresponse += part
        // console.log(part)
    }

    msg.push({
        role: "assistant",
        content: fullresponse
    })
}

// aiChat().then(()=>console.log("done")).catch((err)=>console.error(err))

export{ aiChat};