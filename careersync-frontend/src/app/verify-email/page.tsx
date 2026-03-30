import { Suspense } from "react";
import EmailVerificationPage from "@/components/auth/EmailVerificationPage";
import { Navbar } from "@/components/shared/Navbar";

export default function VerifyEmailPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
        <EmailVerificationPage />
      </Suspense>
    </>
  );
}
