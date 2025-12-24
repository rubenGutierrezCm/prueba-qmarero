/**
 * PersonInfoForm - Reusable form component to collect person information
 * Collects name and email with consistent styling and validation
 */
"use client";

import { Paper, Typography } from "@mui/material";
import { Control, FieldErrors } from "react-hook-form";
import { TextField } from "@/components/Shared";
import { PersonFormData } from "@/lib/validationSchemas";
import { useTranslation } from 'react-i18next';

/**
 * Props for the PersonInfoForm component
 */
interface PersonInfoFormProps {
  /** React Hook Form control */
  control: Control<PersonFormData>;
  /** Form validation errors */
  errors: FieldErrors<PersonFormData>;
  /** Whether the form is in loading state */
  loading?: boolean;
  /** Whether the form submission was successful */
  success?: boolean;
  /** Optional custom title translation key (defaults to 'payment.yourInfo') */
  titleKey?: string;
  /** Optional custom description translation key (defaults to 'payment.sendEmailMessage') */
  descriptionKey?: string;
}

export const PersonInfoForm = ({
  control,
  errors,
  loading = false,
  success = false,
  titleKey = 'payment.yourInfo',
  descriptionKey = 'payment.sendEmailMessage',
}: PersonInfoFormProps) => {
  const { t } = useTranslation();

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {t(titleKey)}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {t(descriptionKey)}
      </Typography>

      <TextField
        name="name"
        control={control}
        errors={errors}
        fullWidth
        label={t('people.fullName')}
        sx={{ mb: 2 }}
        disabled={loading || success}
      />

      <TextField
        name="email"
        control={control}
        errors={errors}
        fullWidth
        label={t('people.email')}
        type="email"
        disabled={loading || success}
      />
    </Paper>
  );
};
