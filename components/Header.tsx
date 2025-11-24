import React from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';

const Header: React.FC<{ title: string }> = ({ title }) => {
  return (
    <header className="h-16 bg-[#121212]/80 backdrop-blur-md border-b border-woodex-600 flex items-center justify-between px-8 sticky top-0 z-10">
      <h1 className="text-lg font-semibold text-white">{title}</h1>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-[#1E1E1E] border border-woodex-600 rounded-full pl-10 pr-4 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-blue-500 w-64 placeholder-gray-600"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="h-8 w-[1px] bg-woodex-600"></div>

          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
              AD
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-white leading-none">Admin User</div>
              <div className="text-xs text-gray-500 mt-1">Woodex Retail</div>
            </div>
            <ChevronDown size={14} className="text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;