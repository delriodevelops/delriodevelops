import React from 'react'
import {FaTrash}from 'react-icons/fa'
const MessageItem = ({item,handleDelete}) => {

    const {_id,email,message}=item
  return (
    <div className="flex border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex-1 block px-2 py-3  sm:p-3 sm:w-auto">
            <h3>From: {email}</h3>
            <br/>
            <p className='message'>{message}</p>
        </div>
        <div className="flex items-center justify-center px-2 py-3 sm:p-3">
            <FaTrash className='cursor-pointer w-8 h-8 hover:text-red-500'  onClick={()=>{handleDelete(_id)}}/>
        </div>
    </div>
  )
}

export default MessageItem