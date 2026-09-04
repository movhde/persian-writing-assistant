import { diffArrays } from "diff";

// diffWords()'s tokenizer relies on \b/\w, which only recognizes ASCII word
// characters — Persian letters fall outside \w, so it fragments mid-word.
// Splitting on whitespace ourselves (keeping the separators) and diffing the
// resulting token arrays keeps whole Persian words intact.
function tokenize(text: string): string[] {
  return text.split(/(\s+)/).filter((token) => token.length > 0);
}

export function DiffView({ original, revised }: { original: string; revised: string }) {
  const parts = diffArrays(tokenize(original), tokenize(revised));

  return (
    <p dir="rtl" lang="fa" className="whitespace-pre-wrap text-lg leading-9">
      {parts.map((part, i) => {
        const text = part.value.join("");
        if (part.added) {
          return (
            <ins key={i} className="rounded bg-emerald-100 px-0.5 text-emerald-800 no-underline">
              {text}
            </ins>
          );
        }
        if (part.removed) {
          return (
            <del key={i} className="rounded bg-rose-100 px-0.5 text-rose-700">
              {text}
            </del>
          );
        }
        return <span key={i}>{text}</span>;
      })}
    </p>
  );
}
