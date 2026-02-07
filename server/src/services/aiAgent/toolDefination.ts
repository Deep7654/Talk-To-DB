import { google } from "@ai-sdk/google";
import {stepCountIs ,streamText , tool } from "ai";
import {z} from "zod"
import asyncHandler from "../../utils/asyncHandler.js";




const aichats = asyncHandler(
async(req : any , res : any, next : any)=>{
    try {const { messages } = req.body;

  // 1) SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Optional: flush headers immediately
  res.flushHeaders?.();
   const SYSTEM_PROMPT = `You are an expert SQL assistant that helps users to query their database using natural language.

    ${new Date().toLocaleString('sv-SE')}
    You have access to following tools:
    1. db tool - call this tool to print query.
    2. schema tool - call this tool to get the database schema which will help you to write sql query.

Rules:
- Generate ONLY SELECT queries (no INSERT, UPDATE, DELETE, DROP)
- Always use the schema provided by the schema tool
- Pass in valid SQL syntax in db tool.
- IMPORTANT: To print database call db tool, Don't return just SQL query.
- IMPORTANT - also give your response about query and output explained
Always respond in a helpful, conversational tone while being technically accurate.`;

  const result = await streamText({
        model: google("gemini-2.5-flash"),
        messages,
        system: SYSTEM_PROMPT,
        stopWhen: stepCountIs(2),
        tools: {
            schema: tool({
                description: 'Call this tool to get database schema information.',
                inputSchema: z.object({}),
                execute: async () => {
                    console.log("reach here db schema")
                    return `CREATE TABLE products (
	id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	name text NOT NULL,
	category text NOT NULL,
	price real NOT NULL,
	stock integer DEFAULT 0 NOT NULL,
	created_at text DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE sales (
	id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	product_id integer NOT NULL,
	quantity integer NOT NULL,
	total_amount real NOT NULL,
	sale_date text DEFAULT CURRENT_TIMESTAMP,
	customer_name text NOT NULL,
	region text NOT NULL,
	FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE no action ON DELETE no action
)`;
                },
            }),
            db: tool({
                description: 'Call this tool to print output',
                inputSchema: z.object({
                    query: z.string().describe('The SQL query to be ran.'),
                }),
                execute: async ({ query }) => {
                    console.log('Query', query);
                    // Important: make sure you sanitize / validate (somehow) check the query
                    // string search [delete, update] -> Guardrails
                    return query;
                },
            }),
        },
    });

    for await (const event of result.fullStream) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }
    // 3) End SSE
    res.write("event: end\ndata: {}\n\n");
    res.end();
}catch (err) {
    res.write(`event: error\ndata: ${JSON.stringify({ message: "failed" })}\n\n`);
    res.end();
    next(err)
  }

}
)

 const getSchema = tool({
    description : "call and use this tool to get database Schema information",
    inputSchema : z.object({}),
    execute : async()=>{
        
        console.log("db Schema executte");
        return "for now guess a schema of user and password and name"
    }
})

 const getDbCall = tool({
    description : '',
    inputSchema : z.object({
        query : z.string().describe('call and use this tool to call the Database and get the output')
    }),
    execute : ()=>{
        
    }
})

export { getDbCall , getSchema}