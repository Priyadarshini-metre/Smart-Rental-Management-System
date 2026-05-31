import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { User, Mail, Shield, Lock, Save, Eye, EyeOff } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast('Please fill in all fields', 'warning');
      return;
    }
    if (newPassword.length < 6) {
      addToast('New password must be at least 6 characters', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.put('/users/change-password', {
        currentPassword,
        newPassword,
      });
      if (response.data && response.data.success) {
        addToast('Password changed successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        addToast(response.data.message || 'Failed to change password', 'error');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">My Profile</h1>
        <p className="text-slate-400 text-sm mt-1">View your account details and manage your password</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Info Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Account Information</h2>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-blue-500/20 flex items-center justify-center">
              <User className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{user?.fullName}</p>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                user?.role === 'ADMIN'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                  : 'bg-slate-700 text-slate-300 border border-slate-600'
              }`}>
                {user?.role}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <User className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Username</p>
                <p className="text-sm font-semibold text-white">{user?.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <Mail className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Email</p>
                <p className="text-sm font-semibold text-white">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <Shield className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Role</p>
                <p className="text-sm font-semibold text-white">{user?.role === 'ADMIN' ? 'Property Manager / Administrator' : 'Tenant / Standard User'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Change Password</h2>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full pl-11 pr-10 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none transition-all text-sm"
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300">
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-11 pr-10 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none transition-all text-sm"
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300">
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirm New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
