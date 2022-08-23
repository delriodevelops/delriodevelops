export default async function sendMessage(email,message){
    const body = {email:email,message:message}
    const options = {method:'POST',headers:{ 'Accept': 'application/json','Content-Type': 'application/json'},body:JSON.stringify(body)}
    fetch('/api/messages',options)
}