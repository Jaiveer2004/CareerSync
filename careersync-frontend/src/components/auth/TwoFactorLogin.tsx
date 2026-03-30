"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Lock, Key } from "lucide-react";
import { verify2FALogin, verifyBackupCode } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface TwoFactorLoginProps {
  email: string;
  onBack?: () => void;
}

export default function TwoFactorLogin({ email, onBack }: TwoFactorLoginProps) {
  const router = useRouter();
  const { login } = useAuth();
  
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [token, setToken] = useState("");
  const [backupCode, setBackupCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (useBackupCode) {
        const response = await verifyBackupCode({ email, backupCode });
        const { token: authToken, user } = response.data;
        login(user, authToken);
        router.push("/dashboard");
      } else {
        const response = await verify2FALogin({ email, token });
        
        // After successful 2FA verification, complete the login
        if (response.data.verified) {
          const { token: authToken, user } = response.data;
          login(user, authToken);
          router.push("/dashboard");
        }
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-grow flex items-center justify-center pt-24 pb-16 px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Two-Factor Authentication</h1>
            <p className="text-slate-500">
              {useBackupCode
                ? "Enter one of your backup codes"
                : "Enter the 6-digit code from your authenticator app"}
            </p>
          </div>

          <div className="space-y-6">
            {error && (
              <Alert variant="destructive" className="mb-6" onClose={() => setError("")}>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleVerify2FA} className="space-y-6">
              {!useBackupCode ? (
                <div className="space-y-2">
                  <Label htmlFor="token" className="text-sm font-medium text-slate-900">Authentication Code</Label>
                  <div className="relative">
                    <Input
                      id="token"
                      type="text"
                      placeholder="123456"
                      value={token}
                      onChange={(e) => setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="pl-10 text-center text-2xl tracking-widest transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      maxLength={6}
                      required
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                  </div>
                  <p className="text-xs text-slate-500 text-center">
                    Open your authenticator app to get your code
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="backupCode" className="text-sm font-medium text-slate-900">Backup Code</Label>
                  <div className="relative">
                    <Input
                      id="backupCode"
                      type="text"
                      placeholder="XXXXXXXX"
                      value={backupCode}
                      onChange={(e) => setBackupCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                      className="pl-10 font-mono transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                  </div>
                  <p className="text-xs text-slate-500">
                    Each backup code can only be used once
                  </p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-200 py-3 text-base font-medium" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </div>
                ) : (
                  "Verify & Continue"
                )}
              </Button>
            </form>

            <div className="space-y-4 pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setUseBackupCode(!useBackupCode);
                  setToken("");
                  setBackupCode("");
                  setError("");
                }}
                className="w-full text-slate-700 hover:text-slate-900 border-slate-200 transition-colors"
              >
                {useBackupCode ? (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Use Authenticator Code
                  </>
                ) : (
                  <>
                    <Key className="h-4 w-4 mr-2" />
                    Use Backup Code
                  </>
                )}
              </Button>

              {onBack && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onBack}
                  className="w-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Back to Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
