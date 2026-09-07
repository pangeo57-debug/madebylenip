import { z } from "zod";

export const SIZES = ["S", "M", "L", "XL", "XXL"] as const;

export const DESIGNS = [
  "Sunset Burst",
  "Grape Stripe",
  "Lemon Grid",
  "Flame Fade",
  "Custom / not sure yet",
] as const;

export const preorderSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.email("Enter a valid email").max(120),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[0-9+()\-.\s]*$/, "Phone can only contain numbers and + - ( ) .")
    .optional()
    .or(z.literal("")),
  design: z.enum(DESIGNS),
  size: z.enum(SIZES),
  quantity: z.coerce.number().int().min(1).max(10),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  consent: z.literal(true, {
    error: "We need your OK to contact you about this preorder",
  }),
  // Honeypot: hidden from real users, so any value here marks a bot.
  // Deliberately not constrained (e.g. max length 0) so it always parses
  // successfully — the route handler checks it after parsing and returns a
  // fake success, rather than a validation error that would tip bots off.
  company: z.string().max(200).optional().or(z.literal("")),
});

export type PreorderInput = z.infer<typeof preorderSchema>;
