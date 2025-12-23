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
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { PersonSplit } from "@/types/bill";
import { Bill } from "@/types/bill";
import { StatusAlert, StepNavigation } from "@/components/ui";
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
          <Typography variant="h6" gutterBottom>
            {t('payment.splitSummary')}
          </Typography>
          <Divider sx={{ my: 2 }} />

          {people.map((person) => {
            const personTotal = calculatePersonTotal(person);
            return (
              <Box
                key={person.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1,
                  px: { xs: 1, sm: 2 },
                  mb: 1,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <PersonIcon color="primary" />
                  <Typography variant="body1" fontWeight="medium">
                    {person.name}
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  {personTotal.toFixed(2)} {currency}
                </Typography>
              </Box>
            );
          })}

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

        <Box
          display="flex"
          gap={2}
          justifyContent="space-between"
        >
          <Button
            variant="outlined"
            onClick={onBack}
            disabled={loading || success}
          >
            {t('common.back')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmAndSendEmails}
            disabled={loading || success}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : success ? (
              `✓ ${t('common.sent')}`
            ) : (
              t('common.confirm')
            )}
          </Button>
        </Box>
    </Box>
  );
};
