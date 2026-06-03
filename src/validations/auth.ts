import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const borrowerOtpSchema = z.object({
  phone: z.string().min(10)
});

export const otpVerificationSchema = z.object({
  token: z
    .string()
    .min(6, "Enter the 6-digit OTP")
    .max(6, "Enter the 6-digit OTP")
    .regex(/^\d+$/, "OTP must be numeric")
});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"]
  });
