/**
 * Split bill page - Custom split payment flow
 * Allows each person to pay for their specific items
 */
"use client";

import { MOCK_BILL } from "@/lib/mockBill";
import { BillSplitter } from "@/components/payment/split";
import { PaymentMethodHeader } from "@/components/Shared";
import { useTranslation } from 'react-i18next';

export default function SplitBillPage() {
  const { t } = useTranslation();

  return (
    <PaymentMethodHeader title={t('payment.splitBill')}>
      <BillSplitter bill={MOCK_BILL} />
    </PaymentMethodHeader>
  )
}
