/**
 * StepNavigation - Reusable navigation buttons for multi-step forms
 * Provides consistent back/continue button layout
 */
"use client";

import { Box, Button } from "@mui/material";

interface StepNavigationProps {
  onBack: () => void;
  onContinue: () => void;
  backLabel?: string;
  continueLabel?: string;
  continueDisabled?: boolean;
  showBack?: boolean;
}

export const StepNavigation = ({
  onBack,
  onContinue,
  backLabel = "Volver",
  continueLabel = "Continuar",
  continueDisabled = false,
  showBack = true,
}: StepNavigationProps) => {
  return (
    <Box display="flex" justifyContent="space-between" mt={3}>
      {showBack && (
        <Button variant="outlined" onClick={onBack}>
          {backLabel}
        </Button>
      )}
      <Button
        variant="contained"
        onClick={onContinue}
        disabled={continueDisabled}
        sx={{ ml: showBack ? 0 : "auto" }}
      >
        {continueLabel}
      </Button>
    </Box>
  );
};
