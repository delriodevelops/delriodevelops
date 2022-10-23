import { Schema,model, models } from "mongoose";

const messageSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
})


const Message = models.messageSchema || model('Message',messageSchema)

export default Message