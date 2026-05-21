"use client";

interface ActivityItem {
  id: string;
  type: 'booking' | 'service' | 'review' | 'payment';
  title: string;
  description: string;
  time: string;
  icon: string;
  status?: 'pending' | 'completed' | 'cancelled';
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-700 bg-emerald-100';
      case 'pending':
        return 'text-orange-700 bg-orange-100';
      case 'cancelled':
        return 'text-rose-700 bg-rose-100';
      default:
        return 'text-blue-700 bg-blue-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return '📅';
      case 'service':
        return '🛠️';
      case 'review':
        return '⭐';
      case 'payment':
        return '💳';
      default:
        return '📋';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <h3 className="text-xl font-serif font-bold text-slate-900 mb-4">Recent Activity</h3>
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📋</div>
          <p className="text-slate-500">No recent activity</p>
          <p className="text-slate-600 text-sm">Your activity will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 rounded-xl border border-slate-100 p-3 hover:border-slate-200 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm">
                  {activity.icon || getTypeIcon(activity.type)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {activity.title}
                  </p>
                  <div className="flex items-center space-x-2">
                    {activity.status && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {formatStatus(activity.status)}
                      </span>
                    )}
                    <p className="text-xs text-slate-500 flex-shrink-0">
                      {activity.time}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
