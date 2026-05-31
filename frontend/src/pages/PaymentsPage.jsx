import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { CreditCard, DollarSign, Calendar, Building, User, AlertCircle, Search } from 'lucide-react';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await api.get('/payments');
        if (response.data && response.data.success) {
          setPayments(response.data.data);
        } else {
          setError(response.data.message || 'Failed to load payments');
        }
      } catch (err) {
        setError('Could not retrieve payment records.');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    return (
      !q ||
      p.propertyName?.toLowerCase().includes(q) ||
      p.tenantName?.toLowerCase().includes(q) ||
      p.paymentMethod?.toLowerCase().includes(q)
    );
  });

  const totalRevenue = payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Payment Records</h1>
          <p className="text-slate-400 text-sm mt-1">Full history of all rent payments collected</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-5 py-3 rounded-xl">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-xs text-slate-400">Total Revenue</p>
            <p className="text-xl font-bold text-emerald-400">${totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex gap-3">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by property, tenant, or payment method..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none transition-all duration-300 text-sm"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500">
          <CreditCard className="w-12 h-12 mx-auto text-slate-600 mb-2" />
          <p className="text-sm font-medium">No payment records found.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase bg-slate-950/40">
                  <th className="p-4 pl-6">Property</th>
                  <th className="p-4">Tenant</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Method</th>
                  <th className="p-4 pr-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-950/30 transition-all duration-150">
                    <td className="p-4 pl-6 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-blue-500" />
                        <span>{p.propertyName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-500" />
                        <span>{p.tenantName}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-400">
                      ${p.amount?.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span>{p.paymentDate}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">{p.paymentMethod}</td>
                    <td className="p-4 pr-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        p.status === 'PAID'
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20'
                          : p.status === 'PENDING'
                          ? 'bg-amber-600/20 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-600/20 text-rose-400 border border-rose-500/20'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
