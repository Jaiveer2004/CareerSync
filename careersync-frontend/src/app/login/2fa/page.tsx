"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TwoFactorLogin from "@/components/auth/TwoFactorLogin";
import { Navbar } from "@/components/shared/Navbar";

function TwoFactorPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (!emailParam) {
      // If no email, redirect back to login
      router.push("/login");
      return;
    }
    setEmail(emailParam);
  }, [searchParams, router]);

  if (!email) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-900">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <TwoFactorLogin 
        email={email} 
        onBack={() => router.push("/login")} 
      />
    </>
  );
}

export default function TwoFactorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-900">Loading...</div>
      </div>
    }>
      <TwoFactorPageContent />
    </Suspense>
  );
}
