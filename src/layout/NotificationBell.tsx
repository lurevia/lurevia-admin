import { useCallback, useEffect, useState } from "react";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import NotificationsIconModule from "@mui/icons-material/Notifications";
import ArrowForwardIconModule from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import {
  type AdminNotificationRecord,
  fetchAdminNotifications,
  fetchUnreadNotificationsCount,
  markAllNotificationsRead,
  navigateToNotification,
} from "../adminActions";
import { getAccessToken } from "../httpClient";
import { normalizeMuiIcon } from "../muiIcon";

const NotificationsIcon = normalizeMuiIcon(NotificationsIconModule);
const ArrowForwardIcon = normalizeMuiIcon(ArrowForwardIconModule);

const POLL_INTERVAL_MS = 20000;

export const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [items, setItems] = useState<AdminNotificationRecord[]>([]);
  const navigate = useNavigate();

  const refreshCount = useCallback(() => {
    if (!getAccessToken()) return;
    fetchUnreadNotificationsCount().then(setUnreadCount).catch(() => undefined);
  }, []);

  useEffect(() => {
    refreshCount();
    const interval = setInterval(refreshCount, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refreshCount]);

  const openMenu = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    const notifications = await fetchAdminNotifications(false, 8);
    setItems(notifications);
  };

  const closeMenu = () => setAnchorEl(null);

  const handleItemClick = (notification: AdminNotificationRecord) => {
    closeMenu();
    navigateToNotification(navigate, notification);
    refreshCount();
  };

  const handleMarkAll = async () => {
    await markAllNotificationsRead();
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleViewAll = () => {
    closeMenu();
    navigate("/notifications");
  };

  return (
    <>
      <IconButton color="inherit" onClick={openMenu} aria-label="Notifications">
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        PaperProps={{
          sx: {
            width: 380,
            maxWidth: "92vw",
            borderRadius: 2,
            boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1.25,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            Notifications ({unreadCount} non lue{unreadCount > 1 ? "s" : ""})
          </Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={handleMarkAll} sx={{ fontSize: 11, fontWeight: 700 }}>
              Tout marquer lu
            </Button>
          )}
        </Box>

        <Box sx={{ maxHeight: 360, overflowY: "auto" }}>
          {items.length === 0 && (
            <MenuItem disabled sx={{ py: 3, justifyContent: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Aucune notification pour le moment
              </Typography>
            </MenuItem>
          )}
          {items.map((n) => (
            <MenuItem
              key={n.id}
              onClick={() => handleItemClick(n)}
              sx={{
                py: 1.25,
                px: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                backgroundColor: n.read ? "transparent" : "action.hover",
                "&:hover": {
                  backgroundColor: "action.selected",
                },
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: n.read ? 600 : 800,
                      color: n.read ? "text.primary" : "primary.main",
                      fontSize: 13,
                    }}
                    noWrap
                  >
                    {n.title}
                  </Typography>
                  {!n.read && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "error.main",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    fontSize: 11.5,
                    lineHeight: 1.4,
                    mt: 0.25,
                  }}
                >
                  {n.message}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: 10, color: "text.disabled", mt: 0.5, display: "block" }}>
                  {new Date(n.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} · Cliquez pour ouvrir
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Box>

        <Divider />
        <Box sx={{ p: 1, backgroundColor: "background.default" }}>
          <Button
            fullWidth
            size="small"
            onClick={handleViewAll}
            endIcon={<ArrowForwardIcon fontSize="small" />}
            sx={{ fontWeight: 800, fontSize: 12, py: 0.75 }}
          >
            Voir toutes les notifications
          </Button>
        </Box>
      </Menu>
    </>
  );
};

