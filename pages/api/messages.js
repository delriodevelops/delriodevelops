import logger from '../../middlewares/logger'
import database from '../../middlewares/database'
import Message from '../../models/messageModel'

export default function handler(req,res){
    database()
    const {method,body}=req
    const {email,message,_id}=body
    
    if(method==='GET'){
            Message
            .find({})
            .then(data=>res.status(200).json(data))    
    } else if (method==='POST'){
        const newMessage = new Message({
                email:email,
                message:message
        })
        
        try {
            newMessage
                .save()
                .then(data=>res.status(201).json(data))
        } catch (e) {
            res.status(400).json(e)
        }
    } else if (method==='DELETE'){
        const deleteMessage = {_id:_id}
        try {
            Message
                .deleteOne(deleteMessage)
                .then(data=>res.status(200).json(data))
        } catch(e){
                res.status(200).json(e)
        }
    }
    
    logger(req,res)
}