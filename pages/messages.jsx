import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../context/GlobalContext'

const Messages = () => {
    const {checkUser,user} = useContext(GlobalContext)
    const [loading,setLoading]=useState(true)    
    useEffect(()=>{
        checkUser()
        !user && window.location.replace('/') 
        fetch('/api/messages')
    },[])
    if(!loading) return (
        <h1>Messsages</h1>
    )
}

export default Messages