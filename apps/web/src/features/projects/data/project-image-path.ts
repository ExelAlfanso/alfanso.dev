import { getMediaUrl } from "../../../lib/media-url";

export function getProjectImagePath(imgPath: string) {
  return getMediaUrl(imgPath);
}
