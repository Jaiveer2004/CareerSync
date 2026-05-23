"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getServiceProviders } from '@/services/apiService';
import { Navbar } from '@/components/shared/Navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

interface Provider {
  id: string;
  name: string;
  profilePicture?: string;
  bio: string;
  email: string;
  phone?: string;
  isOnline: boolean;
  averageRating: number;
  reviewCount: number;
  totalBookingsToday: number;
  isAvailable: boolean;
  nextAvailableSlot: string;
  recentReviews: Array<{
    _id: string;
    rating: number;
    comment: string;
    customer: {
      fullName: string;
    };
  }>;
}

interface ServiceProvider {
  serviceId: string;
  serviceName: string;
  description: string;
  price: number;
  duration: number;
  provider: Provider;
}

interface ServiceProvidersResponse {
  serviceName: string;
  totalProviders: number;
  availableProviders: number;
  providers: ServiceProvider[];
}

const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Professional service provider placeholder images
const getProviderImage = (name: string, index: number) => {
  // Generate consistent placeholder images for service providers
  const colors = [
    "#6366f1", "#10b981", "#f59716", "#ec4899", 
    "#8b5cf6", "#06b6d4", "#ef4444", "#84cc16"
  ];
  
  const color = colors[index % colors.length];
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="75" cy="75" r="75" fill="${color}"/>
      <text x="75" y="85" font-family="Arial" font-size="36" font-weight="bold" fill="white" text-anchor="middle">${initials}</text>
    </svg>
  `)}`;
};

