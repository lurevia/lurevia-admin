import { useCallback, useEffect, useState } from "react";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import NotificationsIconModule from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import {
  type AdminNotificationRecord,
  fetchAdminNotifications,
  fetchUnreadNotificationsCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "../adminActions";
import { normalizeMuiIcon } from "../muiIcon";

const NotificationsIcon = normalizeMuiIcon(NotificationsIconModule);

const POLL_INTERVAL_MS = 20000;

const ENTITY_ROUTE: Record<string, string> = {
  order: "/orders",
  review: "/reviews",
  feedback: "/reviews",
  deletionRequest: "/deletion-requests",
};

export const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [items, setItems] = useState<AdminNotificationRecord[]>([]);
  const navigate = useNavigate();

  const refreshCount = useCallback(() => {
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

  const handleItemClick = async (notification: AdminNotificationRecord) => {
    if (!notification.read) {
      await markNotificationRead(notification.id);
      refreshCount();
    }
    closeMenu();
    const route = ENTITY_ROUTE[notification.entityType];
    if (route) navigate(`${route}/${notification.entityId}`);
  };

  const handleMarkAll = async () => {
    await markAllNotificationsRead();
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <>
      <IconButton color="inherit" onClick={openMenu} aria-label="Notifications">
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu} PaperProps={{ sx: { width: 360 } }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 16px" }}>
          <Typography variant="subtitle2">Activité récente</Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={handleMarkAll}>
              Tout marquer lu
            </Button>
          )}
        </div>
        {items.length === 0 && (
          <MenuItem disabled>
            <ListItemText primary="Aucune notification pour le moment" />
          </MenuItem>
        )}
        {items.map((n) => (
          <MenuItem key={n.id} onClick={() => handleItemClick(n)} sx={{ opacity: n.read ? 0.55 : 1 }}>
            <ListItemText
              primary={n.title}
              secondary={n.message}
              primaryTypographyProps={{ fontWeight: n.read ? 400 : 700, fontSize: 14 }}
              secondaryTypographyProps={{ fontSize: 12, noWrap: true }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
