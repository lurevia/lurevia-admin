import { AppBar, TitlePortal, useGetIdentity } from "react-admin";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { NotificationBell } from "./NotificationBell";

export const LureviaAppBar = () => {
  const { identity } = useGetIdentity();

  return (
    <AppBar elevation={0} userMenu={true}>
      <TitlePortal />
      <Box sx={{ flex: 1 }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mr: 1 }}>
        <NotificationBell />
        {identity && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ width: 30, height: 30, bgcolor: "primary.main", fontSize: 13 }}>
              {identity.fullName?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 600, display: { xs: "none", sm: "block" } }}>
              {identity.fullName}
            </Typography>
          </Box>
        )}
      </Box>
    </AppBar>
  );
};
