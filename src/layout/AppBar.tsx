import { AppBar, TitlePortal } from "react-admin";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { NotificationBell } from "./NotificationBell";

export const LureviaAppBar = () => (
  <AppBar>
    <TitlePortal />
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 1 }}>
      <Typography variant="body2" sx={{ opacity: 0.75, mr: 1 }}>
        Lurevia · Admin
      </Typography>
      <NotificationBell />
    </Box>
  </AppBar>
);
