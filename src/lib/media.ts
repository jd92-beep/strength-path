const CDN =
  "https://cdn.jsdelivr.net/gh/hasaneyldrm/exercises-dataset@main";

export function mediaUrl(relativePath: string): string {
  if (!relativePath) return "";
  if (relativePath.startsWith("http")) return relativePath;
  return `${CDN}/${relativePath.replace(/^\//, "")}`;
}

export function gifUrl(path: string): string {
  return mediaUrl(path);
}

export function thumbUrl(path: string): string {
  return mediaUrl(path);
}
