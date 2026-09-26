import { createTheme } from "@mui/material/styles";
import type { RaThemeOptions } from "react-admin";
import { defaultTheme } from "react-admin";
import type { ThemeConfig } from "./type";
import { darken, lighten, readableTextColor, subtleBackground } from "./colorUtils";

export function buildTheme(config: ThemeConfig): RaThemeOptions {
    const {
        mode, primary, secondary, background, surface,
        textPrimary, textSecondary, border, sidebarStyle,
        density, borderRadius, fontFamily,
    } = config;

    const primaryLight = lighten(primary, 12);
    const primaryDark = darken(primary, 12);
    const primarySubtle = subtleBackground(primary, mode === "dark" ? 15 : 96);
    const primaryContrast = readableTextColor(primary);

    const densityMap = {
        compact: { cellPadding: "8px 12px", rowHeight: 36, fontSize: 13 },
        comfortable: { cellPadding: "12px 16px", rowHeight: 44, fontSize: 14 },
        spacious: { cellPadding: "16px 20px", rowHeight: 52, fontSize: 15 },
    } as const;
    const d = densityMap[density];

    const sidebarBg =
        sidebarStyle === "dark" ? (mode === "dark" ? "#0A0F1F" : "#0A1B3D") :
            sidebarStyle === "accent" ? primary :
                surface;
    const sidebarText =
        sidebarStyle === "light" ? textPrimary : "#E6EDF7";
    const sidebarActiveBg =
        sidebarStyle === "light" ? primarySubtle :
            sidebarStyle === "accent" ? "rgba(255,255,255,0.16)" :
                "rgba(255,255,255,0.08)";
    const sidebarActiveText =
        sidebarStyle === "light" ? primary : "#FFFFFF";

    // 1️⃣ Create a valid base MUI theme using createTheme to properly hydrate grey, error, common, action, etc.
    const muiBase = createTheme({
        palette: {
            mode,
            primary: {
                main: primary,
                light: primaryLight,
                dark: primaryDark,
                contrastText: primaryContrast,
            },
            secondary: { main: secondary },
            background: { default: background, paper: surface },
            text: { primary: textPrimary, secondary: textSecondary },
            divider: border,
        },
        typography: {
            fontFamily,
            fontSize: d.fontSize,
            h6: { fontWeight: 700 },
            button: { textTransform: "none", fontWeight: 600 },
        },
        shape: { borderRadius },
    });

    // 2️⃣ Merge your options securely with React-Admin base defaults
    return {
        ...defaultTheme,
        palette: muiBase.palette,
        typography: muiBase.typography,
        shape: muiBase.shape,

        components: {
            ...defaultTheme.components,
            ...muiBase.components,

            MuiCssBaseline: {
                styleOverrides: { body: { backgroundColor: background } },
            },

            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: "none",
                        backgroundColor: surface,
                        ...(mode === "light" && {
                            border: `1px solid ${border}`,
                            boxShadow: "0 1px 2px rgba(10, 27, 61, 0.04)",
                        }),
                    },
                },
            },

            MuiCard: {
                styleOverrides: { root: { borderRadius, overflow: "hidden" } },
            },

            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: surface,
                        color: textPrimary,
                        borderBottom: `1px solid ${border}`,
                        boxShadow: "none",
                    },
                },
            },

            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundColor: sidebarBg,
                        color: sidebarText,
                        borderRight: sidebarStyle === "light" ? `1px solid ${border}` : "none",
                    },
                },
            },

            MuiButton: {
                defaultProps: { disableElevation: true },
                styleOverrides: {
                    root: { borderRadius, fontWeight: 600, textTransform: "none" },
                    containedPrimary: {
                        backgroundColor: primary,
                        "&:hover": { backgroundColor: primaryDark },
                    },
                },
            },

            MuiChip: {
                styleOverrides: {
                    root: { borderRadius: Math.max(4, borderRadius - 2), fontWeight: 600 },
                },
            },

            MuiTextField: { defaultProps: { size: "small" } },

            // Bypassing the strict literal component type constraint for custom Ra components
            ...({
                RaDatagrid: {
                    styleOverrides: {
                        root: {
                            "& .RaDatagrid-headerCell": {
                                backgroundColor: mode === "dark"
                                    ? darken(surface, 4)
                                    : subtleBackground(primary, 97),
                                fontWeight: 700,
                                color: textPrimary,
                                padding: d.cellPadding,
                            },
                            "& .RaDatagrid-row": { height: d.rowHeight },
                            "& .RaDatagrid-row:hover": { backgroundColor: primarySubtle },
                        },
                    },
                },

                RaMenuItemLink: {
                    styleOverrides: {
                        root: {
                            borderRadius: Math.max(4, borderRadius - 2),
                            margin: "2px 8px",
                            color: sidebarText,
                            "&:hover": { backgroundColor: sidebarActiveBg },
                            "&.RaMenuItemLink-active": {
                                backgroundColor: sidebarActiveBg,
                                color: sidebarActiveText,
                                fontWeight: 700,
                        },
                    },
                },
            },

            RaSidebar: {
                    styleOverrides: {
                        root: { "& .MuiDrawer-paper": { backgroundColor: sidebarBg } },
                    },
                },
            } as any),
        },
    };
}
