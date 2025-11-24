import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { CHART_DATA } from '../constants';

const Analytics: React.FC = () => {
  const productData = [
    { name: 'Executive Desks', value: 45 },
    { name: 'Workstations', value: 30 },
    { name: 'Seating', value: 15 },
    { name: 'Storage', value: 10 },
  ];

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-2xl font-bold text-white">Performance Analytics</h2>
          <p className="text-gray-400 text-sm mt-1">Key Performance Indicators (KPIs) and Growth Metrics.</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Revenue Chart */}
         <div className="bg-[#1E1E1E] p-6 rounded-xl border border-woodex-600">
            <h3 className="text-lg font-semibold text-white mb-6">Revenue Trend</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis stroke="#666" tick={{fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}M`} />
                  <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#333', color: '#fff' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Sales by Category */}
         <div className="bg-[#1E1E1E] p-6 rounded-xl border border-woodex-600">
            <h3 className="text-lg font-semibold text-white mb-6">Sales by Category</h3>
            <div className="h-72">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={productData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                    <XAxis type="number" stroke="#666" hide />
                    <YAxis dataKey="name" type="category" stroke="#999" width={100} tick={{fontSize: 12}} />
                    <Tooltip cursor={{fill: '#252525'}} contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#333', color: '#fff' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {productData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                 </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
       </div>
    </div>
  );
};

export default Analytics;
