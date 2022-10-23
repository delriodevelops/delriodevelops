import { Schema,model, models } from "mongoose";

const postSchema = new Schema({
    category:{
        type:String,
        default:'general'
    },
    title:{
        type:String,
        required:true
    },
    date:{
        type: Date,
        default:Date.now()
    },
    resume:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    }
})


export default models.postSchema || model('Post',postSchema)

