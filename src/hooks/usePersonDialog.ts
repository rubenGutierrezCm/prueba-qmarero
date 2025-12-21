/**
 * usePersonDialog - Custom hook to manage person add/edit dialog state
 * Simplified version for react-hook-form integration
 */
"use client";

import { useState } from "react";

export const usePersonDialog = () => {
  const [open, setOpen] = useState(false);

  /**
   * Open the dialog
   */
  const openDialog = () => setOpen(true);

  /**
   * Close the dialog
   */
  const closeDialog = () => {
    setOpen(false);
  };

  return {
    open,
    openDialog,
    closeDialog,
  };
};
