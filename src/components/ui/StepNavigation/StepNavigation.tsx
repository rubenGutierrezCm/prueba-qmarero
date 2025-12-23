/**
 * StepNavigation - Reusable navigation buttons for multi-step forms
 * Provides consistent back/continue button layout
 */
"use client";

import { Box, Button } from "@mui/material";
import { useTranslation } from 'react-i18next';

/**
 * Props for the StepNavigation component
 */
interface StepNavigationProps {
  /** Callback function when back button is clicked */
  onBack: () => void;
  /** Callback function when continue button is clicked */
  onContinue: () => void;
  /** Custom label for the back button */
  backLabel?: string;
  /** Custom label for the continue button */
  continueLabel?: string;
  /** Whether the continue button is disabled */
  continueDisabled?: boolean;
  /** Whether to show the back button */
  showBack?: boolean;
}

export const StepNavigation = ({
  onBack,
  onContinue,
  backLabel,
  continueLabel,
  continueDisabled = false,
  showBack = true,
}: StepNavigationProps) => {
  const { t } = useTranslation();
  
  return (
    <Box display="flex" justifyContent="space-between" gap={2} mt={3}>
      {showBack && (
        <Button variant="outlined" onClick={onBack} sx={{ flex: 1 }}>
          {backLabel || t('common.back')}
        </Button>
      )}
      <Button
        variant="contained"
        onClick={onContinue}
        disabled={continueDisabled}
        sx={{ flex: 1 }}
      >
        {continueLabel || t('common.continue')}
      </Button>
    </Box>
  );
};
