import logger from '../../../middlewares/logger'
import database from '../../../middlewares/database'
import Post from '../../../models/postModel'

export default function handler (req,res) {
    database()
    const {method,body}=req
    const {category,title,resume,content,date}=body
    
    if(method==="GET") {
        Post
        .find({})
        .then(data=>res.status(200).json(data))
    } else if (method==='POST') {
        const newPost = new Post({
            category:category,
            title:title,
            resume:resume,
            content:content,
            date:date
        })

        try {
            newPost
            .save()
                .then(data=>res.status(201).json(data))
            }catch(e){
                res.status(400).json(e)
            }
        }
        logger(req,res)
    
}