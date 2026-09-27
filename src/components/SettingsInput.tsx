import { TextField, type TextFieldProps } from "@mui/material";

type SettingsInputProps = TextFieldProps & {
  value: string | number | null | undefined;
  onValueChange: (value: string) => void;
};

export const SettingsInput = ({ value, onValueChange, onChange, ...props }: SettingsInputProps) => (
  <TextField
    {...props}
    value={value ?? ""}
    onChange={(event) => {
      onValueChange(event.target.value);
      onChange?.(event);
    }}
  />
);
