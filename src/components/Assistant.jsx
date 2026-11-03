'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const GREETING = {
  role: 'assistant',
  content:
    "Hi. I'm Christian's assistant — ask me about his work, his stack, or what he's shipped.",
};

/**
 * The site assistant, talking to /api/chat.
 *
 * Previously this lived inline in the homepage component, which meant it only
 * existed on `/` and could not be reused. It is self-contained now.
 */
export default function Assistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const logRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Escape closes the panel, matching every other dismissible surface.
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const send = async (event) => {
    event.preventDefault();
    const content = input.trim();
    if (!content || isLoading) return;

    const next = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Drop the local greeting and any past errors before sending.
        body: JSON.stringify({
          messages: next.filter((m) => m.role !== 'error').slice(1),
        }),
      });

      if (!response.ok) throw new Error('Request failed');

      const { answer } = await response.json();
      setMessages([...next, { role: 'assistant', content: answer }]);
    } catch {
      setMessages([
        ...next,
        { role: 'error', content: 'Something went wrong. Try again in a moment.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ed-assistant">
      {isOpen && (
        <div className="ed-assistant-panel" role="dialog" aria-label="Site assistant">
          <div className="ed-assistant-head">
            <span className="ed-mono ed-mono--fg">Assistant</span>
            <button
              type="button"
              className="ed-assistant-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
            >
              <X size={16} />
            </button>
          </div>

          <div className="ed-assistant-log" ref={logRef} aria-live="polite">
            {messages.map((message, i) => (
              <p key={i} className={`ed-msg ed-msg--${message.role}`}>
                {message.content}
              </p>
            ))}
            {isLoading && <p className="ed-msg ed-msg--assistant ed-mono">Thinking…</p>}
          </div>

          <form className="ed-assistant-form" onSubmit={send}>
            <input
              ref={inputRef}
              className="ed-assistant-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask something…"
              aria-label="Message"
            />
            <button className="ed-assistant-send" type="submit" disabled={isLoading || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className="ed-assistant-toggle"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
      >
        <MessageCircle size={14} />
        {isOpen ? 'Close' : 'Ask'}
      </button>
    </div>
  );
}
