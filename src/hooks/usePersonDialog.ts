/**
 * usePersonDialog - Custom hook to manage person add/edit dialog state
 * Handles form validation and dialog open/close state
 */
"use client";

import { useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const usePersonDialog = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  /**
   * Check if name is valid (more than 1 character)
   */
  const isNameValid = name.trim().length > 1;

  /**
   * Check if email is valid using regex
   */
  const isEmailValid = email.trim() !== "" && EMAIL_REGEX.test(email.trim());

  /**
   * Check if form can be submitted
   */
  const canSubmit = isNameValid && isEmailValid;

  /**
   * Open the dialog
   */
  const openDialog = () => setOpen(true);

  /**
   * Close the dialog and reset form
   */
  const closeDialog = () => {
    setOpen(false);
    setName("");
    setEmail("");
  };

  /**
   * Submit the form and return the values
   */
  const submit = (): { name: string; email: string } => {
    const values = { name: name.trim(), email: email.trim() };
    closeDialog();
    return values;
  };

  return {
    open,
    name,
    email,
    isNameValid,
    isEmailValid,
    canSubmit,
    setName,
    setEmail,
    openDialog,
    closeDialog,
    submit,
  };
};
