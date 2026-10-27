'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, stop } = useChat();

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 p-6">
      {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap">
          <strong>{message.role === 'user' ? 'Moi' : 'Assistant'} : </strong>
          {message.role === 'assistant' && status === 'streaming' && <button type="button" onClick={() => stop()}>Stop</button>}
          {message.parts.map((part, i) =>
            part.type === 'text' ? <span key={i}>{part.text}</span> : null
          )}
        </div>
      ))}

    {status === 'submitted' ?
    <p>Réflexion en cours…</p> : status === 'streaming' ?
    <p>Réponse en cours…</p> : null}

      <form
        onSubmit={e => {
          e.preventDefault();
          {status === 'ready' && input !== null && sendMessage({ text: input });}
          setInput('');
        }}
      >
        <input
          className="w-full rounded border p-2"
          value={input}
          placeholder="Pose une question…"
          onChange={e => setInput(e.currentTarget.value)}
          disabled={status !== 'ready'}
        />
      </form>
    </main>
  );
}