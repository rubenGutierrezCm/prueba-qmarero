/**
 * QuickAssignDialog - Dialog for quickly assigning product quantities to multiple people
 * Allows editing existing assignments and validates against available quantities
 * Uses react-hook-form with Zod validation for form management
 */
"use client";

import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { Bill, PersonSplit } from "@/types/bill";
import { TextField } from "@/components/Shared";

interface QuickAssignDialogProps {
  open: boolean;
  bill: Bill;
  people: PersonSplit[];
  quickAssignItemId: string;
  quickAssignQuantities: Record<string, number | string>;
  getItemAssignedQty: (itemId: string) => number;
  onClose: () => void;
  onAssign: (quantities: Record<string, number | string>) => void;
}

export const QuickAssignDialog = ({
  open,
  bill,
  people,
  quickAssignItemId,
  quickAssignQuantities,
  getItemAssignedQty,
  onClose,
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

  // Create dynamic Zod schema based on availableQty
  const quantityValidationSchema = useMemo(() => {
    const schemaFields: Record<string, z.ZodType> = {};
    
    people.forEach((person) => {
      schemaFields[person.id] = z
        .union([z.string(), z.number()])
        .transform((val) => {
          if (val === '' || val === undefined) return 0;
          return typeof val === 'number' ? val : parseInt(String(val)) || 0;
        })
        .refine((val) => val >= 0, {
          message: "No puede ser negativo",
        })
        .refine((val) => val <= availableQty, {
          message: "Excede disponibles",
        });
    });
    
    return z.object(schemaFields);
  }, [people, availableQty]);

  type FormValues = z.infer<typeof quantityValidationSchema>;

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(quantityValidationSchema),
    defaultValues: quickAssignQuantities as FormValues,
  });

  // Update form when quantities change externally
  useEffect(() => {
    if (open) {
      reset(quickAssignQuantities);
    }
  }, [open, quickAssignQuantities, reset]);
  
  // Use useWatch instead of watch() to avoid React Compiler warning
  // This allows proper memoization of the component
  const formValues = useWatch({ control });
  const totalToAssign = useMemo(() => {
    return Object.values(formValues).reduce(
      (sum: number, qty) => {
        if (qty === '' || qty === undefined) return sum;
        return sum + (typeof qty === 'number' ? qty : parseInt(String(qty)) || 0);
      },
      0
    );
  }, [formValues]);
  
  const exceedsAvailable = (totalToAssign as number) > availableQty;

  const handleFormSubmit = (data: FormValues) => {
    onAssign(data as Record<string, number | string>);
  };

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
              name={person.id as keyof FormValues}
              control={control}
              errors={{}}
              type="number"
              size="medium"
              label="Cantidad"
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
          onClick={handleSubmit(handleFormSubmit)}
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
