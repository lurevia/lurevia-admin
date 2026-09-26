import {
  Edit,
  SimpleForm,
  SelectInput,
  useRecordContext,
} from "react-admin";
import {
  Alert,
  Avatar,
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import MailOutlineIconModule from "@mui/icons-material/MailOutline";
import PhoneIconModule from "@mui/icons-material/Phone";
import PlaceIconModule from "@mui/icons-material/Place";
import PaymentIconModule from "@mui/icons-material/Payment";
import ScheduleIconModule from "@mui/icons-material/Schedule";
import ShoppingBagIconModule from "@mui/icons-material/ShoppingBag";
import HourglassEmptyIconModule from "@mui/icons-material/HourglassEmpty";
import CheckCircleIconModule from "@mui/icons-material/CheckCircle";
import LocalShippingIconModule from "@mui/icons-material/LocalShipping";
import CancelIconModule from "@mui/icons-material/Cancel";
import InfoOutlinedIconModule from "@mui/icons-material/InfoOutlined";
import { normalizeMuiIcon } from "../../muiIcon";

// ─── Icônes normalisées ───
const MailIcon = normalizeMuiIcon(MailOutlineIconModule);
const PhoneIcon = normalizeMuiIcon(PhoneIconModule);
const PlaceIcon = normalizeMuiIcon(PlaceIconModule);
const PaymentIcon = normalizeMuiIcon(PaymentIconModule);
const ScheduleIcon = normalizeMuiIcon(ScheduleIconModule);
const BagIcon = normalizeMuiIcon(ShoppingBagIconModule);
const PendingIcon = normalizeMuiIcon(HourglassEmptyIconModule);
const PaidIcon = normalizeMuiIcon(CheckCircleIconModule);
const ShippedIcon = normalizeMuiIcon(LocalShippingIconModule);
const CancelledIcon = normalizeMuiIcon(CancelIconModule);
const InfoIcon = normalizeMuiIcon(InfoOutlinedIconModule);

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES (au niveau module — accessibles partout)
// ─────────────────────────────────────────────────────────────────────────────

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

const STATUS_CONFIG: Record<string, { label: string; color: any; icon: any }> = {
  PENDING: { label: "En attente", color: "warning", icon: PendingIcon },
  PAID: { label: "Payée", color: "info", icon: PaidIcon },
  SHIPPED: { label: "Expédiée", color: "info", icon: ShippedIcon },
  DELIVERED: { label: "Livrée", color: "success", icon: PaidIcon },
  CANCELLED: { label: "Annulée", color: "error", icon: CancelledIcon },
  COD_PENDING: { label: "COD en attente", color: "warning", icon: PendingIcon },
  COD_FAILED: { label: "COD échoué", color: "error", icon: CancelledIcon },
  REFUNDED: { label: "Remboursée", color: "error", icon: CancelledIcon },
  PAYMENT_FAILED: { label: "Paiement échoué", color: "error", icon: CancelledIcon },
  pending: { label: "En attente", color: "warning", icon: PendingIcon },
  paid: { label: "Payée", color: "info", icon: PaidIcon },
  shipped: { label: "Expédiée", color: "info", icon: ShippedIcon },
  delivered: { label: "Livrée", color: "success", icon: PaidIcon },
  cancelled: { label: "Annulée", color: "error", icon: CancelledIcon },
};

const STATUS_CHOICES = [
  { id: "PENDING", name: "En attente" },
  { id: "PAID", name: "Payée" },
  { id: "SHIPPED", name: "Expédiée" },
  { id: "DELIVERED", name: "Livrée" },
  { id: "CANCELLED", name: "Annulée" },
  { id: "COD_PENDING", name: "COD en attente" },
  { id: "COD_FAILED", name: "COD échoué" },
  { id: "REFUNDED", name: "Remboursée" },
  { id: "PAYMENT_FAILED", name: "Paiement échoué" },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const getStatusConfig = (status: string) =>
  STATUS_CONFIG[status] ?? {
    label: status,
    color: "default",
    icon: PendingIcon,
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

// ─────────────────────────────────────────────────────────────────────────────
// APERÇU DE LA COMMANDE
// ─────────────────────────────────────────────────────────────────────────────

const OrderPreview = ({ record }: { record: any }) => {
  if (!record) return null;

  const statusConfig = getStatusConfig(record.status);
  const StatusIconCmp = statusConfig.icon;
  const shipping = record.shipping ?? {};
  const items = Array.isArray(record.items) ? record.items : [];
  const initial = (shipping.fullName ?? "?").charAt(0).toUpperCase();
  const orderNumber =
    record.orderNumber ?? `#${String(record.id).slice(0, 8).toUpperCase()}`;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        backgroundColor: "background.paper",
      }}
    >
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
        Aperçu de la commande
      </Typography>

      {/* Numéro + statut */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
        sx={{ mb: 2 }}
      >
        <Typography
          sx={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700 }}
        >
          {orderNumber}
        </Typography>
        <Chip
          icon={<StatusIconCmp sx={{ fontSize: 12 }} />}
          label={statusConfig.label}
          color={statusConfig.color}
          size="small"
          sx={{
            height: 22,
            fontSize: 10,
            fontWeight: 700,
            "& .MuiChip-icon": { color: "inherit" },
          }}
        />
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {/* Client */}
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
        <Avatar
          sx={{
            width: 44,
            height: 44,
            fontSize: 17,
            fontWeight: 800,
            bgcolor: "primary.main",
            color: "primary.contrastText",
          }}
        >
          {initial}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.25 }}
            noWrap
          >
            {shipping.fullName ?? "Client inconnu"}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "text.secondary" }} noWrap>
            {shipping.email ?? "—"}
          </Typography>
        </Box>
      </Stack>

      {/* Détails compacts */}
      <Stack spacing={1}>
        <PreviewRow icon={PhoneIcon} value={shipping.phone ?? "—"} />
        <PreviewRow
          icon={PlaceIcon}
          value={`${shipping.city ?? "—"}, ${shipping.region ?? "—"}`}
        />
        <PreviewRow
          icon={BagIcon}
          value={`${items.length} article${items.length > 1 ? "s" : ""}`}
        />
        <PreviewRow
          icon={ScheduleIcon}
          value={formatDateTime(record.createdAt)}
        />
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Total */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="baseline"
      >
        <Typography
          sx={{
            fontSize: 10.5,
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            fontWeight: 700,
          }}
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
    </Paper>
  );
};

