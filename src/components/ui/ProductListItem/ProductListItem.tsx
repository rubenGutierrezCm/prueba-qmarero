/**
 * ProductListItem - Reusable component to display a product/bill item
 * Shows product name, quantity, price, and assignment status
 */
"use client";

import { Box, ListItem, ListItemText, Typography, Chip } from "@mui/material";

/**
 * Props for the ProductListItem component
 */
interface ProductListItemProps {
  /** Product name */
  name: string;
  /** Total quantity ordered */
  quantity: number;
  /** Price per unit */
  unitPrice: number;
  /** Currency code (e.g., EUR, USD) */
  currency: string;
  /** Optional notes about the product */
  notes?: string;
  /** How many units have been assigned to people */
  assignedQty?: number;
  /** Callback when the item is clicked */
  onClick?: () => void;
}

export const ProductListItem = ({
  name,
  quantity,
  unitPrice,
  currency,
  notes,
  assignedQty,
  onClick,
}: ProductListItemProps) => {
  const totalPrice = quantity * unitPrice;
  const remainingQty = assignedQty !== undefined ? quantity - assignedQty : undefined;
  const isFullyAssigned = remainingQty === 0;

  return (
    <ListItem
      sx={{
        mb: 1,
        bgcolor: isFullyAssigned ? "success.light" : "background.paper",
        borderRadius: 1,
        border: 1,
        borderColor: "divider",
        cursor: onClick ? "pointer" : "default",
        flexDirection: "column",
        alignItems: "stretch",
        p: { xs: 1.5, sm: 2 },
        "&:hover": {
          bgcolor: onClick ? (isFullyAssigned ? "success.light" : "action.hover") : undefined,
        },
      }}
      onClick={onClick}
    >
      <ListItemText
        primary={
          <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={1}>
            <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              {name}
            </Typography>
            <Typography variant="body1" fontWeight="bold" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              {totalPrice.toFixed(2)} {currency}
            </Typography>
          </Box>
        }
        secondary={
          <>
            {quantity} x {unitPrice.toFixed(2)} {currency}
            {notes && (
              <>
                <br />
                <Typography variant="caption" component="span" color="text.secondary">
                  {notes}
                </Typography>
              </>
            )}
          </>
        }
        secondaryTypographyProps={{ component: "div" }}
      />
      {assignedQty !== undefined && (
        <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
          <Chip
            size="small"
            label={`${assignedQty}/${quantity} assigned`}
            color={isFullyAssigned ? "success" : "default"}
          />
        </Box>
      )}
    </ListItem>
  );
};
