import React from 'react';
import { MOCK_LEADS } from '../constants';
import { Status } from '../types';
import { Plus, Search, MoreVertical, Phone, Mail } from 'lucide-react';

const LeadGeneration: React.FC = () => {
  const columns = [
    { title: 'New Leads', status: Status.New, color: 'border-blue-500' },
    { title: 'Contacted', status: Status.Contacted, color: 'border-yellow-500' },
    { title: 'Proposal Sent', status: Status.Proposal, color: 'border-purple-500' },
    { title: 'Qualified', status: Status.Qualified, color: 'border-indigo-500' },
    { title: 'Closed / Won', status: Status.Won, color: 'border-green-500' },
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Lead Generation</h2>
          <p className="text-gray-400 text-sm mt-1">Manage your sales pipeline and track deals.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white font-medium transition-colors">
          <Plus size={16} /> Add Lead
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 min-w-max h-full pb-4">
          {columns.map((col) => (
            <div key={col.title} className="w-80 bg-[#1E1E1E] rounded-xl border border-woodex-600 flex flex-col">
              <div className={`p-4 border-b border-woodex-600 border-t-4 ${col.color} rounded-t-xl bg-[#252525]`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-white text-sm">{col.title}</h3>
                  <span className="bg-[#121212] text-gray-400 px-2 py-0.5 rounded text-xs">
                    {MOCK_LEADS.filter(l => l.status === col.status).length}
                  </span>
                </div>
              </div>
              
              <div className="p-3 flex-1 overflow-y-auto custom-scrollbar space-y-3 bg-[#121212]/50">
                {MOCK_LEADS.filter(l => l.status === col.status).map((lead) => (
                  <div key={lead.id} className="bg-[#1E1E1E] p-4 rounded-lg border border-woodex-600 hover:border-blue-500/50 transition-all cursor-pointer group shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white text-sm">{lead.name}</h4>
                      <button className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                    <div className="text-xs text-blue-400 mb-3 font-medium">{lead.company}</div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-white bg-[#252525] px-2 py-1 rounded border border-woodex-600">{lead.value}</span>
                      <span className="text-[10px] text-gray-500">{lead.lastContact}</span>
                    </div>

                    <div className="flex gap-2 mt-2 pt-2 border-t border-woodex-600">
                      <button className="flex-1 py-1.5 bg-[#252525] hover:bg-blue-600/20 hover:text-blue-400 rounded text-xs text-gray-400 flex items-center justify-center gap-1 transition-colors">
                        <Phone size={12} /> Call
                      </button>
                      <button className="flex-1 py-1.5 bg-[#252525] hover:bg-purple-600/20 hover:text-purple-400 rounded text-xs text-gray-400 flex items-center justify-center gap-1 transition-colors">
                        <Mail size={12} /> Email
                      </button>
                    </div>
                  </div>
                ))}
                {MOCK_LEADS.filter(l => l.status === col.status).length === 0 && (
                  <div className="text-center py-8 text-gray-600 text-xs italic border-2 border-dashed border-woodex-600 rounded-lg">
                    No leads in this stage
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadGeneration;
