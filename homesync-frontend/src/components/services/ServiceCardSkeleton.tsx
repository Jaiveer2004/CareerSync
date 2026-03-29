export function ServiceCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 w-full bg-slate-100"></div>
      
      {/* Content skeleton */}
      <div className="p-6">
        {/* Title skeleton */}
        <div className="h-6 bg-slate-100 rounded mb-3"></div>
        
        {/* Rating skeleton */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 w-16 bg-slate-100 rounded"></div>
          <div className="h-4 w-20 bg-slate-100 rounded"></div>
        </div>
        
        {/* Duration skeleton */}
        <div className="h-4 w-24 bg-slate-100 rounded mb-4"></div>
        
        {/* Price and button skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-16 bg-slate-100 rounded mb-1"></div>
            <div className="h-3 w-20 bg-slate-100 rounded"></div>
          </div>
          <div className="h-10 w-28 bg-slate-100 rounded"></div>
        </div>
      </div>
    </div>
  );
}