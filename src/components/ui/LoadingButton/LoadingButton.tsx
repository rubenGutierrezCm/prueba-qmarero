/**
 * LoadingButton - Reusable button with loading state
 * Shows a circular progress indicator and custom text when loading
 */
"use client";

import { Button, CircularProgress, ButtonProps } from "@mui/material";
import { ReactNode } from "react";

interface LoadingButtonProps extends Omit<ButtonProps, 'children'> {
  loading: boolean;
  loadingText?: string;
  children: ReactNode;
}

export const LoadingButton = ({
  loading,
  loadingText = "Cargando...",
  children,
  variant = "contained",
  disabled,
  ...buttonProps
}: LoadingButtonProps) => {
  return (
    <Button
      {...buttonProps}
      variant={variant}
      disabled={loading || disabled}
    >
      {loading ? (
        <>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
};
