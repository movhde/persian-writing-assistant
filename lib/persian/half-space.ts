const ZWNJ = "‌";
const FA = "؀-ۿ";

// Longest alternatives first so "ترین" isn't matched as "تر" + "ین".
const PREFIXES = ["نمی", "می", "بی"];
const SUFFIXES = ["های", "ترین", "گونه", "تر", "ها", "وار"];

const PREFIX_RE = new RegExp(`(?<=^|[\\s])(${PREFIXES.join("|")})[ \\t]+(?=[${FA}])`, "gu");
const SUFFIX_RE = new RegExp(`(?<=[${FA}])[ \\t]+(${SUFFIXES.join("|")})(?=[\\s.,!?؟،؛:]|$)`, "gu");

export interface HalfSpaceChange {
  before: string;
  after: string;
}

export interface HalfSpaceResult {
  text: string;
  changes: HalfSpaceChange[];
}

function applyRule(
  text: string,
  re: RegExp,
  replace: (match: RegExpExecArray) => string,
  changes: HalfSpaceChange[],
): string {
  let result = "";
  let lastIndex = 0;
  re.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const replacement = replace(m);
    result += text.slice(lastIndex, m.index) + replacement;
    changes.push({ before: m[0], after: replacement });
    lastIndex = re.lastIndex;
  }
  return result + text.slice(lastIndex);
}

export function correctHalfSpaces(text: string): HalfSpaceResult {
  const changes: HalfSpaceChange[] = [];
  const afterPrefixes = applyRule(text, PREFIX_RE, (m) => `${m[1]}${ZWNJ}`, changes);
  const afterSuffixes = applyRule(afterPrefixes, SUFFIX_RE, (m) => `${ZWNJ}${m[1]}`, changes);
  return { text: afterSuffixes, changes };
}
