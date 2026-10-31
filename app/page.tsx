'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import { ToolCard } from './components/ToolCard';
import type { ChatMessage } from './api/chat/route';
import Markdown from 'react-markdown';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, stop, error, regenerate } = useChat<ChatMessage>();
  const errorMessage = 'La réponse n’a pas pu être générée. Veuillez réessayer.';
  const welcomeMessage =
    'Bonjour ! Je suis ton assistant IA personnel. Je peux répondre à tes questions ou chercher des documents. Demande moi ce que tu veux !';
  const stickyDivRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    stickyDivRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  return (
    <main className="min-h-screen mx-auto flex max-w-xl flex-col gap-4 p-6">
      {messages.length === 0 && (
        <div>
          <p>{welcomeMessage}</p>
          <button
            type="button"
            className="rounded border px-4"
            onClick={() => {
              sendMessage({ text: 'Quel document conseilles-tu pour bien démarrer ?' });
              textAreaRef.current?.focus();
            }}
          >
            Quel document pour bien démarrer ?
          </button>
        </div>
      )}

      {messages.map((message) => (
        <div key={message.id} className={message.role === 'user' ? 'whitespace-pre-wrap' : ''}>
          <p className="text-xs font-semibold mb-1 text-zinc-400">
            {message.role === 'user' ? 'Moi' : 'Assistant'}
          </p>
          {message.parts.map((part, i) => {
            if (part.type === 'text')
              return (
                <div key={i} className="prose dark:prose-invert">
                  <Markdown>{part.text}</Markdown>
                </div>
              );
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

      <div ref={stickyDivRef}></div>

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
          <textarea
            autoFocus
            ref={textAreaRef}
            rows={1}
            className="flex-1 rounded border p-2"
            value={input}
            placeholder="Pose une question…"
            onChange={(e) => setInput(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
          />
          {status === 'ready' || status === 'error' ? (
            <button type="submit" className="rounded border px-4">
              Envoyer
            </button>
          ) : (
            <button
              type="button"
              className="rounded border px-4"
              onClick={() => {
                stop();
                textAreaRef.current?.focus();
              }}
            >
              Stop
            </button>
          )}
        </div>
      </form>
    </main>
  );
}
