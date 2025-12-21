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
import { PeopleStep } from "@/components/payment/split/PeopleStep";
import { EqualConfirmationStep } from "../EqualConfirmationStep";
import { AddPersonDialog } from "@/components/payment/split/BillSplitter/AddPersonDialog";
import { EqualPaymentStepper } from "./EqualPaymentStepper";

interface EqualPaymentFlowProps {
  bill: Bill;
}

export const EqualPaymentFlow = ({ bill }: EqualPaymentFlowProps) => {
  const [activeStep, setActiveStep] = useState(0);

  // Custom hooks
  const equalPayment = useEqualPayment(bill);
  const personDialog = usePersonDialog();

  // Steps configuration
  const steps = [
    { label: "Configurar personas" },
    { label: "Enviar pagos" },
  ];

  /**
   * Handle adding a person
   */
  const handleAddPerson = () => {
    const { name, email } = personDialog.submit();
    equalPayment.addPerson(name, email);
  };

  return (
    <Box>
      {/* Stepper navigation */}
      <EqualPaymentStepper activeStep={activeStep} steps={steps} />

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
              window.location.href = "/payment/split/confirmation";
            }}
          />
        )}

        {/* Dialog: Add person */}
        <AddPersonDialog
          open={personDialog.open}
          name={personDialog.name}
          email={personDialog.email}
          canSubmit={personDialog.canSubmit}
          onNameChange={personDialog.setName}
          onEmailChange={personDialog.setEmail}
          onClose={personDialog.closeDialog}
          onSubmit={handleAddPerson}
        />
      </Box>
    </Box>
  );
};
