/**
 * useQuickAssignDialog - Custom hook to manage product assignment dialog
 * Simplified version for react-hook-form integration
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

  return {
    open,
    itemId,
    quantities,
    openDialog,
    closeDialog,
  };
};
