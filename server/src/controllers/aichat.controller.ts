import { NextFunction , Request , Response} from "express";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { stepCountIs, streamText } from "ai";
import { SYSTEM_PROMPT , aiModel , getDbCallTool , getSchemaTool } from "../services/aiAgent/index.js";


 const aiChat = asyncHandler(
    async (req : Request, res : Response, next : NextFunction)=>{
    try{

        const {messages} = req.body

        // 1) SSE headers
        res.setHeader("Content-Type" , "text/event-stream");
        res.setHeader("Cache-Control" , "no-cache");
        res.setHeader("connection" , "keep-alive");

        // Optional: flush headers immediately
        res.flushHeaders?.();

        // aiModel
        const result = streamText({
            model : aiModel,
            messages,
            system : SYSTEM_PROMPT,
            stopWhen : stepCountIs(3),
            tools : {
                dbSchema : getSchemaTool,
                dbCall : getDbCallTool
            }
            }
        )

        // stream text 
        for await (const event of result.fullStream) {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
        }

        // 3) End SSE
        res.write("event: end\ndata: {}\n\n");
        res.end();


    }catch(error){
        res.write(`event: error\ndata: ${JSON.stringify({ message: "failed" })}\n\n`);
        res.end();
        throw new ApiError(400 , "problem with AI Agent")
    }
})

export default aiChat