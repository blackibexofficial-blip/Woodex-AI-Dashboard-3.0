import React from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Edit, Trash2, Plus, Filter, Download } from 'lucide-react';

const Products: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Inventory Management</h2>
          <p className="text-gray-400 text-sm mt-1">Manage your product catalog and stock levels.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#252525] border border-woodex-600 rounded-lg text-sm text-gray-300 hover:text-white transition-colors">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#252525] border border-woodex-600 rounded-lg text-sm text-gray-300 hover:text-white transition-colors">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white font-medium transition-colors shadow-lg shadow-blue-600/20">
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-[#1E1E1E] rounded-xl border border-woodex-600 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#252525] text-xs uppercase font-semibold border-b border-woodex-600">
              <tr>
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-woodex-600">
              {MOCK_PRODUCTS.map((product) => (
                <tr key={product.id} className="hover:bg-[#252525]/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-xs text-gray-500">
                        IMG
                      </div>
                      <div>
                        <div className="font-medium text-white">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4 text-white font-medium">${product.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                         <div className={`h-full rounded-full ${product.stock < 5 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(product.stock * 2, 100)}%` }}></div>
                      </div>
                      <span className="text-xs">{product.stock}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      product.status === 'Active' ? 'bg-green-500/10 text-green-400' : 
                      product.status === 'Low Stock' ? 'bg-red-500/10 text-red-400' : 'bg-gray-500/10 text-gray-400'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-blue-500/10 hover:text-blue-400 rounded transition-colors"><Edit size={16} /></button>
                      <button className="p-1.5 hover:bg-red-500/10 hover:text-red-400 rounded transition-colors"><Trash2 size={16} /></button>
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

export default Products;