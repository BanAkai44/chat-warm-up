import { simulateReadableStream } from 'ai';
import { MockLanguageModelV4 } from 'ai/test';

// Faux modèle pour tester l'interface sans appeler Gemini (activé par MOCK_MODEL).
const usage = {
  inputTokens: { total: 0, noCache: 0, cacheRead: 0, cacheWrite: 0 },
  outputTokens: { total: 0, text: 0, reasoning: 0 },
};

export const mockModel = new MockLanguageModelV4({
  doStream: async ({ prompt }) => {
    const lastMessage = prompt[prompt.length - 1];

    // Messages "long" et "markdown" : réponse directe, sans outil.
    const userText =
      lastMessage.role === 'user'
        ? lastMessage.content
            .map((part) => (part.type === 'text' ? part.text : ''))
            .join('')
            .trim()
        : '';
    const isLong = userText === 'long';
    const isMarkdown = userText === 'markdown';

    // 1re étape : le modèle demande l'outil.
    if (lastMessage.role !== 'tool' && !isLong && !isMarkdown) {
      return {
        stream: simulateReadableStream({
          initialDelayInMs: 500,
          chunks: [
            {
              type: 'tool-call',
              toolCallId: 'call-1',
              toolName: 'searchDocuments',
              input: JSON.stringify({ query: 'démarrer' }),
            },
            { type: 'finish', usage, finishReason: { unified: 'tool-calls', raw: undefined } },
          ],
        }),
      };
    }

    // 2e étape : il a reçu le résultat (ou l'erreur) de l'outil, il répond mot par mot.
    const text = isLong
      ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
          .repeat(9)
          .slice(0, 1000)
      : isMarkdown
        ? '## Réponse en markdown\n\nVoici du **gras**, de l\'*italique* et du `code` inline.\n\n- Premier point\n- Deuxième point avec **emphase**\n- Troisième point\n\nFin de la réponse simulée.'
        : 'Voici une réponse simulée, sans appel à Gemini.';
    const words = text.split(' ');
    return {
      stream: simulateReadableStream({
        chunkDelayInMs: isLong ? 30 : 150,
        chunks: [
          { type: 'text-start', id: 'text-1' },
          ...words.map((word) => ({
            type: 'text-delta' as const,
            id: 'text-1',
            delta: word + ' ',
          })),
          { type: 'text-end', id: 'text-1' },
          { type: 'finish', usage, finishReason: { unified: 'stop', raw: undefined } },
        ],
      }),
    };
  },
});
