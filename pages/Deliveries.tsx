import React from 'react';
import { MOCK_DELIVERIES } from '../constants';
import { Status } from '../types';
import { Truck, MapPin, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const Deliveries: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Logistics & Deliveries</h2>
          <p className="text-gray-400 text-sm mt-1">Track shipments and delivery schedules.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MOCK_DELIVERIES.map((delivery) => (
          <div key={delivery.id} className="bg-[#1E1E1E] p-5 rounded-xl border border-woodex-600 flex gap-4">
             <div className="flex-shrink-0">
               <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                 delivery.status === Status.Delivered ? 'bg-green-500/10 text-green-500' :
                 delivery.status === Status.InTransit ? 'bg-blue-500/10 text-blue-500 animate-pulse' :
                 'bg-gray-500/10 text-gray-500'
               }`}>
                 <Truck size={24} />
               </div>
             </div>
             <div className="flex-1">
               <div className="flex justify-between items-start">
                 <div>
                   <h3 className="font-bold text-white">{delivery.customer}</h3>
                   <div className="text-xs text-blue-400 font-medium mt-1">Order: {delivery.orderId}</div>
                 </div>
                 <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                    delivery.status === Status.Delivered ? 'bg-green-500 text-black' :
                    delivery.status === Status.InTransit ? 'bg-blue-500 text-white' :
                    'bg-gray-700 text-gray-300'
                 }`}>
                   {delivery.status}
                 </span>
               </div>
               
               <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <MapPin size={16} className="text-gray-500" /> {delivery.address}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Clock size={16} className="text-gray-500" /> {delivery.date}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Truck size={16} className="text-gray-500" /> Driver: {delivery.driver}
                  </div>
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Deliveries;
