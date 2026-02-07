import { NextFunction, Request, Response } from "express";
import ApiError from "../../utils/apiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { stepCountIs, streamText, tool } from "ai";
import { aiModel } from "../../services/aiAgent/index.js";
import { User } from "../../db/models/user.model.js";
import { z } from "zod"
import postgres from "postgres"
import { SYSTEM_PROMPT1 } from "../../services/aiAgent/aiModel.js";


// const aiChat = asyncHandler(
//     async (req: Request, res: Response, next: NextFunction) => {
//         try {

//             const { messages } = req.body

//             // 1) SSE headers
//             res.setHeader("Content-Type", "text/event-stream");
//             res.setHeader("Cache-Control", "no-cache");
//             res.setHeader("connection", "keep-alive");

//             // Optional: flush headers immediately
//             res.flushHeaders?.();

//             // aiModel
//             const result = streamText({
//                 model: aiModel,
//                 messages,
//                 system: SYSTEM_PROMPT,
//                 stopWhen: stepCountIs(3),
//                 tools: {
//                     dbSchema: getSchemaTool,
//                     dbCall: getDbCallTool
//                 }
//             }
//             )

//             // stream text 
//             for await (const event of result.fullStream) {
//                 res.write(`data: ${JSON.stringify(event)}\n\n`);
//             }

//             // 3) End SSE
//             res.write("event: end\ndata: {}\n\n");
//             res.end();


//         } catch (error) {
//             res.write(`event: error\ndata: ${JSON.stringify({ message: "failed" })}\n\n`);
//             res.end();
//             throw new ApiError(400, "problem with AI Agent")
//         }
//     })


const agentChat = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { message } = req.body
    if (!message) {
        return next(new ApiError(400, "Message is required"))
    }

    try {
        // 1) SSE headers
            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("connection", "keep-alive");

            // Optional: flush headers immediately
            res.flushHeaders?.();

        const userId = req.user?.id
        let user;
        let sql;
        try {
            user = User.findById(userId)
            sql = postgres(process.env.DATABASE_URI!, {
                ssl: "require"
            })
        } catch (error) {
            return next(new ApiError(404, "Error while finding the User i DB ", error))
        }

        const result = await streamText({
            model: aiModel,
            messages: message,
            system: SYSTEM_PROMPT1,
            stopWhen: stepCountIs(10),
            tools: {
                dbSchema: tool({
                    description: "call and use this tool to get database Schema information",
                    inputSchema: z.object({}),
                    execute: async () => {
                        const result = await sql`SELECT
                                        table_name,
                                        json_agg(
                                            json_build_object(
                                                'column', column_name,
                                                'type', data_type
                                            ) ORDER BY ordinal_position
                                        ) AS columns
                                        FROM information_schema.columns
                                        WHERE table_schema = 'public'
                                        GROUP BY table_name;
`
                        console.log('Schema Result', result);
                        return result
                    }
                }),
                dbCall: tool({
                    description: '',
                    inputSchema: z.object({
                        query: z.string().describe('call and use this tool to call the Database and get the output')
                    }),
                    execute: async ({ query }) => {
                        console.log('Query', query);
                        const result = await sql.unsafe(query)
                        // Important: make sure you sanitize / validate (somehow) check the query
                        // string search [delete, update] -> Guardrails
                        return result;
                    },
                })
            }
        })
        // stream text 
            for await (const event of result.fullStream) {
                res.write(`data: ${JSON.stringify(event)}\n\n`);
            }

            // 3) End SSE
            res.write("event: end\ndata: {}\n\n");
            res.end();
            next()
    } catch (error) {
        return next(new ApiError(400, "problem with AI Agent" , error))
    }
})

export { agentChat }