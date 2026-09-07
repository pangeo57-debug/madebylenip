import { z } from "zod";
import {
  FINISHES,
  GARMENTS,
  GARMENT_COLOR_NAMES,
  MAX_NAME_LENGTH,
  NAME_PATTERN,
  ORIENTATIONS,
  PRINT_COLOR_NAMES,
  PRINT_FONTS,
  SIZES,
} from "./catalog";

export const preorderSchema = z.object({
  // What we're printing
  printName: z
    .string()
    .trim()
    .min(1, "Add the name you want printed")
    .max(MAX_NAME_LENGTH, `Keep it to ${MAX_NAME_LENGTH} characters`)
    .regex(NAME_PATTERN, "Letters, numbers, spaces, apostrophes and hyphens only"),
  garment: z.enum(GARMENTS),
  garmentColor: z.enum(GARMENT_COLOR_NAMES),
  printColor: z.enum(PRINT_COLOR_NAMES),
  finish: z.enum(FINISHES),
  font: z.enum(PRINT_FONTS),
  orientation: z.enum(ORIENTATIONS),
  size: z.enum(SIZES),
  quantity: z.coerce.number().int().min(1).max(20),

  // Who's ordering
  customerName: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.email("Enter a valid email").max(120),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[0-9+()\-.\s]*$/, "Phone can only contain numbers and + - ( ) .")
    .optional()
    .or(z.literal("")),

  // Where it ships
  address1: z.string().trim().min(3, "Enter your street address").max(120),
  address2: z.string().trim().max(120).optional().or(z.literal("")),
  city: z.string().trim().min(2, "Enter your city").max(80),
  region: z.string().trim().min(2, "Enter your state or region").max(80),
  postalCode: z.string().trim().min(3, "Enter your ZIP / postal code").max(16),
  country: z.string().trim().min(2, "Enter your country").max(60),

  notes: z.string().trim().max(500).optional().or(z.literal("")),
  consent: z.literal(true, {
    error: "We need your OK to contact you about this order",
  }),
  // Honeypot: hidden from real users, so any value here marks a bot.
  // Deliberately not constrained (e.g. max length 0) so it always parses
  // successfully — the route handler checks it after parsing and returns a
  // fake success, rather than a validation error that would tip bots off.
  company: z.string().max(200).optional().or(z.literal("")),
});

export type PreorderInput = z.infer<typeof preorderSchema>;
