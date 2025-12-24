/**
 * BillSplitter - Main component for splitting a restaurant bill among multiple people
 * Manages a multi-step wizard flow: configure people -> assign products -> confirm and send
 */
"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { Bill } from "@/types/bill";
import { useBillSplitter, usePersonDialog, useQuickAssignDialog } from "@/hooks";
import { PeopleStep, PaymentStepper } from "@/components/Shared";
import { AssignProductsStep } from "../AssignProductsStep";
import { ConfirmationStep } from "../ConfirmationStep";
import { QuickAssignDialog } from "../QuickAssignDialog";
import { AddPersonDialog } from "./AddPersonDialog";
import { useTranslation } from 'react-i18next';

/**
 * Props for the BillSplitter component
 */
interface BillSplitterProps {
  /** Bill data to be split */
  bill: Bill;
}

export const BillSplitter = ({ bill }: BillSplitterProps) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);

  // Custom hooks for business logic
  const splitter = useBillSplitter(bill);
  const personDialog = usePersonDialog();
  const assignDialog = useQuickAssignDialog();

  // Steps configuration
  const steps = [
    { label: t('stepper.configurePeople') },
    { label: t('stepper.assignProducts') },
    { label: t('stepper.confirmSplit') },
  ];

  // Check if can proceed to confirmation step
  // Use Math.abs to handle floating point precision issues
  const totalAssigned = splitter.getTotalAssigned();
  const difference = Math.abs(totalAssigned - splitter.totalBill);
  const canProceedToConfirmation = difference < 0.01; // Allow 1 cent tolerance

  /**
   * Handle adding a person
   */
  const handleAddPerson = (name: string, email: string) => {
    splitter.addPerson(name, email);
    personDialog.closeDialog();
  };

  /**
   * Handle opening quick assign dialog for a product
   */
  const handleOpenQuickAssign = (itemId: string) => {
    if (splitter.people.length === 0) {
      alert(t('people.mustAddFirst'));
      return;
    }
    const existingQuantities = splitter.getExistingQuantities(itemId);
    assignDialog.openDialog(itemId, existingQuantities);
  };

  /**
   * Handle submitting product assignment
   */
  const handleQuickAssign = (quantities: Record<string, number | string>) => {
    splitter.assignProducts(assignDialog.itemId, quantities);
    assignDialog.closeDialog();
  };

  return (
    <Box>
      {/* Stepper navigation */}
      <PaymentStepper activeStep={activeStep} steps={steps} />

      <Box sx={{ px: { xs: 1, sm: 2, md: 0 } }}>
        {/* Step 1: Configure people */}
        {activeStep === 0 && (
          <PeopleStep
            people={splitter.people}
            onAddPerson={personDialog.openDialog}
            onRemovePerson={splitter.removePerson}
            onContinue={() => setActiveStep(1)}
          />
        )}

        {/* Step 2: Assign products */}
        {activeStep === 1 && (
          <AssignProductsStep
            bill={bill}
            people={splitter.people}
            totalBill={splitter.totalBill}
            getTotalAssigned={splitter.getTotalAssigned}
            getItemAssignedQty={splitter.getItemAssignedQty}
            calculatePersonTotal={splitter.calculatePersonTotal}
            onOpenQuickAssign={handleOpenQuickAssign}
            onRemoveItemFromPerson={splitter.removeItemFromPerson}
            onBack={() => setActiveStep(0)}
            onContinue={() => setActiveStep(2)}
            canProceed={canProceedToConfirmation}
          />
        )}

        {/* Step 3: Confirmation and send emails */}
        {activeStep === 2 && (
          <ConfirmationStep
            people={splitter.people}
            totalBill={splitter.totalBill}
            currency={bill.currency}
            bill={bill}
            sessionId={splitter.sessionId}
            calculatePersonTotal={splitter.calculatePersonTotal}
            onBack={() => setActiveStep(1)}
            onProceed={() => {
              window.location.href = "/email/sent?method=split";
            }}
          />
        )}

        {/* Dialog: Add person */}
        <AddPersonDialog
          open={personDialog.open}
          onClose={personDialog.closeDialog}
          onSubmit={handleAddPerson}
        />

        {/* Dialog: Quick assign products */}
        <QuickAssignDialog
          open={assignDialog.open}
          bill={bill}
          people={splitter.people}
          quickAssignItemId={assignDialog.itemId}
          quickAssignQuantities={assignDialog.quantities}
          getItemAssignedQty={splitter.getItemAssignedQty}
          onClose={assignDialog.closeDialog}
          onAssign={handleQuickAssign}
        />
      </Box>
    </Box>
  );
};
