/**
 * PaymentSummary - Reusable component to display payment summary information
 * Shows total bill, number of people, and amount per person in a consistent format
 */
"use client";

import {
  Box,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import { useTranslation } from 'react-i18next';

/**
 * Props for the PaymentSummary component
 */
interface PaymentSummaryProps {
  /** Translation key for the title (e.g., 'payment.finalSummary') */
  titleKey: string;
  /** Total bill amount */
  totalBill: number;
  /** Number of people */
  peopleCount: number;
  /** Amount per person */
  amountPerPerson: number;
  /** Currency code */
  currency: string;
  /** Optional translation key for people count label (defaults to 'people.totalPeople') */
  peopleCountLabelKey?: string;
  /** Optional translation key for amount per person label (defaults to 'equal.amountPerPerson') */
  amountPerPersonLabelKey?: string;
}

export const PaymentSummary = ({
  titleKey,
  totalBill,
  peopleCount,
  amountPerPerson,
  currency,
  peopleCountLabelKey = 'people.totalPeople',
  amountPerPersonLabelKey = 'equal.amountPerPerson',
}: PaymentSummaryProps) => {
  const { t } = useTranslation();

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {t(titleKey)}
      </Typography>
      
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="body1">{t('bill.totalBill')}:</Typography>
        <Typography variant="body1" fontWeight="bold">
          {totalBill.toFixed(2)} {currency}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="body1">{t(peopleCountLabelKey)}:</Typography>
        <Typography variant="body1" fontWeight="bold">
          {peopleCount}
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6">
          {t(amountPerPersonLabelKey)}:
        </Typography>
        <Typography variant="h6" color="primary" fontWeight="bold">
          {amountPerPerson.toFixed(2)} {currency}
        </Typography>
      </Box>
    </Paper>
  );
};
