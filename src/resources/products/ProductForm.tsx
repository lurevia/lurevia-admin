import {
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  ArrayInput,
  SimpleFormIterator,
  ReferenceArrayInput,
  SelectArrayInput,
  required,
  useRecordContext,
} from "react-admin";
import { useRef, useState, type ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import InfoOutlinedIconModule from "@mui/icons-material/InfoOutlined";
import ShoppingBagIconModule from "@mui/icons-material/ShoppingBag";
import PhotoCameraIconModule from "@mui/icons-material/PhotoCamera";
import CloseIconModule from "@mui/icons-material/Close";
import AutoAwesomeIconModule from "@mui/icons-material/AutoAwesome";
import AddPhotoAlternateIconModule from "@mui/icons-material/AddPhotoAlternate";
import StarIconModule from "@mui/icons-material/Star";
import { normalizeMuiIcon } from "../../muiIcon";
import {
  AIGenerateDialog,
  type AIGeneratedProductDetails,
} from "../../components/AIGenerateDialog";
import { AIImageEditDialog } from "../../components/AIImageEditDialog";
import { mediaApi, readFileAsDataUrl } from "../../mediaApi";

// ─── Icônes normalisées ───
const InfoIcon = normalizeMuiIcon(InfoOutlinedIconModule);
const ShoppingBagIcon = normalizeMuiIcon(ShoppingBagIconModule);
const PhotoCameraIcon = normalizeMuiIcon(PhotoCameraIconModule);
const CloseIcon = normalizeMuiIcon(CloseIconModule);
const AutoAwesomeIcon = normalizeMuiIcon(AutoAwesomeIconModule);
const AddPhotoIcon = normalizeMuiIcon(AddPhotoAlternateIconModule);
const StarIcon = normalizeMuiIcon(StarIconModule);

// ─────────────────────────────────────────────────────────────────────────────
// APERÇU LIVE DU PRODUIT
// ─────────────────────────────────────────────────────────────────────────────

const ProductPreview = ({
  title,
  sku,
  price,
  originalPrice,
  stock,
  isNew,
  images,
  description,
  onImageClick,
  onImageEditAI,
  onImageRemove,
}: {
  title: string;
  sku: string;
  price: number;
  originalPrice?: number;
  stock: number;
  isNew: boolean;
  images: string[];
  description: string;
  onImageClick: (index: number) => void;
  onImageEditAI: (index: number) => void;
  onImageRemove: (index: number) => void;
}) => {
  const previewTitle = title.trim() || "Nom du produit";
  const previewSku = sku.trim() || "SKU-000";
  const mainImage = images[0];
  const hasDiscount = originalPrice && originalPrice > price && price > 0;

  const formatPrice = (n: number) =>
    n > 0 ? new Intl.NumberFormat("fr-MG").format(n) + " Ar" : "—";

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
        <Typography
          variant="overline"
          sx={{ fontWeight: 700, color: "text.secondary", letterSpacing: 1 }}
        >
          Aperçu en direct
        </Typography>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          maxWidth: 320,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2.5,
          overflow: "hidden",
          boxShadow: "0 8px 24px -12px rgba(0,0,0,0.15)",
        }}
      >
        <Box
          sx={{
            position: "relative",
            aspectRatio: "1 / 1",
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
            cursor: mainImage ? "pointer" : "default",
            "&:hover .main-overlay": { opacity: 1 },
          }}
          onClick={() => mainImage && onImageClick(0)}
        >
          {mainImage ? (
            <>
              <Box
                component="img"
                src={mainImage}
                alt={previewTitle}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <Box
                className="main-overlay"
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  opacity: 0,
                  transition: "opacity 0.2s ease",
                }}
              >
                <Tooltip title="Changer l'image">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onImageClick(0);
                    }}
                    sx={{
                      color: "#FFFFFF",
                      backgroundColor: "rgba(255,255,255,0.2)",
                    }}
                  >
                    <PhotoCameraIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Éditer avec l'IA">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onImageEditAI(0);
                    }}
                    sx={{
                      color: "#FFFFFF",
                      backgroundColor: "rgba(255,255,255,0.2)",
                    }}
                  >
                    <AutoAwesomeIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
                gap: 1,
              }}
            >
              <AddPhotoIcon sx={{ fontSize: 40, opacity: 0.4 }} />
              <Typography sx={{ fontSize: 12 }}>Ajouter une image</Typography>
            </Box>
          )}

          {isNew && (
            <Chip
              label="NOUVEAU"
              size="small"
              sx={{
                position: "absolute",
                top: 10,
                left: 10,
                height: 22,
                fontSize: 9.5,
                fontWeight: 800,
                backgroundColor: "primary.main",
                color: "primary.contrastText",
              }}
            />
          )}
          {hasDiscount && (
            <Chip
              label={`-${Math.round(((originalPrice! - price) / originalPrice!) * 100)}%`}
              size="small"
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                height: 22,
                fontSize: 9.5,
                fontWeight: 800,
                backgroundColor: "error.main",
                color: "#FFFFFF",
              }}
            />
          )}
        </Box>

        <Box sx={{ p: 1.75 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, lineHeight: 1.3, mb: 0.25, minHeight: 36 }}
          >
            {previewTitle}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", fontFamily: "monospace", mb: 1, fontSize: 10.5 }}
          >
            {previewSku}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mb: 1 }}>
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 800,
                color: "primary.main",
                letterSpacing: "-0.3px",
              }}
            >
              {formatPrice(price)}
            </Typography>
            {hasDiscount && (
              <Typography
                sx={{
                  fontSize: 11.5,
                  color: "text.secondary",
                  textDecoration: "line-through",
                }}
              >
                {formatPrice(originalPrice!)}
              </Typography>
            )}
          </Stack>

          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1 }}>
            <StarIcon sx={{ fontSize: 14, color: "#FDB022" }} />
            <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>
              Aucun avis
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: "text.secondary", ml: "auto" }}>
              Stock : {stock}
            </Typography>
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: 11.5,
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: 30,
            }}
          >
            {description.trim() || "Description courte du produit..."}
          </Typography>
        </Box>
      </Paper>

      {images.length > 1 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ mt: 1.5, maxWidth: 320, flexWrap: "wrap" }}
        >
          {images.map((img, i) => (
            <Box
              key={i}
              sx={{
                position: "relative",
                width: 56,
                height: 56,
                borderRadius: 1.5,
                overflow: "hidden",
                border: "2px solid",
                borderColor: i === 0 ? "primary.main" : "divider",
                cursor: "pointer",
                "&:hover .thumb-overlay": { opacity: 1 },
              }}
            >
              <Box
                component="img"
                src={img}
                alt={`Miniature ${i + 1}`}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <Box
                className="thumb-overlay"
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  opacity: 0,
                  transition: "opacity 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.25,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => onImageEditAI(i)}
                  sx={{ color: "#FFFFFF", p: 0.25 }}
                >
                  <AutoAwesomeIcon sx={{ fontSize: 14 }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onImageRemove(i)}
                  sx={{ color: "#FFFFFF", p: 0.25 }}
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Stack>
      )}

      <Alert
        severity="info"
        icon={<InfoIcon fontSize="small" />}
        sx={{
          mt: 2,
          maxWidth: 320,
          py: 0.75,
          "& .MuiAlert-message": { fontSize: 11.5, lineHeight: 1.5 },
        }}
      >
        Cliquez sur une image pour la modifier. Utilisez ✨ pour l'éditer avec l'IA.
      </Alert>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTENU DU FORMULAIRE (ENFANT DE <SimpleForm>)
// ─────────────────────────────────────────────────────────────────────────────
// ⚠️ Ce composant DOIT être rendu À L'INTÉRIEUR de <SimpleForm> pour que
// useFormContext() fonctionne. C'est lui qui a accès au form context.

const ProductFormContent = () => {
  const record = useRecordContext();
  const isEdit = Boolean(record?.id);

  // ✅ useFormContext() fonctionne car ce composant est enfant de <SimpleForm>
  const { setValue, watch } = useFormContext();

  // ─── État local des images ───
  const initialImages: string[] =
    Array.isArray(record?.images) && record.images.length > 0
      ? record.images.map((img: any) =>
          typeof img === "string" ? img : img.url
        )
      : [];

  const [images, setImages] = useState<string[]>(initialImages);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageUrlDraft, setImageUrlDraft] = useState("");
  const [imageUploadError, setImageUploadError] = useState("");
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const editingImageIndex = useRef<number>(-1);

  // ─── Valeurs du formulaire (aperçu live) ───
  const title = (watch("title") as string) ?? record?.title ?? "";
  const sku = (watch("sku") as string) ?? record?.sku ?? "";
  const price = Number(watch("price") ?? record?.price ?? 0);
  const originalPrice = Number(
    watch("originalPrice") ?? record?.originalPrice ?? 0
  );
  const stock = Number(watch("stock") ?? record?.stock ?? 0);
  const isNew = Boolean(watch("isNew") ?? record?.isNew ?? false);
  const description =
    (watch("description") as string) ?? record?.description ?? "";

  // ─── Modales IA ───
  const [aiGenerateOpen, setAiGenerateOpen] = useState(false);
  const [aiImageOpen, setAiImageOpen] = useState(false);

  // ─── Gestion images ───
  const syncImagesToForm = (newImages: string[]) => {
    setImages(newImages);
    setValue("images", newImages, { shouldDirty: true });
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const selectedFiles = Array.from(files);
    const validFiles = selectedFiles.filter((file) =>
      acceptedTypes.includes(file.type) && file.size <= 2 * 1024 * 1024
    );
    if (validFiles.length !== selectedFiles.length) {
      setImageUploadError("Formats acceptés : JPG, PNG, GIF ou WebP, jusqu'à 2 Mo par image.");
    } else {
      setImageUploadError("");
    }
    if (validFiles.length === 0) {
      if (event.target) event.target.value = "";
      return;
    }

    setUploadingImages(true);
    try {
      const uploaded = await Promise.all(validFiles.map(async (file) => {
        const dataUrl = await readFileAsDataUrl(file);
        return mediaApi.uploadDataUrl(dataUrl);
      }));
      const uploadedUrls = uploaded.map((media) => media.publicUrl);
      const replaceIndex = editingImageIndex.current;
      if (replaceIndex >= 0 && replaceIndex < images.length) {
        const next = [...images];
        next[replaceIndex] = uploadedUrls[0];
        syncImagesToForm(next);
      } else {
        syncImagesToForm([...images, ...uploadedUrls]);
      }
      editingImageIndex.current = -1;
    } catch (err) {
      setImageUploadError(err instanceof Error ? err.message : "L'envoi des images a échoué.");
    } finally {
      setUploadingImages(false);
      if (event.target) event.target.value = "";
    }
  };

  const handleImportImageUrl = async () => {
    if (!imageUrlDraft.trim()) return;
    setUploadingImages(true);
    setImageUploadError("");
    try {
      const uploaded = await mediaApi.importUrl(imageUrlDraft);
      syncImagesToForm([...images, uploaded.publicUrl]);
      setImageUrlDraft("");
    } catch (err) {
      setImageUploadError(err instanceof Error ? err.message : "L'import de l'image a échoué.");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    syncImagesToForm(next);
  };

  const openImagePicker = (index?: number) => {
    editingImageIndex.current = index ?? -1;
    imageInputRef.current?.click();
  };

  const openAIImageEditor = (index: number) => {
    editingImageIndex.current = index;
    setAiImageOpen(true);
  };

  const handleAIImageApply = (newUrl: string) => {
    const idx = editingImageIndex.current;
    if (idx >= 0 && idx < images.length) {
      const next = [...images];
      next[idx] = newUrl;
      syncImagesToForm(next);
    } else {
      syncImagesToForm([...images, newUrl]);
    }
  };

  const handleAIDetailsApply = (details: AIGeneratedProductDetails) => {
    setValue("description", details.description, { shouldDirty: true });
    setValue("longDescription", details.longDescription, { shouldDirty: true });
    setValue("tags", details.tags, { shouldDirty: true });
    setValue("sizes", details.sizes, { shouldDirty: true });
  };

  return (
    <>
      {/* Input file caché */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleImageUpload}
      />

      <Box sx={{ width: "100%", pt: 2 }}>
        {/* Intro */}
        <Box sx={{ mb: 3, maxWidth: 1200, mx: "auto" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
            {isEdit ? "Modifier le produit" : "Nouveau produit"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEdit
              ? "Modifiez les informations et les visuels. L'aperçu se met à jour en direct."
              : "Renseignez les informations ci-dessous pour ajouter un nouveau produit."}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Layout 2 colonnes */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 340px" },
            gap: 4,
            maxWidth: 1200,
            mx: "auto",
          }}
        >
          {/* ═══ COLONNE GAUCHE : FORMULAIRE ═══ */}
          <Box>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 700,
                color: "text.secondary",
                letterSpacing: 1,
                mb: 1.5,
                display: "block",
              }}
            >
              Identité du produit
            </Typography>

            <TextInput
              source="title"
              label="Titre"
              validate={required()}
              fullWidth
              placeholder="Ex : Sac en raphia naturel tressé main"
              helperText="Titre clair et descriptif (max 100 caractères)."
            />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 2 }}
            >
              <TextInput
                source="sku"
                label="SKU"
                validate={required()}
                fullWidth
                placeholder="Ex : SAC-RAP-001"
                helperText="Référence unique interne."
              />
              <NumberInput
                source="price"
                label="Prix (Ar)"
                validate={required()}
                fullWidth
                helperText="Prix en Ariary malgache."
              />
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 2 }}
            >
              <NumberInput
                source="originalPrice"
                label="Prix barré (Ar)"
                fullWidth
                helperText="Optionnel — pour afficher une promo."
              />
              <NumberInput
                source="stock"
                label="Stock disponible"
                defaultValue={0}
                validate={required()}
                fullWidth
                helperText="Quantité en inventaire."
              />
            </Stack>

            <Box sx={{ mt: 2 }}>
              <BooleanInput source="isNew" label="Marquer comme nouveau" />
            </Box>

            <Box sx={{ mt: 2 }}>
              <ReferenceArrayInput
                source="categoryIds"
                reference="categories"
                label="Catégories"
              >
                <SelectArrayInput
                  optionText="name"
                  validate={required()}
                  fullWidth
                />
              </ReferenceArrayInput>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1.5 }}
            >
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 700,
                  color: "text.secondary",
                  letterSpacing: 1,
                }}
              >
                Description
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
                onClick={() => setAiGenerateOpen(true)}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 11.5,
                  borderRadius: 1.5,
                  borderColor: "primary.main",
                  color: "primary.main",
                  py: 0.5,
                  "&:hover": {
                    backgroundColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.08),
                    borderColor: "primary.main",
                  },
                }}
              >
                Générer avec l'IA
              </Button>
            </Stack>

            <TextInput
              source="description"
              label="Description courte"
              fullWidth
              multiline
              rows={2}
              placeholder="Résumé en une phrase pour les listes produits."
              helperText="Apparaît dans le catalogue et les résultats de recherche."
            />

            <Box sx={{ mt: 2 }}>
              <TextInput
                source="longDescription"
                label="Description longue"
                multiline
                rows={5}
                fullWidth
                placeholder="Description complète : matières, dimensions, entretien, origine..."
                helperText="Détails affichés sur la fiche produit."
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="overline"
              sx={{
                fontWeight: 700,
                color: "text.secondary",
                letterSpacing: 1,
                mb: 1.5,
                display: "block",
              }}
            >
              Variantes
            </Typography>

            <ArrayInput source="tags" label="Tags / mots-clés" defaultValue={[]}>
              <SimpleFormIterator inline>
                <TextInput source="" label="Tag" helperText={false} />
              </SimpleFormIterator>
            </ArrayInput>

            <Box sx={{ mt: 2 }}>
              <ArrayInput
                source="sizes"
                label="Tailles / dimensions"
                defaultValue={[]}
              >
                <SimpleFormIterator inline>
                  <TextInput source="" label="Valeur" helperText={false} />
                </SimpleFormIterator>
              </ArrayInput>
            </Box>

            <Box sx={{ mt: 2 }}>
              <ArrayInput source="colors" label="Couleurs" defaultValue={[]}>
                <SimpleFormIterator inline>
                  <TextInput source="label" label="Nom" helperText={false} />
                  <TextInput
                    source="hex"
                    label="Code hex"
                    placeholder="#2F7BF6"
                    helperText={false}
                  />
                </SimpleFormIterator>
              </ArrayInput>
            </Box>

            <Box sx={{ height: 24 }} />
          </Box>

          {/* ═══ COLONNE DROITE : APERÇU LIVE ═══ */}
          <Box>
            <Box sx={{ position: "sticky", top: 24 }}>
              <ProductPreview
                title={title}
                sku={sku}
                price={price}
                originalPrice={originalPrice}
                stock={stock}
                isNew={isNew}
                images={images}
                description={description}
                onImageClick={(i) => openImagePicker(i)}
                onImageEditAI={(i) => openAIImageEditor(i)}
                onImageRemove={(i) => handleRemoveImage(i)}
              />

              <Stack spacing={1} sx={{ mt: 2, maxWidth: 320 }}>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  disabled={uploadingImages}
                  startIcon={<AddPhotoIcon fontSize="small" />}
                  onClick={() => openImagePicker()}
                  sx={{ textTransform: "none", fontWeight: 600, fontSize: 12 }}
                >
                  Ajouter une image
                </Button>
                <Stack direction="row" spacing={0.75}>
                  <TextField
                    value={imageUrlDraft}
                    onChange={(event) => setImageUrlDraft(event.target.value)}
                    placeholder="URL d'image à importer"
                    size="small"
                    fullWidth
                    inputProps={{ "aria-label": "URL d'image à importer" }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={uploadingImages || !imageUrlDraft.trim()}
                    onClick={() => void handleImportImageUrl()}
                  >
                    {uploadingImages ? <CircularProgress size={16} /> : "Importer"}
                  </Button>
                </Stack>
                {imageUploadError && (
                  <Alert severity="error" sx={{ py: 0.25, "& .MuiAlert-message": { fontSize: 11.5 } }}>
                    {imageUploadError}
                  </Alert>
                )}
                {images.length > 0 && (
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    startIcon={<AutoAwesomeIcon fontSize="small" />}
                    onClick={() => openAIImageEditor(0)}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: 12,
                      borderColor: "primary.main",
                      color: "primary.main",
                    }}
                  >
                    Éditer l'image avec l'IA
                  </Button>
                )}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Modales IA */}
      <AIGenerateDialog
        open={aiGenerateOpen}
        onClose={() => setAiGenerateOpen(false)}
        initialContext={{ title }}
        onApply={handleAIDetailsApply}
      />

      <AIImageEditDialog
        open={aiImageOpen}
        onClose={() => setAiImageOpen(false)}
        imageUrl={images[editingImageIndex.current] ?? ""}
        onApply={handleAIImageApply}
      />
    </>
  );
};


export const ProductForm = () => (
  <SimpleForm
    sx={{
      "& .RaSimpleForm-toolbar": {
        px: 3,
        py: 2,
        borderTop: "1px solid",
        borderColor: "divider",
      },
    }}
  >
    <ProductFormContent />
  </SimpleForm>
);