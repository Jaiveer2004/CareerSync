"use client";

interface SimpleChartProps {
  title: string;
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
}

export function SimpleChart({ title, data }: SimpleChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-20 text-sm text-slate-500 truncate">
              {item.label}
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
            <div className="w-12 text-sm text-slate-900 text-right">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}