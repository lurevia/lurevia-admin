import { useState, type MouseEvent } from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import LogoutIconModule from "@mui/icons-material/Logout";
import PersonIconModule from "@mui/icons-material/Person";
import SettingsIconModule from "@mui/icons-material/Settings";
import { useGetIdentity, useLogout } from "react-admin";
import { useNavigate } from "react-router-dom";
import { normalizeMuiIcon } from "../muiIcon";

const LogoutIcon = normalizeMuiIcon(LogoutIconModule);
const PersonIcon = normalizeMuiIcon(PersonIconModule);
const SettingsIcon = normalizeMuiIcon(SettingsIconModule);

interface FullIdentity {
  id?: string | number;
  fullName?: string;
  avatar?: string;
  email?: string;
}

export const LureviaUserMenu = () => {
  const { identity } = useGetIdentity();
  const logout = useLogout();
  const navigate = useNavigate();
  const typedIdentity = identity as FullIdentity | undefined;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate("/my-profile");
  };

  const handleSettings = () => {
    handleClose();
    navigate("/configuration");
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  if (!identity) return null;

  const initial = typedIdentity?.fullName?.charAt(0).toUpperCase() ?? "?";
  const displayName = typedIdentity?.fullName ?? "Utilisateur";

  return (
    <Box>
      <Tooltip title={displayName} arrow>
        <IconButton
          onClick={handleOpen}
          size="small"
          sx={{
            p: 0,
            border: "2px solid transparent",
            transition: "all 0.2s",
            "&:hover": { borderColor: "primary.main" },
          }}
          aria-label="Menu utilisateur"
        >
          <Avatar
            src={typedIdentity?.avatar}
            alt={displayName}
            sx={{
              width: 34,
              height: 34,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {initial}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(10, 27, 61, 0.15))",
              mt: 1.5,
              minWidth: 220,
              border: "1px solid",
              borderColor: "divider",
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
                borderTop: "1px solid",
                borderLeft: "1px solid",
                borderColor: "divider",
              },
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {displayName}
          </Typography>
          {typedIdentity?.email && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.25 }}
            >
              {typedIdentity.email}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem onClick={handleProfile} sx={{ py: 1 }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Mon profil</Typography>
        </MenuItem>

        <MenuItem onClick={handleSettings} sx={{ py: 1 }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Paramètres</Typography>
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem onClick={handleLogout} sx={{ py: 1, color: "error.main" }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: "error.main" }} />
          </ListItemIcon>
          <Typography variant="body2">Déconnexion</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};