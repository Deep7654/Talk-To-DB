import mongoose from "mongoose"

interface IMessage {
    content: string;
    query?: string;
    // fragmentId?: mongoose.Types.ObjectId;
    messageRole: "USER" | "ASSISTANT";
    messageType: "RESULT" | "ERROR";
    // projectId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema =  new mongoose.Schema<IMessage>({
    content : {
        type : String,
        require : true 
    },
    query: {
        type: String,
        // required: true
    },
    // fragmentId: {
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref : "Fragment",
    // },
    messageRole : {
        type: String,
        enum: ["USER", "ASSISTANT"],
        default: "USER"
    },
    messageType:{
        type: String,
        enum: ["RESULT", "ERROR"],
        default : "RESULT"
    },
   
    // projectId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref : "Project",
    //     required: true
    // }
},{
    timestamps:true
})

export const Message = mongoose.models.Message || mongoose.model<IMessage>("Message", messageSchema)
