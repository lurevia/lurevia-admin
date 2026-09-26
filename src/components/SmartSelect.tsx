import { useMemo, useState, type ReactNode } from "react";
import {
  Autocomplete,
  Box,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface SmartSelectOption {
  value: string;
  label: string;
  icon?: SvgIconComponent;
  /** Décrit l'option dans un tooltip. */
  description?: string;
}

interface SmartSelectProps {
  /** Label du placeholder quand rien n'est sélectionné. */
  placeholder: string;
  /** Icône affichée à gauche du champ (le "type" de filtre). */
  icon: SvgIconComponent;
  /** Couleur de l'icône (token MUI ou hex). */
  iconColor?: string;
  /** Liste des options disponibles. */
  options: SmartSelectOption[];
  /** Valeur sélectionnée (chaîne vide = aucun filtre). */
  value: string;
  /** Callback appelé au changement. */
  onChange: (value: string) => void;
  /** Largeur minimale (par défaut 180). */
  minWidth?: number;
  /** Largeur maximale (par défaut 260). */
  maxWidth?: number;
  /** Autorise à effacer la valeur (affiche un X). */
  clearable?: boolean;
  /** Désactive la recherche interne (utile pour les tris courts). */
  disableSearch?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sélecteur intelligent réutilisable.
 *
 * - Affiche une icône à gauche
 * - Recherche interne (optionnelle)
 * - Coche l'option active
 * - Bordure colorée quand actif
 *
 * Utilisable pour :
 * - Filtres (rôle, genre, âge, statut, catégorie...)
 * - Tri (date, prix, popularité...)
 * - N'importe quel sélecteur simple
 */
export const SmartSelect = ({
  placeholder,
  icon: Icon,
  iconColor = "text.secondary",
  options,
  value,
  onChange,
  minWidth = 180,
  maxWidth = 260,
  clearable = true,
  disableSearch = false,
}: SmartSelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const filteredOptions = useMemo(() => {
    if (disableSearch || !searchInput.trim()) return options;
    const q = searchInput.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, searchInput, disableSearch]);

  const selectedOption = options.find((o) => o.value === value) ?? null;
  const isActive = Boolean(value);

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => {
        setOpen(false);
        setSearchInput("");
      }}
      value={selectedOption}
      onChange={(_, newValue) => onChange(newValue?.value ?? "")}
      inputValue={disableSearch ? "" : searchInput}
      onInputChange={
        disableSearch ? undefined : (_, v) => setSearchInput(v)
      }
      options={filteredOptions}
      getOptionLabel={(option: SmartSelectOption) => option.label}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      noOptionsText="Aucun résultat"
      disableClearable={!clearable}
      size="small"
      sx={{
        minWidth,
        maxWidth,
        flex: "0 0 auto",
        "& .MuiOutlinedInput-root": {
          borderRadius: 1.5,
          backgroundColor: "background.default",
          paddingLeft: "8px",
          "& fieldset": {
            borderColor: isActive ? "primary.main" : "divider",
            borderWidth: isActive ? "1.5px" : "1px",
          },
          "&:hover fieldset": { borderColor: "primary.main" },
          "&.Mui-focused fieldset": {
            borderColor: "primary.main",
            borderWidth: "1.5px",
          },
          "& .MuiAutocomplete-input": {
            fontSize: 13,
            padding: "6.5px 4px !important",
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <InputAdornment
                  position="start"
                  sx={{ mr: 0.5, minWidth: 20, justifyContent: "center" }}
                >
                  <Icon
                    sx={{
                      fontSize: 16,
                      color: isActive ? "primary.main" : iconColor,
                    }}
                  />
                </InputAdornment>
                {params.InputProps.startAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option: SmartSelectOption) => {
        const OptionIcon = option.icon;
        const isSelected = option.value === value;
        return (
          <Box
            component="li"
            {...props}
            sx={{
              display: "flex !important",
              alignItems: "center",
              gap: 1.25,
              px: 1.5,
              py: 0.75,
              fontSize: 13,
              fontWeight: isSelected ? 700 : 500,
              color: isSelected ? "primary.main" : "text.primary",
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            {OptionIcon && (
              <OptionIcon
                sx={{
                  fontSize: 16,
                  color: isSelected ? "primary.main" : "text.secondary",
                  flexShrink: 0,
                }}
              />
            )}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{ fontSize: 13, fontWeight: "inherit", color: "inherit" }}
                noWrap
              >
                {option.label}
              </Typography>
              {option.description && (
                <Typography
                  sx={{ fontSize: 10.5, color: "text.secondary" }}
                  noWrap
                >
                  {option.description}
                </Typography>
              )}
            </Box>
            {isSelected && (
              <CheckIcon sx={{ fontSize: 16, color: "primary.main", flexShrink: 0 }} />
            )}
          </Box>
        );
      }}
    />
  );
};