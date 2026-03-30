"use client";

interface Booking {
  _id: string;
  status: string;
  paymentStatus: string;
  totalPrice: number;
}

interface BookingSummaryProps {
  bookings: Booking[];
  userRole?: string;
}

export function BookingSummary({ bookings, userRole = 'customer' }: BookingSummaryProps) {
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const totalSpent = bookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.totalPrice, 0);
  
  const completionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stats = userRole === 'customer' 
    ? [
        {
          title: 'Total Bookings',
          value: totalBookings,
          icon: '📊',
          color: 'from-blue-500 to-blue-600'
        },
        {
          title: 'Completed',
          value: completedBookings,
          icon: '✅',
          color: 'from-green-500 to-green-600'
        },
        {
          title: 'Pending',
          value: pendingBookings,
          icon: '⏳',
          color: 'from-yellow-500 to-yellow-600'
        },
        {
          title: 'Total Spent',
          value: formatCurrency(totalSpent),
          icon: '💰',
          color: 'from-purple-500 to-purple-600'
        }
      ]
    : [
        {
          title: 'Total Bookings',
          value: totalBookings,
          icon: '📊',
          color: 'from-blue-500 to-blue-600'
        },
        {
          title: 'Completed',
          value: completedBookings,
          icon: '✅',
          color: 'from-green-500 to-green-600'
        },
        {
          title: 'Completion Rate',
          value: `${completionRate.toFixed(1)}%`,
          icon: '📈',
          color: 'from-orange-500 to-orange-600'
        },
        {
          title: 'Total Earned',
          value: formatCurrency(totalSpent),
          icon: '💰',
          color: 'from-purple-500 to-purple-600'
        }
      ];

  if (totalBookings === 0) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-slate-300 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-slate-900 text-lg`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}