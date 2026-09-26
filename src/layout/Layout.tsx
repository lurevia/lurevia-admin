import { Layout as RaLayout, type LayoutProps } from "react-admin";
import { LureviaAppBar } from "./AppBar";
import { LureviaMenu } from "./Menu";

export const LureviaLayout = (props: LayoutProps) => (
  <RaLayout
    {...props}
    appBar={LureviaAppBar}
    menu={LureviaMenu}
    sx={{
      "& .RaSidebar-root .MuiDrawer-paper": {
        padding: 0,
        overflowX: "hidden",
      },
    }}
  />
);