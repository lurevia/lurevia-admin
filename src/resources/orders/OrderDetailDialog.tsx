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
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIconModule from "@mui/icons-material/Close";
import EditOutlinedIconModule from "@mui/icons-material/EditOutlined";
import ReceiptLongIconModule from "@mui/icons-material/ReceiptLong";
import PhoneIconModule from "@mui/icons-material/Phone";
import MailOutlineIconModule from "@mui/icons-material/MailOutline";
import PlaceIconModule from "@mui/icons-material/Place";
import PaymentIconModule from "@mui/icons-material/Payment";
import ScheduleIconModule from "@mui/icons-material/Schedule";
import LocalShippingIconModule from "@mui/icons-material/LocalShipping";
import ShoppingBagIconModule from "@mui/icons-material/ShoppingBag";
import HourglassEmptyIconModule from "@mui/icons-material/HourglassEmpty";
import CheckCircleIconModule from "@mui/icons-material/CheckCircle";
import CancelIconModule from "@mui/icons-material/Cancel";
import { normalizeMuiIcon } from "../../muiIcon";

const CloseIcon = normalizeMuiIcon(CloseIconModule);
const EditIcon = normalizeMuiIcon(EditOutlinedIconModule);
const ReceiptIcon = normalizeMuiIcon(ReceiptLongIconModule);
const PhoneIcon = normalizeMuiIcon(PhoneIconModule);
const MailIcon = normalizeMuiIcon(MailOutlineIconModule);
const PlaceIcon = normalizeMuiIcon(PlaceIconModule);
const PaymentIcon = normalizeMuiIcon(PaymentIconModule);
const ScheduleIcon = normalizeMuiIcon(ScheduleIconModule);
const ShippingIcon = normalizeMuiIcon(LocalShippingIconModule);
const BagIcon = normalizeMuiIcon(ShoppingBagIconModule);
const PendingIcon = normalizeMuiIcon(HourglassEmptyIconModule);
const PaidIcon = normalizeMuiIcon(CheckCircleIconModule);
const CancelledIcon = normalizeMuiIcon(CancelIconModule);

interface Props {
  open: boolean;
  onClose: () => void;
  record: any | null;
  onEdit: () => void;
}

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    color: "success" | "warning" | "error" | "info" | "default";
    icon: any;
  }
> = {
  PENDING: { label: "En attente", color: "warning", icon: PendingIcon },
  PAID: { label: "Payée", color: "info", icon: PaidIcon },
  SHIPPED: { label: "Expédiée", color: "info", icon: ShippingIcon },
  DELIVERED: { label: "Livrée", color: "success", icon: PaidIcon },
  CANCELLED: { label: "Annulée", color: "error", icon: CancelledIcon },
  COD_PENDING: { label: "COD en attente", color: "warning", icon: PendingIcon },
  COD_FAILED: { label: "COD échoué", color: "error", icon: CancelledIcon },
  REFUNDED: { label: "Remboursée", color: "error", icon: CancelledIcon },
  PAYMENT_FAILED: { label: "Paiement échoué", color: "error", icon: CancelledIcon },
  pending: { label: "En attente", color: "warning", icon: PendingIcon },
  paid: { label: "Payée", color: "info", icon: PaidIcon },
  shipped: { label: "Expédiée", color: "info", icon: ShippingIcon },
  delivered: { label: "Livrée", color: "success", icon: PaidIcon },
  cancelled: { label: "Annulée", color: "error", icon: CancelledIcon },
};

const getStatusConfig = (status: string) =>
  STATUS_CONFIG[status] ?? {
    label: status,
    color: "default" as const,
    icon: PendingIcon,
  };

const PAYMENT_LABELS: Record<string, string> = {
  MOBILE_MONEY: "Mobile Money",
  COD: "Paiement à la livraison",
  CARD: "Carte bancaire",
  BANK_TRANSFERT: "Virement bancaire",
  mobile_money: "Mobile Money",
  cod: "Paiement à la livraison",
  card: "Carte bancaire",
  bank_transfert: "Virement bancaire",
};

