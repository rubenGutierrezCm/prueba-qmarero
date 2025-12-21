/**
 * QuickAssignDialog - Dialog for quickly assigning product quantities to multiple people
 * Allows editing existing assignments and validates against available quantities
 */
"use client";

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { Bill, PersonSplit } from "@/types/bill";

interface QuickAssignDialogProps {
  open: boolean;
  bill: Bill;
  people: PersonSplit[];
  quickAssignItemId: string;
  quickAssignQuantities: Record<string, number | string>;
  getItemAssignedQty: (itemId: string) => number;
  onClose: () => void;
  onQuantityChange: (personId: string, value: number | string) => void;
  onAssign: () => void;
}

export const QuickAssignDialog = ({
  open,
  bill,
  people,
  quickAssignItemId,
  quickAssignQuantities,
  getItemAssignedQty,
  onClose,
  onQuantityChange,
  onAssign,
}: QuickAssignDialogProps) => {
  const selectedItem = bill.items.find((i) => i.id === quickAssignItemId);
  const totalAssignedToOthers = getItemAssignedQty(quickAssignItemId);
  
  // Calcular cuánto estaba asignado originalmente en este diálogo
  const originallyAssignedInDialog = people.reduce((sum, person) => {
    const personItem = person.items.find((i) => i.itemId === quickAssignItemId);
    return sum + (personItem?.quantity || 0);
  }, 0);
  
  // Las unidades disponibles son: total del item - lo asignado a otros + lo que estaba en este diálogo
  const availableQty = (selectedItem?.qty || 0) - totalAssignedToOthers + originallyAssignedInDialog;
  
  const totalToAssign = Object.values(quickAssignQuantities).reduce(
    (sum: number, qty) => {
      if (qty === '' || qty === undefined) return sum;
      return sum + (typeof qty === 'number' ? qty : 0);
    },
    0
  );
  
  const exceedsAvailable = (totalToAssign as number) > availableQty;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>
        {quickAssignItemId && (
          <Box>
            <Typography variant="h6">Asignar producto</Typography>
            <Typography variant="body2" color="text.secondary">
              {bill.items.find((i) => i.id === quickAssignItemId)?.name}
            </Typography>
          </Box>
        )}
      </DialogTitle>
      <DialogContent sx={{ pb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Asigna las cantidades a cada persona:
        </Typography>
        {people.map((person) => (
          <Box
            key={person.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
              p: 1,
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: 0,
              }}
            >
              <PersonIcon color="primary" />
              <Typography noWrap>{person.name}</Typography>
            </Box>
            <TextField
              type="number"
              size="medium"
              label="Cantidad"
              value={quickAssignQuantities[person.id] ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  onQuantityChange(person.id, '');
                } else {
                  const numValue = Number(value);
                  if (!isNaN(numValue) && numValue >= 0) {
                    onQuantityChange(person.id, numValue);
                  }
                }
              }}
              inputProps={{ min: 0, max: availableQty }}
              sx={{ width: { xs: 100, sm: 120 } }}
            />
          </Box>
        ))}
        <Divider sx={{ my: 2 }} />
        <Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Disponibles:</Typography>
            <Typography variant="body2" fontWeight="bold">
              {availableQty} unidades
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2">Total a asignar:</Typography>
            <Typography 
              variant="body2" 
              fontWeight="bold"
              color={exceedsAvailable ? "error" : "inherit"}
            >
              {totalToAssign} unidades
            </Typography>
          </Box>
          {exceedsAvailable && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
              ⚠️ La cantidad asignada excede las unidades disponibles
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        p: 2, 
        gap: 1,
        justifyContent: "space-between"
      }}>
        <Button onClick={onClose} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          Cancelar
        </Button>
        <Button
          onClick={onAssign}
          variant="contained"
          disabled={totalToAssign === 0 || exceedsAvailable}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Asignar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