export default function ServiceProvidersPage({ params }: { params: Promise<{ serviceName: string }> }) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [serviceData, setServiceData] = useState<ServiceProvidersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);

  const resolvedParams = use(params);
  const serviceName = decodeURIComponent(resolvedParams.serviceName);

  // Redirect partners to their services page
  useEffect(() => {
    if (!authLoading && user?.role === 'partner') {
      router.push('/employer/jobs');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // Only fetch providers for customers or non-authenticated users
    if (!authLoading && user?.role !== 'partner') {
      const fetchProviders = async () => {
        try {
          const response = await getServiceProviders(serviceName);
          setServiceData(response.data);
        } catch (error) {
          console.error("Failed to fetch service providers:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProviders();
    }
  }, [serviceName, authLoading, user]);

  // Show loading while checking auth or if partner is being redirected
  if (authLoading || (user?.role === 'partner')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-300 border-t-indigo-600 mx-auto mb-4"></div>
          <div className="text-slate-900">
            {authLoading ? 'Loading...' : 'Redirecting to your services...'}
          </div>
        </div>
      </div>
    );
  }

  const availableProviders = serviceData?.providers.filter(p => p.provider.isAvailable) || [];
  const offlineProviders = serviceData?.providers.filter(p => !p.provider.isAvailable) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 pt-24 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Service Not Found</h1>
          <p className="text-slate-500 mb-6">The service you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/jobs">
            <Button>Back to Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6 pt-24">
          <div className="flex items-center gap-2 text-slate-600 mb-2 text-sm">
            <Link href="/jobs" className="hover:text-[#1e40af]">Jobs</Link>
            <span>→</span>
            <span>{serviceName}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{serviceName}</h1>
              <p className="text-slate-500 mt-1">Choose from {serviceData.totalProviders} actively hiring companies</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600">Starting from</div>
              <div className="text-2xl font-bold text-green-600">
                {formatINR(Math.min(...serviceData.providers.map((p) => p.price)))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Actively Reviewing Section */}
            {availableProviders.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Actively Reviewing ({availableProviders.length})
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {availableProviders.map((service, index) => (
                    <div 
                      key={service.serviceId}
                      className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200 p-6"
                    >
                      <div className="flex items-start gap-4">
                        {/* Provider Image */}
                        <div className="relative">
                          <Image
                            src={getProviderImage(service.provider.name, index)}
                            alt={service.provider.name}
                            width={80}
                            height={80}
                            className="rounded-full object-cover"
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>

                        {/* Provider Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">{service.serviceName}</h3>
                              <p className="text-sm text-slate-600 mt-1">
                                {service.description?.length > 135
                                  ? `${service.description.slice(0, 132)}...`
                                  : service.description}
                              </p>
                              <p className="text-xs text-slate-500 mt-2">Hiring Company: {service.provider.name}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                                <span className="flex items-center gap-1">
                                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                  {service.provider.averageRating.toFixed(1)}
                                </span>
                                <span>({service.provider.reviewCount} reviews)</span>
                                <span>{service.duration} mins process</span>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-2xl font-bold text-slate-900">{formatINR(service.price)}</div>
                              <div className="text-sm text-slate-600">/ year</div>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                              <p className="text-[11px] uppercase tracking-wide text-slate-500">Compensation</p>
                              <p className="text-sm font-semibold text-slate-900">{formatINR(service.price)}</p>
                            </div>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                              <p className="text-[11px] uppercase tracking-wide text-slate-500">Process Time</p>
                              <p className="text-sm font-semibold text-slate-900">{service.duration} mins</p>
                            </div>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                              <p className="text-[11px] uppercase tracking-wide text-slate-500">Applications Today</p>
                              <p className="text-sm font-semibold text-slate-900">{service.provider.totalBookingsToday}</p>
                            </div>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                              <p className="text-[11px] uppercase tracking-wide text-slate-500">Review Status</p>
                              <p className="text-sm font-semibold text-slate-900">
                                {service.provider.isAvailable ? 'Reviewing now' : `Next: ${service.provider.nextAvailableSlot}`}
                              </p>
                            </div>
                          </div>

                          {/* Recent Review */}
                          {service.provider.recentReviews.length > 0 && (
                            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <svg key={i} className={`w-3 h-3 ${
                                      i < service.provider.recentReviews[0].rating ? 'text-yellow-400' : 'text-slate-600'
                                    } fill-current`} viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-sm font-medium text-gray-700">{service.provider.recentReviews[0].customer.fullName}</span>
                              </div>
                              <p className="text-sm text-slate-500">{service.provider.recentReviews[0].comment}</p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center gap-3 mt-4">
                            <Button 
                              className="bg-slate-900 hover:bg-slate-700 text-white px-6"
                              onClick={() => setSelectedProvider(service)}
                            >
                              Company Details
                            </Button>
                            <Link href={`/book/${service.serviceId}`}>
                              <Button 
                                variant="outline" 
                                className="border-slate-300 text-slate-900 hover:bg-slate-50"
                              >
                                Apply for Role
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Other Hiring Companies Section */}
            {offlineProviders.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  All Hiring Companies ({offlineProviders.length})
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {offlineProviders.map((service, index) => (
                    <div 
                      key={service.serviceId}
                      className="bg-white rounded-lg shadow-sm border p-4 opacity-75"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={getProviderImage(service.provider.name, index + availableProviders.length)}
                          alt={service.provider.name}
                          width={60}
                          height={60}
                          className="rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{service.provider.name}</h3>
                          <p className="text-sm text-slate-500">{service.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-yellow-600">⭐ {service.provider.averageRating.toFixed(1)}</span>
                            <span className="text-sm text-slate-600">{formatINR(service.price)}</span>
                          </div>
                        </div>
                        <div className="text-xs text-slate-600">{service.provider.nextAvailableSlot ? "Next Review:" : "Active:"}: {service.provider.nextAvailableSlot}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Roles in {serviceName}</h3>
              
              {/* Service Types */}
              <div className="space-y-3">
                {Array.from(new Set(serviceData.providers.map(p => p.serviceName))).slice(0, 6).map((serviceType, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#1e40af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{serviceType}</div>
                        <div className="text-sm text-slate-600">
                          {serviceData.providers.filter(p => p.serviceName === serviceType).length} open roles
                        </div>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Detail Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Image
                    src={getProviderImage(selectedProvider.provider.name, 0)}
                    alt={selectedProvider.provider.name}
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedProvider.provider.name}</h3>
                    <p className="text-slate-500">{selectedProvider.description}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-medium">{selectedProvider.provider.averageRating.toFixed(1)}</span>
                      <span className="text-slate-600">({selectedProvider.provider.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedProvider(null)}
                  className="text-slate-500 hover:text-slate-500"
                >
                  ✕
                </button>
              </div>

              {/* Provider Bio */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-900 mb-2">About</h4>
                <p className="text-slate-500">{selectedProvider.provider.bio}</p>
              </div>

              {/* Role Details */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-900 mb-3">Role Details</h4>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="font-medium text-slate-900">{selectedProvider.serviceName}</h5>
                      <p className="text-sm text-slate-500">{selectedProvider.duration} minutes</p>
                    </div>
                    <span className="font-semibold text-slate-900">{formatINR(selectedProvider.price)}</span>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              {selectedProvider.provider.recentReviews.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Candidate Feedback</h4>
                  <div className="space-y-3">
                    {selectedProvider.provider.recentReviews.slice(0, 3).map((review, index) => (
                      <div key={index} className="border-l-4 border-blue-200 pl-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-900">{review.customer.fullName}</span>
                          <span className="text-yellow-500">⭐ {review.rating}</span>
                        </div>
                        <p className="text-slate-500 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Link href={`/book/${selectedProvider.serviceId}`} className="flex-1">
                  <Button className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] text-white">
                    Apply for This Role
                  </Button>
                </Link>
                <Link
                  href={`/messages?provider=${encodeURIComponent(selectedProvider.provider.name)}&role=${encodeURIComponent(selectedProvider.serviceName)}`}
                >
                  <Button variant="outline" className="border-blue-600 text-[#1e40af] hover:bg-[#1e40af]/10">
                    Message HR
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
