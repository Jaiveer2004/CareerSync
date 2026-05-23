"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Mail, Loader2 } from "lucide-react";
import { verifyEmail, resendVerificationEmail } from "@/services/authService";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function EmailVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [status, setStatus] = useState<"loading" | "success" | "error" | "pending">("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const autoVerify = async () => {
      const userEmail = searchParams.get("email");
      const urlCode = searchParams.get("code") || searchParams.get("amp;code");

      if (userEmail) setEmail(userEmail);

      // If user landed with both email and code, auto-verify (fallback compat)
      if (userEmail && urlCode) {
        setOtpCode(urlCode);
        setStatus("loading");
        try {
          const response = await verifyEmail({ email: userEmail, code: urlCode });
          setStatus("success");
          setMessage(response.data.message || "Email verified successfully!");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } catch (err: unknown) {
          const error = err as { response?: { data?: { message?: string } } };
          setStatus("pending");
          setMessage(error.response?.data?.message || "Verification failed. The code may have expired or is incorrect.");
        }
      } else if (userEmail) {
        setStatus("pending");
        setMessage("We've sent a 6-digit verification OTP code to your email. Please enter it below to verify your account.");
      } else {
        setStatus("error");
        setMessage("No email address was provided for verification. Please register again.");
      }
    };

    autoVerify();
  }, [searchParams, router]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await verifyEmail({ email, code: otpCode });
      setStatus("success");
      setMessage(response.data.message || "Email verified successfully!");
      toast.success("Account verified!");
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setStatus("pending");
      setMessage(error.response?.data?.message || "Verification failed. The OTP code may have expired or is incorrect.");
      toast.error(error.response?.data?.message || "Incorrect verification code.");
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setMessage("Email address not found. Please register again.");
      return;
    }

    setIsResending(true);
    const toastId = toast.loading("Resending code...");
    try {
      const response = await resendVerificationEmail({ email });
      setMessage(response.data.message || "Verification code sent! Please check your inbox.");
      toast.dismiss(toastId);
      toast.success("New code sent!");
      setStatus("pending");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setMessage(error.response?.data?.message || "Failed to resend verification code.");
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || "Failed to resend code.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-grow flex items-center justify-center pt-24 pb-16 px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <div className={`mx-auto mb-4 w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center ${
              status === "loading" ? "bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-500/30" : 
              status === "success" ? "bg-gradient-to-br from-green-400 to-green-600 shadow-green-500/30" : 
              status === "pending" ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-indigo-500/30" : 
              "bg-gradient-to-br from-red-400 to-red-600 shadow-red-500/30"
            }`}>
              {status === "loading" && <Loader2 className="h-8 w-8 text-white animate-spin" />}
              {status === "success" && <CheckCircle2 className="h-8 w-8 text-white" />}
              {status === "pending" && <Mail className="h-8 w-8 text-white" />}
              {status === "error" && <XCircle className="h-8 w-8 text-white" />}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {status === "loading" && "Verifying OTP..."}
              {status === "success" && "Account Verified!"}
              {status === "pending" && "Verify Your Account"}
              {status === "error" && "Verification Error"}
            </h1>
            <p className="text-slate-500 text-sm">
              {status === "loading" && "Please wait while we verify your OTP"}
              {status === "success" && "Your account has been successfully verified"}
              {status === "pending" && `Verification code sent to ${email || 'your email'}`}
              {status === "error" && "No verification session was found"}
            </p>
          </div>

          <div className="space-y-6">
            {message && (
              <Alert 
                variant={status === "error" ? "destructive" : "default"}
                className={
                  status === "success" ? "bg-green-50 border-green-200 text-green-800" : 
                  status === "pending" ? "bg-indigo-50 border-indigo-200 text-indigo-800" : ""
                }
              >
                <AlertTitle className={`flex items-center gap-2 ${
                  status === "success" ? "text-green-800 font-semibold" : 
                  status === "pending" ? "text-indigo-800 font-semibold" : ""
                }`}>
                  {status === "success" && <CheckCircle2 className="h-4 w-4" />}
                  {status === "pending" && <Mail className="h-4 w-4 text-indigo-600" />}
                  {status === "error" && <XCircle className="h-4 w-4" />}
                  {status === "loading" && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                  {status === "loading" ? "Processing..." : status === "success" ? "Success" : status === "pending" ? "Verification Code Sent" : "Error"}
                </AlertTitle>
                <AlertDescription className={`mt-2 ${
                  status === "success" ? "text-green-700" : 
                  status === "pending" ? "text-indigo-700 font-medium text-xs leading-relaxed" : ""
                }`}>
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {status === "success" && (
              <div className="text-center space-y-4">
                <p className="text-sm text-slate-600 animate-pulse">
                  Redirecting to login page...
                </p>
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-200 py-3 text-base font-medium"
                >
                  Go to Login
                </Button>
              </div>
            )}

            {status === "pending" && (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="space-y-2.5">
                  <label htmlFor="otp-input" className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">
                    Enter 6-Digit OTP Code
                  </label>
                  <div className="flex justify-center">
                    <input
                      id="otp-input"
                      type="text"
                      maxLength={6}
                      pattern="\d{6}"
                      required
                      placeholder="••••••"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-52 text-center text-4xl font-bold tracking-[10px] py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono placeholder-slate-300"
                      autoFocus
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={otpCode.length !== 6}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-none shadow-md hover:shadow-lg transition-all duration-200 py-3.5 text-base font-semibold rounded-xl"
                >
                  Verify Account
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2.5 bg-white text-slate-400 font-bold uppercase tracking-wider">Or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isResending || !email}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 border-none shadow-sm transition-all duration-200 py-3 text-sm font-semibold rounded-xl"
                >
                  {isResending ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="h-4 w-4 text-slate-500" />
                      Resend Verification OTP
                    </div>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/login")}
                  className="w-full text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-slate-200 transition-colors py-3 text-sm font-semibold rounded-xl"
                >
                  Back to Login
                </Button>
              </form>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/register")}
                  className="w-full text-slate-500 hover:text-slate-950 hover:bg-slate-50 border-slate-200 transition-colors py-3.5 text-base font-semibold rounded-xl"
                >
                  Back to Registration
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
