"use client";

import {
  Container,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { EqualPaymentFlow } from "@/components/payment/equal";
import { Bill } from "@/types/bill";

// Hardcoded bill data
const MOCK_BILL: Bill = {
  table: {
    id: "MESA-18",
    name: "Terraza Norte",
    server: "Lucía",
  },
  currency: "EUR",
  items: [
    {
      id: "I1",
      name: "Entrante - Pan con tomate",
      qty: 2,
      unitPrice: 4.0,
      notes: "Compartido para la mesa",
    },
  ],
};

export default function EqualPaymentPage() {
  const totalBill = MOCK_BILL.items.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box>
          <Typography variant="h4" align="center" gutterBottom>
            Dividir Cuenta a Partes Iguales
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {MOCK_BILL.table.name} • Mesa {MOCK_BILL.table.id}
          </Typography>
          <Box display="flex" alignItems="center" gap="10px">
            <Typography variant="body2" color="text.secondary">
              Total cuenta:
            </Typography>
            <Typography fontWeight="bold">
              {totalBill.toFixed(2)} {MOCK_BILL.currency}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <EqualPaymentFlow bill={MOCK_BILL} />
    </Container>
  );
}
