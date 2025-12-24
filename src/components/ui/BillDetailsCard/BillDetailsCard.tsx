/**
 * BillDetailsCard - Reusable component to display bill details
 * Shows table info, items list, and total amount in a consistent format
 */
"use client";

import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { Bill } from "@/types/bill";
import { useTranslation } from 'react-i18next';

/**
 * Props for the BillDetailsCard component
 */
interface BillDetailsCardProps {
  /** Bill data to display */
  bill: Bill;
  /** Total bill amount */
  totalAmount: number;
}

export const BillDetailsCard = ({
  bill,
  totalAmount,
}: BillDetailsCardProps) => {
  const { t } = useTranslation();

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <ReceiptIcon color="primary" />
        <Typography variant="h6">
          {t('bill.details')}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {t('bill.table')}: {bill.table.name} ({bill.table.id})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('bill.servedBy')}: {bill.table.server}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Items table */}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('products.product')}</TableCell>
            <TableCell align="center">{t('products.quantity')}</TableCell>
            <TableCell align="right">{t('products.unitPrice')}</TableCell>
            <TableCell align="right">{t('products.subtotal')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bill.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Typography variant="body2">{item.name}</Typography>
              </TableCell>
              <TableCell align="center">{item.qty}</TableCell>
              <TableCell align="right">
                {item.unitPrice.toFixed(2)} {bill.currency}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                {(item.qty * item.unitPrice).toFixed(2)} {bill.currency}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Divider sx={{ my: 2 }} />

      {/* Total */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">{t('bill.totalBill')}:</Typography>
        <Typography variant="h5" color="primary" fontWeight="bold">
          {totalAmount.toFixed(2)} {bill.currency}
        </Typography>
      </Box>
    </Paper>
  );
};
