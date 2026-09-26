import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  Stack,
  Chip,
  Button,
  Divider,
  Tooltip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIconModule from "@mui/icons-material/Close";
import EditOutlinedIconModule from "@mui/icons-material/EditOutlined";
import StarIconModule from "@mui/icons-material/Star";
import WarningAmberIconModule from "@mui/icons-material/WarningAmber";
import Inventory2IconModule from "@mui/icons-material/Inventory2";
import LocalOfferIconModule from "@mui/icons-material/LocalOffer";
import PaletteIconModule from "@mui/icons-material/Palette";
import StraightenIconModule from "@mui/icons-material/Straighten";
import CalendarTodayIconModule from "@mui/icons-material/CalendarToday";
import { normalizeMuiIcon } from "../../muiIcon";

const CloseIcon = normalizeMuiIcon(CloseIconModule);
const EditIcon = normalizeMuiIcon(EditOutlinedIconModule);
const StarIcon = normalizeMuiIcon(StarIconModule);
const WarningIcon = normalizeMuiIcon(WarningAmberIconModule);
const InventoryIcon = normalizeMuiIcon(Inventory2IconModule);
const TagIcon = normalizeMuiIcon(LocalOfferIconModule);
const PaletteIcon = normalizeMuiIcon(PaletteIconModule);
const SizeIcon = normalizeMuiIcon(StraightenIconModule);
const CalendarIcon = normalizeMuiIcon(CalendarTodayIconModule);

interface Props {
  open: boolean;
  onClose: () => void;
  record: any | null;
  onEdit: () => void;
}

const formatPrice = (n: number) =>
  n > 0 ? new Intl.NumberFormat("fr-MG").format(n) + " Ar" : "—";

const formatDate = (date: string) =>
  date
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(date))
    : "—";

