/**
 * PeopleSummaryPanel - Displays summary of people and their assigned products
 */
"use client";

import { Box, Typography } from "@mui/material";
import { Bill, PersonSplit } from "@/types/bill";
import { PersonSummaryCard } from "./PersonSummaryCard";
import { AssignmentSummary } from "./AssignmentSummary";
import { useTranslation } from 'react-i18next';

/**
 * Props for the PeopleSummaryPanel component
 */
interface PeopleSummaryPanelProps {
  /** List of people sharing the bill */
  people: PersonSplit[];
  /** Bill data */
  bill: Bill;
  /** Total amount assigned */
  totalAssigned: number;
  /** Total bill amount */
  totalBill: number;
  /** Function to calculate total for a person */
  calculatePersonTotal: (person: PersonSplit) => number;
  /** Callback to remove item from person */
  onRemoveItemFromPerson: (personId: string, itemId: string) => void;
}

export const PeopleSummaryPanel = ({
  people,
  bill,
  totalAssigned,
  totalBill,
  calculatePersonTotal,
  onRemoveItemFromPerson,
}: PeopleSummaryPanelProps) => {
  const { t } = useTranslation();

  return (
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
  );
};
