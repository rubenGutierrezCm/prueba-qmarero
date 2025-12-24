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
  /** Optional custom label for the back button (defaults to 'common.back') */
  backLabel?: string;
  /** Optional custom label for the confirm button (defaults to 'common.confirm') */
  confirmLabel?: string;
  /** Optional custom label for the loading state (defaults to 'common.sending') */
  loadingLabel?: string;
  /** Whether to show the back button */
  showBack?: boolean;
}

export const ConfirmationActions = ({
  onBack,
  onConfirm,
  loading = false,
  success = false,
  backLabel,
  confirmLabel,
  loadingLabel,
  showBack = true,
}: ConfirmationActionsProps) => {
  const { t } = useTranslation();

  return (
    <Box display="flex" justifyContent="space-between" gap={2}>
      {showBack && (
        <Button
          variant="outlined"
          onClick={onBack}
          disabled={loading || success}
          sx={{ flex: 1 }}
        >
          {backLabel || t('common.back')}
        </Button>
      )}
      <LoadingButton
        variant="contained"
        onClick={onConfirm}
        disabled={success}
        loading={loading}
        loadingText={loadingLabel || t('common.sending')}
        sx={{ flex: showBack ? 1 : undefined, width: showBack ? undefined : '100%' }}
      >
        {confirmLabel || t('common.confirm')}
      </LoadingButton>
    </Box>
  );
};
