import { AppBar, TitlePortal } from "react-admin";
import { Box, IconButton, Tooltip } from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import { NotificationBell } from "./NotificationBell";
import { LureviaUserMenu } from "./UserMenu";

export const LureviaAppBar = () => {
  return (
    <AppBar elevation={0} userMenu={<LureviaUserMenu />}>
      <TitlePortal />
      <Box sx={{ flex: 1 }} />

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <NotificationBell />
        <Tooltip title="Personnaliser le thème" arrow>
          <IconButton size="small" color="inherit" aria-label="Personnaliser le thème">
            <PaletteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </AppBar>
  );
};