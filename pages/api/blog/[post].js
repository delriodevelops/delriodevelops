import database from '../../../middlewares/database'
import Post from '../../../models/postModel'

export default function handler(req,res) {
    database()
    const { post } = req.query

    try {
        Post
            .findById(post)
            .then(data=>res.status(200).json(data))
    } catch (e) {
        res.status(400).json(e)
    }
}