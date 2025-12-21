"use client";

import { BillSummaryStep } from "@/components/payment/single";
import { PaymentMethodHeader } from "@/components/Shared";

export default function PaySinglePage() {

  return (
      <PaymentMethodHeader title="Pago Completo de la Cuenta">
        <BillSummaryStep />
      </PaymentMethodHeader>
    );
}
