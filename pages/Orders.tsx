import React from 'react';
import { MOCK_ORDERS } from '../constants';
import { Status } from '../types';
import { Search, Filter, Eye, MoreVertical, Download } from 'lucide-react';

const Orders: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Order Management</h2>
          <p className="text-gray-400 text-sm mt-1">Track and process customer orders.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="bg-[#1E1E1E] border border-woodex-600 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500 w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#252525] border border-woodex-600 rounded-lg text-sm text-gray-300 hover:text-white transition-colors">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      <div className="bg-[#1E1E1E] rounded-xl border border-woodex-600 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#252525] text-xs uppercase font-semibold border-b border-woodex-600">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-woodex-600">
              {MOCK_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-[#252525]/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{order.id}</td>
                  <td className="px-6 py-4 text-blue-400">{order.customer}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">{order.items} items</td>
                  <td className="px-6 py-4 text-white font-bold">{order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === Status.Completed || order.status === Status.Delivered ? 'bg-green-500/10 text-green-400' : 
                      order.status === Status.Pending ? 'bg-yellow-500/10 text-yellow-400' : 
                      order.status === Status.InTransit ? 'bg-purple-500/10 text-purple-400' :
                      'bg-blue-500/10 text-blue-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-[#333] rounded-full text-gray-400 hover:text-white transition-colors" title="View Details">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 hover:bg-[#333] rounded-full text-gray-400 hover:text-white transition-colors" title="Download Invoice">
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
