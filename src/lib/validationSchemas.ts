/**
 * Validation schemas using Zod for form validation
 * Used with react-hook-form and zodResolver
 */
import { z } from "zod";

/**
 * Schema for person data (name and email)
 * Used in AddPersonDialog and BillSummaryStep
 */
export const personSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .refine((val) => val.trim().length >= 2, {
      message: "El nombre no puede estar vacío",
    }),
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email inválido"),
});

/**
 * Schema for quantity validation
 * Used in QuickAssignDialog for product quantity assignment
 */
export const quantitySchema = (max: number) =>
  z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (val === '' || val === undefined) return 0;
      return typeof val === 'number' ? val : parseInt(String(val)) || 0;
    })
    .refine((val) => val >= 0, {
      message: "No puede ser negativo",
    })
    .refine((val) => val <= max, {
      message: "Excede disponibles",
    });

/**
 * Type inference for person schema
 */
export type PersonFormData = z.infer<typeof personSchema>;
