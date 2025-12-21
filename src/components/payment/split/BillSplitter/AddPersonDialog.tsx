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

interface AddPersonDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, email: string) => void;
}

export const AddPersonDialog = ({
  open,
  onClose,
  onSubmit,
}: AddPersonDialogProps) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<PersonFormData>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      name: "",
      email: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmitForm = (data: PersonFormData) => {
    onSubmit(data.name.trim(), data.email.trim());
    reset();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(onSubmitForm)();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Añadir persona</DialogTitle>
      <DialogContent>
        <TextField
          name="name"
          control={control}
          errors={errors}
          autoFocus
          margin="dense"
          label="Nombre completo"
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          name="email"
          control={control}
          errors={errors}
          margin="dense"
          label="Correo electrónico"
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
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit(onSubmitForm)}
          variant="contained"
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Añadir
        </Button>
      </DialogActions>
    </Dialog>
  );
};
