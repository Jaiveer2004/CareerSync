// Enhanced register page with modern design and navbar
"use client";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { Navbar } from "@/components/shared/Navbar";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-12rem)]">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Join HomeSync</h1>
              <p className="text-slate-500">Create your account to get started</p>
            </div>

            {/* Register Form Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-2xl">
              <RegisterForm />
              
              {/* Divider */}
              <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                <p className="text-slate-500 text-sm">
                  Already have an account?{' '}
                  <Link href="/login" className="text-[#1e40af] hover:text-blue-300 font-medium transition-colors">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <p className="text-slate-600 text-xs">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-[#1e40af] hover:text-blue-300 transition-colors">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-[#1e40af] hover:text-blue-300 transition-colors">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}