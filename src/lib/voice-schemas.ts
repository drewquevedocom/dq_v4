import { z } from "zod";

export const calendarAvailabilitySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date format YYYY-MM-DD"),
  timezone: z.string().min(1),
  duration_minutes: z.number().int().min(15).max(120).optional().default(30),
});

export const sendBookingLinkSchema = z.object({
  name: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().min(6),
  use_case: z.string().optional(),
  budget_range: z.string().optional(),
  timeline: z.string().optional(),
  call_control_id: z.string().optional(),
});

export type CalendarAvailabilityInput = z.infer<typeof calendarAvailabilitySchema>;
export type SendBookingLinkInput = z.infer<typeof sendBookingLinkSchema>;
