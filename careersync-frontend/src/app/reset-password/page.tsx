import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Navbar } from "@/components/shared/Navbar";

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </>
  );
}
