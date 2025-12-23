/**
 * StatusAlert - Reusable alert component for error and success messages
 * Shows conditional alerts with icons
 */
"use client";

import { Alert } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { SxProps, Theme } from "@mui/material/styles";

/**
 * Props for the StatusAlert component
 */
interface StatusAlertProps {
  /** Error message to display */
  error?: string | null;
  /** Whether to show success alert */
  success?: boolean;
  /** Custom success message */
  successMessage?: string;
  /** MUI sx prop for styling */
  sx?: SxProps<Theme>;
}

export const StatusAlert = ({
  error,
  success,
  successMessage = "Operation successful!",
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
