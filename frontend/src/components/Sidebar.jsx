import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Building, Users, CalendarRange, CreditCard, UserCircle } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const links = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN'],
    },
    {
      to: '/properties',
      label: 'Properties',
      icon: Building,
      roles: ['ADMIN', 'USER'],
    },
    {
      to: '/tenants',
      label: 'Tenants',
      icon: Users,
      roles: ['ADMIN'],
    },
    {
      to: '/bookings',
      label: 'Bookings',
      icon: CalendarRange,
      roles: ['ADMIN', 'USER'],
    },
    {
      to: '/payments',
      label: 'Payments',
      icon: CreditCard,
      roles: ['ADMIN'],
    },
    {
      to: '/profile',
      label: 'My Profile',
      icon: UserCircle,
      roles: ['ADMIN', 'USER'],
    },
  ];

  const activeStyle = "flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg transition-all duration-300 font-semibold shadow-md shadow-blue-500/20";
  const inactiveStyle = "flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-all duration-300 font-medium";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between lg:hidden border-b border-slate-800 pb-4">
            <span className="font-bold text-white text-lg">Menu</span>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-2 mt-4 lg:mt-0">
            {links
              .filter(link => link.roles.includes(user?.role))
              .map(link => {
                const IconComponent = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
          </nav>
        </div>

        <div className="border-t border-slate-800 pt-4 text-center">
          <span className="text-[11px] text-slate-500 font-medium">
            Smart Rental System v1.0
          </span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
