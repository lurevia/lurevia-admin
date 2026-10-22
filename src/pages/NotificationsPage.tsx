import { useEffect, useState, useMemo } from "react";
import { Title } from "react-admin";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import NotificationsIconModule from "@mui/icons-material/Notifications";
import CheckCircleIconModule from "@mui/icons-material/CheckCircle";
import DoneAllIconModule from "@mui/icons-material/DoneAll";
import RefreshIconModule from "@mui/icons-material/Refresh";
import SearchIconModule from "@mui/icons-material/Search";
import ArrowForwardIconModule from "@mui/icons-material/ArrowForward";
import ReceiptIconModule from "@mui/icons-material/ReceiptLong";
import StarIconModule from "@mui/icons-material/Star";
import WarningAmberIconModule from "@mui/icons-material/WarningAmber";
import PersonRemoveIconModule from "@mui/icons-material/PersonRemove";
import FeedbackIconModule from "@mui/icons-material/Feedback";
import MarkEmailReadIconModule from "@mui/icons-material/MarkEmailRead";

import { normalizeMuiIcon } from "../muiIcon";
import {
  fetchAdminNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  navigateToNotification,
  type AdminNotificationRecord,
} from "../adminActions";

const NotificationsIcon = normalizeMuiIcon(NotificationsIconModule);
const CheckCircleIcon = normalizeMuiIcon(CheckCircleIconModule);
const DoneAllIcon = normalizeMuiIcon(DoneAllIconModule);
const RefreshIcon = normalizeMuiIcon(RefreshIconModule);
const SearchIcon = normalizeMuiIcon(SearchIconModule);
const ArrowForwardIcon = normalizeMuiIcon(ArrowForwardIconModule);
const ReceiptIcon = normalizeMuiIcon(ReceiptIconModule);
const StarIcon = normalizeMuiIcon(StarIconModule);
const WarningIcon = normalizeMuiIcon(WarningAmberIconModule);
const PersonRemoveIcon = normalizeMuiIcon(PersonRemoveIconModule);
const FeedbackIcon = normalizeMuiIcon(FeedbackIconModule);
const MarkEmailReadIcon = normalizeMuiIcon(MarkEmailReadIconModule);

const TYPE_CONFIG: Record<
  AdminNotificationRecord["type"],
  { label: string; color: "primary" | "warning" | "error" | "info" | "success"; icon: any }
