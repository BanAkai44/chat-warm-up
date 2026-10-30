'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { ToolCard } from './components/ToolCard';
import type { ChatMessage } from './api/chat/route';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, stop, error, regenerate } = useChat<ChatMessage>();
  const errorMessage = 'La réponse n’a pas pu être générée. Veuillez réessayer.';

  return (
    <main className="min-h-screen mx-auto flex max-w-xl flex-col gap-4 p-6">
      {messages.map((message) => (
        <div key={message.id} className="whitespace-pre-wrap">
          <strong>{message.role === 'user' ? 'Moi' : 'Assistant'} : </strong>
          {message.parts.map((part, i) => {
            if (part.type === 'text') return <span key={i}>{part.text}</span>;
            if (part.type === 'tool-searchDocuments')
              return (
                <ToolCard
                  key={i}
                  query={part.input?.query}
                  state={part.state}
                  output={part.output}
                />
              );
            return null;
          })}
        </div>
      ))}

      {status === 'error' && (
        <div>
          <p>{errorMessage}</p>
          <button type="button" className="rounded border px-4" onClick={() => regenerate()}>
            Réessayer
          </button>
        </div>
      )}

      <form
        className="sticky bottom-0 bg-black py-4 mt-auto"
        onSubmit={(e) => {
          e.preventDefault();
          if ((status !== 'ready' && status !== 'error') || input.trim() === '') return;
          sendMessage({ text: input });
          setInput('');
        }}
      >
        {status === 'submitted' ? (
          <p>Réflexion en cours…</p>
        ) : status === 'streaming' ? (
          <p>Réponse en cours…</p>
        ) : null}

        <div className="flex gap-2">
          <input
            className="flex-1 rounded border p-2"
            value={input}
            placeholder="Pose une question…"
            onChange={(e) => setInput(e.currentTarget.value)}
          />
          {status === 'ready' || status === 'error' ? (
            <button type="submit" className="rounded border px-4">
              Envoyer
            </button>
          ) : (
            <button type="button" className="rounded border px-4" onClick={() => stop()}>
              Stop
            </button>
          )}
        </div>
      </form>
    </main>
  );
}