const PreviewRow = ({ icon: Icon, value }: { icon: any; value: string }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <Icon sx={{ fontSize: 14, color: "text.secondary", flexShrink: 0 }} />
    <Typography
      sx={{ fontSize: 11.5, color: "text.secondary" }}
      noWrap
      title={value}
    >
      {value}
    </Typography>
  </Stack>
);

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <Stack direction="row" spacing={1.5} alignItems="center">
    <Icon sx={{ fontSize: 16, color: "primary.main", flexShrink: 0 }} />
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography
        sx={{
          fontSize: 10.5,
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          fontWeight: 700,
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 600 }} noWrap title={value}>
        {value}
      </Typography>
    </Box>
  </Stack>
);

// ─────────────────────────────────────────────────────────────────────────────
// CONTENU DU FORMULAIRE
// ─────────────────────────────────────────────────────────────────────────────

const OrderFormContent = () => {
  const record = useRecordContext();
  if (!record) return null;

  const shipping = record.shipping ?? {};
  const items = Array.isArray(record.items) ? record.items : [];

  // ✅ paymentLabel calculé AVANT le return
  const paymentLabel =
    PAYMENT_LABELS[record.paymentMethod] ?? record.paymentMethod ?? "—";

  const orderNumber =
    record.orderNumber ?? `#${String(record.id).slice(0, 8).toUpperCase()}`;

  return (
    <Box sx={{ width: "100%", pt: 2 }}>
      {/* Intro */}
      <Box sx={{ mb: 3, maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
          Gérer la commande {orderNumber}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Consultez le détail et mettez à jour le statut de traitement.
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
        {/* ═══ COLONNE GAUCHE ═══ */}
        <Box>
          {/* Client */}
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
            Client
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.03),
              border: "1px solid",
              borderColor: (theme) =>
                alpha(theme.palette.primary.main, 0.12),
              mb: 3,
            }}
          >
            <Stack spacing={1.5}>
              <InfoRow
                icon={MailIcon}
                label="Email"
                value={shipping.email ?? "—"}
              />
              <InfoRow
                icon={PhoneIcon}
                label="Téléphone"
                value={shipping.phone ?? "—"}
              />
            </Stack>
          </Paper>

          {/* Livraison */}
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
            Adresse de livraison
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.03),
              border: "1px solid",
              borderColor: (theme) =>
                alpha(theme.palette.primary.main, 0.12),
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
              <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.25 }}>
                {shipping.fullName ?? "—"}
              </Typography>
              <Typography sx={{ fontSize: 12.5, lineHeight: 1.6 }}>
                {shipping.address ?? "—"}
              </Typography>
              <Typography
                sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}
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

          {/* Paiement */}
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
            Paiement
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.03),
              border: "1px solid",
              borderColor: (theme) =>
                alpha(theme.palette.primary.main, 0.12),
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 3,
            }}
          >
            <PaymentIcon
              sx={{ fontSize: 18, color: "primary.main", flexShrink: 0 }}
            />
            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
              {paymentLabel}
            </Typography>
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
              borderRadius: 2,
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
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td": { borderBottom: 0 },
                        "&:hover": { backgroundColor: "action.hover" },
                      }}
                    >
                      <TableCell sx={{ fontSize: 12.5 }}>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                        >
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
                                sx={{
                                  fontSize: 14,
                                  color: "text.secondary",
                                }}
                              />
                            </Box>
                          )}
                          <Typography
                            sx={{ fontSize: 12.5, fontWeight: 600 }}
                            noWrap
                          >
                            {item.title ?? item.titleSnapshot ?? "Produit"}
                          </Typography>
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
                        {formatMoney(price * qty)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>

          {/* Totaux */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.03),
              border: "1px solid",
              borderColor: (theme) =>
                alpha(theme.palette.primary.main, 0.12),
              mb: 3,
            }}
          >
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                  Sous-total
                </Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                  {formatMoney(record.subtotal)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                  Livraison
                </Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                  {formatMoney(record.shippingCost)}
                </Typography>
              </Stack>
              <Divider />
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                  Total
                </Typography>
                <Typography
                  sx={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: "primary.main",
                    letterSpacing: "-0.3px",
                  }}
                >
                  {formatMoney(record.total)}
                </Typography>
              </Stack>
            </Stack>
          </Paper>

          <Divider sx={{ mb: 3 }} />

          {/* ═══ Section Statut ═══ */}
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
            Traitement
          </Typography>

          <Alert
            severity="info"
            icon={<InfoIcon fontSize="small" />}
            sx={{
              mb: 2,
              py: 0.75,
              "& .MuiAlert-message": { fontSize: 12.5, lineHeight: 1.5 },
            }}
          >
            Modifiez le statut pour faire avancer la commande dans son cycle de vie.
            Chaque changement est enregistré.
          </Alert>

          <Box
            sx={{
              maxWidth: 400,
              "& .RaSelectInput-root": { width: "100%" },
              "& .MuiFormControl-root": { width: "100%" },
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                backgroundColor: "background.default",
              },
            }}
          >
            <SelectInput
              source="status"
              label="Statut de la commande"
              choices={STATUS_CHOICES}
              fullWidth
            />
          </Box>
        </Box>

        {/* ═══ COLONNE DROITE : Aperçu ═══ */}
        <Box>
          <Box sx={{ position: "sticky", top: 24 }}>
            <OrderPreview record={record} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const OrderEdit = () => (
  <Edit title="Commande" mutationMode="pessimistic" redirect="list">
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
      <OrderFormContent />
    </SimpleForm>
  </Edit>
);