import { API_URL, httpClient } from "./httpClient";

export type ImportedMedia = {
  id: string;
  publicUrl: string;
  contentType: string;
  byteSize: number;
  googleArchiveStatus: string;
};

/**
 * Miroir exact de src/api/media.ts côté storefront : même pipeline
 * (upload direct en data URL, ou import depuis une URL publique), pour que
 * les images ajoutées depuis l'admin ou depuis l'espace vendeur suivent
 * strictement le même chemin de stockage (GitHub via l'API backend, avec
 * archivage Google Photos en tâche de fond côté serveur).
 */
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

/**
 * Normalise une URL d'image saisie manuellement : si elle pointe déjà vers
 * notre dépôt GitHub de médias, on la garde telle quelle (évite un aller-
 * retour réseau inutile) ; sinon on la fait rapatrier côté serveur via
 * /media/import (mêmes contrôles anti-SSRF que pour l'espace vendeur).
 */
export const normalizeImageUrl = async (url: string): Promise<string> =>
  url.includes("raw.githubusercontent.com/") ? url : (await mediaApi.importUrl(url)).publicUrl;
