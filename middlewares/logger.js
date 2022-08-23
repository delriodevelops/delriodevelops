export default function logger(req,res){
    const {method,url,body}=req
    console.log(method, body)
    console.log('FROM: ',url)
    console.log('RESPONSE STATUS: ',res.status)
}