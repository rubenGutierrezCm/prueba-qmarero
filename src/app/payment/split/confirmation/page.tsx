"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { CenteredMessagePage } from "@/components/Shared";
import { useTranslation } from 'react-i18next';

export default function ConfirmationPage() {
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
      title={t('success.emailsSent')}
      description={t('success.emailsSentDescription')}
    />
  );
}
