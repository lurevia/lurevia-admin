import { FormEvent, useState } from "react";
import { useLogin, useNotify } from "react-admin";
import VisibilityIconModule from "@mui/icons-material/Visibility";
import VisibilityOffIconModule from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { normalizeMuiIcon } from "../muiIcon";
import { loginTheme } from "../theme/loginTheme";
import lureviaLogo from "../logo";
import loginIllustration from "../assets/login-illustration.png";

const VisibilityIcon = normalizeMuiIcon(VisibilityIconModule);
const VisibilityOffIcon = normalizeMuiIcon(VisibilityOffIconModule);

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
        loginError instanceof Error
          ? loginError.message
          : "Impossible de vous connecter.";
      setError(message);
      notify(message, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={loginTheme}>
      <CssBaseline />

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#EBF3FA",
          p: { xs: 2, md: 4 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            maxWidth: 1000,
            minHeight: 600,
            bgcolor: "#FFFFFF",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box
            sx={{
              flex: 1.1,
              bgcolor: "#F3F7FA",
              p: 6,
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#0A1B3D",
                lineHeight: 1.3,
                maxWidth: 340,
                mt: 4,
              }}
            >
              Pilotez votre boutique avec clarté.
            </Typography>

            <Box
              sx={{
                alignSelf: "center",
                width: "100%",
                maxWidth: 380,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                my: "auto",
                py: 2,
              }}
            >
              <Box
                component="img"
                src={loginIllustration}
                alt="Illustration Connexion Lurevia"
                sx={{
                  width: "100%",
                  maxHeight: 350,
                  objectFit: "contain",
                  filter: "drop-shadow(0 12px 24px rgba(10, 27, 61, 0.08))",
                }}
              />
            </Box>

            <Typography variant="caption" color="text.secondary">
              © {new Date().getFullYear()} Lurevia
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              p: { xs: 4, sm: 6, md: 8 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
              <Box
                component="img"
                src={lureviaLogo}
                alt="Lurevia"
                sx={{
                  height: 52,
                  width: 52,
                  borderRadius: 2,
                  objectFit: "cover",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                }}
              />
              <Box>
                <Typography
                  sx={{
                    fontSize: "1.35rem",
                    fontWeight: 800,
                    color: "#0A1B3D",
                    lineHeight: 1.15,
                    letterSpacing: "-0.3px",
                  }}
                >
                  Lurevia
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "text.secondary",
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                  }}
                >
                  Be Authentic · Admin
                </Typography>
              </Box>
            </Box>

            {/* Titres */}
            <Typography
              component="h1"
              sx={{
                fontSize: "1.75rem",
                fontWeight: 700,
                mb: 1,
                color: "#0A1B3D",
              }}
            >
              Connexion
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Accédez à votre espace d'administration.
            </Typography>

            {error && (
              <Alert severity="error" onClose={() => setError("")} sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  label="Adresse e-mail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                />

                <TextField
                  label="Mot de passe"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Afficher le mot de passe"
                          onClick={() => setShowPassword((v) => !v)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon fontSize="small" />
                          ) : (
                            <VisibilityIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        sx={{
                          color: "primary.main",
                          "&.Mui-checked": { color: "primary.main" },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Rester connecté
                      </Typography>
                    }
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    bgcolor: "primary.main",
                    borderRadius: 0,
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  }}
                >
                  {loading ? "Connexion..." : "Se connecter"}
                </Button>
              </Stack>
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                mt: 6,
                display: { xs: "block", md: "none" },
                textAlign: "center",
              }}
            >
              © {new Date().getFullYear()} Lurevia
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};