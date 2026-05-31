import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  ArrowLeft, 
  Save, 
  Building, 
  MapPin, 
  Info, 
  DollarSign, 
  Image,
  AlertCircle
} from 'lucide-react';

const PropertyFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Apartment');
  const [rentAmount, setRentAmount] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('VACANT');

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    if (isEditMode) {
      const fetchProperty = async () => {
        setFetching(true);
        try {
          const response = await api.get(`/properties/${id}`);
          if (response.data && response.data.success) {
            const prop = response.data.data;
            setName(prop.name);
            setAddress(prop.address);
            setLocation(prop.location);
            setDescription(prop.description || '');
            setType(prop.type);
            setRentAmount(prop.rentAmount);
            setImageUrl(prop.imageUrl || '');
            setStatus(prop.status);
          } else {
            setError(response.data.message || 'Failed to load property details');
          }
        } catch (err) {
          console.error('Error fetching property:', err);
          setError('Failed to fetch property details.');
        } finally {
          setFetching(false);
        }
      };

      fetchProperty();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !address || !location || !rentAmount || !type) {
      setError('Please fill in all required fields');
      return;
    }

    setError('');
    setLoading(true);

    const payload = {
      name,
      address,
      location,
      description,
      type,
      rentAmount: Number(rentAmount),
      imageUrl: imageUrl || undefined,
      status
    };

    try {
      let response;
      if (isEditMode) {
        response = await api.put(`/properties/${id}`, payload);
      } else {
        response = await api.post('/properties', payload);
      }

      if (response.data && response.data.success) {
        addToast(isEditMode ? 'Property updated successfully!' : 'Property added successfully!', 'success');
        navigate('/properties');
      } else {
        setError(response.data.message || 'Operation failed');
      }
    } catch (err) {
      console.error('Error saving property:', err);
      setError(err.response?.data?.message || 'An error occurred while saving the property.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100 space-y-6">
      {/* Back button & Title */}
      <div className="flex items-center gap-4">
        <Link 
          to="/properties" 
          className="p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {isEditMode ? 'Modify Property' : 'Register New Property'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {isEditMode ? 'Update existing property characteristics and availability' : 'Add a new real estate accommodation to the portfolio'}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-xl flex items-center gap-3 animate-headShake">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl max-w-3xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Property Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-blue-500" />
              <span>Property Name *</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sunset Luxury Apartment"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none transition-all duration-300 text-sm"
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>Location (City/State) *</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Miami, FL"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none transition-all duration-300 text-sm"
              required
            />
          </div>

          {/* Address */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>Full Address *</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 102 Ocean Drive, Apartment 4B"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none transition-all duration-300 text-sm"
              required
            />
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-blue-500" />
              <span>Type *</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none transition-all duration-300 text-sm"
              required
            >
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Room">Room</option>
            </select>
          </div>

          {/* Rent Amount */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-blue-500" />
              <span>Monthly Rent Amount ($) *</span>
            </label>
            <input
              type="number"
              value={rentAmount}
              onChange={(e) => setRentAmount(e.target.value)}
              placeholder="e.g. 2000"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none transition-all duration-300 text-sm"
              required
              min="1"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
              <Image className="w-4 h-4 text-blue-500" />
              <span>Image URL</span>
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="e.g. https://images.unsplash.com/..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none transition-all duration-300 text-sm"
            />
          </div>

          {/* If edit mode, allow updating status */}
          {isEditMode && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none transition-all duration-300 text-sm"
              >
                <option value="VACANT">Vacant</option>
                <option value="OCCUPIED">Occupied</option>
              </select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-500" />
              <span>Description</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe property features, rooms, amenities, policy rules, etc."
              rows="4"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none transition-all duration-300 text-sm"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 border-t border-slate-800 pt-6">
          <Link
            to="/properties"
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition-all duration-300"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditMode ? 'Update Property' : 'Save Property'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyFormPage;
