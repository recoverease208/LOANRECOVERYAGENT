import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { AlertCircle, CheckCircle2, KeyRound, Mail, Phone, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { borrowerOtpSchema, forgotPasswordSchema, loginSchema, resetPasswordSchema } from "@/validations/auth";
import { sendPasswordReset, signInBorrowerWithOtp, signInWithPassword, updatePassword } from "@/services/authService";

type Mode = "admin" | "staff" | "borrower" | "otp" | "forgot" | "reset";
type LoginValues = z.infer<typeof loginSchema>;
type BorrowerValues = z.infer<typeof borrowerOtpSchema>;
type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function AuthPage({ mode }: { mode: Mode }) {
  const navigate = useNavigate();
  const borrowerMode = mode === "borrower" || mode === "otp";
  const loginForm = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
  const borrowerForm = useForm<BorrowerValues>({ resolver: zodResolver(borrowerOtpSchema) });
  const forgotForm = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) });
  const resetForm = useForm<ResetPasswordValues>({ resolver: zodResolver(resetPasswordSchema) });
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const title =
    mode === "staff"
      ? "Staff login"
      : mode === "borrower"
        ? "Borrower OTP login"
        : mode === "forgot"
          ? "Forgot password"
          : mode === "reset"
            ? "Set new password"
            : "Admin login";

  async function submitLogin(values: LoginValues) {
    setErrorMessage("");
    try {
      await signInWithPassword(values.email, values.password);
      navigate("/app");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to sign in. Please try again.");
    }
  }

  async function submitBorrower(values: BorrowerValues) {
    setErrorMessage("");
    try {
      await signInBorrowerWithOtp(values.phone);
      navigate("/otp", { state: { phone: values.phone } });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to request OTP. Please try again.");
    }
  }

  async function submitForgotPassword(values: ForgotPasswordValues) {
    setErrorMessage("");
    setStatusMessage("");
    try {
      const result = await sendPasswordReset(values.email);
      setStatusMessage(
        result.demo
          ? "Demo mode is active, so no email was sent. Add Supabase keys in .env.local to send real reset links."
          : "Password reset instructions have been sent if this email exists."
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to send reset link. Please try again.");
    }
  }

  async function submitResetPassword(values: ResetPasswordValues) {
    setErrorMessage("");
    try {
      await updatePassword(values.password);
      navigate("/login", { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update password. Please try again.");
    }
  }

  return (
    <main className="grid min-h-screen bg-surface lg:grid-cols-[0.95fr_1.05fr]">
      <section className="hidden bg-navy p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <Logo className="[&_p]:text-white" />
        <div>
          <p className="text-sm font-bold uppercase text-mint">Secure recovery workspace</p>
          <h1 className="mt-4 max-w-xl text-5xl font-extrabold leading-tight">Role-aware access for recovery operations.</h1>
          <p className="mt-5 max-w-lg leading-7 text-white/65">
            Admins, managers, agents, and borrowers authenticate through Supabase Auth with RLS-backed data access and auditable sensitive actions.
          </p>
        </div>
        <div className="flex gap-3 text-sm text-white/70">
          <ShieldCheck className="h-5 w-5 text-mint" />
          JWT sessions, OTP actions, signed document access, and service-role isolation.
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md">
          <CardContent>
            <Link to="/" className="mb-8 inline-flex">
              <Logo />
            </Link>
            <h2 className="text-2xl font-extrabold text-navy">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-secondary">
              {mode === "forgot"
                ? "Enter your work email and Settlie AI will send password reset instructions."
                : mode === "reset"
                  ? "Create a new password for your Settlie AI account."
                  : "Use the seeded admin in development or connect Supabase Auth for real users."}
            </p>
            {statusMessage && (
              <div className="mt-5 flex items-start gap-3 rounded-xl bg-mint/10 p-4 text-sm font-semibold text-navy">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-mint" />
                {statusMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mt-5 flex items-start gap-3 rounded-xl bg-error/10 p-4 text-sm font-semibold text-error">
                <AlertCircle className="mt-0.5 h-4 w-4" />
                {errorMessage}
              </div>
            )}
            {mode === "forgot" ? (
              <form className="mt-6 grid gap-4" onSubmit={forgotForm.handleSubmit(submitForgotPassword)}>
                <Input placeholder="Work email" type="email" {...forgotForm.register("email")} />
                {forgotForm.formState.errors.email?.message && (
                  <p className="text-sm font-semibold text-error">{forgotForm.formState.errors.email.message}</p>
                )}
                <Button type="submit" disabled={forgotForm.formState.isSubmitting}>
                  <Mail className="h-4 w-4" />
                  {forgotForm.formState.isSubmitting ? "Sending reset link" : "Send reset link"}
                </Button>
              </form>
            ) : mode === "reset" ? (
              <form className="mt-6 grid gap-4" onSubmit={resetForm.handleSubmit(submitResetPassword)}>
                <Input placeholder="New password" type="password" {...resetForm.register("password")} />
                <Input placeholder="Confirm password" type="password" {...resetForm.register("confirmPassword")} />
                {(resetForm.formState.errors.password?.message || resetForm.formState.errors.confirmPassword?.message) && (
                  <p className="text-sm font-semibold text-error">
                    {resetForm.formState.errors.password?.message ?? resetForm.formState.errors.confirmPassword?.message}
                  </p>
                )}
                <Button type="submit" disabled={resetForm.formState.isSubmitting}>
                  <KeyRound className="h-4 w-4" />
                  {resetForm.formState.isSubmitting ? "Updating password" : "Update password"}
                </Button>
              </form>
            ) : (
              <form
                className="mt-6 grid gap-4"
                onSubmit={borrowerMode ? borrowerForm.handleSubmit(submitBorrower) : loginForm.handleSubmit(submitLogin)}
              >
                {borrowerMode ? (
                  <Input placeholder="+91 mobile number" {...borrowerForm.register("phone")} />
                ) : (
                  <>
                    <Input placeholder="Email" type="email" {...loginForm.register("email")} />
                    <Input placeholder="Password" type="password" {...loginForm.register("password")} />
                  </>
                )}
                <Button type="submit">
                  {borrowerMode ? <Phone className="h-4 w-4" /> : <KeyRound className="h-4 w-4" />}
                  Continue securely
                </Button>
              </form>
            )}
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Link className="font-semibold text-mint" to="/staff-login">Staff login</Link>
              <Link className="font-semibold text-mint" to="/borrower-login">Borrower login</Link>
              <Link className="font-semibold text-mint" to="/forgot-password">Forgot password</Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
