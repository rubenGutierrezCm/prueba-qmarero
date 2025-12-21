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

interface AssignProductsStepProps {
  bill: Bill;
  people: PersonSplit[];
  totalBill: number;
  getTotalAssigned: () => number;
  getItemAssignedQty: (itemId: string) => number;
  calculatePersonTotal: (person: PersonSplit) => number;
  onOpenQuickAssign: (itemId: string) => void;
  onRemoveItemFromPerson: (personId: string, itemId: string) => void;
  onBack: () => void;
  onContinue: () => void;
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
  const totalAssigned = getTotalAssigned();

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        *Haz clic en cada producto para asignarlo a las personas
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
            Resumen por persona
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
