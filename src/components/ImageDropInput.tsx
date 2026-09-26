import { useState, useCallback, type DragEvent } from "react";
import { useInput, type InputProps } from "react-admin";
import { mediaApi, readFileAsDataUrl, normalizeImageUrl } from "../mediaApi";

const dropZoneClass = (active: boolean) =>
  `flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed p-4 text-center text-sm cursor-pointer transition-colors ${
    active ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
  }`;

const uploadFiles = async (files: File[]): Promise<string[]> => {
  const dataUrls = await Promise.all(files.map(readFileAsDataUrl));
  const uploaded = await Promise.all(dataUrls.map((dataUrl) => mediaApi.uploadDataUrl(dataUrl)));
  return uploaded.map((m) => m.publicUrl);
};

/**
 * Zone de dépôt + saisie d'URL pour ajouter une ou plusieurs images.
 *
 * Remplace les champs "Image (URL)" en texte libre : coller une URL reste
 * possible (elle est automatiquement rapatriée vers notre stockage GitHub
 * via /media/import — voir mediaApi.ts), mais on peut aussi glisser-déposer
 * un fichier depuis son ordinateur, ce qui évite d'avoir à héberger l'image
 * ailleurs au préalable.
 */
export const ImageDropInput = (props: InputProps & { multiple?: boolean; label?: string }) => {
  const { field } = useInput(props);
  const multiple = props.multiple ?? true;
  const [dragActive, setDragActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [urlDraft, setUrlDraft] = useState("");

  const currentUrls: string[] = multiple ? (Array.isArray(field.value) ? field.value : []) : field.value ? [field.value] : [];

  const commit = (urls: string[]) => {
    field.onChange(multiple ? urls : urls[0] ?? "");
  };

  const addUrls = useCallback(
    (newUrls: string[]) => {
      commit(multiple ? [...currentUrls, ...newUrls] : newUrls.slice(-1));
    },
    [currentUrls, multiple]
  );

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setBusy(true);
    setError("");
    try {
      const urls = await uploadFiles(Array.from(fileList));
      addUrls(urls);
    } catch {
      setError("L'envoi d'une image a échoué. Vérifiez le format (jpg, png, gif, webp) et la taille.");
    } finally {
      setBusy(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    void handleFiles(event.dataTransfer.files);
  };

  const handleAddUrl = async () => {
    const url = urlDraft.trim();
    if (!url) return;
    setBusy(true);
    setError("");
    try {
      const publicUrl = await normalizeImageUrl(url);
      addUrls([publicUrl]);
      setUrlDraft("");
    } catch {
      setError("Cette URL n'a pas pu être importée (image invalide ou inaccessible).");
    } finally {
      setBusy(false);
    }
  };

  const removeAt = (index: number) => commit(currentUrls.filter((_, i) => i !== index));

  return (
    <div className="mb-4 w-full">
      {props.label && (
        <label className="mb-1 block text-xs font-semibold text-gray-600">{props.label}</label>
      )}

      {currentUrls.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {currentUrls.map((url, index) => (
            <div key={`${url}-${index}`} className="relative h-20 w-20 overflow-hidden rounded-md border border-gray-200">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label="Retirer cette image"
                className="absolute right-0 top-0 rounded-bl bg-black/60 px-1 text-xs text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        className={dropZoneClass(dragActive)}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById(`file-input-${props.source}`)?.click()}
      >
        <input
          id={`file-input-${props.source}`}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple={multiple}
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />
        <span>{busy ? "Envoi en cours…" : "Glissez une image ici, ou cliquez pour en choisir une"}</span>
      </div>

      <div className="mt-2 flex gap-2">
        <input
          type="url"
          placeholder="…ou collez une URL d'image"
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          className="flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        />
        <button
          type="button"
          onClick={() => void handleAddUrl()}
          disabled={busy || !urlDraft.trim()}
          className="rounded-md bg-gray-800 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          Ajouter
        </button>
      </div>

      {error && <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
};
