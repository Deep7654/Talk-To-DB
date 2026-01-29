import mongoose from "mongoose";

interface IUser  {
    username: string;
    email: string;
    password: string;
    number : string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    isDbConnected: boolean;
    dbAccess : mongoose.Types.ObjectId;
    messages : mongoose.Types.ObjectId[];
    provider : string;
    providerId : string;
    isVerified : boolean;
    webToken : string;
}

const userSchema = new mongoose.Schema<IUser>({
    username :{
        type : String, required : true , unique : true 
    },
    email : {
        type : String, required : true, unique : true
    },
    password : { type : String, required : true
    },
    number :{   type : String 
    },
    name : { type : String, // required : true
    },
    createdAt : { type : Date, default : Date.now
    },
    updatedAt : { type : Date, default : Date.now
    },
    isDbConnected : { type : Boolean, default : false
    },
    provider : { type : String, // required : true
    },
    providerId : { type : String, // required : true
    },
    isVerified: { type: Boolean, // default: false
    },
    webToken: { type: String, // required: true
    },
    dbAccess: { type: mongoose.Schema.Types.ObjectId, ref: "DbAccess" 
    },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" 
    }],
    
},{
    timestamps:true
})

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);