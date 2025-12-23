/**
 * AssignProductsStep - Second step of bill splitting wizard
 * Allows user to assign products to different people
 */
"use client";

import { Box, Typography, List } from "@mui/material";
import { Bill, PersonSplit } from "@/types/bill";
import { ProductListItem } from "@/components/ui";
import { PersonSummaryCard } from "./PersonSummaryCard";
import { AssignmentSummary } from "./AssignmentSummary";
import { StepNavigation } from "@/components/ui";
import { useTranslation } from 'react-i18next';

/**
 * Props for the AssignProductsStep component
 */
interface AssignProductsStepProps {
  /** Bill data with items */
  bill: Bill;
  /** List of people sharing the bill */
  people: PersonSplit[];
  /** Total bill amount */
  totalBill: number;
  /** Function to get total assigned amount */
  getTotalAssigned: () => number;
  /** Function to get quantity assigned for a specific item */
  getItemAssignedQty: (itemId: string) => number;
  /** Function to calculate total for a person */
  calculatePersonTotal: (person: PersonSplit) => number;
  /** Callback to open quick assign dialog */
  onOpenQuickAssign: (itemId: string) => void;
  /** Callback to remove item from person */
  onRemoveItemFromPerson: (personId: string, itemId: string) => void;
  /** Callback to go back */
  onBack: () => void;
  /** Callback to continue */
  onContinue: () => void;
  /** Whether all products are assigned */
  canProceed: boolean;
}

export const AssignProductsStep = ({
  bill,
  people,
  totalBill,
  getTotalAssigned,
  getItemAssignedQty,
  calculatePersonTotal,
  onOpenQuickAssign,
  onRemoveItemFromPerson,
  onBack,
  onContinue,
  canProceed,
}: AssignProductsStepProps) => {
  const { t } = useTranslation();
  const totalAssigned = getTotalAssigned();

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {t('products.clickToAssign')}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 3,
        }}
      >
        {/* Left column: Products list */}
        <Box>
          <List>
            {bill.items.map((item) => {
              const assignedQty = getItemAssignedQty(item.id);
              
              return (
                <ProductListItem
                  key={item.id}
                  name={item.name}
                  quantity={item.qty}
                  unitPrice={item.unitPrice}
                  currency={bill.currency}
                  notes={item.notes}
                  assignedQty={assignedQty}
                  onClick={() => onOpenQuickAssign(item.id)}
                />
              );
            })}
          </List>
        </Box>

        {/* Right column: People summary */}
        <Box>
          <Typography variant="h6" textAlign="center" gutterBottom>
            {t('products.summaryByPerson')}
          </Typography>

          {/* Summary of total assigned */}
          <AssignmentSummary
            totalAssigned={totalAssigned}
            totalBill={totalBill}
            currency={bill.currency}
          />

          {/* List of people with their assigned products */}
          <Box>
            {people.map((person) => (
              <PersonSummaryCard
                key={person.id}
                person={person}
                bill={bill}
                total={calculatePersonTotal(person)}
                onRemoveItem={(itemId) => onRemoveItemFromPerson(person.id, itemId)}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <StepNavigation
        onBack={onBack}
        onContinue={onContinue}
        continueDisabled={!canProceed}
      />
    </Box>
  );
};
