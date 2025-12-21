"use client";

import { MOCK_BILL } from "@/lib/mockBill";
import { SinglePaymentFlow } from "@/components/payment/single";
import { PaymentMethodHeader } from "@/components/Shared";


export default function PaySinglePage() {

  return (
      <PaymentMethodHeader title="Pago Completo de la Cuenta">
        <SinglePaymentFlow bill={MOCK_BILL} />
      </PaymentMethodHeader>
    );
}
