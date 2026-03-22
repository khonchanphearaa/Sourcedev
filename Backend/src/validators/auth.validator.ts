import { z } from "zod";

export const ResetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format"),

  otp: z
    .coerce
    .string()
    .trim()
    .min(1, "OTP is required")
    .length(4, "OTP must be exactly 4 digits"),

  newPassword: z
    .coerce
    .string()
    .trim()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long")
});