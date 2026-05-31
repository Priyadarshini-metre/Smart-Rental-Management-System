import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Calendar, 
  Building, 
  User, 
  DollarSign, 
  CreditCard,
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  X,
  Save
} from 'lucide-react';

const BookingsPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedPropertyId = searchParams.get('propertyId');

  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking Form Modal states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [submittingBooking, setSubmittingBooking] = useState(false);

  // Payment Modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const { user } = useAuth();
  const { addToast } = useToast();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/bookings');
      if (response.data && response.data.success) {
        setBookings(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Could not retrieve bookings list.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFormMetadata = async () => {
    try {
      // Fetch vacant properties
      const propRes = await api.get('/properties', { params: { status: 'VACANT', size: 100 } });
      if (propRes.data && propRes.data.success) {
        setProperties(propRes.data.data.content);
      }

      // Fetch tenants
      const tenantRes = await api.get('/tenants');
      if (tenantRes.data && tenantRes.data.success) {
        setTenants(tenantRes.data.data);
      }
    } catch (err) {
      console.error('Error loading metadata:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchFormMetadata();
  }, []);

  // Open modal automatically if propertyId is in query parameters
  useEffect(() => {
    if (preselectedPropertyId) {
      setSelectedPropertyId(preselectedPropertyId);
      // Fetch property details to prefill rent amount
      const fetchPropDetails = async () => {
        try {
          const response = await api.get(`/properties/${preselectedPropertyId}`);
          if (response.data && response.data.success) {
            setMonthlyRent(response.data.data.rentAmount);
            // If the preselected property is not in vacant list (since it's vacant but maybe not reloaded), inject it:
            setProperties(prev => {
              if (!prev.some(p => p.id === response.data.data.id)) {
                return [...prev, response.data.data];
              }
              return prev;
            });
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchPropDetails();
      setShowBookingModal(true);
    }
  }, [preselectedPropertyId]);

  const handlePropertyChange = (e) => {
    const id = e.target.value;
    setSelectedPropertyId(id);
    const selectedProp = properties.find(p => p.id === Number(id));
    if (selectedProp) {
      setMonthlyRent(selectedProp.rentAmount);
    } else {
      setMonthlyRent('');
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!selectedPropertyId || !selectedTenantId || !startDate || !endDate || !monthlyRent) {
      setError('Please fill in all fields');
      return;
    }

    setSubmittingBooking(true);
    setError('');

    const payload = {
      propertyId: Number(selectedPropertyId),
      tenantId: Number(selectedTenantId),
      startDate,
      endDate,
      monthlyRent: Number(monthlyRent)
    };

    try {
      const response = await api.post('/bookings', payload);
      if (response.data && response.data.success) {
        setShowBookingModal(false);
        // Clear fields
        setSelectedPropertyId('');
        setSelectedTenantId('');
        setStartDate('');
        setEndDate('');
        setMonthlyRent('');
        fetchBookings();
      } else {
        setError(response.data.message || 'Failed to create booking');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to complete booking.');
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await api.put(`/bookings/${id}/status`, null, {
        params: { status: newStatus }
      });
      if (response.data && response.data.success) {
        addToast(`Lease marked as ${newStatus.toLowerCase()} successfully.`, 'success');
        fetchBookings();
        fetchFormMetadata();
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to change booking status.', 'error');
    }
  };

  const openPaymentModal = (booking) => {
    setActiveBooking(booking);
    setPaymentAmount(booking.monthlyRent); // Default to monthly rent amount
    setError('');
    setShowPaymentModal(true);
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!paymentAmount || !paymentMethod) {
      setError('Please fill in all fields');
      return;
    }

    setSubmittingPayment(true);
    setError('');

    const payload = {
      bookingId: activeBooking.id,
      amount: Number(paymentAmount),
      paymentDate: new Date().toISOString().split('T')[0], // Today's date
      paymentMethod
    };

    try {
      const response = await api.post('/payments', payload);
      if (response.data && response.data.success) {
        setShowPaymentModal(false);
        addToast('Payment recorded successfully!', 'success');
        fetchBookings();
      } else {
        setError(response.data.message || 'Failed to record payment');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to record payment.');
    } finally {
      setSubmittingPayment(false);
    }
  };

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Lease Bookings</h1>
          <p className="text-slate-400 text-sm mt-1">Manage rental agreements, check timelines, and record rent payments</p>
        </div>
        <button
          onClick={() => {
            fetchFormMetadata();
            setError('');
            setShowBookingModal(true);
          }}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>New Booking</span>
        </button>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500">
          <Calendar className="w-12 h-12 mx-auto text-slate-600 mb-2" />
          <p className="text-sm font-medium">No bookings registered yet.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase bg-slate-950/40">
                  <th className="p-4 pl-6">Property</th>
                  <th className="p-4">Tenant</th>
                  <th className="p-4">Rent Price</th>
                  <th className="p-4">Lease Duration</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-950/30 transition-all duration-150">
                    <td className="p-4 pl-6 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-blue-500" />
                        <span>{b.propertyName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <User className="w-4 h-4 text-slate-500" />
                        <span>{b.tenantName}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-blue-400">
                      ${b.monthlyRent}/mo
                    </td>
                    <td className="p-4 space-y-0.5">
                      <div className="text-xs font-semibold text-slate-300">
                        {b.startDate} to {b.endDate}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Booked: {new Date(b.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        b.status === 'ACTIVE' 
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20' 
                          : b.status === 'COMPLETED' 
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' 
                          : 'bg-rose-600/20 text-rose-400 border border-rose-500/20'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex justify-end gap-2">
                        {b.status === 'ACTIVE' && (
                          <button
                            onClick={() => openPaymentModal(b)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg border border-blue-500/20 text-xs font-semibold transition"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay Rent</span>
                          </button>
                        )}
                        {user?.role === 'ADMIN' && b.status === 'ACTIVE' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(b.id, 'COMPLETED')}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-500 rounded-lg border border-slate-700 transition"
                              title="Mark Completed"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(b.id, 'CANCELLED')}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-rose-500 rounded-lg border border-slate-700 transition"
                              title="Cancel Lease"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-zoomIn">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span>Establish Lease Booking</span>
              </h2>
              <button onClick={() => setShowBookingModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2.5">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Property Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Property *</label>
                <select
                  value={selectedPropertyId}
                  onChange={handlePropertyChange}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none text-sm transition-all"
                  required
                >
                  <option value="">-- Choose Vacant Property --</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${p.rentAmount}/mo - {p.location})
                    </option>
                  ))}
                </select>
              </div>

              {/* Tenant Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Tenant *</label>
                <select
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none text-sm transition-all"
                  required
                >
                  <option value="">-- Choose Tenant --</option>
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.firstName} {t.lastName} ({t.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Start Date *</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none text-sm transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">End Date *</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none text-sm transition-all"
                    required
                  />
                </div>
              </div>

              {/* Monthly Rent */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Rent ($) *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <DollarSign className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none text-sm transition-all"
                    required
                    min="1"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 border-t border-slate-800 pt-5 mt-6">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBooking}
                  className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/10 transition"
                >
                  {submittingBooking ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Create Lease</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-zoomIn">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-500" />
                <span>Record Rent Payment</span>
              </h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2.5">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="text-sm text-slate-400 bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-1">
                <div>
                  Property: <span className="font-semibold text-white">{activeBooking?.propertyName}</span>
                </div>
                <div>
                  Tenant: <span className="font-semibold text-white">{activeBooking?.tenantName}</span>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount ($) *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <DollarSign className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none text-sm transition-all"
                    required
                    min="1"
                  />
                </div>
              </div>

              {/* Method */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Payment Method *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none text-sm transition-all"
                  required
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="Check">Check</option>
                </select>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 border-t border-slate-800 pt-5 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPayment}
                  className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/10 transition"
                >
                  {submittingPayment ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Record Payment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
