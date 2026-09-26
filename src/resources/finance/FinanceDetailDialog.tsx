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
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIconModule from "@mui/icons-material/Close";
import MailOutlineIconModule from "@mui/icons-material/MailOutline";
import CalendarTodayIconModule from "@mui/icons-material/CalendarToday";
import PaidIconModule from "@mui/icons-material/Paid";
import TrendingUpIconModule from "@mui/icons-material/TrendingUp";
import TagIconModule from "@mui/icons-material/Tag";
import ReceiptLongIconModule from "@mui/icons-material/ReceiptLong";
import StorefrontIconModule from "@mui/icons-material/Storefront";
import DescriptionIconModule from "@mui/icons-material/Description";
import AccountBalanceIconModule from "@mui/icons-material/AccountBalance";
import SwapHorizIconModule from "@mui/icons-material/SwapHoriz";
import HourglassEmptyIconModule from "@mui/icons-material/HourglassEmpty";
import CheckCircleIconModule from "@mui/icons-material/CheckCircle";
import CancelIconModule from "@mui/icons-material/Cancel";
import { normalizeMuiIcon } from "../../muiIcon";

const CloseIcon = normalizeMuiIcon(CloseIconModule);
const MailIcon = normalizeMuiIcon(MailOutlineIconModule);
const DateIcon = normalizeMuiIcon(CalendarTodayIconModule);
const MoneyIcon = normalizeMuiIcon(PaidIconModule);
const RateIcon = normalizeMuiIcon(TrendingUpIconModule);
const RefIcon = normalizeMuiIcon(TagIconModule);
const SettlementIcon = normalizeMuiIcon(ReceiptLongIconModule);
const SellerIcon = normalizeMuiIcon(StorefrontIconModule);
const ContractIcon = normalizeMuiIcon(DescriptionIconModule);
const CommissionIcon = normalizeMuiIcon(AccountBalanceIconModule);
const TransferIcon = normalizeMuiIcon(SwapHorizIconModule);
const PendingIcon = normalizeMuiIcon(HourglassEmptyIconModule);
const ApprovedIcon = normalizeMuiIcon(CheckCircleIconModule);
const RejectedIcon = normalizeMuiIcon(CancelIconModule);

type ResourceKey = "sellers" | "contracts" | "settlements" | "commissions" | "transfers";

const RESOURCE_META: Record<
  ResourceKey,
  { label: string; icon: any; accent: "primary" | "info" | "success" | "warning" | "error" }
> = {
  sellers: { label: "Vendeur", icon: SellerIcon, accent: "primary" },
  contracts: { label: "Contrat", icon: ContractIcon, accent: "info" },
  settlements: { label: "Settlement", icon: SettlementIcon, accent: "success" },
  commissions: { label: "Commission", icon: CommissionIcon, accent: "warning" },
  transfers: { label: "Transfert", icon: TransferIcon, accent: "error" },
};

const STATUS_LABELS: Record<string, string> = {
  active: "Actif",
  pending: "En attente",
  suspended: "Suspendu",
  PENDING: "En attente",
  APPROVED: "Approuvé",
  REJECTED: "Rejeté",
  PENDING_REVIEW: "En revue",
  READY: "Prêt",
  TRANSFER_PENDING: "Transfert en cours",
  PAID: "Payé",
  FAILED: "Échoué",
  CANCELLED: "Annulé",
  PROCESSING: "En cours",
  COMPLETED: "Complété",
};

const getStatusConfig = (status: string | null | undefined) => {
  if (!status) return null;
  const normalized = status.toLowerCase();
  const isSuccess = ["active", "approved", "paid", "completed", "ready"].includes(
    normalized
  );
  const isError = ["rejected", "failed", "cancelled", "suspended"].includes(
    normalized
  );
  const color = isSuccess ? "success" : isError ? "error" : "warning";
  const Icon = isSuccess ? ApprovedIcon : isError ? RejectedIcon : PendingIcon;
  return {
    label: STATUS_LABELS[status] ?? status,
    color: color as "success" | "error" | "warning",
    icon: Icon,
  };
};

const formatDate = (date: string | null | undefined) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

const formatDateTime = (date: string | null | undefined) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const formatMoney = (value: number | undefined | null) => {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("fr-MG").format(n) + " Ar";
};

interface Props {
  open: boolean;
  onClose: () => void;
  resource: ResourceKey;
  record: any | null;
}

const DetailRow = ({
  icon: Icon,
  label,
  value,
  bold,
  accent,
}: {
  icon: any;
  label: string;
  value: string;
  bold?: boolean;
  accent?: string;
}) => (
  <Stack direction="row" spacing={1.5} alignItems="center">
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: (theme) =>
          alpha(theme.palette.primary.main, 0.08),
        color: "primary.main",
        flexShrink: 0,
      }}
    >
      <Icon sx={{ fontSize: 16 }} />
    </Box>
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
      <Typography
        sx={{
          fontSize: bold ? 15 : 13,
          fontWeight: bold ? 800 : 600,
          color: accent ?? "text.primary",
          wordBreak: "break-word",
        }}
      >
        {value}
      </Typography>
    </Box>
  </Stack>
);

