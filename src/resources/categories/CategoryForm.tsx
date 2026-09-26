import {
  SimpleForm,
  TextInput,
  required,
  useRecordContext,
} from "react-admin";
import { useRef, useState, type ChangeEvent } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import InfoOutlinedIconModule from "@mui/icons-material/InfoOutlined";
import CollectionsIconModule from "@mui/icons-material/Collections";
import ShoppingBagIconModule from "@mui/icons-material/ShoppingBag";
import CategoryIconModule from "@mui/icons-material/Category";
import DescriptionIconModule from "@mui/icons-material/Description";
import AutoAwesomeIconModule from "@mui/icons-material/AutoAwesome";
import PhotoCameraIconModule from "@mui/icons-material/PhotoCamera";
import CloseIconModule from "@mui/icons-material/Close";
import WallpaperIconModule from "@mui/icons-material/Wallpaper";
import EditOutlinedIconModule from "@mui/icons-material/EditOutlined";
import { normalizeMuiIcon } from "../../muiIcon";

// ─── Icônes normalisées ───
const InfoIcon = normalizeMuiIcon(InfoOutlinedIconModule);
const CollectionsIcon = normalizeMuiIcon(CollectionsIconModule);
const ShoppingBagIcon = normalizeMuiIcon(ShoppingBagIconModule);
const CategoryIcon = normalizeMuiIcon(CategoryIconModule);
const DescriptionIcon = normalizeMuiIcon(DescriptionIconModule);
const AutoAwesomeIcon = normalizeMuiIcon(AutoAwesomeIconModule);
const PhotoCameraIcon = normalizeMuiIcon(PhotoCameraIconModule);
const CloseIcon = normalizeMuiIcon(CloseIconModule);
const WallpaperIcon = normalizeMuiIcon(WallpaperIconModule);
const EditIcon = normalizeMuiIcon(EditOutlinedIconModule);

// ─────────────────────────────────────────────────────────────────────────────
// ENCART D'AIDE
// ─────────────────────────────────────────────────────────────────────────────

