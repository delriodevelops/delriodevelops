'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Maximize2, Minimize2, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const suggestions = ["What's your experience?", 'What have you built?', 'Which project uses AI agents?', "Let's schedule a call"];

// Must match MAX_MESSAGE_LENGTH in app/api/chat/route.js
const MAX_MESSAGE_LENGTH = 800;

// Answers are Markdown; links leave the site in a new tab, raw HTML is never rendered
const markdownComponents = {
  a: ({ href, children }) => {
    const external = /^https?:\/\/(?!(www\.)?iamdelrio\.com(\/|$))/.test(href || '');
    return (
      <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
      </a>
    );
  },
};

export default function GridbreakChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isWide, setIsWide] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! I'm Christian's AI assistant. Ask me anything about his work, projects or how he can help you." },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') (isWide ? setIsWide(false) : setIsOpen(false));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, isWide]);

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
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Sorry, something went wrong. Try again!');
      setMessages([...updatedMessages, { role: 'assistant', content: data.answer }]);
    } catch (err) {
      setMessages([...updatedMessages, { role: 'error', content: err.message }]);
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
        <div
          className={`gb-chat-win${isWide ? ' gb-chat-win--wide' : ''}`}
          role="dialog"
          aria-label="Chat with Christian's AI assistant"
        >
          <div className="gb-chat-head">
            <div>
              <h2 className="gb-cx">Ask anything</h2>
              <span className="gb-mono">AI assistant · online</span>
            </div>
            <div className="gb-chat-actions">
              <button
                className="gb-chat-close"
                onClick={() => setIsWide((wide) => !wide)}
                aria-label={isWide ? 'Shrink chat' : 'Expand chat'}
                aria-pressed={isWide}
              >
                {isWide ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button className="gb-chat-close" onClick={() => setIsOpen(false)} aria-label="Close chat">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="gb-chat-msgs" ref={messagesRef} aria-live="polite">
            {messages.map((msg, i) =>
              msg.role === 'assistant' ? (
                <div key={i} className="gb-msg gb-msg--assistant gb-md">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div key={i} className={`gb-msg gb-msg--${msg.role}`}>
                  {msg.content}
                </div>
              )
            )}
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
              placeholder="Ask about my work…"
              value={input}
              maxLength={MAX_MESSAGE_LENGTH}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()} aria-label="Send message">
              <ArrowUpRight size={20} />
            </button>
          </form>
          <p className="gb-chat-note gb-mono">Questions are saved anonymously so I can improve the answers.</p>
        </div>
      )}
    </div>
  );
}
