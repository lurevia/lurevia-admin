import type { ReactNode } from "react";
import { Card, CardActions, CardContent, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import StarIconModule from "@mui/icons-material/Star";
import WarningIconModule from "@mui/icons-material/WarningAmber";
import VisibilityIconModule from "@mui/icons-material/VisibilityOutlined";
import EditIconModule from "@mui/icons-material/EditOutlined";
import DeleteIconModule from "@mui/icons-material/DeleteOutline";
import { normalizeMuiIcon } from "../../muiIcon";
import { formatAriary } from "../../utils/formatters";
import { ProductCardImage } from "./ProductCardImage";
import type { ProductCardProps } from "./productTypes";

const StarIcon = normalizeMuiIcon(StarIconModule);
const WarningIcon = normalizeMuiIcon(WarningIconModule);
const VisibilityIcon = normalizeMuiIcon(VisibilityIconModule);
const EditIcon = normalizeMuiIcon(EditIconModule);
const DeleteIcon = normalizeMuiIcon(DeleteIconModule);

export const ProductCard = ({ record, onView, onEdit, onDelete }: ProductCardProps) => {
  const price = record.price ?? 0;
  const originalPrice = record.originalPrice ?? 0;
  const discountPercent = originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  const stock = record.stock ?? 0;
  const isLowStock = stock > 0 && stock <= (record.lowStockThreshold ?? 5);

  return (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        "&:hover": {
          borderColor: "primary.main",
          "& .product-actions": { opacity: 1 },
        },
      }}
    >
      <ProductCardImage record={record} discountPercent={discountPercent} onView={onView} onEdit={onEdit} />
      <CardContent sx={{ flex: 1, p: 1.25 }}>
        <Typography variant="caption" color="text.secondary" noWrap>{record.sku}</Typography>
        <Typography variant="body2" title={record.title} sx={{ fontWeight: 700, minHeight: 32, mb: 0.75 }}>
          {record.title}
        </Typography>
        <Stack direction="row" spacing={0.75} alignItems="baseline" sx={{ mb: 0.75 }}>
          <Typography sx={{ fontSize: 13.5, fontWeight: 800, color: "primary.main" }}>
            {formatAriary(price)}
          </Typography>
          {discountPercent > 0 && (
            <Typography sx={{ fontSize: 10, color: "text.secondary", textDecoration: "line-through" }}>
              {formatAriary(originalPrice)}
            </Typography>
          )}
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          {(record.reviewCountCache ?? 0) > 0 ? (
            <Stack direction="row" spacing={0.25} alignItems="center">
              <StarIcon sx={{ fontSize: 12, color: "#FDB022" }} />
              <Typography sx={{ fontSize: 10.5, fontWeight: 600 }}>
                {(record.ratingCache ?? 0).toFixed(1)}
              </Typography>
              <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
                ({record.reviewCountCache})
              </Typography>
            </Stack>
          ) : (
            <Typography sx={{ fontSize: 10, color: "text.secondary" }}>Aucun avis</Typography>
          )}
          {isLowStock || stock === 0 ? (
            <Chip
              icon={<WarningIcon sx={{ fontSize: 10 }} />}
              label={stock === 0 ? "Rupture" : stock}
              size="small"
              color={stock === 0 ? "error" : "warning"}
            />
          ) : (
            <Typography sx={{ fontSize: 10, color: "text.secondary" }}>Stock : {stock}</Typography>
          )}
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 1, py: 0.75, borderTop: "1px solid", borderColor: "divider", justifyContent: "space-between" }}>
        <CardAction icon={<VisibilityIcon />} label="Voir le détail" onClick={onView} />
        <Stack direction="row" spacing={0.25}>
          <CardAction icon={<EditIcon />} label="Modifier" onClick={onEdit} />
          <CardAction icon={<DeleteIcon />} label="Supprimer" onClick={onDelete} />
        </Stack>
      </CardActions>
    </Card>
  );
};

const CardAction = ({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) => (
  <Tooltip title={label} arrow>
    <IconButton size="small" aria-label={label} onClick={onClick}>{icon}</IconButton>
  </Tooltip>
);