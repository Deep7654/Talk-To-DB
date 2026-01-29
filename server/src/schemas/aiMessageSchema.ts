import { z } from "zod"


const messageItem = z.object({
    role: z.enum(["user", "agent", "system", "assistant"]), 
    content: z.string()
})

const messages = z.array(
    messageItem
) 

const aiMsgSchema = z.object({
    messages 
})

export default aiMsgSchema