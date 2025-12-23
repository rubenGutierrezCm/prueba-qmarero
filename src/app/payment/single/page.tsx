"use client";

import { BillSummaryStep } from "@/components/payment/single";
import { PaymentMethodHeader } from "@/components/Shared";
import { useTranslation } from 'react-i18next';

export default function PaySinglePage() {
  const { t } = useTranslation();

  return (
      <PaymentMethodHeader title={t('payment.fullBillPayment')}>
        <BillSummaryStep />
      </PaymentMethodHeader>
    );
}
