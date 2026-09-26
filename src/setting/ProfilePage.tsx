import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Title, useGetIdentity, useNotify, useLogout } from "react-admin";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    Stack,
    Tab,
    Tabs,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import PhotoCameraIconModule from "@mui/icons-material/PhotoCamera";
import CloseIconModule from "@mui/icons-material/Close";
import SaveIconModule from "@mui/icons-material/Save";
import PersonIconModule from "@mui/icons-material/Person";
import LockIconModule from "@mui/icons-material/Lock";
import PaletteIconModule from "@mui/icons-material/Palette";
import VerifiedIconModule from "@mui/icons-material/Verified";
import LogoutIconModule from "@mui/icons-material/Logout";
import InfoOutlinedIconModule from "@mui/icons-material/InfoOutlined";
import { normalizeMuiIcon } from "../muiIcon";
import { useThemeCustomizer } from "../theme/ThemeCustomizerContext";
import { API_URL, httpClient } from "../httpClient";
import { PresetGallery } from "./PresetGallery";
import { ThemeControls } from "./ThemeControls";
import { useSearchParams } from "react-router-dom";

const PhotoCameraIcon = normalizeMuiIcon(PhotoCameraIconModule);
const CloseIcon = normalizeMuiIcon(CloseIconModule);
const SaveIcon = normalizeMuiIcon(SaveIconModule);
const PersonIcon = normalizeMuiIcon(PersonIconModule);
const LockIcon = normalizeMuiIcon(LockIconModule);
const PaletteIcon = normalizeMuiIcon(PaletteIconModule);
const VerifiedIcon = normalizeMuiIcon(VerifiedIconModule);
const LogoutIcon = normalizeMuiIcon(LogoutIconModule);
const InfoIcon = normalizeMuiIcon(InfoOutlinedIconModule);

type TabKey = "info" | "security" | "theme";

