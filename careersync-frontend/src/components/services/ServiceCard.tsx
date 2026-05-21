"use client";

import Link from "next/link";
import { Button } from "../ui/button";

interface Service {
  _id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  duration?: number;
  providerCount?: number;
  reviewCount?: number;
  averageRating?: number;
  sampleProvider?: {
    name: string;
    rating: number;
  };
}

interface ServiceCardProps {
  service: Service;
}

const formatSalary = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const buildShortDescription = (service: Service) => {
  if (service.description && service.description.trim().length > 0) {
    const trimmed = service.description.trim();
    return trimmed.length > 120 ? `${trimmed.slice(0, 117)}...` : trimmed;
  }

  return `Explore ${service.category} opportunities curated for candidates looking to grow into high-impact roles.`;
};

export function ServiceCard({ service }: ServiceCardProps) {
  const shortDescription = buildShortDescription(service);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="text-xl font-semibold text-slate-900 leading-snug">{service.name}</h3>
        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {service.category}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-slate-600 mb-6 min-h-[44px]">
        {shortDescription}
      </p>

      <div className="mb-5 flex items-center justify-between text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Annual CTC</p>
          <p className="text-lg font-semibold text-slate-900">{formatSalary(service.price)}</p>
        </div>
        {service.providerCount ? (
          <p className="text-slate-600">{service.providerCount} hiring teams</p>
        ) : null}
      </div>

      <Link href={`/service-providers/${encodeURIComponent(service.name)}`} className="block">
        <Button className="w-full rounded-lg bg-slate-900 py-2.5 text-white hover:bg-slate-700">
          View Roles
        </Button>
      </Link>
      {service.duration ? (
        <p className="mt-3 text-xs text-slate-500">Typical process duration: {service.duration} hrs</p>
      ) : null}
      </div>
    
  );
}