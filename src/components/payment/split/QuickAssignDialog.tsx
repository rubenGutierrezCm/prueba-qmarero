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
  quickAssignQuantities: Record<string, number>;
  getItemAssignedQty: (itemId: string) => number;
  onClose: () => void;
  onQuantityChange: (personId: string, value: number) => void;
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
  const totalToAssign = Object.values(quickAssignQuantities).reduce(
    (sum, qty) => sum + qty,
    0
  );

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
            <Typography variant="caption" color="text.secondary">
              {bill.items.find((i) => i.id === quickAssignItemId)?.qty}{" "}
              unidades - {getItemAssignedQty(quickAssignItemId)} asignadas -{" "}
              {(bill.items.find((i) => i.id === quickAssignItemId)?.qty || 0) -
                getItemAssignedQty(quickAssignItemId)}{" "}
              disponibles
            </Typography>
          </Box>
        )}
      </DialogTitle>
      <DialogContent sx={{ pb: { xs: 10, sm: 2 } }}>
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
              size="small"
              label="Cantidad"
              value={quickAssignQuantities[person.id] || 0}
              onChange={(e) =>
                onQuantityChange(person.id, Number(e.target.value))
              }
              inputProps={{ min: 0 }}
              sx={{ width: { xs: 80, sm: 100 } }}
            />
          </Box>
        ))}
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2">Total a asignar:</Typography>
          <Typography variant="body2" fontWeight="bold">
            {totalToAssign} unidades
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        p: 2, 
        gap: 1,
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        <Button onClick={onClose} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          Cancelar
        </Button>
        <Button
          onClick={onAssign}
          variant="contained"
          disabled={totalToAssign === 0}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Asignar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
