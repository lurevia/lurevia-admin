import { Layout as RaLayout, type LayoutProps } from "react-admin";
import { LureviaAppBar } from "./AppBar";
import { LureviaMenu } from "./Menu";
import CssBaseline from "@mui/material/CssBaseline";

export const LureviaLayout = (props: LayoutProps) => (
  <>
    <CssBaseline />
    <RaLayout
      {...props}
      appBar={LureviaAppBar}
      menu={LureviaMenu}
      sx={{
      height: "100dvh",
      minHeight: 0,
      overflow: "hidden",
      "& .RaLayout-appFrame": {
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
      },
      "& .RaLayout-contentWithSidebar": {
        minHeight: 0,
        overflowX: "hidden",
        overflowY: "auto",
        overscrollBehavior: "contain",
      },
      "& .RaSidebar-paper": {
        padding: 0,
        overflowX: "hidden",
      },
      "& .RaSidebar-fixed": {
        width: 240,
        minWidth: 240,
        boxSizing: "border-box",
      },
      }}
    />
  </>
);