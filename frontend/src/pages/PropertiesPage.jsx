import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Plus, 
  Search, 
  MapPin, 
  Home, 
  DollarSign, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Edit3,
  Calendar,
  AlertCircle
} from 'lucide-react';

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering states
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [status, setStatus] = useState('');

  // Pagination states
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 6,
        sortBy: 'id',
        sortDir: 'desc',
        location: location || undefined,
        type: type || undefined,
        status: status || undefined,
        minRent: minRent ? Number(minRent) : undefined,
        maxRent: maxRent ? Number(maxRent) : undefined,
      };

      const response = await api.get('/properties', { params });
      if (response.data && response.data.success) {
        setProperties(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
        setTotalElements(response.data.data.totalElements);
      } else {
        setError(response.data.message || 'Failed to load properties');
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to retrieve properties.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page, location, type, status, minRent, maxRent]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchProperties();
  };

  const handleClearFilters = () => {
    setLocation('');
    setType('');
    setMinRent('');
    setMaxRent('');
    setStatus('');
    setPage(0);
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/properties/${id}`);
      if (response.data && response.data.success) {
        addToast('Property deleted successfully!', 'success');
        fetchProperties();
      }
    } catch (err) {
      console.error('Error deleting property:', err);
      addToast('Failed to delete property. It might be linked to active bookings.', 'error');
    }
  };

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Properties Inventory</h1>
          <p className="text-slate-400 text-sm mt-1">Browse, filter, and manage rental accommodations</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => navigate('/properties/new')}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Add Property</span>
          </button>
        )}
      </div>

      {/* Filter panel */}
      <form onSubmit={handleSearch} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Location Search */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <MapPin className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City/State"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none transition-all duration-300 text-sm"
              />
            </div>
          </div>

          {/* Type Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Property Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none transition-all duration-300 text-sm"
            >
              <option value="">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Room">Room</option>
            </select>
          </div>

          {/* Status Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none transition-all duration-300 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="VACANT">Vacant</option>
              <option value="OCCUPIED">Occupied</option>
            </select>
          </div>

          {/* Min Rent */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Min Rent ($)</label>
            <input
              type="number"
              value={minRent}
              onChange={(e) => setMinRent(e.target.value)}
              placeholder="Min"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none transition-all duration-300 text-sm"
            />
          </div>

          {/* Max Rent */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Max Rent ($)</label>
            <input
              type="number"
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value)}
              placeholder="Max"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none transition-all duration-300 text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition-all duration-300"
          >
            Clear Filters
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-md shadow-blue-500/10"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Loading & Errors */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500">
          <Home className="w-12 h-12 mx-auto text-slate-600 mb-2 animate-bounce" />
          <p className="text-sm font-medium">No properties match your filter criteria.</p>
        </div>
      ) : (
        /* Properties Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {properties.map((prop) => (
            <div key={prop.id} className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between">
              <div>
                {/* Image & Badges */}
                <div className="h-48 relative overflow-hidden bg-slate-950">
                  <img
                    src={prop.imageUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop'}
                    alt={prop.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  {/* Status Badge */}
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    prop.status === 'VACANT' 
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-rose-600/20 text-rose-400 border border-rose-500/20'
                  }`}>
                    {prop.status}
                  </span>
                  {/* Type Badge */}
                  <span className="absolute bottom-4 left-4 px-3 py-1 bg-slate-900/80 backdrop-blur-md text-slate-300 rounded-lg text-xs font-semibold">
                    {prop.type}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-lg text-white leading-tight line-clamp-1">{prop.name}</h3>
                  <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>{prop.location}</span>
                  </div>
                  <p className="text-slate-400 text-xs line-clamp-2 h-8 leading-relaxed">
                    {prop.description || 'No description provided.'}
                  </p>
                  <span className="text-xs text-slate-500 block font-mono">{prop.address}</span>
                </div>
              </div>

              {/* Price & Actions Footer */}
              <div className="p-5 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-baseline gap-1 text-blue-400">
                  <DollarSign className="w-4 h-4 shrink-0" />
                  <span className="text-2xl font-bold">{prop.rentAmount}</span>
                  <span className="text-slate-500 text-xs">/month</span>
                </div>

                {/* Buttons based on role */}
                <div className="flex gap-2">
                  {user?.role === 'ADMIN' ? (
                    <>
                      <button
                        onClick={() => navigate(`/properties/edit/${prop.id}`)}
                        className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all duration-200 border border-slate-700"
                        title="Edit Property"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prop.id)}
                        className="p-2.5 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white rounded-xl transition-all duration-200 border border-rose-500/10"
                        title="Delete Property"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    prop.status === 'VACANT' && (
                      <button
                        onClick={() => navigate(`/bookings?propertyId=${prop.id}`)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/10 transition-all duration-300"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Book Lease</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 px-6 py-4 rounded-2xl shadow-xl">
          <div className="text-sm text-slate-400">
            Showing <span className="font-semibold text-white">{properties.length}</span> of <span className="font-semibold text-white">{totalElements}</span> properties
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 rounded-xl transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-slate-300 font-semibold font-mono">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
              disabled={page === totalPages - 1}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 rounded-xl transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;