export const FinanceDetailDialog = ({ open, onClose, resource, record }: Props) => {
  if (!record) return null;

  const meta = RESOURCE_META[resource];
  const Icon = meta.icon;
  const statusConfig = getStatusConfig(record.status);
  const StatusIconCmp = statusConfig?.icon;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2.5, overflow: "hidden" } }}
    >
      <DialogTitle sx={{ pr: 6, pb: 1.5, position: "relative" }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: (theme) =>
                alpha(theme.palette[meta.accent].main, 0.12),
              color: `${meta.accent}.main`,
            }}
          >
            <Icon sx={{ fontSize: 18 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 16 }}>
              Détail du {meta.label.toLowerCase()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Créé le {formatDateTime(record.createdAt)}
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
        {/* Statut */}
        {statusConfig && StatusIconCmp && (
          <>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 700,
                  color: "text.secondary",
                  letterSpacing: 1,
                  fontSize: 10.5,
                }}
              >
                Statut
              </Typography>
              <Chip
                icon={<StatusIconCmp sx={{ fontSize: 14 }} />}
                label={statusConfig.label}
                color={statusConfig.color}
                size="small"
                sx={{
                  height: 24,
                  fontSize: 11,
                  fontWeight: 700,
                  "& .MuiChip-icon": { color: "inherit" },
                }}
              />
            </Stack>
            <Divider sx={{ mb: 3 }} />
          </>
        )}

        {/* Header avec avatar + nom */}
        {record.sellerName && (
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
              {record.sellerName.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.25 }}>
                {record.sellerName}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontFamily: "monospace", fontSize: 10.5 }}
              >
                ID : {String(record.sellerId ?? record.id).slice(0, 12)}…
              </Typography>
            </Box>
          </Stack>
        )}

        {/* Champs spécifiques */}
        <Stack spacing={2}>
          {resource === "sellers" && (
            <>
              <DetailRow icon={MailIcon} label="Email" value={record.email ?? "—"} />
              <DetailRow
                icon={RateIcon}
                label="Commission"
                value={
                  record.commissionRate != null
                    ? `${record.commissionRate} %`
                    : "—"
                }
              />
              <DetailRow
                icon={DateIcon}
                label="Inscrit le"
                value={formatDate(record.createdAt)}
              />
            </>
          )}

          {resource === "contracts" && (
            <>
              <DetailRow
                icon={RateIcon}
                label="Commission"
                value={
                  record.value != null
                    ? `${record.value}${record.type === "PERCENTAGE" ? " %" : " Ar"}`
                    : "—"
                }
              />
              <DetailRow
                icon={DateIcon}
                label="Début"
                value={formatDate(record.effectiveFrom ?? record.startsAt)}
              />
              <DetailRow
                icon={DateIcon}
                label="Fin"
                value={formatDate(record.effectiveTo ?? record.endsAt)}
              />
              {record.rejectionReason && (
                <DetailRow
                  icon={RejectedIcon}
                  label="Motif du rejet"
                  value={record.rejectionReason}
                  accent="error.main"
                />
              )}
            </>
          )}

          {resource === "settlements" && (
            <>
              <DetailRow
                icon={MoneyIcon}
                label="Montant brut"
                value={formatMoney(record.grossAmount)}
              />
              <DetailRow
                icon={MoneyIcon}
                label="Commission prélevée"
                value={formatMoney(record.commissionAmount)}
                accent="warning.main"
              />
              <DetailRow
                icon={MoneyIcon}
                label="Net à payer"
                value={formatMoney(record.netAmount)}
                accent="success.main"
                bold
              />
              {record.reviewNote && (
                <DetailRow
                  icon={ContractIcon}
                  label="Note de revue"
                  value={record.reviewNote}
                />
              )}
            </>
          )}

          {resource === "commissions" && (
            <>
              <DetailRow
                icon={RateIcon}
                label="Taux appliqué"
                value={record.rate != null ? `${record.rate} %` : "—"}
              />
              <DetailRow
                icon={MoneyIcon}
                label="Montant"
                value={formatMoney(record.amount)}
                accent="success.main"
                bold
              />
              {record.orderId && (
                <DetailRow
                  icon={RefIcon}
                  label="Commande"
                  value={`#${String(record.orderId).slice(0, 8)}`}
                />
              )}
            </>
          )}

          {resource === "transfers" && (
            <>
              <DetailRow
                icon={MoneyIcon}
                label="Montant transféré"
                value={formatMoney(record.amount)}
                bold
              />
              <DetailRow
                icon={RefIcon}
                label="Référence"
                value={record.reference ?? record.externalReference ?? "—"}
              />
              {record.failureReason && (
                <DetailRow
                  icon={RejectedIcon}
                  label="Motif d'échec"
                  value={record.failureReason}
                  accent="error.main"
                />
              )}
              <DetailRow
                icon={DateIcon}
                label="Date"
                value={formatDate(record.createdAt)}
              />
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 1.5,
            boxShadow: "none",
          }}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};