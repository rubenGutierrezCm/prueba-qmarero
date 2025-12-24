/**
 * EqualConfirmationStep - Final step for equal payment
 * Saves to IndexedDB and sends payment emails to all people
 */
"use client";

import { useState } from "react";
import {
  Box,
} from "@mui/material";
import { StatusAlert, PaymentPersonList, PaymentSummary, ConfirmationActions } from "@/components/ui";
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
      <PaymentSummary
        titleKey="payment.finalSummary"
        totalBill={totalBill}
        peopleCount={people.length}
        amountPerPerson={amountPerPerson}
        currency={currency}
      />

      {/* People list */}
      <PaymentPersonList
        people={people}
        getAmount={() => amountPerPerson}
        currency={currency}
        titleKey="payment.peopleWillReceive"
      />

      {/* Status messages */}
      <StatusAlert
        error={error}
        success={success}
        successMessage={t('payment.emailSentSuccess')}
      />

      {/* Actions */}
      <ConfirmationActions
        onBack={onBack}
        onConfirm={handleConfirmAndSendEmails}
        loading={loading}
        success={success}
      />
    </Box>
  );
};