const formatMoney = (value: number | undefined | null) => {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("fr-MG").format(n) + " Ar";
};

const formatDateTime = (date: string | null | undefined) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const OrderDetailDialog = ({ open, onClose, record, onEdit }: Props) => {
  if (!record) return null;

  const statusConfig = getStatusConfig(record.status);
  const StatusIconCmp = statusConfig.icon;
  const shipping = record.shipping ?? {};
  const items = Array.isArray(record.items) ? record.items : [];
  const initial = (shipping.fullName ?? "?").charAt(0).toUpperCase();
  const orderNumber =
    record.orderNumber ?? `#${String(record.id).slice(0, 8).toUpperCase()}`;

  const themeColorKey =
    statusConfig.color === "success"
      ? "success"
      : statusConfig.color === "error"
        ? "error"
        : statusConfig.color === "info"
          ? "info"
          : "warning";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2.5, overflow: "hidden" } }}
    >
      <DialogTitle sx={{ pr: 6, pb: 1.5, position: "relative" }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: (theme) =>
                alpha(theme.palette[themeColorKey].main, 0.12),
              color: `${themeColorKey}.main`,
            }}
          >
            <ReceiptIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontWeight: 800, fontSize: 16 }}>
                Commande {orderNumber}
              </Typography>
              <Chip
                icon={<StatusIconCmp sx={{ fontSize: 12 }} />}
                label={statusConfig.label}
                color={statusConfig.color}
                size="small"
                sx={{
                  height: 22,
                  fontSize: 10.5,
                  fontWeight: 700,
                  "& .MuiChip-icon": { color: "inherit" },
                }}
              />
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {formatDateTime(record.createdAt)}
            </Typography>
          </Box>
        </Stack>

        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
          aria-label="Fermer"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {/* Client */}
        <Typography
          variant="overline"
          sx={{
            fontWeight: 700,
            color: "text.secondary",
            letterSpacing: 1,
            fontSize: 10.5,
            mb: 1.5,
            display: "block",
          }}
        >
          Client
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              fontSize: 22,
              fontWeight: 800,
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            {initial}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.25 }}>
              {shipping.fullName ?? "Client inconnu"}
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              {shipping.email && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <MailIcon sx={{ fontSize: 12, color: "text.secondary" }} />
                  <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>
                    {shipping.email}
                  </Typography>
                </Stack>
              )}
              {shipping.phone && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <PhoneIcon sx={{ fontSize: 12, color: "text.secondary" }} />
                  <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>
                    {shipping.phone}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Livraison */}
        <Typography
          variant="overline"
          sx={{
            fontWeight: 700,
            color: "text.secondary",
            letterSpacing: 1,
            fontSize: 10.5,
            mb: 1.5,
            display: "block",
          }}
        >
          Adresse de livraison
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 1.5,
            backgroundColor: (theme) =>
              alpha(theme.palette.primary.main, 0.04),
            border: "1px solid",
            borderColor: (theme) => alpha(theme.palette.primary.main, 0.12),
            display: "flex",
            gap: 1.5,
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <PlaceIcon
            sx={{
              fontSize: 18,
              color: "primary.main",
              flexShrink: 0,
              mt: 0.15,
            }}
          />
          <Box>
            <Typography sx={{ fontSize: 13, lineHeight: 1.6 }}>
              {shipping.address ?? "—"}
            </Typography>
            <Typography
              sx={{ fontSize: 12.5, color: "text.secondary", mt: 0.5 }}
            >
              {shipping.city ?? "—"}, {shipping.region ?? "—"}
            </Typography>
            {shipping.notes && (
              <Typography
                sx={{
                  fontSize: 11.5,
                  color: "text.secondary",
                  mt: 1,
                  fontStyle: "italic",
                }}
              >
                Note : {shipping.notes}
              </Typography>
            )}
          </Box>
        </Paper>

        <Divider sx={{ mb: 3 }} />

        {/* Articles */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: 1.5 }}
        >
          <BagIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography
            variant="overline"
            sx={{
              fontWeight: 700,
              color: "text.secondary",
              letterSpacing: 1,
              fontSize: 10.5,
            }}
          >
            Articles ({items.length})
          </Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1.5,
            overflow: "hidden",
            mb: 3,
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: 11.5,
                    backgroundColor: "action.hover",
                  }}
                >
                  Produit
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    fontSize: 11.5,
                    backgroundColor: "action.hover",
                  }}
                >
                  Prix
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    fontSize: 11.5,
                    backgroundColor: "action.hover",
                  }}
                >
                  Qté
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    fontSize: 11.5,
                    backgroundColor: "action.hover",
                  }}
                >
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item: any, index: number) => {
                const price = Number(item.price ?? item.priceSnapshot ?? 0);
                const qty = Number(item.quantity ?? 1);
                const lineTotal = price * qty;
                return (
                  <TableRow
                    key={index}
                    sx={{
                      "&:last-child td": { borderBottom: 0 },
                      "&:hover": { backgroundColor: "action.hover" },
                    }}
                  >
                    <TableCell sx={{ fontSize: 12.5 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {item.imageSnapshot || item.image ? (
                          <Box
                            component="img"
                            src={item.imageSnapshot ?? item.image}
                            alt={item.title ?? item.titleSnapshot}
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: 0.75,
                              objectFit: "cover",
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: 0.75,
                              backgroundColor: "action.hover",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <BagIcon
                              sx={{ fontSize: 14, color: "text.secondary" }}
                            />
                          </Box>
                        )}
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{ fontSize: 12.5, fontWeight: 600 }}
                            noWrap
                          >
                            {item.title ?? item.titleSnapshot ?? "Produit"}
                          </Typography>
                          {(item.colorSnapshot || item.sizeSnapshot) && (
                            <Typography
                              sx={{ fontSize: 10.5, color: "text.secondary" }}
                            >
                              {item.colorSnapshot}
                              {item.colorSnapshot && item.sizeSnapshot
                                ? " · "
                                : ""}
                              {item.sizeSnapshot}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: 12.5 }}>
                      {formatMoney(price)}
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: 12.5 }}>
                      ×{qty}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: "primary.main",
                      }}
                    >
                      {formatMoney(lineTotal)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>

        <Divider sx={{ mb: 3 }} />

        {/* Totaux + paiement */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          sx={{ mb: 1 }}
        >
          <Box sx={{ flex: 1 }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 1.5 }}
            >
              <PaymentIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 700,
                  color: "text.secondary",
                  letterSpacing: 1,
                  fontSize: 10.5,
                }}
              >
                Paiement
              </Typography>
            </Stack>
            <Chip
              label={
                PAYMENT_LABELS[record.paymentMethod] ??
                record.paymentMethod ??
                "—"
              }
              size="small"
              sx={{
                height: 24,
                fontSize: 11.5,
                fontWeight: 700,
              }}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 240 }}>
            <Stack spacing={0.75}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 12.5, color: "text.secondary" }}>
                  Sous-total
                </Typography>
                <Typography sx={{ fontSize: 12.5, fontWeight: 600 }}>
                  {formatMoney(record.subtotal)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 12.5, color: "text.secondary" }}>
                  Livraison
                </Typography>
                <Typography sx={{ fontSize: 12.5, fontWeight: 600 }}>
                  {formatMoney(record.shippingCost)}
                </Typography>
              </Stack>
              <Divider />
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  sx={{ fontSize: 13, fontWeight: 700, color: "text.primary" }}
                >
                  Total
                </Typography>
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "primary.main",
                    letterSpacing: "-0.3px",
                  }}
                >
                  {formatMoney(record.total)}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mt: 3, color: "text.secondary" }}
        >
          <ScheduleIcon sx={{ fontSize: 14 }} />
          <Typography sx={{ fontSize: 11 }}>
            Commandée le {formatDateTime(record.createdAt)}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button
          onClick={onClose}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Fermer
        </Button>
        <Button
          variant="contained"
          onClick={onEdit}
          startIcon={<EditIcon fontSize="small" />}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 1.5,
            boxShadow: "none",
          }}
        >
          Gérer la commande
        </Button>
      </DialogActions>
    </Dialog>
  );
};