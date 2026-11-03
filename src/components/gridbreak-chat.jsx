'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';

const suggestions = ["What's your experience?", "What's your tech stack?", "Let's schedule a call"];

export default function GridbreakChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! I'm Christian's AI assistant. Ask me anything about his work, skills, or how he can help you." },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (content) => {
    if (!content.trim() || isLoading) return;

    const userMessage = { role: 'user', content: content.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.filter((m) => m.role !== 'error').slice(1),
        }),
      });
      if (!response.ok) throw new Error('Failed to get response');
      const { answer } = await response.json();
      setMessages([...updatedMessages, { role: 'assistant', content: answer }]);
    } catch (err) {
      setMessages([...updatedMessages, { role: 'error', content: 'Sorry, something went wrong. Try again!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="gb-chat" data-lenis-prevent>
      {!isOpen && (
        <button className="gb-chat-toggle" onClick={() => setIsOpen(true)}>
          <span className="gb-dot" style={{ color: 'var(--gb-red)' }} />
          Ask my AI
        </button>
      )}

      {isOpen && (
        <div className="gb-chat-win" role="dialog" aria-label="Chat with Christian's AI assistant">
          <div className="gb-chat-head">
            <div>
              <h2 className="gb-cx">Ask anything</h2>
              <span className="gb-mono">AI assistant · online</span>
            </div>
            <button className="gb-chat-close" onClick={() => setIsOpen(false)} aria-label="Close chat">
              <X size={20} />
            </button>
          </div>

          <div className="gb-chat-msgs" ref={messagesRef} aria-live="polite">
            {messages.map((msg, i) => (
              <div key={i} className={`gb-msg gb-msg--${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {isLoading && <div className="gb-msg gb-msg--assistant gb-mono">Thinking…</div>}
            {messages.length === 1 && !isLoading && (
              <div className="gb-chat-sugg">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => sendMessage(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form className="gb-chat-form" onSubmit={handleSubmit}>
            <label htmlFor="gb-chat-input">Message</label>
            <input
              id="gb-chat-input"
              type="text"
              placeholder="Ask me anything…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()} aria-label="Send message">
              <ArrowUpRight size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
