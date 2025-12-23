/**
 * LoadingButton - Reusable button with loading state
 * Shows a circular progress indicator and custom text when loading
 */
"use client";

import { Button, CircularProgress, ButtonProps } from "@mui/material";
import { ReactNode } from "react";

/**
 * Props for the LoadingButton component
 */
interface LoadingButtonProps extends Omit<ButtonProps, 'children'> {
  /** Whether the button is in loading state */
  loading: boolean;
  /** Text to display when loading */
  loadingText?: string;
  /** Button content when not loading */
  children: ReactNode;
}

export const LoadingButton = ({
  loading,
  loadingText = "Loading...",
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