export const ProductDetailDialog = ({ open, onClose, record, onEdit }: Props) => {
  if (!record) return null;

  const images: string[] =
    Array.isArray(record.images) && record.images.length > 0
      ? record.images.map((img: any) => (typeof img === "string" ? img : img.url))
      : [];

  const stock = record.stock ?? 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock <= (record.lowStockThreshold ?? 5) && stock > 0;
  const rating = record.ratingCache ?? 0;
  const reviewCount = record.reviewCountCache ?? 0;
  const hasDiscount =
    record.originalPrice && record.originalPrice > (record.price ?? 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2.5, overflow: "hidden" } }}
    >
      <DialogTitle
        sx={{
          pr: 6,
          pb: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, fontSize: 18 }}
            noWrap
            title={record.title}
          >
            {record.title}
          </Typography>
          {record.isNew && (
            <Chip
              label="NOUVEAU"
              size="small"
              sx={{
                height: 20,
                fontSize: 9.5,
                fontWeight: 800,
                backgroundColor: "primary.main",
                color: "primary.contrastText",
              }}
            />
          )}
        </Stack>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
          aria-label="Fermer"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 0,
          }}
        >
          {/* ═══ GAUCHE : Images ═══ */}
          <Box
            sx={{
              p: 3,
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.03),
            }}
          >
            {/* Image principale */}
            <Box
              sx={{
                aspectRatio: "1 / 1",
                borderRadius: 2,
                overflow: "hidden",
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                mb: 2,
              }}
            >
              {images[0] ? (
                <Box
                  component="img"
                  src={images[0]}
                  alt={record.title}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                  }}
                >
                  <InventoryIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                </Box>
              )}
            </Box>

            {/* Miniatures */}
            {images.length > 1 && (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {images.slice(0, 5).map((url, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 1.5,
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      component="img"
                      src={url}
                      alt={`${record.title} ${i + 1}`}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                ))}
              </Stack>
            )}
          </Box>

          {/* ═══ DROITE : Infos ═══ */}
          <Box sx={{ p: 3, display: "flex", flexDirection: "column" }}>
            {/* Prix + SKU */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              sx={{ mb: 2 }}
            >
              <Box>
                <Stack direction="row" spacing={1} alignItems="baseline">
                  <Typography
                    sx={{
                      fontSize: 26,
                      fontWeight: 800,
                      color: "primary.main",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {formatPrice(record.price ?? 0)}
                  </Typography>
                  {hasDiscount && (
                    <Typography
                      sx={{
                        fontSize: 14,
                        color: "text.secondary",
                        textDecoration: "line-through",
                      }}
                    >
                      {formatPrice(record.originalPrice)}
                    </Typography>
                  )}
                </Stack>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontFamily: "monospace", fontSize: 11 }}
                >
                  {record.sku}
                </Typography>
              </Box>

              {/* Stock badge */}
              {isOutOfStock ? (
                <Chip
                  icon={<WarningIcon sx={{ fontSize: 13 }} />}
                  label="Rupture"
                  size="small"
                  sx={{
                    backgroundColor: "error.light",
                    color: "error.dark",
                    fontWeight: 700,
                    "& .MuiChip-icon": { color: "inherit" },
                  }}
                />
              ) : isLowStock ? (
                <Chip
                  icon={<WarningIcon sx={{ fontSize: 13 }} />}
                  label={`${stock} restant${stock > 1 ? "s" : ""}`}
                  size="small"
                  sx={{
                    backgroundColor: "warning.light",
                    color: "warning.dark",
                    fontWeight: 700,
                    "& .MuiChip-icon": { color: "inherit" },
                  }}
                />
              ) : (
                <Chip
                  icon={<InventoryIcon sx={{ fontSize: 13 }} />}
                  label={`Stock : ${stock}`}
                  size="small"
                  sx={{
                    backgroundColor: "success.light",
                    color: "success.dark",
                    fontWeight: 700,
                    "& .MuiChip-icon": { color: "inherit" },
                  }}
                />
              )}
            </Stack>

            {/* Note */}
            {reviewCount > 0 && (
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <StarIcon sx={{ fontSize: 16, color: "#FDB022" }} />
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                  {rating.toFixed(1)}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                  ({reviewCount} avis)
                </Typography>
              </Stack>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Description */}
            {record.description && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="overline"
                  sx={{
                    fontWeight: 700,
                    color: "text.secondary",
                    fontSize: 10.5,
                    letterSpacing: 1,
                  }}
                >
                  Description courte
                </Typography>
                <Typography sx={{ fontSize: 13, lineHeight: 1.6, mt: 0.5 }}>
                  {record.description}
                </Typography>
              </Box>
            )}

            {record.longDescription && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="overline"
                  sx={{
                    fontWeight: 700,
                    color: "text.secondary",
                    fontSize: 10.5,
                    letterSpacing: 1,
                  }}
                >
                  Description longue
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12.5,
                    lineHeight: 1.6,
                    mt: 0.5,
                    whiteSpace: "pre-wrap",
                    display: "-webkit-box",
                    WebkitLineClamp: 6,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {record.longDescription}
                </Typography>
              </Box>
            )}

            {/* Tags */}
            {record.tags && record.tags.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.75 }}>
                  <TagIcon sx={{ fontSize: 13, color: "text.secondary" }} />
                  <Typography
                    variant="overline"
                    sx={{
                      fontWeight: 700,
                      color: "text.secondary",
                      fontSize: 10.5,
                      letterSpacing: 1,
                    }}
                  >
                    Tags
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                  {record.tags.map((tag: string, i: number) => (
                    <Chip
                      key={i}
                      label={tag}
                      size="small"
                      sx={{ height: 22, fontSize: 11, fontWeight: 600 }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Couleurs + Tailles */}
            {(record.colors?.length > 0 || record.sizes?.length > 0) && (
              <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                {record.colors?.length > 0 && (
                  <Box>
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.75 }}>
                      <PaletteIcon sx={{ fontSize: 13, color: "text.secondary" }} />
                      <Typography
                        variant="overline"
                        sx={{
                          fontWeight: 700,
                          color: "text.secondary",
                          fontSize: 10.5,
                          letterSpacing: 1,
                        }}
                      >
                        Couleurs
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {record.colors.map((c: any, i: number) => (
                        <Tooltip key={i} title={c.label} arrow>
                          <Box
                            sx={{
                              width: 22,
                              height: 22,
                              borderRadius: "50%",
                              backgroundColor: c.hex,
                              border: "2px solid",
                              borderColor: "background.paper",
                              boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
                            }}
                          />
                        </Tooltip>
                      ))}
                    </Stack>
                  </Box>
                )}

                {record.sizes?.length > 0 && (
                  <Box>
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.75 }}>
                      <SizeIcon sx={{ fontSize: 13, color: "text.secondary" }} />
                      <Typography
                        variant="overline"
                        sx={{
                          fontWeight: 700,
                          color: "text.secondary",
                          fontSize: 10.5,
                          letterSpacing: 1,
                        }}
                      >
                        Tailles
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {record.sizes.map((s: any, i: number) => (
                        <Chip
                          key={i}
                          label={typeof s === "string" ? s : s.value}
                          size="small"
                          variant="outlined"
                          sx={{ height: 22, fontSize: 11, fontWeight: 600 }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            )}

            {/* Date de création */}
            {record.createdAt && (
              <Stack
                direction="row"
                spacing={0.75}
                alignItems="center"
                sx={{ mt: "auto", pt: 2, borderTop: "1px solid", borderColor: "divider" }}
              >
                <CalendarIcon sx={{ fontSize: 13, color: "text.secondary" }} />
                <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>
                  Créé le {formatDate(record.createdAt)}
                </Typography>
              </Stack>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <Button
          onClick={onClose}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Fermer
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon fontSize="small" />}
          onClick={onEdit}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 1.5,
            boxShadow: "none",
          }}
        >
          Modifier
        </Button>
      </DialogActions>
    </Dialog>
  );
};