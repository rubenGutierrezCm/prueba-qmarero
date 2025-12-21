/**
 * PersonSummaryCard - Shows a person's assigned products and total
 * Used in the assign products step
 */
"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import { PersonSplit, Bill } from "@/types/bill";

interface PersonSummaryCardProps {
  person: PersonSplit;
  bill: Bill;
  total: number;
  onRemoveItem: (itemId: string) => void;
}

export const PersonSummaryCard = ({
  person,
  bill,
  total,
  onRemoveItem,
}: PersonSummaryCardProps) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        {/* Header with person name and total */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
          flexWrap="wrap"
          gap={1}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <PersonIcon color="primary" />
            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              {person.name}
            </Typography>
          </Box>
          <Typography variant="h6" color="primary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            {total.toFixed(2)} {bill.currency}
          </Typography>
        </Box>

        {/* List of assigned items */}
        {person.items.length > 0 ? (
          <List dense>
            {person.items.map((item) => {
              const billItem = bill.items.find((bi) => bi.id === item.itemId);
              if (!billItem) return null;
              
              return (
                <ListItem
                  key={item.itemId}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => onRemoveItem(item.itemId)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                  sx={{ px: 0 }}
                >
                  <ListItemText
                    primary={billItem.name}
                    secondary={`${item.quantity} x ${billItem.unitPrice.toFixed(2)} ${bill.currency} = ${(
                      item.quantity * billItem.unitPrice
                    ).toFixed(2)} ${bill.currency}`}
                    primaryTypographyProps={{
                      sx: { fontSize: { xs: '0.875rem', sm: '1rem' } }
                    }}
                    secondaryTypographyProps={{
                      sx: { fontSize: { xs: '0.75rem', sm: '0.875rem' } }
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Sin productos asignados
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