const FieldHelper = ({
  icon,
  title,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 1.25,
      p: 1.5,
      mb: 1.5,
      borderRadius: 1.5,
      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
      border: "1px solid",
      borderColor: (theme) => alpha(theme.palette.primary.main, 0.12),
    }}
  >
    <Box
      sx={{
        width: 26,
        height: 26,
        borderRadius: 1,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
        color: "primary.main",
        "& svg": { fontSize: 16 },
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography sx={{ fontSize: 12.5, fontWeight: 700, mb: 0.25 }}>
        {title}
      </Typography>
      <Typography
        sx={{ fontSize: 11.5, color: "text.secondary", lineHeight: 1.5 }}
      >
        {hint}
      </Typography>
    </Box>
  </Box>
);

// ─────────────────────────────────────────────────────────────────────────────
// APERÇU LIVE DE LA CARTE
// ─────────────────────────────────────────────────────────────────────────────

const CategoryPreview = ({
  name,
  slug,
  description,
  imageUrl,
  bannerUrl,
  onImageClick,
  onBannerClick,
  onImageRemove,
  onBannerRemove,
}: {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  bannerUrl: string;
  onImageClick: () => void;
  onBannerClick: () => void;
  onImageRemove: () => void;
  onBannerRemove: () => void;
}) => {
  const previewName = name.trim() || "Nom de la catégorie";
  const previewSlug = slug.trim() || "slug";
  const previewDesc = description.trim() || "Description de la catégorie...";
  const previewInitial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
        <Typography
          variant="overline"
          sx={{ fontWeight: 700, color: "text.secondary", letterSpacing: 1 }}
        >
          Aperçu en direct
        </Typography>
        <Chip
          icon={<EditIcon sx={{ fontSize: 12 }} />}
          label="Images éditables"
          size="small"
          sx={{
            height: 20,
            fontSize: 10,
            fontWeight: 600,
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
            color: "primary.main",
            "& .MuiChip-icon": { color: "inherit" },
          }}
        />
      </Stack>

      <Paper
        elevation={0}
        sx={{
          maxWidth: 320,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2.5,
          overflow: "hidden",
          backgroundColor: "background.paper",
          boxShadow: "0 8px 24px -12px rgba(0,0,0,0.15)",
        }}
      >
        {/* Bandeau bannière */}
        <Box
          sx={{
            position: "relative",
            height: 72,
            backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: (theme) =>
              bannerUrl ? "transparent" : alpha(theme.palette.primary.main, 0.08),
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover .banner-overlay": { opacity: 1 },
          }}
          onClick={onBannerClick}
        >
          {/* Overlay au survol */}
          <Box
            className="banner-overlay"
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "#FFFFFF",
              opacity: 0,
              transition: "opacity 0.2s ease",
            }}
          >
            <PhotoCameraIcon sx={{ fontSize: 20 }} />
            <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
              Changer la bannière
            </Typography>
          </Box>

          {/* Bouton retirer bannière */}
          {bannerUrl && (
            <Tooltip title="Retirer la bannière" arrow>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onBannerRemove();
                }}
                sx={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 22,
                  height: 22,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  color: "#FFFFFF",
                  "&:hover": { backgroundColor: "error.main" },
                }}
                aria-label="Retirer la bannière"
              >
                <CloseIcon sx={{ fontSize: 13 }} />
              </IconButton>
            </Tooltip>
          )}

          {/* Avatar rond chevauchant */}
          <Box
            sx={{
              position: "absolute",
              bottom: -28,
              left: 16,
              width: 56,
              height: 56,
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid",
              borderColor: "background.paper",
              backgroundColor: "background.paper",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover .avatar-overlay": { opacity: 1 },
            }}
            onClick={(e) => {
              e.stopPropagation();
              onImageClick();
            }}
          >
            {imageUrl ? (
              <Box
                component="img"
                src={imageUrl}
                alt={previewName}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <CategoryIcon sx={{ fontSize: 26, color: "primary.main" }} />
            )}

            {/* Overlay au survol */}
            <Box
              className="avatar-overlay"
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "#FFFFFF",
                opacity: 0,
                transition: "opacity 0.2s ease",
              }}
            >
              <PhotoCameraIcon sx={{ fontSize: 18 }} />
            </Box>
          </Box>

          {/* Bouton retirer avatar */}
          {imageUrl && (
            <Tooltip title="Retirer l'image" arrow>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageRemove();
                }}
                sx={{
                  position: "absolute",
                  bottom: -20,
                  left: 56,
                  width: 20,
                  height: 20,
                  zIndex: 3,
                  backgroundColor: "error.main",
                  color: "#FFFFFF",
                  "&:hover": { backgroundColor: "error.dark" },
                }}
                aria-label="Retirer l'image"
              >
                <CloseIcon sx={{ fontSize: 11 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Contenu */}
        <Box sx={{ pt: 5, pb: 2, px: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, lineHeight: 1.3, mb: 0.25 }}
            noWrap
            title={previewName}
          >
            {previewName}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", fontFamily: "monospace", mb: 1 }}
            noWrap
          >
            /{previewSlug}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: 12.5,
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: 36,
            }}
          >
            {previewDesc}
          </Typography>

          <Stack direction="row" spacing={0.75} sx={{ mt: 1.5 }} flexWrap="wrap">
            <Chip
              icon={<ShoppingBagIcon sx={{ fontSize: 14 }} />}
              label="0 produit"
              size="small"
              sx={{
                height: 22,
                fontSize: 11,
                fontWeight: 600,
                "& .MuiChip-icon": { color: "inherit" },
              }}
            />
          </Stack>
        </Box>
      </Paper>

      <Alert
        severity="info"
        icon={<InfoIcon fontSize="small" />}
        sx={{
          mt: 2,
          maxWidth: 320,
          py: 1,
          "& .MuiAlert-message": { fontSize: 12, lineHeight: 1.5 },
        }}
      >
        Cliquez sur les images pour les modifier directement.
      </Alert>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FORMULAIRE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

