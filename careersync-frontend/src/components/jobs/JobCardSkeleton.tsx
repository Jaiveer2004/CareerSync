export function JobCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="h-6 w-2/3 bg-slate-100 rounded"></div>
        <div className="h-6 w-20 bg-slate-100 rounded-full"></div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="h-4 w-full bg-slate-100 rounded"></div>
        <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="h-3 w-20 bg-slate-100 rounded mb-2"></div>
          <div className="h-6 w-24 bg-slate-100 rounded"></div>
        </div>
        <div className="h-4 w-24 bg-slate-100 rounded"></div>
      </div>

      <div className="h-10 w-full bg-slate-100 rounded-lg"></div>
    </div>
  );
}