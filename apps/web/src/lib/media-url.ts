const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";
const leadingSlashes = /^\/+/;

export function getMediaUrl(key: string) {
  return `${apiUrl}/media/${key.replace(leadingSlashes, "")}`;
}
