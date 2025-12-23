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
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .refine((val) => val.trim().length >= 2, {
      message: "Name cannot be empty",
    }),
  email: z
    .string()
    .min(1, "Email is required")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"),
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
      message: "Cannot be negative",
    })
    .refine((val) => val <= max, {
      message: "Exceeds available",
    });

/**
 * Type inference for person schema
 */
export type PersonFormData = z.infer<typeof personSchema>;
