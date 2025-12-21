"use client";

import { MOCK_BILL } from "@/lib/mockBill";
import { EqualPaymentFlow } from "@/components/payment/equal";
import { PaymentMethodHeader } from "@/components/Shared";

export default function EqualPaymentPage() {
  
  return (
    <PaymentMethodHeader title="Partes iguales">
      <EqualPaymentFlow bill={MOCK_BILL} />
    </PaymentMethodHeader>
  );
}
