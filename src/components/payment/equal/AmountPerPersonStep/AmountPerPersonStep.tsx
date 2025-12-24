/**
 * AmountPerPersonStep - Shows how much each person will pay equally
 * Displays warning about equal split and total per person
 */
"use client";

import WarningIcon from "@mui/icons-material/Warning";
import { PaymentPersonList, PaymentSummary, StepNavigation } from "@/components/ui";
import { useTranslation } from 'react-i18next';
import { PersonSplit } from "@/types/bill";
import {
  Box,
  Typography,
  Alert,
} from "@mui/material";

/**
 * Props for the AmountPerPersonStep component
 */
interface AmountPerPersonStepProps {
  /** List of people sharing the bill */
  people: PersonSplit[];
  /** Amount each person will pay */
  amountPerPerson: number;
  /** Currency code */
  currency: string;
  /** Total bill amount */
  totalBill: number;
  /** Callback to go back */
  onBack: () => void;
  /** Callback to continue */
  onContinue: () => void;
}

export const AmountPerPersonStep = ({
  people,
  amountPerPerson,
  currency,
  totalBill,
  onBack,
  onContinue,
}: AmountPerPersonStepProps) => {
  const { t } = useTranslation();
  
  return (
    <Box>
      {/* Warning about equal split */}
      <Alert severity="info" icon={<WarningIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight="bold" gutterBottom>
          {t('equal.title')}
        </Typography>
        <Typography variant="body2">
          {t('equal.description')}
        </Typography>
      </Alert>

      {/* Summary card */}
      <PaymentSummary
        titleKey="equal.splitSummaryTitle"
        totalBill={totalBill}
        peopleCount={people.length}
        amountPerPerson={amountPerPerson}
        currency={currency}
        peopleCountLabelKey="equal.numberOfPeople"
      />

      {/* List of people with amounts */}
      <PaymentPersonList
        people={people}
        getAmount={() => amountPerPerson}
        currency={currency}
        titleKey="equal.peopleWillPay"
      />

      {/* Navigation */}
      <StepNavigation
        onBack={onBack}
        onContinue={onContinue}
        continueLabel={t('equal.sendEmailsAndProcess')}
      />
    </Box>
  );
};
