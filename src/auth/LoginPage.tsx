import { FormEvent, useState } from "react";
import { useLogin, useNotify } from "react-admin";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export const LureviaLoginPage = () => {
  const login = useLogin();
  const notify = useNotify();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ username: email.trim(), password, remember });
    } catch (loginError) {
      const message =
        loginError instanceof Error ? loginError.message : "Impossible de vous connecter.";
      setError(message);
      notify(message, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: { xs: 2, md: 5 },
        py: { xs: 3, md: 5 },
        background:
          "radial-gradient(circle at 8% 10%, rgba(77,141,255,.24), transparent 32%)," +
          "radial-gradient(circle at 92% 88%, rgba(139,92,246,.18), transparent 30%), #07111f",
      }}
    >
      <Box
        sx={{
          width: "min(1120px, 100%)",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.08fr .92fr" },
          overflow: "hidden",
          border: "1px solid rgba(148,167,196,.18)",
          borderRadius: { xs: 4, md: 6 },
          background: "rgba(12, 27, 46, .82)",
          boxShadow: "0 32px 100px rgba(0,0,0,.42)",
          backdropFilter: "blur(24px)",
        }}
      >
        <Box
          sx={{
            position: "relative",
            minHeight: { md: 650 },
            p: { xs: 3, md: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            background:
              "linear-gradient(145deg, rgba(77,141,255,.22), rgba(12,27,46,.35) 52%, rgba(139,92,246,.17))",
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 3,
                  color: "#fff",
                  background: "linear-gradient(135deg, #4d8dff, #8b5cf6)",
                  boxShadow: "0 12px 28px rgba(77,141,255,.34)",
                }}
              >
                <Inventory2OutlinedIcon />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                Lurevia
              </Typography>
            </Stack>
            <Typography
              variant="overline"
              sx={{ display: "block", mt: { xs: 7, md: 13 }, color: "primary.light", letterSpacing: 2.4 }}
            >
              ESPACE ÉQUIPE
            </Typography>
            <Typography
              component="h1"
              sx={{
                maxWidth: 510,
                mt: 1,
                fontSize: { xs: "2.5rem", md: "4.2rem" },
                lineHeight: 0.98,
                fontWeight: 850,
                letterSpacing: "-.065em",
              }}
            >
              Pilotez votre boutique avec clarté.
            </Typography>
            <Typography sx={{ maxWidth: 440, mt: 3, color: "text.secondary", fontSize: "1.05rem", lineHeight: 1.7 }}>
              Un espace calme pour suivre vos ventes, vos produits et vos clients, sans bruit.
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ position: "relative", zIndex: 1, mt: 6 }}>
            <Paper sx={{ flex: 1, p: 2, background: "rgba(7,17,31,.48)" }}>
              <TrendingUpIcon sx={{ color: "primary.light" }} />
              <Typography sx={{ mt: 1, fontWeight: 700 }}>Vue d’ensemble</Typography>
              <Typography variant="body2" color="text.secondary">Les bons signaux, au bon endroit.</Typography>
            </Paper>
            <Paper sx={{ flex: 1, p: 2, background: "rgba(7,17,31,.48)" }}>
              <ShieldOutlinedIcon sx={{ color: "#a78bfa" }} />
              <Typography sx={{ mt: 1, fontWeight: 700 }}>Accès sécurisé</Typography>
              <Typography variant="body2" color="text.secondary">Réservé aux administrateurs.</Typography>
            </Paper>
          </Stack>
          <Box
            sx={{
              position: "absolute",
              width: 260,
              height: 260,
              right: -80,
              top: -80,
              borderRadius: "50%",
              border: "1px solid rgba(131,176,255,.18)",
              boxShadow: "0 0 0 34px rgba(131,176,255,.04), 0 0 0 70px rgba(131,176,255,.025)",
            }}
          />
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 3, md: 6 }, display: "flex", alignItems: "center" }}>
          <Stack spacing={3} sx={{ width: "100%" }}>
            <Box>
              <Typography variant="overline" sx={{ color: "primary.light", letterSpacing: 2 }}>
                BON RETOUR
              </Typography>
              <Typography component="h2" variant="h4" sx={{ mt: 0.5, fontWeight: 800, letterSpacing: -1 }}>
                Connexion
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Connectez-vous pour retrouver votre espace de pilotage.
              </Typography>
            </Box>
            {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}
            <Stack spacing={2}>
              <TextField
                label="Adresse e-mail"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                autoFocus
                required
                fullWidth
              />
              <TextField
                label="Mot de passe"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="Afficher le mot de passe" onClick={() => setShowPassword((visible) => !visible)} edge="end">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
            <FormControlLabel
              control={<Checkbox checked={remember} onChange={(event) => setRemember(event.target.checked)} />}
              label="Rester connecté sur cet appareil"
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              endIcon={<ArrowForwardIcon />}
              sx={{ py: 1.5, borderRadius: 3, fontWeight: 800 }}
            >
              {loading ? "Connexion..." : "Ouvrir mon espace"}
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", lineHeight: 1.6 }}>
              Cet espace est réservé aux comptes administrateurs Lurevia.
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
