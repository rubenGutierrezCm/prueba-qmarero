/**
 * AssignmentSummary - Shows the total assigned vs total bill
 * Displays warning if amounts don't match
 */
"use client";

import { Box, Typography, Paper, Alert } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

interface AssignmentSummaryProps {
  totalAssigned: number;
  totalBill: number;
  currency: string;
}

export const AssignmentSummary = ({
  totalAssigned,
  totalBill,
  currency,
}: AssignmentSummaryProps) => {
  const remaining = totalBill - totalAssigned;
  const isComplete = Math.abs(remaining) < 0.01; // Allow for floating point errors

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="body1">Total cuenta:</Typography>
        <Typography variant="body1" fontWeight="bold">
          {totalBill.toFixed(2)} {currency}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="body1">Total asignado:</Typography>
        <Typography
          variant="body1"
          fontWeight="bold"
          color={isComplete ? "success.main" : "warning.main"}
        >
          {totalAssigned.toFixed(2)} {currency}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body1">Restante:</Typography>
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
          Debes asignar todos los productos antes de continuar
        </Alert>
      )}
    </Paper>
  );
};
