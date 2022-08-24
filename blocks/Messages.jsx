import React, { useEffect,useState } from 'react'
import MessageItem from '../components/MessageItem'
import checkLocalStorage from '../services/checkLocalStorage'
import deleteMessage from '../services/deleteMessage'

const Messages = () => {
    useEffect(()=>{
        const localUser = checkLocalStorage('user')
        !localUser && window.location.replace('/signin')
        setLoading(false)
        fetch('/api/messages')
        .then(res=>res.json())
        .then(data=>setMessages(data))
    },[])

    const handleDelete = (id)=>{
        deleteMessage(id)
        fetch('/api/messages')
        .then(res=>res.json())
        .then(data=>setMessages(data))
    }
    const [messages,setMessages]=useState([{}])
    const [loading,setLoading]=useState(true) 

    if(!loading) return (
    <section className="container bg-gray-900 body-font p-2 mx-auto sm:p-4 dark:text-gray-100">
    	<h2 className="mb-4 text-2xl font-semibold leading-tight">Emails</h2>
    	<div className="flex flex-col overflow-x-auto text-xs">
    		<div className="flex text-left dark:bg-gray-700">
    			<div className="flex items-center justify-center w-8 px-2 py-3 sm:p-3">
    			</div>
    		</div>
            {messages.length!==0 
            ? messages.map(item=>
                <MessageItem key={item._id} item={item} handleDelete={handleDelete}/>    
            )
            : <h1>No messages over here...</h1>}
    	</div>
    </section>
  )
}

export default Messages