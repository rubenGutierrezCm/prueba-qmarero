/**
 * Split bill page - Custom split payment flow
 * Allows each person to pay for their specific items
 */
"use client";

import { MOCK_BILL } from "@/lib/mockBill";
import { BillSplitter } from "@/components/payment/split";
import { PaymentMethodHeader } from "@/components/Shared";

export default function SplitBillPage() {

  return (
    <PaymentMethodHeader title="Dividir Cuenta">
      <BillSplitter bill={MOCK_BILL} />
    </PaymentMethodHeader>
  )
}
