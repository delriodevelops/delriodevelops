'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const formatDate = (iso) =>
  new Date(iso).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' });

/** What visitors asked the site's AI assistant, from /api/admin/chat-log. */
export default function ChatLogPanel({ user }) {
  const [chats, setChats] = useState([]);
  const [open, setOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(
    async (before) => {
      setLoading(true);
      setError('');
      try {
        const token = await user.getIdToken();
        const response = await fetch(`/api/admin/chat-log${before ? `?before=${before}` : ''}`, {
          headers: { authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(response.status === 401 ? 'Not authorized' : `Error ${response.status}`);
        const { chats: page } = await response.json();
        setChats((current) => (before ? [...current, ...page] : page));
        setDone(page.length < 50);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    load();
  }, [load]);

  const visitors = new Set(chats.map((chat) => chat.visitor)).size;

  return (
    <>
      <div className="ed-mono ed-admin-subhead">
        <span>Questions to the AI</span>
        <div className="ed-hairline flex-1"></div>
        <span>
          {chats.length} shown · {visitors} visitors
        </span>
      </div>

      {error && <p className="ed-mono ed-mono--signal">{error}</p>}

      {chats.map((chat) => (
        <div key={chat.id} className="ed-admin-row group cursor-pointer" onClick={() => setOpen(open === chat.id ? null : chat.id)}>
          <h3 className="ed-admin-row-title" style={{ fontSize: '1.05rem' }}>
            {chat.question}
          </h3>
          <div className="ed-mono" style={{ marginTop: '0.4rem' }}>
            {formatDate(chat.at)}
            {chat.country ? ` · ${chat.country}` : ''}
            {chat.page ? ` · ${chat.page}` : ''}
            {` · visitor ${chat.visitor.slice(0, 6)}`}
            {chat.status !== 'ok' && <span className="ed-mono--signal"> · {chat.status}</span>}
          </div>
          {open === chat.id && chat.answer && (
            <p style={{ marginTop: '0.8rem', whiteSpace: 'pre-wrap', opacity: 0.8, fontSize: '0.9rem' }}>{chat.answer}</p>
          )}
        </div>
      ))}

      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-6 h-6 animate-spin ed-spin mx-auto" />
        </div>
      ) : chats.length === 0 ? (
        <div className="ed-empty ed-mono">No questions yet.</div>
      ) : (
        !done && (
          <button className="ed-btn" onClick={() => load(chats.at(-1).id)}>
            Load more
          </button>
        )
      )}
    </>
  );
}
