/**
 * ConfirmationActions - Reusable component for confirmation action buttons
 * Provides consistent back and confirm button layout with loading state
 */
"use client";

import { Box, Button } from "@mui/material";
import { LoadingButton } from "../LoadingButton";
import { useTranslation } from 'react-i18next';

/**
 * Props for the ConfirmationActions component
 */
interface ConfirmationActionsProps {
  /** Callback function when back button is clicked */
  onBack: () => void;
  /** Callback function when confirm button is clicked */
  onConfirm: () => void;
  /** Whether the action is in loading state */
  loading?: boolean;
  /** Whether the action was successful */
  success?: boolean;
}

export const ConfirmationActions = ({
  onBack,
  onConfirm,
  loading = false,
  success = false,
}: ConfirmationActionsProps) => {
  const { t } = useTranslation();

  return (
    <Box display="flex" justifyContent="space-between" gap={2}>
      <Button
        variant="outlined"
        onClick={onBack}
        disabled={loading || success}
        sx={{ flex: 1 }}
      >
        {t('common.back')}
      </Button>
      <LoadingButton
        variant="contained"
        onClick={onConfirm}
        disabled={success}
        loading={loading}
        loadingText={t('common.sending')}
        sx={{ flex: 1 }}
      >
        {t('common.confirm')}
      </LoadingButton>
    </Box>
  );
};