> = {
  NEW_ORDER: { label: "Commande", color: "primary", icon: ReceiptIcon },
  NEW_REVIEW: { label: "Avis client", color: "warning", icon: StarIcon },
  NEW_FEEDBACK: { label: "Feedback", color: "info", icon: FeedbackIcon },
  DELETION_REQUEST: { label: "Suppression", color: "error", icon: PersonRemoveIcon },
  LOW_STOCK: { label: "Alerte Stock", color: "error", icon: WarningIcon },
};

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AdminNotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const items = await fetchAdminNotifications(false, 100);
      setNotifications(items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const handleMarkAll = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleRead = async (notification: AdminNotificationRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.read) {
      await markNotificationRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      );
    }
  };

  const handleClickItem = (notification: AdminNotificationRecord) => {
    navigateToNotification(navigate, notification);
  };

  // Filtrage combiné
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // 1. Filtre lu / non lu
      if (activeTab === "unread" && item.read) return false;
      if (activeTab === "read" && !item.read) return false;

      // 2. Filtre de catégorie
      if (categoryFilter !== "ALL" && item.type !== categoryFilter) return false;

      // 3. Recherche texte
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = item.title.toLowerCase().includes(q);
        const inMsg = item.message.toLowerCase().includes(q);
        const inId = (item.entityId || "").toLowerCase().includes(q);
        if (!inTitle && !inMsg && !inId) return false;
      }

      return true;
    });
  }, [notifications, activeTab, categoryFilter, searchQuery]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>
      <Title title="Centre de Notifications" />

      {/* ════════ EN-TÊTE ════════ */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "primary.main",
              letterSpacing: 2,
              textTransform: "uppercase",
              mb: 0.5,
            }}
          >
            Communication & Événements
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Centre de Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Suivi des commandes en direct, modération des avis et alertes prioritaires.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          {unreadCount > 0 && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<DoneAllIcon />}
              onClick={handleMarkAll}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Tout marquer comme lu ({unreadCount})
            </Button>
          )}
          <Tooltip title="Rafraîchir" arrow>
            <IconButton
              onClick={loadNotifications}
              sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* ════════ CARTES KPI RÉCAPITULATIF ════════ */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2.5, p: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
            Total Reçues
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
            {notifications.length}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Événements enregistrés
          </Typography>
        </Card>

        <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2.5, p: 2, bgcolor: (theme) => alpha(theme.palette.error.main, 0.04) }}>
          <Typography variant="caption" color="error.main" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
            Non lues
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: "error.main" }}>
            {unreadCount}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Nécessitent votre attention
          </Typography>
        </Card>

        <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2.5, p: 2 }}>
          <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
            Commandes
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
            {notifications.filter((n) => n.type === "NEW_ORDER").length}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Flux de ventes
          </Typography>
        </Card>

        <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2.5, p: 2 }}>
          <Typography variant="caption" color="warning.main" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
            Avis & Retours
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
            {notifications.filter((n) => n.type === "NEW_REVIEW" || n.type === "NEW_FEEDBACK").length}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Modération clients
          </Typography>
        </Card>
      </Box>

      {/* ════════ BARRE D'ONGLETS ET FILTRES ════════ */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2.5,
          overflow: "hidden",
          mb: 3,
        }}
      >
        <Box sx={{ borderBottom: "1px solid", borderColor: "divider", px: 2, pt: 1 }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 700,
                fontSize: 13,
                minHeight: 48,
              },
            }}
          >
            <Tab value="all" label={`Toutes (${notifications.length})`} />
            <Tab
              value="unread"
              label={`Non lues (${unreadCount})`}
              sx={{ color: unreadCount > 0 ? "error.main" : undefined }}
            />
            <Tab value="read" label="Déjà consultées" />
          </Tabs>
        </Box>

        {/* Barre d'outils de recherche & sélection */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ p: 2, backgroundColor: "background.paper" }}
          alignItems="center"
        >
          <TextField
            size="small"
            placeholder="Rechercher par mot-clé, commande ou client…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 240 }}
          />

          <Select
            size="small"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            sx={{ minWidth: 200, fontSize: 13, fontWeight: 600 }}
          >
            <MenuItem value="ALL">Toutes les catégories</MenuItem>
            <MenuItem value="NEW_ORDER">Commandes uniquement</MenuItem>
            <MenuItem value="NEW_REVIEW">Avis clients</MenuItem>
            <MenuItem value="LOW_STOCK">Alertes de Stock</MenuItem>
            <MenuItem value="DELETION_REQUEST">Suppressions de compte</MenuItem>
            <MenuItem value="NEW_FEEDBACK">Retours d'expérience</MenuItem>
          </Select>
        </Stack>
      </Card>

      {/* ════════ LISTE DES NOTIFICATIONS ════════ */}
      <Stack spacing={1.5}>
        {filteredNotifications.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2.5,
              p: 6,
              textAlign: "center",
            }}
          >
            <NotificationsIcon sx={{ fontSize: 44, color: "text.disabled", mb: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Aucune notification correspondante
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Essayez de réinitialiser vos filtres ou effectuez une autre recherche.
            </Typography>
          </Card>
        ) : (
          filteredNotifications.map((n) => {
            const config = TYPE_CONFIG[n.type] || {
              label: "Information",
              color: "primary",
              icon: NotificationsIcon,
            };
            const IconComponent = config.icon;

            return (
              <Card
                key={n.id}
                elevation={0}
                onClick={() => handleClickItem(n)}
                sx={{
                  border: "1px solid",
                  borderColor: n.read ? "divider" : "primary.main",
                  borderRadius: 2.5,
                  cursor: "pointer",
                  backgroundColor: n.read ? "background.paper" : (theme) => alpha(theme.palette.primary.main, 0.03),
                  boxShadow: n.read ? "none" : "0 4px 16px rgba(47,123,246,0.06)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "action.hover",
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <CardContent sx={{ p: 2.25, "&:last-child": { pb: 2.25 } }}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }}>
                    {/* Icône typée */}
                    <Avatar
                      sx={{
                        width: 44,
                        height: 44,
                        bgcolor: (theme) => alpha(theme.palette[config.color].main, 0.12),
                        color: `${config.color}.main`,
                        flexShrink: 0,
                      }}
                    >
                      <IconComponent fontSize="small" />
                    </Avatar>

                    {/* Contenu */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                        {!n.read && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: "primary.main",
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: n.read ? 600 : 800,
                            fontSize: 14,
                            color: n.read ? "text.primary" : "primary.main",
                          }}
                        >
                          {n.title}
                        </Typography>
                        <Chip
                          label={config.label}
                          size="small"
                          color={config.color}
                          sx={{ height: 20, fontSize: 10, fontWeight: 700 }}
                        />
                      </Stack>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: 13, lineHeight: 1.5, mb: 0.75 }}
                      >
                        {n.message}
                      </Typography>

                      <Typography variant="caption" sx={{ fontSize: 11, color: "text.disabled" }}>
                        {new Date(n.createdAt).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        {n.entityId ? `· Réf: #${n.entityId}` : ""}
                      </Typography>
                    </Box>

                    {/* Boutons d'action rapides */}
                    <Stack direction="row" spacing={1} sx={{ alignSelf: { xs: "stretch", sm: "center" } }}>
                      {!n.read && (
                        <Tooltip title="Marquer comme lu" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => handleToggleRead(n, e)}
                            sx={{ color: "text.secondary", "&:hover": { color: "success.main" } }}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      <Button
                        variant="contained"
                        size="small"
                        endIcon={<ArrowForwardIcon fontSize="small" />}
                        sx={{
                          fontWeight: 700,
                          fontSize: 12,
                          px: 2,
                          borderRadius: 2,
                          textTransform: "none",
                        }}
                      >
                        Ouvrir
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            );
          })
        )}
      </Stack>
    </Box>
  );
};
