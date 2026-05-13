"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { deleteAccount } from "@/services/authService";
import { Shield, Lock, User, Mail, Phone, Key, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import TwoFactorSetup, { DisableTwoFactor } from "@/components/auth/TwoFactorSetup";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  // Profile state
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Delete account state
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  
  // 2FA state - Initialize from user context
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [show2FADisable, setShow2FADisable] = useState(false);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
    };
  };

  const passwordValidation = validatePassword(newPassword);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // TODO: Call API to update profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSuccess("Profile updated successfully!");
      setIsEditingProfile(false);
    } catch {
      setError("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!passwordValidation.isValid) {
      setError("Password does not meet requirements");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Call API to change password
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Failed to change password. Please check your current password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle2FA = () => {
    if (twoFactorEnabled) {
      setShow2FADisable(true);
    } else {
      setShow2FASetup(true);
    }
  };

  const handle2FASuccess = () => {
    setShow2FASetup(false);
    setShow2FADisable(false);
    setTwoFactorEnabled(!twoFactorEnabled);
    setSuccess(twoFactorEnabled ? "2FA disabled successfully" : "2FA enabled successfully");
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!deletePassword.trim()) {
      setError("Please enter your current password to delete your account.");
      return;
    }

    const confirmed = window.confirm("This action is permanent and cannot be undone. Delete your account?");
    if (!confirmed) return;

    setIsDeletingAccount(true);

    try {
      const response = await deleteAccount({ password: deletePassword });
      setSuccess(response.data?.message || "Account deleted successfully.");
      logout();
      router.push('/');
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } };
      setError(apiError?.response?.data?.message || "Failed to delete account. Please verify your password.");
    } finally {
      setIsDeletingAccount(false);
      setDeletePassword("");
    }
  };

  // Show 2FA setup/disable modals
  if (show2FASetup) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="container mx-auto py-8 px-4">
            <TwoFactorSetup onSuccess={handle2FASuccess} />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (show2FADisable) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="container mx-auto py-8 px-4">
            <DisableTwoFactor onSuccess={handle2FASuccess} />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
          {/* Header */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">Account Center</p>
            <h1 className="text-3xl font-semibold text-slate-900 mb-1">Profile Settings</h1>
            <p className="text-slate-600">Manage your account information and security settings</p>
          </div>

          {/* Global Success/Error Messages */}
          {success && (
            <Alert variant="success" onClose={() => setSuccess("")}>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive" onClose={() => setError("")}>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Personal Information */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                    <User className="h-6 w-6 text-[#1e40af]" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Personal Information</CardTitle>
                    <CardDescription className="mt-1">
                      Update your personal details and contact information
                    </CardDescription>
                  </div>
                </div>
                {!isEditingProfile && (
                  <Button variant="outline" className="border-slate-300" onClick={() => setIsEditingProfile(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-semibold text-slate-800">Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={!isEditingProfile}
                      className="bg-slate-50 border-slate-200 text-slate-900 disabled:text-slate-900 disabled:opacity-100"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-slate-800">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-600" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        className="pl-10 bg-slate-50 border-slate-200 text-slate-900 disabled:text-slate-900 disabled:opacity-100"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-600" />
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 bg-slate-50 border-slate-200"
                        disabled={!isEditingProfile}
                        placeholder="+91 1234567890"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={user?.role || "Customer"}
                      disabled
                      className="capitalize bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>

                {isEditingProfile && (
                  <div className="flex gap-3">
                    <Button type="submit" className="bg-slate-900 hover:bg-slate-700 text-white" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setFullName(user?.fullName || "");
                        setEmail(user?.email || "");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 shadow-sm">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-50 rounded-lg border border-red-100">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-red-700">Delete Account</CardTitle>
                  <CardDescription className="mt-1 text-slate-700">
                    Enter your current password to permanently delete your account and related data.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deletePassword" className="text-sm font-semibold text-slate-800">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-600" />
                    <Input
                      id="deletePassword"
                      type={showDeletePassword ? "text" : "password"}
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="pl-10 pr-10 bg-white border-red-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowDeletePassword(!showDeletePassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 hover:text-slate-900"
                    >
                      {showDeletePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="destructive"
                  className="text-white hover:text-white"
                  disabled={isDeletingAccount}
                >
                  {isDeletingAccount ? "Deleting Account..." : "Delete Account"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-violet-50 rounded-lg border border-violet-100">
                  <Lock className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Change Password</CardTitle>
                  <CardDescription className="mt-1">
                    Update your password to keep your account secure
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-600" />
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="pl-10 pr-10 bg-slate-50 border-slate-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 hover:text-slate-900"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-600" />
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10 bg-slate-50 border-slate-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 hover:text-slate-900"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {newPassword && (
                  <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs font-semibold text-slate-600">Password Requirements:</p>
                    <div className="space-y-1">
                      <PasswordRequirement met={passwordValidation.minLength} text="At least 8 characters" />
                      <PasswordRequirement met={passwordValidation.hasUpperCase} text="One uppercase letter" />
                      <PasswordRequirement met={passwordValidation.hasLowerCase} text="One lowercase letter" />
                      <PasswordRequirement met={passwordValidation.hasNumber} text="One number" />
                      <PasswordRequirement met={passwordValidation.hasSpecialChar} text="One special character" />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-600" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 bg-slate-50 border-slate-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 hover:text-slate-900"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-600">Passwords do not match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-700 text-white"
                  disabled={isLoading || !passwordValidation.isValid || newPassword !== confirmPassword}
                >
                  {isLoading ? "Changing Password..." : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                    <Shield className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
                    <CardDescription className="mt-1">
                      Add an extra layer of security by requiring a verification code in addition to your password
                    </CardDescription>
                  </div>
                </div>
                <Switch checked={twoFactorEnabled} onCheckedChange={handleToggle2FA} />
              </div>
            </CardHeader>
            {twoFactorEnabled && (
              <CardContent>
                <Alert variant="success">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription className="ml-2">
                    Two-factor authentication is currently <strong>enabled</strong> on your account.
                    You&apos;ll need your authenticator app to sign in.
                  </AlertDescription>
                </Alert>
              </CardContent>
            )}
          </Card>

          {/* Account Information */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-slate-600">Account ID</p>
                  <p className="text-slate-900 font-mono mt-1">{user?.id || "N/A"}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-slate-600">Account Type</p>
                  <p className="text-slate-900 capitalize mt-1">{user?.role || "Customer"}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-slate-600">Member Since</p>
                  <p className="text-slate-900 mt-1">November 2025</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-slate-600">Email Status</p>
                  <p className="text-emerald-600 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <CheckCircle2 className="h-3 w-3 text-emerald-600 flex-shrink-0" />
      ) : (
        <XCircle className="h-3 w-3 text-slate-500 flex-shrink-0" />
      )}
      <span className={met ? "text-emerald-600" : "text-slate-600"}>{text}</span>
    </div>
  );
}
