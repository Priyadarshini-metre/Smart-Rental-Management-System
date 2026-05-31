import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  FileText, 
  Building,
  CheckCircle,
  AlertCircle,
  Edit2,
  Trash2,
  X,
  Save,
  Link2
} from 'lucide-react';

const TenantsPage = () => {
  const [tenants, setTenants] = useState([]);
  const [vacantProperties, setVacantProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Form modal states
  const [showModal, setShowModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  
  // Input fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [idProof, setIdProof] = useState('');
  const [propertyId, setPropertyId] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const fetchTenants = async (query = '') => {
    setLoading(true);
    try {
      const response = await api.get('/tenants', {
        params: { query: query || undefined }
      });
      if (response.data && response.data.success) {
        setTenants(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch tenants');
      }
    } catch (err) {
      console.error('Error fetching tenants:', err);
      setError('Could not retrieve tenants.');
    } finally {
      setLoading(false);
    }
  };

  const fetchVacantProperties = async () => {
    try {
      // Fetch page 0 of properties with status VACANT
      const response = await api.get('/properties', {
        params: { status: 'VACANT', size: 100 }
      });
      if (response.data && response.data.success) {
        setVacantProperties(response.data.data.content);
      }
    } catch (err) {
      console.error('Error fetching vacant properties:', err);
    }
  };

  useEffect(() => {
    fetchTenants();
    fetchVacantProperties();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTenants(searchQuery);
  };

  const openAddModal = () => {
    setEditingTenant(null);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setIdProof('');
    setPropertyId('');
    setError('');
    setShowModal(true);
  };

  const openEditModal = (tenant) => {
    setEditingTenant(tenant);
    setFirstName(tenant.firstName);
    setLastName(tenant.lastName);
    setEmail(tenant.email);
    setPhone(tenant.phone);
    setIdProof(tenant.idProof);
    setPropertyId(tenant.propertyId || '');
    setError('');
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone || !idProof) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError('');

    const payload = {
      firstName,
      lastName,
      email,
      phone,
      idProof,
      propertyId: propertyId ? Number(propertyId) : null
    };

    try {
      let response;
      if (editingTenant) {
        response = await api.put(`/tenants/${editingTenant.id}`, payload);
      } else {
        response = await api.post('/tenants', payload);
      }

      if (response.data && response.data.success) {
        setShowModal(false);
        fetchTenants(searchQuery);
        fetchVacantProperties(); // Refresh vacant property listings
      } else {
        setError(response.data.message || 'Operation failed');
      }
    } catch (err) {
      console.error('Error saving tenant:', err);
      setError(err.response?.data?.message || 'Failed to save tenant information.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/tenants/${id}`);
      if (response.data && response.data.success) {
        addToast('Tenant deleted successfully.', 'success');
        fetchTenants(searchQuery);
        fetchVacantProperties();
      }
    } catch (err) {
      console.error('Error deleting tenant:', err);
      addToast('Failed to delete tenant.', 'error');
    }
  };

  const handleUnassign = async (id) => {
    try {
      const response = await api.post(`/tenants/${id}/assign`);
      if (response.data && response.data.success) {
        addToast('Tenant unassigned from property.', 'success');
        fetchTenants(searchQuery);
        fetchVacantProperties();
      }
    } catch (err) {
      console.error('Error unassigning tenant:', err);
      addToast('Failed to unassign tenant.', 'error');
    }
  };

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Tenant Profiles</h1>
          <p className="text-slate-400 text-sm mt-1">Manage tenant details, contact details, and lease allocations</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>Add Tenant</span>
        </button>
      </div>

      {/* Search Filter Panel */}
      <form onSubmit={handleSearchSubmit} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex gap-3">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by first name, last name, or email..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none transition-all duration-300 text-sm"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-md shadow-blue-500/10"
        >
          Search
        </button>
      </form>

      {/* List Container */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : tenants.length === 0 ? (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500">
          <Users className="w-12 h-12 mx-auto text-slate-600 mb-2 animate-pulse" />
          <p className="text-sm font-medium">No tenants registered yet.</p>
        </div>
      ) : (
        /* Tenants Table / Cards */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase bg-slate-950/40">
                  <th className="p-4 pl-6">Tenant Name</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">ID Proof</th>
                  <th className="p-4">Assigned Property</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-950/30 transition-all duration-150">
                    <td className="p-4 pl-6 font-semibold text-white">
                      {t.firstName} {t.lastName}
                    </td>
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Mail className="w-3.5 h-3.5 text-blue-500" />
                        <span>{t.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Phone className="w-3.5 h-3.5 text-blue-500" />
                        <span>{t.phone}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span>{t.idProof}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {t.propertyName ? (
                        <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg w-fit">
                          <Building className="w-3.5 h-3.5" />
                          <span>{t.propertyName}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        t.status === 'ACTIVE' 
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex justify-end gap-2">
                        {t.propertyId && (
                          <button
                            onClick={() => handleUnassign(t.id)}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-500 hover:text-amber-400 rounded-lg transition-all duration-200 border border-slate-700"
                            title="Unassign Property"
                          >
                            <Link2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(t)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 rounded-lg transition-all duration-200 border border-slate-700"
                          title="Edit Tenant"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-2 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg transition-all duration-200 border border-rose-500/10"
                          title="Delete Tenant"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Tenant Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-zoomIn">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span>{editingTenant ? 'Edit Tenant Profile' : 'Register New Tenant'}</span>
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body/Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2.5">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">First Name *</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none text-sm transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Name *</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none text-sm transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none text-sm transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone Number *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 012-3456"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none text-sm transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ID Proof Details *</label>
                <input
                  type="text"
                  value={idProof}
                  onChange={(e) => setIdProof(e.target.value)}
                  placeholder="e.g. Driver's License or Passport No."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none text-sm transition-all"
                  required
                />
              </div>

              {/* Property Assignment Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assign Property</label>
                <select
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none text-sm transition-all"
                >
                  <option value="">No Assignment (Keep Inactive)</option>
                  {vacantProperties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${p.rentAmount}/mo - {p.location})
                    </option>
                  ))}
                  {/* Keep current assigned property in dropdown list if editing */}
                  {editingTenant?.propertyId && (
                    <option value={editingTenant.propertyId}>
                      {editingTenant.propertyName} (Currently Assigned)
                    </option>
                  )}
                </select>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 border-t border-slate-800 pt-5 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/10 transition"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingTenant ? 'Update Tenant' : 'Register Tenant'}</span>
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

export default TenantsPage;
