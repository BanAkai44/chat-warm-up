import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  tool,
  isStepCount,
  InferUITools,
  UIDataTypes,
} from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { mockModel } from './mock-model';

const tools = {
  searchDocuments: tool({
    description: 'Recherche des documents pertinents pour une requête.',
    inputSchema: z.object({ query: z.string() }),
    // Factice : délai simulé puis résultats en dur.
    execute: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return [
        {
          title: 'Guide de démarrage',
          excerpt: 'Ce guide présente les étapes pour bien démarrer.',
        },
        { title: 'FAQ produit', excerpt: 'Réponses aux questions les plus fréquentes.' },
      ];
    },
  }),
};

export type ChatMessage = UIMessage<never, UIDataTypes, InferUITools<typeof tools>>;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: process.env.MOCK_MODEL ? mockModel : google('gemini-3.5-flash'),
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: isStepCount(5),
    instructions:
      "S'il y a un outil, appelle le une seule fois, puis réponds dans la langue utilisée par l'utilisateur. Répond à partir des documents trouvés plutôt que de relancer une recherche.",
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
