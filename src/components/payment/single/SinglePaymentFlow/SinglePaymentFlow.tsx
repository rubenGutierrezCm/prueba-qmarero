/**
 * SinglePaymentFlow - Main flow for single person payment
 * Shows bill summary, collects email, and sends payment link
 */
"use client";

import { Box } from "@mui/material";
import { Bill } from "@/types/bill";
import { BillSummaryStep } from "../BillSummaryStep/BillSummaryStep";

interface SinglePaymentFlowProps {
  bill: Bill;
}

export const SinglePaymentFlow = ({ bill }: SinglePaymentFlowProps) => {
  const totalBill = bill.items.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  );

  return (
    <Box>
      <BillSummaryStep
        bill={bill}
        totalBill={totalBill}
      />
    </Box>
  );
};
