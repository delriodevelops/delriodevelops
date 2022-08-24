export default function deleteMessage(id){
    const body = {_id:id}
    const options = {method:'DELETE',headers:{ 'Accept': 'application/json','Content-Type': 'application/json'},body:JSON.stringify(body)}
    fetch('/api/messages',options)
}

