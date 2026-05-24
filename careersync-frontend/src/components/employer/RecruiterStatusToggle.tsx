"use client";

import { useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import { RecruiterStatusToggleSkeleton } from "./RecruiterStatusToggleSkeleton";
import { getPartnerProfile, updatePartnerStatus } from "@/services/apiService";
import toast from "react-hot-toast";

export function RecruiterStatusToggle() {
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(true);

  useEffect(() => {
    getPartnerProfile()
      .then((res) => {
        console.log("Partner profile fetched:", res.data);
        if (res.data && (res.data.companyProfile === null || !res.data._id)) {
          setHasProfile(false);
          setIsOnline(false);
        } else {
          setHasProfile(true);
          setIsOnline(res.data.isOnline || false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch partner status", err);
        // Check if this is an authentication issue
        if (err?.response?.status === 401) {
          console.error("Authentication issue - user may need to log in again");
        } else if (err?.response?.status === 404) {
          console.error("Partner profile not found - user may need to complete onboarding");
          setHasProfile(false);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleToggle = async (checked: boolean) => {
    const previousStatus = isOnline;
    setIsOnline(checked); 

    try {
      // Use the dedicated service function
      const promise = updatePartnerStatus({ isOnline: checked });

      await toast.promise(promise, {
        loading: `Switching to ${checked ? 'Online' : 'Offline'}...`,
        success: () => {
          return <b>Status updated to {checked ? 'Online' : 'Offline'}!</b>;
        },
        error: (err) => {
          setIsOnline(previousStatus); // Revert on error
          console.error("Detailed error:", err);
          
          let errorMessage = "Failed to set status";
          
          if (err?.response?.data?.message) {
            errorMessage = err.response.data.message;
          } else if (err?.message) {
            errorMessage = err.message;
          } else if (err?.response?.status === 404) {
            errorMessage = "Partner profile not found. Please complete your onboarding.";
          } else if (err?.response?.status === 403) {
            errorMessage = "Access denied. Only partners can change status.";
          } else if (err?.response?.status === 401) {
            errorMessage = "Please log in again to continue.";
          }
          
          return <b>{errorMessage}</b>;
        },
      });
    } catch (error) {
      console.error("Status update failed", error);
      setIsOnline(previousStatus); // Revert on error
      toast.error("Failed to set status");
    }
  };

  if (isLoading) return <RecruiterStatusToggleSkeleton />;

  return (
    <div className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-200/30">
      <span className="text-xs font-bold text-slate-800">Actively Sourcing</span>
      <div className="flex items-center gap-2.5">
        <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-[10px] font-bold border transition-all duration-200 ${
          isOnline 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-slate-100 text-slate-500 border-slate-200'
        }`}>
          {isOnline && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
          {isOnline ? "Online" : "Offline"}
        </span>
        <Switch id="online-status" checked={isOnline} disabled={!hasProfile} onCheckedChange={handleToggle} />
      </div>
    </div>
  );

}