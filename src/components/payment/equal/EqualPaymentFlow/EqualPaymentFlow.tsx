/**
 * EqualPaymentFlow - Main component for equal bill splitting
 * Two-step flow: add people -> confirm equal amounts -> send emails
 */
"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { Bill } from "@/types/bill";
import { useEqualPayment } from "@/hooks/useEqualPayment";
import { usePersonDialog } from "@/hooks";
import { PeopleStep, PaymentStepper, AddPersonDialog } from "@/components/Shared";
import { EqualConfirmationStep } from "../EqualConfirmationStep";
import { useTranslation } from 'react-i18next';

/**
 * Props for the EqualPaymentFlow component
 */
interface EqualPaymentFlowProps {
  /** Bill data to be split equally */
  bill: Bill;
}

export const EqualPaymentFlow = ({ bill }: EqualPaymentFlowProps) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);

  // Custom hooks
  const equalPayment = useEqualPayment(bill);
  const personDialog = usePersonDialog();

  // Steps configuration
  const steps = [
    { label: t('stepper.configurePeople') },
    { label: t('stepper.sendPayments') },
  ];

  /**
   * Handle adding a person
   */
  const handleAddPerson = (name: string, email: string) => {
    equalPayment.addPerson(name, email);
    personDialog.closeDialog();
  };

  return (
    <Box>
      {/* Stepper navigation */}
      <PaymentStepper activeStep={activeStep} steps={steps} />

      <Box sx={{ px: { xs: 1, sm: 2, md: 0 } }}>
        {/* Step 1: Configure people */}
        {activeStep === 0 && (
          <PeopleStep
            people={equalPayment.people}
            onAddPerson={personDialog.openDialog}
            onRemovePerson={equalPayment.removePerson}
            onContinue={() => setActiveStep(1)}
          />
        )}

        {/* Step 2: Send emails and process */}
        {activeStep === 1 && (
          <EqualConfirmationStep
            people={equalPayment.people}
            amountPerPerson={equalPayment.amountPerPerson}
            totalBill={equalPayment.totalBill}
            currency={bill.currency}
            bill={bill}
            sessionId={equalPayment.sessionId}
            onBack={() => setActiveStep(0)}
            onProceed={() => {
              window.location.href = "/email/sent?method=equal";
            }}
          />
        )}

        {/* Dialog: Add person */}
        <AddPersonDialog
          open={personDialog.open}
          onClose={personDialog.closeDialog}
          onSubmit={handleAddPerson}
        />
      </Box>
    </Box>
  );
};
