import React from 'react';
import { MOCK_SHOWROOM_VISITORS } from '../constants';
import { Users, Clock, UserCheck, LogIn } from 'lucide-react';

const Showroom: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Showroom Management</h2>
          <p className="text-gray-400 text-sm mt-1">Model Town Showroom Visitor Log</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm text-white font-medium transition-colors shadow-lg shadow-green-600/20">
          <LogIn size={16} /> Check-In Visitor
        </button>
      </div>

      <div className="bg-[#1E1E1E] rounded-xl border border-woodex-600 overflow-hidden">
        <div className="p-4 border-b border-woodex-600 bg-[#252525] flex items-center gap-2 text-sm font-medium text-gray-300">
           <Users size={16} /> Today's Visitors
        </div>
        <div className="divide-y divide-woodex-600">
           {MOCK_SHOWROOM_VISITORS.map((visitor) => (
             <div key={visitor.id} className="p-4 flex items-center justify-between hover:bg-[#252525]/50 transition-colors">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-sm font-bold text-white">
                   {visitor.name.substring(0, 2)}
                 </div>
                 <div>
                   <div className="font-medium text-white">{visitor.name}</div>
                   <div className="text-xs text-gray-500">ID: {visitor.id} • {visitor.purpose}</div>
                 </div>
               </div>
               
               <div className="flex items-center gap-8">
                 <div className="text-right">
                    <div className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                      <Clock size={12} /> {visitor.checkInTime}
                    </div>
                    <div className="text-xs text-blue-400 mt-1">Agent: {visitor.assignedAgent}</div>
                 </div>
                 <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                   visitor.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-700/30 text-gray-500'
                 }`}>
                   {visitor.status}
                 </span>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Showroom;
