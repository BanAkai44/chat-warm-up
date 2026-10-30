type Doc = { title: string; excerpt: string };

type Props = {
  query?: string;
  state: string;
  output?: Doc[];
};

export function ToolCard({ query, state, output }: Props) {
  return (
    <div className="my-2 rounded border border-zinc-600 p-3 text-sm">
      {query && <p className="font-semibold">Recherche de documents : « {query} »</p>}

      {state !== 'output-available' && state !== 'output-error' && (
        <p className="text-zinc-400">Recherche en cours…</p>
      )}

      {state === 'output-error' && <p>Souci outil</p>}

      {state === 'output-available' && output && (
        <ul className="mt-2 space-y-1">
          {output.map((doc, j) => (
            <li key={j}>
              <strong>{doc.title}</strong> — {doc.excerpt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
