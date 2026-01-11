'use client';
import React, { useState } from 'react';
import { IoSendSharp } from 'react-icons/io5';

const Chat = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hello there! I'm Christian's assistant, what can I help you with?",
        },
    ]);
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!content.trim() || isLoading) return;

        setIsLoading(true);

        // Add user message to the conversation
        const userMessage = { role: 'user', content: content.trim() };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setContent('');

        try {
            // Send conversation history to API (excluding the initial greeting for cleaner context)
            const conversationHistory = updatedMessages
                .filter((msg) => msg.role !== 'error')
                .slice(1); // Remove initial greeting from context

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: conversationHistory }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const { answer } = await response.json();
            setMessages([...updatedMessages, { role: 'assistant', content: answer }]);
        } catch (err) {
            console.error('Chat error:', err);
            setMessages([
                ...updatedMessages,
                { role: 'error', content: 'Sorry, an error occurred. Please try again.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="flex-grow overflow-y-auto space-y-1 pr-2 mb-1">
                {messages.map(({ role, content }, index) => (
                    <div
                        key={index}
                        className={`flex ${['assistant', 'error'].includes(role) ? 'justify-start' : 'justify-end'
                            } gap-2`}
                    >
                        {['assistant', 'error'].includes(role) && (
                            <img
                                src="/mecha.png"
                                alt="assistant"
                                className="w-12 h-12 rounded-full bg-lime-500"
                            />
                        )}
                        <div
                            className={`rounded-3xl px-4 py-2 ${['assistant', 'error'].includes(role) ? 'mr-[10px]' : 'bg-neutral-600 ml-[10px]'
                                } ${role === 'assistant' && 'bg-blue-500'} ${role === 'error' && 'bg-red-500'
                                } h-fit self-center`}
                        >
                            {content?.split('\n').map((t, i) => (
                                <p key={i} className={i ? 'block mt-4' : ''}>
                                    {t}
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start gap-2">
                        <img
                            src="/mecha.png"
                            alt="assistant"
                            className="w-12 h-12 rounded-full bg-lime-500"
                        />
                        <p className="rounded-3xl px-4 py-2 bg-blue-500 h-fit self-center">Typing...</p>
                    </div>
                )}
            </div>
            <form className="flex gap-2" onSubmit={handleSubmit}>
                <input
                    disabled={isLoading}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    type="text"
                    id="chatbox"
                    className="flex-grow p-4 text-md text-neutral-900 border border-neutral-300 rounded-2xl bg-neutral-50 focus:ring-blue-500 focus:border-blue-500 w-full"
                    placeholder="Type your message..."
                    required
                />
                <button
                    disabled={isLoading}
                    type="submit"
                    className="text-black bg-lime-400 hover:bg-lime-500 focus:ring-4 focus:outline-none focus:ring-lime-300 font-medium rounded-2xl text-sm px-4 py-2 disabled:opacity-50"
                >
                    <IoSendSharp className="text-xl" />
                </button>
            </form>
        </>
    );
};

export default Chat;