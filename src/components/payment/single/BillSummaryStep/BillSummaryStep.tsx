/**
 * BillSummaryStep - Shows complete bill summary with items
 * Collects user email and sends payment link directly
 */
"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { processSinglePayment } from "@/lib/paymentService";
import { WarningBox, PersonInfoForm } from "@/components/Shared";
import { getTotalBill, MOCK_BILL } from "@/lib/mockBill";
import { StatusAlert, ConfirmationActions, BillDetailsCard } from "@/components/ui";
import { personSchema, PersonFormData } from "@/lib/validationSchemas";
import { useTranslation } from 'react-i18next';
import {
  Box,
} from "@mui/material";

const CURRENT_BILL = MOCK_BILL;

export const BillSummaryStep = () => {

  const { t } = useTranslation();
  const router = useRouter();

  const totalBill = useMemo(() => getTotalBill(CURRENT_BILL), []);

  const { control, handleSubmit, formState: { errors } } = useForm<PersonFormData>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      name: "",
      email: "",
    },
    mode: "onBlur",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: PersonFormData) => {

    setLoading(true);
    setError(null);

    try {
      // Process payment using reusable service
      await processSinglePayment({
        bill: CURRENT_BILL,
        personName: data.name.trim(),
        personEmail: data.email.trim(),
        totalAmount: totalBill,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/email/sent?method=single");
      }, 2000);

    } catch (err) {
      console.error("Error:", err);
      setError(t('payment.errorProcessing'));
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Warning section */}
      <WarningBox>
        {t('payment.reviewInfo')}
      </WarningBox>

      {/* Bill details */}
      <BillDetailsCard
        bill={CURRENT_BILL}
        totalAmount={totalBill}
      />

      {/* Contact form */}
      <PersonInfoForm
        control={control}
        errors={errors}
        loading={loading}
        success={success}
      />

      {/* Status messages */}
      <StatusAlert
        error={error}
        success={success}
        successMessage={t('payment.emailSentSuccess')}
      />

      {/* Navigation */}
      <ConfirmationActions
        onBack={() => {
          const code = localStorage.getItem('currentTicketCode');
          router.push(code ? `/${code}` : '/');
        }}
        onConfirm={handleSubmit(onSubmit)}
        loading={loading}
        success={success}
      />
    </Box>
  );
};
