"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Mail, Loader2 } from "lucide-react";
import { verifyEmail, resendVerificationEmail } from "@/services/authService";
import { useRouter, useSearchParams } from "next/navigation";

export default function EmailVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const verifyEmailToken = async () => {
      const token = searchParams.get("token");
      const code = searchParams.get("code");
      const userEmail = searchParams.get("email");

      if (userEmail) setEmail(userEmail);

      if (!token || !code) {
        setStatus("error");
        setMessage("Invalid verification link. Please check your email and try again.");
        return;
      }

      try {
        const response = await verifyEmail({ token, code });
        setStatus("success");
        setMessage(response.data.message || "Email verified successfully!");
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed. The link may have expired.");
      }
    };

    verifyEmailToken();
  }, [searchParams, router]);

  const handleResendVerification = async () => {
    if (!email) {
      setMessage("Email address not found. Please register again.");
      return;
    }

    setIsResending(true);
    try {
      const response = await resendVerificationEmail({ email });
      setMessage(response.data.message || "Verification email sent! Please check your inbox.");
      setStatus("success");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setMessage(error.response?.data?.message || "Failed to resend verification email.");
      setStatus("error");
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
              "bg-gradient-to-br from-red-400 to-red-600 shadow-red-500/30"
            }`}>
              {status === "loading" && <Loader2 className="h-8 w-8 text-white animate-spin" />}
              {status === "success" && <CheckCircle2 className="h-8 w-8 text-white" />}
              {status === "error" && <XCircle className="h-8 w-8 text-white" />}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {status === "loading" && "Verifying Email..."}
              {status === "success" && "Email Verified!"}
              {status === "error" && "Verification Failed"}
            </h1>
            <p className="text-slate-500">
              {status === "loading" && "Please wait while we verify your email address"}
              {status === "success" && "Your account has been successfully verified"}
              {status === "error" && "We couldn't verify your email address"}
            </p>
          </div>

          <div className="space-y-6">
            <Alert 
              variant={status === "error" ? "destructive" : "default"}
              className={status === "success" ? "bg-green-50 border-green-200 text-green-800" : ""}
            >
              <AlertTitle className={`flex items-center gap-2 ${status === "success" ? "text-green-800 font-semibold" : ""}`}>
                {status === "success" && <CheckCircle2 className="h-4 w-4" />}
                {status === "error" && <XCircle className="h-4 w-4" />}
                {status === "loading" && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                {status === "loading" ? "Processing..." : status === "success" ? "Success" : "Error"}
              </AlertTitle>
              <AlertDescription className={`mt-2 ${status === "success" ? "text-green-700" : ""}`}>
                {message}
              </AlertDescription>
            </Alert>

            {status === "success" && (
              <div className="text-center space-y-4">
                <p className="text-sm text-slate-600">
                  Redirecting to login page in 3 seconds...
                </p>
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-200 py-3 text-base font-medium"
                >
                  Go to Login
                </Button>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <Button
                  onClick={handleResendVerification}
                  disabled={isResending || !email}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 border-none shadow-sm transition-all duration-200 py-3 text-base font-medium mb-3"
                >
                  {isResending ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="h-4 w-4" />
                      Resend Verification Email
                    </div>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/register")}
                  className="w-full text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-slate-200 transition-colors py-3"
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
