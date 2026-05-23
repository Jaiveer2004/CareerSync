"use client";

import { PartnerRoute } from "@/components/auth/PartnerRoutes";
import { CreateJobForm } from "@/components/employer/CreateJobForm";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

export default function CreateServicePage() {
    return (
        <PartnerRoute>
            <DashboardLayout>
                <div className="container mx-auto py-8">
                    <h1 className="text-3xl font-bold mb-8 text-slate-900 font-serif">Create Job Posting</h1>
                    <div className="max-w-2xl mx-auto">
                        <CreateJobForm />
                    </div>
                </div>
            </DashboardLayout>
        </PartnerRoute>
    );
}
