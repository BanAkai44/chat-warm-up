'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 p-6">
      {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap">
          <strong>{message.role === 'user' ? 'Moi' : 'Assistant'} : </strong>
          {message.parts.map((part, i) =>
            part.type === 'text' ? <span key={i}>{part.text}</span> : null
          )}
        </div>
      ))}

      <form
        onSubmit={e => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input
          className="w-full rounded border p-2"
          value={input}
          placeholder="Pose une question…"
          onChange={e => setInput(e.currentTarget.value)}
        />
      </form>
    </main>
  );
}