/**
 * ControlledTextField - TextField wrapper with built-in Controller
 * Simplifies form field creation with react-hook-form
 */
"use client";

import { Control, Controller, FieldValues, Path, FieldErrors } from "react-hook-form";
import { TextField, TextFieldProps } from "@mui/material";

interface ControlledTextFieldProps<T extends FieldValues> extends Omit<TextFieldProps, 'name' | 'error' | 'helperText'> {
  name: Path<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export const ControlledTextField = <T extends FieldValues>({
  name,
  control,
  errors,
  ...textFieldProps
}: ControlledTextFieldProps<T>) => {
  const error = errors[name];
  const errorMessage = error?.message as string | undefined;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          {...textFieldProps}
          error={!!error}
          helperText={errorMessage}
        />
      )}
    />
  );
};
