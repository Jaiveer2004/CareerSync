"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Service {
  _id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  duration?: number;
}

interface Provider {
  _id: string;
  user: {
    fullName: string;
    email?: string;
  };
  bio?: string;
  skillsAndExpertise?: string[];
  experienceYears?: number;
  averageRating?: number;
  isOnline?: boolean;
}

interface BookingDetails {
  bookingDate: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  notes?: string;
}

interface BookingFormProps {
  service: Service;
  selectedProvider: Provider | null;
  onFormSubmit: (details: BookingDetails) => void;
}

export function BookingForm({ service, selectedProvider, onFormSubmit }: BookingFormProps) {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDuration = (duration: number) => {
    if (duration >= 60) {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${duration}m`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProvider) {
      alert('Please select a service provider');
      return;
    }

    setIsLoading(true);
    try {
      await onFormSubmit({
        bookingDate: new Date().toISOString(),
        address: { street, city, postalCode },
        notes: `${notes}${resumeFileName ? `\nResume: ${resumeFileName}` : ''}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Submit Application</h2>
        <p className="text-slate-300">Provide your details to process this role application.</p>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Service Summary */}
        <div className="bg-slate-100/50 rounded-xl p-4 border border-slate-300">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-900">{service.name}</h3>
            <span className="text-2xl font-bold text-emerald-600">{formatCurrency(service.price)}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span className="bg-[#1e40af]/20 text-[#1e40af] px-2 py-1 rounded border border-blue-600/30">
              {service.category}
            </span>
            {service.duration && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatDuration(service.duration)}
              </span>
            )}
          </div>
          {selectedProvider && (
            <div className="mt-3 pt-3 border-t border-slate-300">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {selectedProvider.user.fullName.charAt(0)}
                </div>
                <span className="text-slate-600">Hiring Team: {selectedProvider.user.fullName}</span>
                {selectedProvider.isOnline && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-600 text-xs">Online</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Address Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Applicant Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              LinkedIn Profile URL
            </label>
            <Input 
              placeholder="https://linkedin.com/in/yourprofile" 
              value={street} 
              onChange={e => setStreet(e.target.value)} 
              required 
              className="bg-slate-100 border-slate-300 text-slate-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                City
              </label>
              <Input 
                placeholder="e.g. San Francisco, CA" 
                value={city} 
                onChange={e => setCity(e.target.value)} 
                required 
                className="bg-slate-100 border-slate-300 text-slate-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Postal Code
              </label>
              <Input 
                placeholder="e.g. 5" 
                value={postalCode} 
                onChange={e => setPostalCode(e.target.value)} 
                required 
                className="bg-slate-100 border-slate-300 text-slate-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Cover Letter / Additional Information
          </label>
          <Textarea 
            placeholder="Why are you a good fit for this role? Share your motivation..."
            value={notes} 
            onChange={e => setNotes(e.target.value)}
            rows={3}
            className="bg-slate-100 border-slate-300 text-slate-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Resume Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Upload Resume
          </label>
          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setResumeFileName(file ? file.name : '');
            }}
            className="bg-slate-100 border-slate-300 text-slate-900 file:mr-4 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-sm file:text-white"
          />
          {resumeFileName ? (
            <p className="mt-2 text-xs text-slate-600">Selected: {resumeFileName}</p>
          ) : (
            <p className="mt-2 text-xs text-slate-600">Accepted formats: PDF, DOC, DOCX</p>
          )}
        </div>

        {/* Pricing Summary */}
        <div className="bg-slate-100/50 rounded-xl p-4 border border-slate-300">
          <div className="space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Service Cost</span>
              <span>{formatCurrency(service.price)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Platform Fee</span>
              <span>Free</span>
            </div>
            <div className="border-t border-slate-300 pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold text-slate-900">
                <span>Compensation</span>
                <span className="text-emerald-600">{formatCurrency(service.price)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={isLoading || !selectedProvider} 
          className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] text-white py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Processing...
            </div>
          ) : (
            `Submit Application`
          )}
        </Button>

        {!selectedProvider && (
          <p className="text-red-600 text-sm text-center">
            Please select a service provider to proceed with application
          </p>
        )}
      </form>
    </div>
  );
}