export const CategoryForm = () => {
  const record = useRecordContext();
  const isEdit = Boolean(record?.id);

  // Réf inputs file (cachés)
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);

  // État local des images (aperçu + valeur du formulaire)
  const [imageUrl, setImageUrl] = useState<string>(record?.imageUrl ?? "");
  const [bannerUrl, setBannerUrl] = useState<string>(record?.bannerUrl ?? "");

  // Upload d'image générique
  const handleFile = (
    event: ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Le fichier doit être une image (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("L'image doit faire moins de 2 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") setter(result);
    };
    reader.readAsDataURL(file);

    if (event.target) event.target.value = "";
  };

  return (
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
      {/* Champs cachés qui seront soumis */}
      <TextInput source="imageUrl" defaultValue={imageUrl} sx={{ display: "none" }} />
      <TextInput source="bannerUrl" defaultValue={bannerUrl} sx={{ display: "none" }} />

      <Box sx={{ width: "100%", pt: 2 }}>
        {/* Intro */}
        <Box sx={{ mb: 3, maxWidth: 1100, mx: "auto" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
            {isEdit ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEdit
              ? "Modifiez les informations et les visuels. L'aperçu se met à jour en direct."
              : "Renseignez les informations ci-dessous pour créer une nouvelle catégorie."}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* ─── Layout 2 colonnes ─── */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 340px" },
            gap: 4,
            maxWidth: 1100,
            mx: "auto",
          }}
        >
          {/* ═══ COLONNE GAUCHE : FORMULAIRE ═══ */}
          <Box>
            {/* ─── Section 1 : Identité ─── */}
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
              Identité
            </Typography>

            <FieldHelper
              icon={<CategoryIcon />}
              title="Nom affiché"
              hint="Le nom de la catégorie tel qu'il apparaîtra sur la boutique. Ex : « Artisanat », « Bijoux », « Beauté »."
            />
            <TextInput
              source="name"
              label="Nom"
              validate={required()}
              fullWidth
              placeholder="Ex : Artisanat malgache"
              helperText="Utilisez un nom court et clair, entre 2 et 40 caractères."
            />

            <Box sx={{ mt: 2 }}>
              <FieldHelper
                icon={<DescriptionIcon />}
                title="Description"
                hint="Un court texte qui explique ce que contient cette catégorie. Il apparaît sous le titre sur la page catalogue."
              />
              <TextInput
                source="description"
                label="Description"
                multiline
                rows={3}
                validate={required()}
                fullWidth
                placeholder="Ex : Découvrez nos créations artisanales 100 % faites main par des artisans malgaches."
                helperText="2 à 3 phrases suffisent (max 300 caractères recommandés)."
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* ─── Section 2 : Paramètres avancés ─── */}
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
              Paramètres avancés
            </Typography>

            <FieldHelper
              icon={<AutoAwesomeIcon />}
              title="Icône Lucide"
              hint="Identifiant technique de l'icône affichée si l'image principale est absente."
            />
            <TextInput
              source="iconName"
              label="Icône (nom Lucide)"
              defaultValue="ShoppingBag"
              fullWidth
              helperText="Ex : ShoppingBag, Gem, Palette, Sparkles. Voir lucide.dev/icons pour la liste complète."
            />

            {/* Aperçu icône par défaut */}
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
                border: "1px dashed",
                borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
                  color: "primary.main",
                }}
              >
                <ShoppingBagIcon fontSize="small" />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                  Icône par défaut
                </Typography>
                <Typography
                  sx={{ fontSize: 11.5, color: "text.secondary", lineHeight: 1.4 }}
                >
                  Si aucune image n'est fournie, une icône générique sera affichée.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ height: 24 }} />
          </Box>

          {/* ═══ COLONNE DROITE : APERÇU LIVE ═══ */}
          <Box>
            <Box sx={{ position: "sticky", top: 24 }}>
              <CategoryPreview
                name={record?.name ?? ""}
                slug={record?.slug ?? ""}
                description={record?.description ?? ""}
                imageUrl={imageUrl}
                bannerUrl={bannerUrl}
                onImageClick={() => imageInputRef.current?.click()}
                onBannerClick={() => bannerInputRef.current?.click()}
                onImageRemove={() => setImageUrl("")}
                onBannerRemove={() => setBannerUrl("")}
              />

              {/* Inputs cachés pour upload */}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleFile(e, setImageUrl)}
              />
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleFile(e, setBannerUrl)}
              />

              {/* Boutons "Changer" alternatifs pour accessibilité */}
              <Box sx={{ mt: 2, maxWidth: 320, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<CollectionsIcon fontSize="small" />}
                  onClick={() => imageInputRef.current?.click()}
                  sx={{ textTransform: "none", fontWeight: 600, fontSize: 12 }}
                >
                  Image
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<WallpaperIcon fontSize="small" />}
                  onClick={() => bannerInputRef.current?.click()}
                  sx={{ textTransform: "none", fontWeight: 600, fontSize: 12 }}
                >
                  Bannière
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </SimpleForm>
  );
};