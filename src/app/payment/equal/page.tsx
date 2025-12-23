/**
 * Equal payment page - Divide bill equally among all people
 * Each person pays the same amount
 */
"use client";

import { MOCK_BILL } from "@/lib/mockBill";
import { EqualPaymentFlow } from "@/components/payment/equal";
import { PaymentMethodHeader } from "@/components/Shared";
import { useTranslation } from 'react-i18next';

export default function EqualPaymentPage() {
  const { t } = useTranslation();
  
  return (
    <PaymentMethodHeader title={t('payment.equalSplit')}>
      <EqualPaymentFlow bill={MOCK_BILL} />
    </PaymentMethodHeader>
  );
}
