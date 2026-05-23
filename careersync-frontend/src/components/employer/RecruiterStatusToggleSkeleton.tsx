import Skeleton from "react-loading-skeleton";

export function RecruiterStatusToggleSkeleton() {
  return (
    <div className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-200/30">
      <Skeleton 
        width={100} 
        height={16} 
        baseColor="#f1f5f9" 
        highlightColor="#e2e8f0" 
      />
      <div className="flex items-center gap-2.5">
        <Skeleton 
          width={55} 
          height={20} 
          className="rounded-full" 
          baseColor="#f1f5f9" 
          highlightColor="#e2e8f0" 
        />
        <Skeleton 
          width={36} 
          height={20} 
          className="rounded-full" 
          baseColor="#f1f5f9" 
          highlightColor="#e2e8f0" 
        />
      </div>
    </div>
  );
}