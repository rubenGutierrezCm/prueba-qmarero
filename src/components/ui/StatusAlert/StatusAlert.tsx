/**
 * StatusAlert - Reusable alert component for error and success messages
 * Shows conditional alerts with icons
 */
"use client";

import { Alert } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { SxProps, Theme } from "@mui/material/styles";

interface StatusAlertProps {
  error?: string | null;
  success?: boolean;
  successMessage?: string;
  sx?: SxProps<Theme>;
}

export const StatusAlert = ({
  error,
  success,
  successMessage = "¡Operación exitosa!",
  sx = { mb: 3 },
}: StatusAlertProps) => {
  if (error) {
    return (
      <Alert severity="error" sx={sx}>
        {error}
      </Alert>
    );
  }

  if (success) {
    return (
      <Alert severity="success" icon={<CheckCircleIcon />} sx={sx}>
        {successMessage}
      </Alert>
    );
  }

  return null;
};
