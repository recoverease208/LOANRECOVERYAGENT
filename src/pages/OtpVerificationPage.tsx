import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { AlertCircle, CheckCircle2, KeyRound, Phone, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { otpVerificationSchema } from "@/validations/auth";
import { requestBorrowerOtp, verifyBorrowerOtp } from "@/services/authService";

type OtpValues = z.infer<typeof otpVerificationSchema>;

export function OtpVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialPhone = (location.state as { phone?: string } | null)?.phone ?? "";
  const [phone, setPhone] = useState(initialPhone);
  const [hasRequested, setHasRequested] = useState(Boolean(initialPhone));
  const [statusMessage, setStatusMessage] = useState(initialPhone ? `OTP sent to ${initialPhone}` : "");
  const [errorMessage, setErrorMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  const otpForm = useForm<OtpValues>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: { token: "" }
  });

  useEffect(() => {
    if (initialPhone) {
      setPhone(initialPhone);
    }
  }, [initialPhone]);

  async function resendOtp() {
    if (!phone) {
      setErrorMessage("Enter your mobile number first.");
      return;
    }

    setErrorMessage("");
    setIsResending(true);
    try {
      await requestBorrowerOtp(phone);
      setStatusMessage(`OTP resent to ${phone}`);
      setHasRequested(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  }

  async function requestOtp() {
    if (!phone) {
      setErrorMessage("Enter your mobile number first.");
      return;
    }

    setErrorMessage("");
    setStatusMessage("");
    try {
      await requestBorrowerOtp(phone);
      setStatusMessage(`OTP sent to ${phone}`);
      setHasRequested(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to send OTP. Please try again.");
    }
  }

  async function submit(values: OtpValues) {
    if (!phone) {
      setErrorMessage("We need the borrower phone number before verifying OTP.");
      return;
    }

    setErrorMessage("");
    try {
      await verifyBorrowerOtp(phone, values.token);
      navigate("/app");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to verify OTP. Please try again.");
    }
  }

  return (
    <main className="grid min-h-screen bg-surface lg:grid-cols-[0.95fr_1.05fr]">
      <section className="hidden bg-navy p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-mint">Borrower verification</p>
          <h1 className="mt-4 max-w-xl text-5xl font-extrabold leading-tight">Secure OTP verification for borrower access.</h1>
          <p className="mt-5 max-w-lg leading-7 text-white/65">
            Borrowers confirm the phone number used for recovery conversations before entering the portal.
          </p>
        </div>
        <div className="flex gap-3 text-sm text-white/70">
          <ShieldCheck className="h-5 w-5 text-mint" />
          OTP verification, session binding, and secure portal entry.
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md">
          <CardContent>
            <h2 className="text-2xl font-extrabold text-navy">Verify OTP</h2>
            <p className="mt-2 text-sm leading-6 text-secondary">
              {phone ? `Enter the 6-digit code sent to ${phone}.` : "Enter your mobile number to request an OTP."}
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
            <div className="mt-6 grid gap-4">
              {!hasRequested ? (
                <>
                  <Input
                    placeholder="+91 mobile number"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                  <Button type="button" onClick={() => void requestOtp()}>
                    <Phone className="h-4 w-4" />
                    Send OTP
                  </Button>
                </>
              ) : (
                <form className="grid gap-4" onSubmit={otpForm.handleSubmit(submit)}>
                  <Input placeholder="6-digit OTP" inputMode="numeric" maxLength={6} {...otpForm.register("token")} />
                  {otpForm.formState.errors.token?.message && (
                    <p className="text-sm font-semibold text-error">{otpForm.formState.errors.token.message}</p>
                  )}
                  <Button type="submit" disabled={otpForm.formState.isSubmitting}>
                    <KeyRound className="h-4 w-4" />
                    {otpForm.formState.isSubmitting ? "Verifying OTP" : "Verify and continue"}
                  </Button>
                </form>
              )}
              <Button type="button" variant="secondary" onClick={() => void resendOtp()} disabled={isResending || !phone}>
                <RotateCcw className="h-4 w-4" />
                {isResending ? "Resending..." : "Resend OTP"}
              </Button>
              <div className="rounded-xl border border-border bg-surface p-4 text-sm text-secondary">
                <p className="flex items-center gap-2 font-semibold text-navy">
                  <Phone className="h-4 w-4 text-mint" />
                  Demo mode tip
                </p>
                <p className="mt-2 leading-6">If Supabase is not connected, use `123456` to complete verification locally.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
