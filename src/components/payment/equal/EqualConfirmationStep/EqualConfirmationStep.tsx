/**
 * EqualConfirmationStep - Final step for equal payment
 * Saves to IndexedDB and sends payment emails to all people
 */
"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { LoadingButton, StatusAlert } from "@/components/ui";
import PersonIcon from "@mui/icons-material/Person";
import { PersonSplit, Bill } from "@/types/bill";
import { processMultiplePayments, PaymentProduct } from "@/lib/paymentService";
import { WarningBox } from "@/components/Shared";
import { useTranslation } from 'react-i18next';

/**
 * Props for the EqualConfirmationStep component
 */
interface EqualConfirmationStepProps {
  /** List of people sharing the bill */
  people: PersonSplit[];
  /** Amount each person will pay */
  amountPerPerson: number;
  /** Total bill amount */
  totalBill: number;
  /** Currency code */
  currency: string;
  /** Complete bill data */
  bill: Bill;
  /** Unique session identifier */
  sessionId: string;
  /** Callback to go back */
  onBack: () => void;
  /** Callback to proceed after success */
  onProceed: () => void;
}

export const EqualConfirmationStep = ({
  people,
  amountPerPerson,
  totalBill,
  currency,
  bill,
  sessionId,
  onBack,
  onProceed,
}: EqualConfirmationStepProps) => {
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
        getPersonAmount: () => amountPerPerson,
        getPersonProducts: (): PaymentProduct[] => [{
          itemId: 'equal-split',
          itemName: `Parte igual de la cuenta (${people.length} personas)`,
          quantity: 1,
          unitPrice: amountPerPerson,
        }],
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
      {/* Warning section */}
      <WarningBox>
        {t('payment.reviewInfoMultiple')}
      </WarningBox>

      {/* Summary */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('payment.finalSummary')}
        </Typography>
        
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body1">{t('bill.totalBill')}:</Typography>
          <Typography variant="body1" fontWeight="bold">
            {totalBill.toFixed(2)} {currency}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body1">{t('people.totalPeople', { count: people.length }).replace('Total: ', '')}:</Typography>
          <Typography variant="body1" fontWeight="bold">
            {people.length}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">
            {t('equal.amountPerPerson')}:
          </Typography>
          <Typography variant="h6" color="primary" fontWeight="bold">
            {amountPerPerson.toFixed(2)} {currency}
          </Typography>
        </Box>
      </Paper>

      {/* People list */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('payment.peopleWillReceive')}
        </Typography>
        
        <List>
          {people.map((person) => (
            <ListItem key={person.id}>
              <PersonIcon color="primary" sx={{ mr: 2 }} />
              <ListItemText
                primary={person.name}
                secondary={`${person.email} • ${amountPerPerson.toFixed(2)} ${currency}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Status messages */}
      <StatusAlert
        error={error}
        success={success}
        successMessage={t('payment.emailSentSuccess')}
      />

      {/* Actions */}
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
          onClick={handleConfirmAndSendEmails}
          disabled={success}
          loading={loading}
          loadingText={t('common.sending')}
          sx={{ flex: 1 }}
        >
          {t('common.confirm')}
        </LoadingButton>
      </Box>
    </Box>
  );
};
