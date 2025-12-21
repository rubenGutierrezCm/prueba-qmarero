/**
 * useQuickAssignDialog - Custom hook to manage product assignment dialog
 * Handles quantities state and dialog open/close
 */
"use client";

import { useState } from "react";

export const useQuickAssignDialog = () => {
  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number | string>>({});

  /**
   * Open dialog for specific item with pre-loaded quantities
   */
  const openDialog = (
    newItemId: string,
    existingQuantities: Record<string, number | string>
  ) => {
    setItemId(newItemId);
    setQuantities(existingQuantities);
    setOpen(true);
  };

  /**
   * Close dialog and reset state
   */
  const closeDialog = () => {
    setOpen(false);
    setItemId("");
    setQuantities({});
  };

  /**
   * Update quantity for a specific person
   */
  const updateQuantity = (personId: string, value: number | string) => {
    setQuantities((prev) => ({
      ...prev,
      [personId]: value === '' ? '' : Math.max(0, Number(value)),
    }));
  };

  /**
   * Submit the dialog and return quantities
   */
  const submit = (): { itemId: string; quantities: Record<string, number | string> } => {
    const result = { itemId, quantities };
    closeDialog();
    return result;
  };

  return {
    open,
    itemId,
    quantities,
    openDialog,
    closeDialog,
    updateQuantity,
    submit,
  };
};
