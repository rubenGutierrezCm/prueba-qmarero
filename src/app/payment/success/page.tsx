/**
 * Payment success page
 * Displays confirmation message after successful payment
 */
"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { CenteredMessagePage } from "@/components/Shared";
import { useTranslation } from 'react-i18next';

export default function PaymentSuccessPage() {
  const { t } = useTranslation();
  
  return (
    <CenteredMessagePage
      icon={
        <CheckCircleIcon
          sx={{
            fontSize: 80,
            color: "success.main",
          }}
        />
      }
      title={t('success.title')}
      description={t('success.description')}
    />
  );
}
