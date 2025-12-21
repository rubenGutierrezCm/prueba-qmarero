/**
 * AddPersonDialog - Dialog component for adding a new person to the bill split
 * Handles form validation and submission
 */
"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface AddPersonDialogProps {
  open: boolean;
  name: string;
  email: string;
  canSubmit: boolean;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const AddPersonDialog = ({
  open,
  name,
  email,
  canSubmit,
  onNameChange,
  onEmailChange,
  onClose,
  onSubmit,
}: AddPersonDialogProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canSubmit) {
      onSubmit();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Añadir persona</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nombre completo"
          fullWidth
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Correo electrónico"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
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
          onClick={onSubmit}
          variant="contained"
          disabled={!canSubmit}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Añadir
        </Button>
      </DialogActions>
    </Dialog>
  );
};
