import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { OnboardingForm } from "@/components/partner/OnboardingForm";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

export default function PartnerOnboardingPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8 text-slate-900">Become a Company/Recruiter</h1>
          <div className="max-w-2xl mx-auto">
            <OnboardingForm />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}