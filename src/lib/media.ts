/** Primary + fallback CDNs for the exercises-dataset media files. */
const CDNS = [
  "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main",
  "https://cdn.jsdelivr.net/gh/hasaneyldrm/exercises-dataset@main",
] as const;

export function mediaUrl(relativePath: string, cdnIndex = 0): string {
  if (!relativePath) return "";
  if (relativePath.startsWith("http")) return relativePath;
  const base = CDNS[Math.min(cdnIndex, CDNS.length - 1)];
  return `${base}/${relativePath.replace(/^\//, "")}`;
}

export function gifUrl(path: string, cdnIndex = 0): string {
  return mediaUrl(path, cdnIndex);
}

export function thumbUrl(path: string, cdnIndex = 0): string {
  return mediaUrl(path, cdnIndex);
}

export function nextCdnIndex(current: number): number | null {
  const next = current + 1;
  return next < CDNS.length ? next : null;
}

/** Local illustrated icons by body part (generated assets under /public/exercise-icons). */
export function bodyPartIcon(bodyPart: string): string {
  const key = bodyPart.toLowerCase().replace(/\s+/g, "-");
  const known = new Set([
    "chest",
    "back",
    "upper-legs",
    "shoulders",
    "upper-arms",
    "waist",
    "lower-legs",
    "lower-arms",
    "cardio",
    "neck",
  ]);
  const file = known.has(key) ? key : "default";
  return `/exercise-icons/${file}.jpg`;
}
