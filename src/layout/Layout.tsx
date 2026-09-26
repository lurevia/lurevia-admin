import { Layout as RaLayout, type LayoutProps } from "react-admin";
import { useTheme } from "@mui/material/styles";
import { LureviaAppBar } from "./AppBar";
import { LureviaMenu } from "./Menu";
import { MenuCollapseProvider, useMenuCollapse } from "./MenuCollapseContext";

const LayoutWithCollapse = (props: LayoutProps) => {
  const { width, collapsed, isMobile } = useMenuCollapse();
  const theme = useTheme();

  return (
    <RaLayout
      {...props}
      appBar={LureviaAppBar}
      menu={LureviaMenu}
      sx={{
        ...(!isMobile && {
          "& .RaSidebar-root .MuiDrawer-paper, & .MuiDrawer-paper": {
            width: `${width}px`,
            minWidth: `${width}px`,
            maxWidth: `${width}px`,
            transition: theme.transitions.create(["width", "min-width", "max-width"], {
              duration: theme.transitions.duration.standard,
              easing: theme.transitions.easing.easeInOut,
            }),
            overflowX: "hidden",
          },
          "& .RaLayout-contentWithSidebar": {
            marginLeft: `${width}px`,
            transition: theme.transitions.create("margin-left", {
              duration: theme.transitions.duration.standard,
              easing: theme.transitions.easing.easeInOut,
            }),
          },
        }),
      }}
    />
  );
};


export const LureviaLayout = (props: LayoutProps) => (
  <MenuCollapseProvider>
    <LayoutWithCollapse {...props} />
  </MenuCollapseProvider>
);