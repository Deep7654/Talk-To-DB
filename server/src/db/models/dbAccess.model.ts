import mongoose from "mongoose";

const dbAccessSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId ,
        ref : "User"  , 
    },
    DbAccess : {
        type : Boolean,
        default : false
    },
    dbname : { type : String , // required : true
    },

}, {
    timestamps:true
    })

export const DbAccess = mongoose.models.DbAccess || mongoose.model("DbAccess", dbAccessSchema);