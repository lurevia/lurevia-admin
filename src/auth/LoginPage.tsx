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
                position: "relative",
                width: 320,
                height: 320,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  width: 240,
                  height: 240,
                  bgcolor: "#FADCD9",
                  borderRadius: "40% 60% 60% 40% / 40% 40% 60% 60%",
                  opacity: 0.7,
                }}
              />

              <Box
                component="img"
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
                alt="Lurevia"
                sx={{
                  width: 190,
                  height: 190,
                  borderRadius: "50%",
                  objectFit: "cover",
                  zIndex: 2,
                  border: "4px solid #FFFFFF",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                }}
              />

              <Box
                component="img"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                alt=""
                sx={{
                  position: "absolute",
                  top: 40,
                  right: 20,
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: "3px solid #FFFFFF",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  zIndex: 3,
                }}
              />

              <Box
                component="img"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                alt=""
                sx={{
                  position: "absolute",
                  bottom: 60,
                  right: 10,
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: "3px solid #FFFFFF",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  zIndex: 3,
                }}
              />

              <Box
                component="img"
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
                alt=""
                sx={{
                  position: "absolute",
                  bottom: 50,
                  left: 20,
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  border: "3px solid #FFFFFF",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  zIndex: 3,
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
            <Box sx={{ display: "flex", alignItems: "center", mb: 5 }}>
              <Box
                component="img"
                src="/logo.svg"
                alt="Lurevia"
                sx={{
                  height: 40,
                  width: "auto",
                  objectFit: "contain",
                }}
              />
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