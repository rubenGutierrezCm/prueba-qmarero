/**
 * AmountPerPersonStep - Shows how much each person will pay equally
 * Displays warning about equal split and total per person
 */
"use client";

import PersonIcon from "@mui/icons-material/Person";
import WarningIcon from "@mui/icons-material/Warning";
import { PersonSplit } from "@/types/bill";
import { StepNavigation } from "@/components/ui";
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Alert,
  Card,
  CardContent,
  Divider,
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
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('equal.splitSummaryTitle')}
        </Typography>
        
        <Box sx={{ my: 2 }}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body1">{t('bill.totalBill')}:</Typography>
            <Typography variant="body1" fontWeight="bold">
              {totalBill.toFixed(2)} {currency}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body1">{t('equal.numberOfPeople')}:</Typography>
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
        </Box>
      </Paper>

      {/* List of people with amounts */}
      <Typography variant="h6" gutterBottom>
        {t('equal.peopleWillPay')}
      </Typography>
      
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {people.map((person) => (
          <Card key={person.id} variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <PersonIcon color="primary" />
                <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  {person.name}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {person.email}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">{t('equal.amountToPay')}:</Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {amountPerPerson.toFixed(2)} {currency}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Navigation */}
      <StepNavigation
        onBack={onBack}
        onContinue={onContinue}
        continueLabel={t('equal.sendEmailsAndProcess')}
      />
    </Box>
  );
};
