import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  Building, 
  Users, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp 
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        if (response.data && response.data.success) {
          setStats(response.data.data);
        } else {
          setError(response.data.message || 'Failed to load stats');
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to fetch dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-slate-900 min-h-screen text-white">
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: stats?.monthlyRevenue?.map(item => item.month) || [],
    datasets: [
      {
        fill: true,
        label: 'Monthly Revenue ($)',
        data: stats?.monthlyRevenue?.map(item => item.revenue) || [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#3b82f6',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(51, 65, 85, 0.3)',
        },
        ticks: {
          color: '#94a3b8',
        },
      },
      y: {
        grid: {
          color: 'rgba(51, 65, 85, 0.3)',
        },
        ticks: {
          color: '#94a3b8',
          callback: (value) => `$${value}`,
        },
      },
    },
  };

  const kpis = [
    {
      title: 'Total Properties',
      value: stats?.totalProperties || 0,
      icon: Building,
      color: 'bg-blue-600/20 text-blue-400 border-blue-500/20',
    },
    {
      title: 'Total Tenants',
      value: stats?.totalTenants || 0,
      icon: Users,
      color: 'bg-indigo-600/20 text-indigo-400 border-indigo-500/20',
    },
    {
      title: 'Occupied Properties',
      value: stats?.occupiedProperties || 0,
      icon: CheckCircle,
      color: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/20',
    },
    {
      title: 'Vacant Properties',
      value: stats?.vacantProperties || 0,
      icon: AlertCircle,
      color: 'bg-amber-600/20 text-amber-400 border-amber-500/20',
    },
  ];

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Real-time metrics, revenue performance, and inventory statuses</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className={`p-6 bg-slate-900 border ${kpi.color} rounded-2xl shadow-xl flex items-center justify-between`}>
              <div>
                <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider block">{kpi.title}</span>
                <span className="text-3xl font-bold mt-2 block text-white">{kpi.value}</span>
              </div>
              <div className={`p-3 rounded-xl ${kpi.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Performance Chart */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white">Revenue Operations</h2>
              <p className="text-xs text-slate-400">Total earnings plotted month-over-month</p>
            </div>
            <div className="flex items-center gap-2 bg-blue-600/15 text-blue-400 px-3.5 py-1.5 rounded-full border border-blue-500/25">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-semibold">${stats?.totalRevenue?.toLocaleString()}</span>
            </div>
          </div>
          <div className="h-72 relative">
            {stats?.monthlyRevenue?.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="absolute inset-0 flex flex-col justify-center items-center text-slate-500">
                <DollarSign className="w-12 h-12 text-slate-600 mb-2" />
                <span>No payment records found yet</span>
              </div>
            )}
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-5">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Occupancy Ratio</h2>
          
          <div className="space-y-4 py-2">
            <div>
              <div className="flex justify-between text-sm font-semibold text-slate-300 mb-1">
                <span>Occupied ({stats?.occupiedProperties})</span>
                <span>
                  {stats?.totalProperties > 0 
                    ? Math.round((stats.occupiedProperties / stats.totalProperties) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${stats?.totalProperties > 0 
                      ? (stats.occupiedProperties / stats.totalProperties) * 100 
                      : 0}%` 
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold text-slate-300 mb-1">
                <span>Vacant ({stats?.vacantProperties})</span>
                <span>
                  {stats?.totalProperties > 0 
                    ? Math.round((stats.vacantProperties / stats.totalProperties) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${stats?.totalProperties > 0 
                      ? (stats.vacantProperties / stats.totalProperties) * 100 
                      : 0}%` 
                  }}
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <div className="text-xs text-slate-400">
              <span className="font-semibold text-slate-200 block mb-0.5">Automated Portfolio Sync</span>
              Your properties and payments are synced dynamically with our database records.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
