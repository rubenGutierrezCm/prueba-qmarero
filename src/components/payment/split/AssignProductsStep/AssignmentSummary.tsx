/**
 * AssignmentSummary - Shows the total assigned vs total bill
 * Displays warning if amounts don't match
 */
"use client";

import { Box, Typography, Paper, Alert } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import { useTranslation } from 'react-i18next';

/**
 * Props for the AssignmentSummary component
 */
interface AssignmentSummaryProps {
  /** Total amount assigned to people */
  totalAssigned: number;
  /** Total bill amount */
  totalBill: number;
  /** Currency code */
  currency: string;
}

export const AssignmentSummary = ({
  totalAssigned,
  totalBill,
  currency,
}: AssignmentSummaryProps) => {
  const { t } = useTranslation();
  const remaining = totalBill - totalAssigned;
  const isComplete = Math.abs(remaining) < 0.01; // Allow for floating point errors

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="body1">{t('bill.totalBill')}:</Typography>
        <Typography variant="body1" fontWeight="bold">
          {totalBill.toFixed(2)} {currency}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="body1">{t('bill.totalAssigned')}:</Typography>
        <Typography
          variant="body1"
          fontWeight="bold"
          color={isComplete ? "success.main" : "warning.main"}
        >
          {totalAssigned.toFixed(2)} {currency}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body1">{t('bill.remaining')}:</Typography>
        <Typography
          variant="body1"
          fontWeight="bold"
          color={isComplete ? "success.main" : "error.main"}
        >
          {remaining.toFixed(2)} {currency}
        </Typography>
      </Box>

      {!isComplete && (
        <Alert severity="warning" icon={<WarningIcon />} sx={{ mt: 2 }}>
          {t('products.mustAssignAll')}
        </Alert>
      )}
    </Paper>
  );
};
