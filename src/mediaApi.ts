import { API_URL, httpClient } from "./httpClient";

export type ImportedMedia = {
  id: string;
  publicUrl: string;
  contentType: string;
  byteSize: number;
  googleArchiveStatus: string;
};

export const mediaApi = {
  async uploadDataUrl(dataUrl: string): Promise<ImportedMedia> {
    const { json } = await httpClient(`${API_URL}/media/upload`, {
      method: "POST",
      body: JSON.stringify({ dataUrl }),
    });
    return (json as { data: { media: ImportedMedia } }).data.media;
  },

  async importUrl(sourceUrl: string): Promise<ImportedMedia> {
    const { json } = await httpClient(`${API_URL}/media/import`, {
      method: "POST",
      body: JSON.stringify({ url: sourceUrl.trim() }),
    });
    return (json as { data: { media: ImportedMedia } }).data.media;
  },
};

export const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Lecture du fichier impossible."));
    reader.readAsDataURL(file);
  });

export const normalizeImageUrl = async (url: string): Promise<string> =>
  url.includes("raw.githubusercontent.com/") ? url : (await mediaApi.importUrl(url)).publicUrl;
