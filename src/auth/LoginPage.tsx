import { FormEvent, useState } from "react";
import { useLogin, useNotify } from "react-admin";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
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

/**
 * Page de connexion — simple et claire, assortie au reste de l'admin :
 * fond uni, coins peu arrondis, pas de flou. Le panneau bleu à gauche
 * garde une touche de marque sans en faire trop.
 */
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
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", px: { xs: 2, md: 5 }, py: 5, bgcolor: "#F4F7FC" }}>
      <Box
        sx={{
          width: "min(980px, 100%)",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          overflow: "hidden",
          border: "1px solid #E4EAF4",
          borderRadius: 2,
          bgcolor: "#fff",
          boxShadow: "0 8px 32px -16px rgba(10, 27, 61, 0.18)",
        }}
      >
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
            p: 5,
            background: "linear-gradient(160deg, #2F7BF6, #1749B0)",
            color: "#fff",
          }}
        >
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 1.5,
                  bgcolor: "rgba(255,255,255,0.16)",
                  fontWeight: 800,
                }}
              >
                L
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Lurevia
              </Typography>
            </Stack>
            <Typography variant="overline" sx={{ display: "block", mt: 8, opacity: 0.8, letterSpacing: 2 }}>
              ESPACE ÉQUIPE
            </Typography>
            <Typography component="h1" sx={{ maxWidth: 380, mt: 1, fontSize: "2.4rem", lineHeight: 1.15, fontWeight: 800 }}>
              Pilotez votre boutique avec clarté.
            </Typography>
            <Typography sx={{ maxWidth: 360, mt: 2, opacity: 0.85, lineHeight: 1.6 }}>
              Un espace calme pour suivre vos ventes, vos produits et vos clients, sans bruit.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Paper sx={{ flex: 1, p: 2, bgcolor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }}>
              <TrendingUpIcon />
              <Typography sx={{ mt: 1, fontWeight: 700 }}>Vue d'ensemble</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Les bons signaux, au bon endroit.
              </Typography>
            </Paper>
            <Paper sx={{ flex: 1, p: 2, bgcolor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }}>
              <ShieldOutlinedIcon />
              <Typography sx={{ mt: 1, fontWeight: 700 }}>Accès sécurisé</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Réservé aux administrateurs.
              </Typography>
            </Paper>
          </Stack>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 3, md: 5 }, display: "flex", alignItems: "center" }}>
          <Stack spacing={2.5} sx={{ width: "100%" }}>
            <Box>
              <Typography component="h2" variant="h5" sx={{ fontWeight: 800 }}>
                Connexion
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
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
            <Button type="submit" variant="contained" size="large" disabled={loading} endIcon={<ArrowForwardIcon />} sx={{ py: 1.3 }}>
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
