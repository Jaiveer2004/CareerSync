"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Booking {
  _id: string;
  service: {
    name: string;
    _id: string;
    salaryRange?: string;
    location?: string;
    experienceLevel?: string;
  };
  partner?: {
    user: {
      fullName: string;
      profilePicture?: string;
    };
    averageRating?: number;
  };
  customer?: {
    fullName: string;
  };
  bookingDate: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  status: string;
  actualStatus?: string;
  totalPrice: number;
  paymentStatus: 'pending' | 'paid';
  createdAt: string;
}

interface EnhancedBookingCardProps {
  booking: Booking;
  userRole?: string;
  onReviewClick?: (bookingId: string) => void;
  onCancelClick?: (bookingId: string) => void;
  onContactClick?: (booking: Booking) => void;
  onConfirmClick?: (bookingId: string) => void;
  onRejectClick?: (bookingId: string) => void;
  onStatusUpdate?: (bookingId: string, status: string) => void;
}

export function EnhancedBookingCard({ 
  booking, 
  userRole = 'customer',
  onReviewClick,
  onCancelClick,
  onContactClick,
  onConfirmClick,
  onRejectClick,
  onStatusUpdate
}: EnhancedBookingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied':
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'reviewing':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'shortlisted':
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'interview':
      case 'scheduled':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'rejected':
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'completed':
      case 'closed':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status.toLowerCase() === 'pending') return 'Applied';
    if (status.toLowerCase() === 'confirmed') return 'Shortlisted';
    if (status.toLowerCase() === 'cancelled') return 'Rejected';
    if (status.toLowerCase() === 'completed') return 'Closed';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const displayStatus = booking.actualStatus || booking.status;
  const { date, time } = formatDate(booking.bookingDate);
  const createdDate = new Date(booking.createdAt).toLocaleDateString();

  const canReview = displayStatus.toLowerCase() === 'completed' || displayStatus.toLowerCase() === 'closed';
  const canContact = ['confirmed', 'shortlisted', 'interview', 'scheduled'].includes(displayStatus.toLowerCase());
  
  // Partner-specific permissions
  const canConfirm = userRole === 'partner' && ['pending', 'applied', 'reviewing'].includes(displayStatus.toLowerCase());
  const canReject = userRole === 'partner' && ['pending', 'applied', 'reviewing'].includes(displayStatus.toLowerCase());
  const canMarkComplete = userRole === 'partner' && ['confirmed', 'shortlisted', 'interview', 'scheduled'].includes(displayStatus.toLowerCase());
  
  // Customer-specific permissions
  const canCancelAsCustomer = userRole === 'customer' && ['pending', 'applied', 'reviewing', 'confirmed', 'shortlisted', 'interview', 'scheduled'].includes(displayStatus.toLowerCase());

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Main Card Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-slate-900">{booking.service?.name || 'Unknown Role'}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(displayStatus)}`}>
                {getStatusIcon(displayStatus)}
              </span>
            </div>
            
            {userRole === 'partner' && booking.customer && (
              <p className="text-slate-600 text-sm">Candidate: {booking.customer.fullName}</p>
            )}
            
            {userRole === 'customer' && booking.partner?.user && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                    {booking.partner.user.fullName?.charAt(0) || 'P'}
                  </span>
                </div>
                <span className="text-slate-600 text-sm">{booking.partner.user.fullName}</span>
                {booking.partner.averageRating && (
                  <span className="text-yellow-400 text-sm">
                    ⭐ {booking.partner.averageRating.toFixed(1)}
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div className="text-right">
            <p className="text-xl font-bold text-slate-900">{booking.service?.salaryRange || formatCurrency(booking.totalPrice)}</p>
            <p className="text-xs text-slate-500">
              Estimated Salary
            </p>
          </div>
        </div>

        {/* Date and Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-100/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#1e40af]">📅</span>
              <span className="text-sm font-medium text-slate-600">
                {displayStatus.toLowerCase() === 'interview' ? 'Interview Time' : 'Applied Date'}
              </span>
            </div>
            <p className="text-slate-900 font-semibold">{date}</p>
            <p className="text-slate-600 text-sm">{time}</p>
          </div>
          
          <div className="bg-slate-100/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-green-400">📍</span>
              <span className="text-sm font-medium text-slate-600">Location</span>
            </div>
            <p className="text-slate-900 text-sm">{booking.service?.location || booking.address?.city || 'Remote'}</p>
            <p className="text-slate-600 text-xs">{booking.service?.location ? 'Job Location' : `${booking.address?.street}, ${booking.address?.postalCode}`}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Partner Actions */}
          {canConfirm && onConfirmClick && (
            <Button
              size="sm"
              onClick={() => onConfirmClick(booking._id)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Accept Application
            </Button>
          )}
          
          {canReject && onRejectClick && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRejectClick(booking._id)}
              className="border-red-300 text-red-700 hover:text-red-800 hover:border-red-400"
            >
              Reject Application
            </Button>
          )}
          
          {canMarkComplete && onStatusUpdate && (
            <Button
              size="sm"
              onClick={() => onStatusUpdate(booking._id, 'completed')}
              className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white"
            >
              Mark Complete
            </Button>
          )}

          {/* Customer Actions */}
          {canReview && onReviewClick && (
            <Button
              size="sm"
              onClick={() => onReviewClick(booking._id)}
              className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white"
            >
              Leave Review
            </Button>
          )}
          
          {canContact && onContactClick && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onContactClick(booking)}
              className="border-slate-300 text-slate-600 hover:text-slate-900 hover:border-gray-500"
            >
              Contact {userRole === 'customer' ? 'Company' : 'Candidate'}
            </Button>
          )}
          
          {canCancelAsCustomer && onCancelClick && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCancelClick(booking._id)}
              className="border-red-300 text-red-700 hover:text-red-800 hover:border-red-400"
            >
              Cancel
            </Button>
          )}
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="border-slate-300 text-slate-700 hover:text-slate-900 hover:border-gray-500"
          >
            {isExpanded ? 'Less Details' : 'More Details'}
          </Button>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t border-slate-200 pt-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Application ID:</span>
                <p className="text-slate-900 font-mono text-xs">{booking._id}</p>
              </div>
              <div>
                <span className="text-slate-600">Booked on:</span>
                <p className="text-slate-900">{createdDate}</p>
              </div>
            </div>
            
            {booking.service?.location ? (
              <div>
                <span className="text-slate-600 text-sm">Experience Level Required:</span>
                <p className="text-slate-900 font-semibold">{booking.service?.experienceLevel || 'Not specified'}</p>
              </div>
            ) : (
              <div>
                <span className="text-slate-600 text-sm">Full Address:</span>
                <p className="text-slate-900">
                  {booking.address.street}, {booking.address.city}, {booking.address.postalCode}
                </p>
              </div>
            )}

            {/* Application Pipeline Progress */}
            <div className="bg-slate-100/30 rounded-xl p-4 border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Application Status Tracker</h4>
              <div className="flex items-center space-x-2">
                <div className={`w-3.5 h-3.5 rounded-full border-2 ${displayStatus.toLowerCase() !== 'rejected' && displayStatus.toLowerCase() !== 'cancelled' ? 'bg-emerald-500 border-emerald-300' : 'bg-slate-300 border-slate-200'}`}></div>
                <span className="text-xs font-semibold text-slate-600">Applied</span>
                <div className="flex-1 h-0.5 bg-slate-200"></div>
                
                <div className={`w-3.5 h-3.5 rounded-full border-2 ${['reviewing', 'shortlisted', 'interview', 'completed', 'closed', 'confirmed'].includes(displayStatus.toLowerCase()) ? 'bg-emerald-500 border-emerald-300' : 'bg-slate-300 border-slate-200'}`}></div>
                <span className="text-xs font-semibold text-slate-600">Screening</span>
                <div className="flex-1 h-0.5 bg-slate-200"></div>
                
                <div className={`w-3.5 h-3.5 rounded-full border-2 ${['shortlisted', 'interview', 'completed', 'closed', 'confirmed'].includes(displayStatus.toLowerCase()) ? 'bg-emerald-500 border-emerald-300' : 'bg-slate-300 border-slate-200'}`}></div>
                <span className="text-xs font-semibold text-slate-600">Shortlisted</span>
                <div className="flex-1 h-0.5 bg-slate-200"></div>
                
                <div className={`w-3.5 h-3.5 rounded-full border-2 ${['interview', 'completed', 'closed'].includes(displayStatus.toLowerCase()) ? 'bg-emerald-500 border-emerald-300' : 'bg-slate-300 border-slate-200'}`}></div>
                <span className="text-xs font-semibold text-slate-600">Interview</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}