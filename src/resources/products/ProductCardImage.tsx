import { Box, Chip, IconButton, Tooltip } from "@mui/material";
import InventoryIconModule from "@mui/icons-material/Inventory2";
import VisibilityIconModule from "@mui/icons-material/VisibilityOutlined";
import EditIconModule from "@mui/icons-material/EditOutlined";
import { normalizeMuiIcon } from "../../muiIcon";
import type { ProductRecord } from "./productTypes";

const InventoryIcon = normalizeMuiIcon(InventoryIconModule);
const VisibilityIcon = normalizeMuiIcon(VisibilityIconModule);
const EditIcon = normalizeMuiIcon(EditIconModule);

interface ProductCardImageProps {
  record: ProductRecord;
  discountPercent: number;
  onView: () => void;
  onEdit: () => void;
}

export const ProductCardImage = ({
  record,
  discountPercent,
  onView,
  onEdit,
}: ProductCardImageProps) => {
  const firstImage = record.images?.[0];
  const imageUrl = typeof firstImage === "string" ? firstImage : firstImage?.url;

  return (
    <Box
      sx={{ position: "relative", aspectRatio: "4 / 3", overflow: "hidden" }}
      onClick={onView}
    >
      {imageUrl ? (
        <Box
          component="img"
          src={imageUrl}
          alt={record.title}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <Box sx={{ height: "100%", display: "grid", placeItems: "center" }}>
          <InventoryIcon sx={{ fontSize: 32, opacity: 0.3 }} />
        </Box>
      )}

      <Box sx={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 0.5 }}>
        {record.isNew && <Chip label="NOUVEAU" size="small" color="primary" />}
        {discountPercent > 0 && (
          <Chip label={`-${discountPercent}%`} size="small" color="error" />
        )}
      </Box>
      {record.stock === 0 && (
        <Chip label="RUPTURE" size="small" color="error" sx={{ position: "absolute", top: 8, right: 8 }} />
      )}

      <Box
        className="product-actions"
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          opacity: 0,
          transition: "opacity 0.2s ease",
        }}
      >
        <Tooltip title="Voir le détail" arrow>
          <IconButton
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              onView();
            }}
            sx={{ backgroundColor: "rgba(255,255,255,0.9)" }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Modifier" arrow>
          <IconButton
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              onEdit();
            }}
            sx={{ backgroundColor: "rgba(255,255,255,0.9)" }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};