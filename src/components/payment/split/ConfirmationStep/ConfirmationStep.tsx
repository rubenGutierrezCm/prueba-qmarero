/**
 * ConfirmationStep - Final step of bill splitting wizard
 * Saves data to IndexedDB and sends payment emails to all people
 */
"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import { PaymentPersonList, ConfirmationActions, StatusAlert } from "@/components/ui";
import { PersonSplit, Bill } from "@/types/bill";
import { processMultiplePayments, PaymentProduct } from "@/lib/paymentService";
import { WarningBox } from "@/components/Shared";
import { useTranslation } from 'react-i18next';

/**
 * Props for the ConfirmationStep component
 */
interface ConfirmationStepProps {
  /** List of people with their assigned items */
  people: PersonSplit[];
  /** Total bill amount */
  totalBill: number;
  /** Currency code */
  currency: string;
  /** Complete bill data */
  bill: Bill;
  /** Unique session identifier */
  sessionId: string;
  /** Function to calculate total for a person */
  calculatePersonTotal: (person: PersonSplit) => number;
  /** Callback to go back */
  onBack: () => void;
  /** Callback to proceed after success */
  onProceed: () => void;
}

export const ConfirmationStep = ({
  people,
  totalBill,
  currency,
  bill,
  sessionId,
  calculatePersonTotal,
  onBack,
  onProceed,
}: ConfirmationStepProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleConfirmAndSendEmails = async () => {
    setLoading(true);
    setError(null);

    try {
      // Process payments using reusable service
      await processMultiplePayments({
        sessionId,
        bill,
        people,
        getPersonAmount: (person) => calculatePersonTotal(person),
        getPersonProducts: (person): PaymentProduct[] => {
          return person.items.map(item => {
            const billItem = bill.items.find(bi => bi.id === item.itemId);
            return {
              itemId: item.itemId,
              itemName: billItem?.name || "Unknown product",
              quantity: item.quantity,
              unitPrice: billItem?.unitPrice || 0,
            };
          });
        },
      });

      setSuccess(true);
      setTimeout(() => {
        onProceed();
      }, 2000);

    } catch (err) {
      console.error("Error:", err);
      setError(t('payment.errorProcessing'));
      setLoading(false);
    }
  };

  return (
    <Box>
        <WarningBox>
          {t('payment.reviewInfoMultiple')}
        </WarningBox>
        <Paper
          variant="outlined"
          sx={{ p: { xs: 2, sm: 3 }, mb: 3, bgcolor: "background.default" }}
        >
          <PaymentPersonList
            people={people}
            getAmount={(person) => calculatePersonTotal(person)}
            currency={currency}
            titleKey="payment.splitSummary"
          />

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-between" px={{ xs: 1, sm: 2 }} flexWrap="wrap" gap={1}>
            <Typography variant="h6">{t('common.total')}:</Typography>
            <Typography variant="h6" color="primary">
              {totalBill.toFixed(2)} {currency}
            </Typography>
          </Box>
        </Paper>

        <StatusAlert
          error={error}
          success={success}
          successMessage={t('payment.emailsSentSuccess')}
        />

        <ConfirmationActions
          onBack={onBack}
          onConfirm={handleConfirmAndSendEmails}
          loading={loading}
          success={success}
        />
    </Box>
  );
};
