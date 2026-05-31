import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Building2, UserCircle } from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-slate-800 text-white h-16 px-6 flex items-center justify-between border-b border-slate-700 shadow-md">
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleSidebar} 
          className="p-2 hover:bg-slate-700 rounded-lg lg:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <Building2 className="w-8 h-8 text-blue-500 animate-pulse" />
          <span className="font-bold text-xl tracking-wider bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            SmartRental
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 bg-slate-900 px-4 py-1.5 rounded-full border border-slate-700 hover:border-blue-500/50 transition-all duration-300"
          >
            <UserCircle className="w-4 h-4 text-blue-400" />
            <div className="text-sm text-left">
              <span className="font-semibold block leading-tight">{user.fullName}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                {user.role}
              </span>
            </div>
          </button>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white rounded-lg transition-all duration-300 font-medium border border-rose-500/20"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
