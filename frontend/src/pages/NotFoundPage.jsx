import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10 animate-pulse" />
      
      <div className="text-center max-w-md space-y-6">
        <div className="flex justify-center">
          <Compass className="w-20 h-20 text-blue-500 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
        <h1 className="text-7xl font-extrabold text-white tracking-wider">404</h1>
        <h2 className="text-2xl font-bold text-slate-200">Lost in the grid?</h2>
        <p className="text-slate-400 text-sm">
          The dashboard location or resource you are looking for has either been moved or doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 mx-auto"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
