// Heuristic, not a validated linguistic instrument — deterministic so it's
// replayable, unlike asking the model that wrote the text to self-rate it.

const SENTENCE_SPLIT_RE = /[.!?؟؛\n]+/;
const WORD_SPLIT_RE = /\s+/;
const LONG_WORD_CHARS = 6;

// Common written-colloquial forms vs. formal Persian. Not exhaustive.
const INFORMAL_MARKERS = [
  "می‌خوام", "می‌خوای", "می‌خواد", "می‌خوایم", "می‌خواین", "می‌خوان",
  "نمی‌خوام", "نمی‌خوای", "نمی‌خواد",
  "بریم", "برین", "بیان", "بیاین",
  "میگم", "میگی", "میگه", "میگیم", "میگن",
  "میشه", "نمیشه", "میتونم", "میتونی", "میتونه", "میتونیم", "میتونین", "میتونن",
  "چیه", "کیه", "اینا", "اونا", "دیگه", "همینه", "باهاش", "توش", "روش",
  "خیلی زیاد", "الکی",
];

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export interface ReadabilityScore {
  readability: number;
  formality: number;
  avgWordsPerSentence: number;
  avgWordLength: number;
}

export function scoreText(text: string): ReadabilityScore {
  const words = text.split(WORD_SPLIT_RE).filter(Boolean);
  const sentences = text.split(SENTENCE_SPLIT_RE).map((s) => s.trim()).filter(Boolean);

  const wordCount = Math.max(1, words.length);
  const sentenceCount = Math.max(1, sentences.length);

  const avgWordsPerSentence = wordCount / sentenceCount;
  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / wordCount;
  const longWordRatio = words.filter((w) => w.length > LONG_WORD_CHARS).length / wordCount;

  const readability = clamp(
    100 - avgWordsPerSentence * 1.8 - longWordRatio * 60,
    0,
    100,
  );

  const informalHits = words.filter((w) => INFORMAL_MARKERS.includes(w)).length;
  const formality = clamp(100 - (informalHits / wordCount) * 100 * 4, 0, 100);

  return {
    readability: Math.round(readability),
    formality: Math.round(formality),
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
    avgWordLength: Math.round(avgWordLength * 10) / 10,
  };
}
