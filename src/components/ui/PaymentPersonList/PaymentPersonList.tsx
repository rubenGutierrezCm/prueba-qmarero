/**
 * PaymentPersonList - Reusable component to display a list of people with payment information
 * Shows person name, email, and amount to pay in a consistent format
 */
"use client";

import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useTranslation } from 'react-i18next';

/**
 * Person data for the payment list
 */
export interface PaymentPerson {
  /** Unique identifier */
  id: string;
  /** Person's name */
  name: string;
  /** Person's email */
  email: string;
}

/**
 * Props for the PaymentPersonList component
 */
interface PaymentPersonListProps<T extends PaymentPerson = PaymentPerson> {
  /** List of people */
  people: T[];
  /** Function to get the payment amount for each person */
  getAmount: (person: T) => number;
  /** Currency code */
  currency: string;
  /** Translation key for the title (e.g., 'payment.peopleWillReceive') */
  titleKey: string;
}

export const PaymentPersonList = <T extends PaymentPerson = PaymentPerson>({
  people,
  getAmount,
  currency,
  titleKey,
}: PaymentPersonListProps<T>) => {
  const { t } = useTranslation();

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {t(titleKey)}
      </Typography>
      
      <List>
        {people.map((person) => {
          const amount = getAmount(person);
          return (
            <ListItem key={person.id}>
              <PersonIcon color="primary" sx={{ mr: 2 }} />
              <ListItemText
                primary={person.name}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.secondary" display="block">
                      {person.email}
                    </Typography>
                    <Typography component="span" variant="body2" display="block" fontWeight="medium">
                      {t('equal.amountToPay')}: {amount.toFixed(2)} {currency}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};
