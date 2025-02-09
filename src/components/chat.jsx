'use client'
import React, { useEffect, useState } from 'react'
import { IoSendSharp } from "react-icons/io5";

const Chat = () => {
    const [messages, setMessages] = useState([{ role: 'assistant', content: "Hello there! I'm Christian's assistant, what can I help you with?" }])
    const [content, setContent] = useState('')
    //esto se cambiará de loading a streaming cuando en openai se pueda hacer streaming con los asistentes
    const [isStreaming, setIsStreaming] = useState(false)
    const [threadId, setThreadId] = useState(null)

    async function createThread() {
        const threadId = await (await fetch('/api/threads/create')).json()
        setThreadId(threadId)
        localStorage.setItem('threadId', JSON.stringify(threadId))
        return threadId
    }

    async function getMessages(tID) {
        const response = await (await fetch(`/api/threads/retrieve`, {
            method: 'POST',
            body: JSON.stringify({ threadId: tID })
        })).json()
        setMessages([...messages, ...response])
    }

    useEffect(() => {
        const localThread = localStorage.getItem('threadId')

        if (localThread) {
            const tID = JSON.parse(localThread)
            setThreadId(tID)
            getMessages(tID)
        }
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        let tId = threadId
        if (!content) return;
        if (!threadId) tId = await createThread()
        
        setIsStreaming(true)

        const newMessages = [...messages, { role: 'user', content }]
        setMessages(newMessages)
        fetch('/api/messages', {
            method: 'POST',
            body: JSON.stringify({ threadId: tId, content }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(({ answer }) => {
                setMessages([...newMessages, { role: 'assistant', content: answer }])
                setContent('')
            }).catch(err => {
                setMessages([...newMessages, { role: 'error', content: 'Sorry, an error occurred. Please, try again' }])
                console.error(err)
            })
            .finally(() => setIsStreaming(false))

    }
    return (
        <>
            <div className='flex-grow overflow-y-auto space-y-1 pr-2 mb-1'>
                {
                    messages.map(({ role, content }, index) => (
                        <div key={index} className={`flex ${['assistant', 'error'].includes(role) ? 'justify-start' : 'justify-end'} gap-2`}>
                            {
                                ['assistant', 'error'].includes(role) && (
                                    <img src='/mecha.png' alt='mecha' className='w-12 h-12 rounded-full bg-lime-500' />
                                )
                            }
                            <div className={`rounded-3xl px-4 py-2 ${['assistant', 'error'].includes(role) ? 'mr-[10px]' : 'bg-neutral-600 ml-[10px]'} ${role === 'assistant' && 'bg-blue-500'} ${role === 'error' && 'bg-red-500'} h-fit self-center `}>
                                {content?.split('\n').map((t, i) => <p key={i} className={i && 'block mt-4'}>{t}</p>)}
                            </div>
                        </div>
                    ))
                }
                {
                    isStreaming && (
                        <div className='flex justify-start gap-2'>
                            <img src='/mecha.png' alt='mecha' className='w-12 h-12 rounded-full bg-lime-500' />
                            <p className='rounded-3xl px-4 py-2 bg-blue-500  h-fit self-center'>Typing...</p>
                        </div>
                    )
                }
            </div>
            <form className="flex gap-2" onSubmit={handleSubmit}>
                <input disabled={isStreaming} value={content} onChange={(e) => { setContent(e.target.value) }} type="text" id="chatbox" className="flex-grow p-4 text-md text-neutral-900 border border-neutral-300 rounded-2xl bg-neutral-50 focus:ring-blue-500 focus:border-blue-500 w-full" placeholder="Type your message..." required />
                <button disabled={isStreaming} type="submit" className="text-black bg-lime-400 hover:bg-lime-500 focus:ring-4 focus:outline-none focus:ring-lime-300 font-medium rounded-2xl text-sm px-4 py-2">
                    <IoSendSharp className='text-xl' />
                </button>
            </form>
        </>
    )
}

export default Chat