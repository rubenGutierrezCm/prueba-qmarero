/**
 * AddPersonDialog - Dialog component for adding a new person to the bill split
 * Handles form validation and submission with react-hook-form and Zod
 */
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { personSchema, PersonFormData } from "@/lib/validationSchemas";
import { TextField } from "@/components/Shared";
import { useTranslation } from 'react-i18next';

/**
 * Props for the AddPersonDialog component
 */
interface AddPersonDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when dialog is closed */
  onClose: () => void;
  /** Callback when form is submitted with name and email */
  onSubmit: (name: string, email: string) => void;
}

export const AddPersonDialog = ({
  open,
  onClose,
  onSubmit,
}: AddPersonDialogProps) => {
  const { t } = useTranslation();
  const { control, handleSubmit, formState: { errors }, reset } = useForm<PersonFormData>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      name: "",
      email: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    if (!open) {
      // Reset form completely including validation errors
      reset({
        name: "",
        email: "",
      });
    }
  }, [open, reset]);

  const onSubmitForm = (data: PersonFormData) => {
    onSubmit(data.name.trim(), data.email.trim());
    // Reset form with default values and clear all errors
    reset(
      {
        name: "",
        email: "",
      },
      {
        keepErrors: false,
        keepDirty: false,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
        keepSubmitCount: false,
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(onSubmitForm)();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      key={open ? 'open' : 'closed'}
    >
      <DialogTitle>{t('people.addPerson')}</DialogTitle>
      <DialogContent>
        <TextField
          name="name"
          control={control}
          errors={errors}
          autoFocus
          margin="dense"
          label={t('people.fullName')}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          name="email"
          control={control}
          errors={errors}
          margin="dense"
          label={t('people.email')}
          type="email"
          fullWidth
          onKeyPress={handleKeyPress}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
        <Button
          onClick={onClose}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSubmit(onSubmitForm)}
          variant="contained"
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          {t('common.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
