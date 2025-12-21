/**
 * TextField - TextField wrapper with built-in Controller
 * Simplifies form field creation with react-hook-form
 */
"use client";

import { Control, Controller, FieldValues, Path, FieldErrors } from "react-hook-form";
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from "@mui/material";

interface TextFieldProps<T extends FieldValues> extends Omit<MuiTextFieldProps, 'name' | 'error' | 'helperText'> {
  name: Path<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export const TextField = <T extends FieldValues>({
  name,
  control,
  errors,
  ...textFieldProps
}: TextFieldProps<T>) => {
  const error = errors[name];
  const errorMessage = error?.message as string | undefined;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <MuiTextField
          {...field}
          {...textFieldProps}
          error={!!error}
          helperText={errorMessage}
        />
      )}
    />
  );
};
