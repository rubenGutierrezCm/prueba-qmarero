"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { CenteredMessagePage } from "@/components/Shared";
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';

export default function EmailSentPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const method = searchParams.get('method') || 'split'; // split, single, equal
  
  // Determinar el mensaje según el método
  const getTitle = () => {
    if (method === 'single') {
      return t('success.emailSent');
    }
    return t('success.emailsSent');
  };
  
  const getDescription = () => {
    if (method === 'single') {
      return t('success.emailSentDescription');
    }
    return t('success.emailsSentDescription');
  };
  
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
      title={getTitle()}
      description={getDescription()}
    />
  );
}