export const ProfilePage = () => {
    const [searchParams] = useSearchParams();
    const { identity } = useGetIdentity();
    const notify = useNotify();
    const logout = useLogout();
    const { config } = useThemeCustomizer();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [tab, setTab] = useState<TabKey>(() =>
        searchParams.get("tab") === "theme" ? "theme" : "info"
    );
    const [saving, setSaving] = useState(false);

    // Infos profil
    const [fullName, setFullName] = useState(identity?.fullName ?? "");
    const [avatarUrl, setAvatarUrl] = useState(identity?.avatar ?? "");

    // Mot de passe
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        setFullName(identity?.fullName ?? "");
        setAvatarUrl(identity?.avatar ?? "");
    }, [identity]);

    // ─── Avatar upload ───
    const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            notify("Le fichier doit être une image.", { type: "warning" });
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            notify("L'image doit faire moins de 2 Mo.", { type: "warning" });
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === "string") setAvatarUrl(result);
        };
        reader.readAsDataURL(file);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // ─── Enregistrer infos ───
    const handleSaveInfo = async () => {
        setSaving(true);
        try {
            await httpClient(`${API_URL}/users/me`, {
                method: "PATCH",
                body: JSON.stringify({ fullName, avatarUrl }),
            });
            notify("Profil mis à jour.", { type: "success" });
        } catch (err) {
            notify(err instanceof Error ? err.message : "Erreur.", { type: "error" });
        } finally {
            setSaving(false);
        }
    };

    // ─── Changer mot de passe ───
    const handleChangePassword = async () => {
        if (newPassword.length < 8) {
            notify("Le mot de passe doit faire au moins 8 caractères.", { type: "warning" });
            return;
        }
        if (newPassword !== confirmPassword) {
            notify("Les mots de passe ne correspondent pas.", { type: "warning" });
            return;
        }
        setSaving(true);
        try {
            await httpClient(`${API_URL}/users/me/change-password`, {
                method: "POST",
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            notify("Mot de passe changé. Reconnectez-vous.", { type: "success" });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            notify(err instanceof Error ? err.message : "Erreur.", { type: "error" });
        } finally {
            setSaving(false);
        }
    };

    const initial = fullName?.charAt(0).toUpperCase() ?? "?";

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: "auto" }}>
            <Title title="Mon profil" />

            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.25 }}>
                    Mon profil
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Gérez vos informations personnelles, votre sécurité et votre thème.
                </Typography>
            </Box>

            {/* Carte profil */}
            <Card
                elevation={0}
                sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2.5,
                    mb: 3,
                }}
            >
                <CardContent sx={{ p: 2.5 }}>
                    <Stack direction="row" spacing={2.5} alignItems="center">
                        <Box sx={{ position: "relative" }}>
                            <Avatar
                                src={avatarUrl || undefined}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    fontSize: 30,
                                    fontWeight: 800,
                                    bgcolor: "primary.main",
                                    color: "primary.contrastText",
                                }}
                            >
                                {initial}
                            </Avatar>
                            <Tooltip title="Changer l'avatar" arrow>
                                <IconButton
                                    size="small"
                                    onClick={() => fileInputRef.current?.click()}
                                    sx={{
                                        position: "absolute",
                                        bottom: -4,
                                        right: -4,
                                        width: 28,
                                        height: 28,
                                        backgroundColor: "primary.main",
                                        color: "primary.contrastText",
                                        border: "2px solid",
                                        borderColor: "background.paper",
                                        "&:hover": { backgroundColor: "primary.dark" },
                                    }}
                                >
                                    <PhotoCameraIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                            </Tooltip>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleAvatarChange}
                            />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                    {identity?.fullName ?? "Administrateur"}
                                </Typography>
                                <Chip
                                    icon={<VerifiedIcon sx={{ fontSize: 12 }} />}
                                    label="Admin"
                                    size="small"
                                    color="primary"
                                    sx={{
                                        height: 22,
                                        fontSize: 10.5,
                                        fontWeight: 700,
                                        "& .MuiChip-icon": { color: "inherit" },
                                    }}
                                />
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                                {identity?.email ?? "admin@lurevia.mg"}
                            </Typography>
                            <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.5 }}>
                                Dernière connexion :{" "}
                                {identity?.lastLoginAt
                                    ? new Date(identity.lastLoginAt).toLocaleString("fr-FR")
                                    : "aujourd'hui"}
                            </Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>

            {/* Onglets */}
            <Card
                elevation={0}
                sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2.5 }}
            >
                <Box sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
                    <Tabs
                        value={tab}
                        onChange={(_, v) => setTab(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            minHeight: 56,
                            px: 1,
                            "& .MuiTab-root": {
                                textTransform: "none",
                                fontWeight: 700,
                                fontSize: 12.5,
                                minHeight: 56,
                                px: 2,
                            },
                        }}
                    >
                        <Tab
                            value="info"
                            icon={<PersonIcon sx={{ fontSize: 16 }} />}
                            iconPosition="start"
                            label="Informations"
                        />
                        <Tab
                            value="security"
                            icon={<LockIcon sx={{ fontSize: 16 }} />}
                            iconPosition="start"
                            label="Sécurité"
                        />
                        <Tab
                            value="theme"
                            icon={<PaletteIcon sx={{ fontSize: 16 }} />}
                            iconPosition="start"
                            label="Thème"
                        />
                    </Tabs>
                </Box>

                <CardContent sx={{ p: 3 }}>
                    {/* ═══ INFOS ═══ */}
                    {tab === "info" && (
                        <Stack spacing={3}>
                            <Box>
                                <Typography sx={{ fontWeight: 800, fontSize: 15, mb: 0.5 }}>
                                    Informations personnelles
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Ces informations vous identifient sur la plateforme.
                                </Typography>
                            </Box>

                            <TextField
                                label="Nom complet"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                fullWidth
                                size="small"
                            />

                            <TextField
                                label="Adresse e-mail"
                                value={identity?.email ?? ""}
                                fullWidth
                                size="small"
                                disabled
                                helperText="Contactez un autre administrateur pour modifier votre email."
                            />

                            <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
                                <Button
                                    variant="contained"
                                    onClick={handleSaveInfo}
                                    disabled={saving}
                                    startIcon={saving ? <CircularProgress size={16} sx={{ color: "inherit" }} /> : <SaveIcon />}
                                    sx={{
                                        textTransform: "none",
                                        fontWeight: 700,
                                        borderRadius: 1.5,
                                        boxShadow: "none",
                                    }}
                                >
                                    {saving ? "Enregistrement…" : "Enregistrer"}
                                </Button>
                            </Stack>
                        </Stack>
                    )}

                    {/* ═══ SÉCURITÉ ═══ */}
                    {tab === "security" && (
                        <Stack spacing={3}>
                            <Box>
                                <Typography sx={{ fontWeight: 800, fontSize: 15, mb: 0.5 }}>
                                    Changer le mot de passe
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Utilisez un mot de passe fort (8 caractères min, majuscule, chiffre).
                                </Typography>
                            </Box>

                            <Alert
                                severity="info"
                                icon={<InfoIcon fontSize="small" />}
                                sx={{ py: 0.75, borderRadius: 2 }}
                            >
                                Vous serez déconnecté de tous vos appareils après le changement.
                            </Alert>

                            <TextField
                                label="Mot de passe actuel"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                fullWidth
                                size="small"
                                autoComplete="current-password"
                            />
                            <TextField
                                label="Nouveau mot de passe"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                fullWidth
                                size="small"
                                autoComplete="new-password"
                            />
                            <TextField
                                label="Confirmer le nouveau mot de passe"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                fullWidth
                                size="small"
                                autoComplete="new-password"
                                error={
                                    confirmPassword.length > 0 && newPassword !== confirmPassword
                                }
                                helperText={
                                    confirmPassword.length > 0 && newPassword !== confirmPassword
                                        ? "Les mots de passe ne correspondent pas."
                                        : ""
                                }
                            />

                            <Divider />

                            <Box>
                                <Typography sx={{ fontWeight: 800, fontSize: 15, mb: 0.5, color: "error.main" }}>
                                    Déconnexion
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Terminer la session actuelle en toute sécurité.
                                </Typography>
                            </Box>

                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<LogoutIcon />}
                                onClick={() => logout()}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 700,
                                    borderRadius: 1.5,
                                    alignSelf: "flex-start",
                                }}
                            >
                                Se déconnecter
                            </Button>

                            <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
                                <Button
                                    variant="contained"
                                    onClick={handleChangePassword}
                                    disabled={saving || !currentPassword || !newPassword}
                                    startIcon={saving ? <CircularProgress size={16} sx={{ color: "inherit" }} /> : <SaveIcon />}
                                    sx={{
                                        textTransform: "none",
                                        fontWeight: 700,
                                        borderRadius: 1.5,
                                        boxShadow: "none",
                                    }}
                                >
                                    {saving ? "Enregistrement…" : "Changer le mot de passe"}
                                </Button>
                            </Stack>
                        </Stack>
                    )}

                    {/* ═══ THÈME ═══ */}
                    {tab === "theme" && (
                        <Stack spacing={3}>
                            <Box>
                                <Typography sx={{ fontWeight: 800, fontSize: 15, mb: 0.5 }}>
                                    Thème de l'interface
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Personnalisez votre espace administrateur. Ce thème est propre à votre compte.
                                </Typography>
                            </Box>

                            {/* Info sur le thème actuel */}
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
                                    border: "1px solid",
                                    borderColor: (theme) => alpha(theme.palette.primary.main, 0.15),
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 1.5,
                                        backgroundColor: config.primary,
                                        flexShrink: 0,
                                        border: "1px solid",
                                        borderColor: "divider",
                                    }}
                                />
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                                        Thème actuel : {config.name}
                                    </Typography>
                                    <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                                        Mode {config.mode === "light" ? "clair" : "sombre"} · Densité{" "}
                                        {config.density} · Sidebar {config.sidebarStyle}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider />

                            {/* Galerie de presets */}
                            <PresetGallery />
                            <Divider />
                            <ThemeControls />
                        </Stack>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};