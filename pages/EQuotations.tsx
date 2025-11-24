
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_EQUOTATIONS } from '../constants';
import { Status, EQuotation, QuotationItem } from '../types';
import { Plus, FileText, Send, MoreHorizontal, Download, Eye, Search, Filter, X, Save, ArrowLeft, Printer, Trash2 } from 'lucide-react';

const EQuotations: React.FC = () => {
  const [viewMode, setViewMode] = useState<'LIST' | 'CREATE' | 'PREVIEW'>('LIST');
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [quotations, setQuotations] = useState<EQuotation[]>(MOCK_EQUOTATIONS);
  const [selectedQuotation, setSelectedQuotation] = useState<EQuotation | null>(null);

  // --- New Quotation Form State ---
  const [formData, setFormData] = useState<Partial<EQuotation>>({
    clientName: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    validityDays: 15,
    advancePercent: 75,
    deliveryTime: '6 to 7 Days',
    transportationTerms: 'Outstation charges depend on city, quantity and load'
  });
  const [formItems, setFormItems] = useState<QuotationItem[]>([
    { id: '1', srNo: 1, item: '', description: '', qty: 1, unitPrice: 0, total: 0 }
  ]);

  // Calculate Next ID
  const getNextId = () => {
    const ids = quotations.map(q => parseInt(q.id.replace('WF-', '')));
    const maxId = Math.max(...ids, 10103);
    return `WF-${maxId + 1}`;
  };

  const filteredQuotations = quotations.filter(quote => {
    const matchesTab = activeTab === 'All' || quote.status === activeTab;
    const matchesSearch = quote.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          quote.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleAddItem = () => {
    const nextSr = formItems.length + 1;
    setFormItems([...formItems, { id: Date.now().toString(), srNo: nextSr, item: '', description: '', qty: 1, unitPrice: 0, total: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    const updated = formItems.filter(i => i.id !== id).map((item, idx) => ({ ...item, srNo: idx + 1 }));
    setFormItems(updated);
  };

  const handleItemChange = (id: string, field: keyof QuotationItem, value: any) => {
    setFormItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'qty' || field === 'unitPrice') {
          updatedItem.total = Number(updatedItem.qty) * Number(updatedItem.unitPrice);
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateFinancials = () => {
    const subtotal = formItems.reduce((sum, item) => sum + item.total, 0);
    return {
      subtotal,
      rent: 0,
      advance: 0,
      tax: 0,
      shipping: 0,
      balanceDue: subtotal
    };
  };

  const handleSaveQuotation = () => {
    const financials = calculateFinancials();
    const newQuote: EQuotation = {
      id: getNextId(),
      clientName: formData.clientName || 'Unknown Client',
      location: formData.location || 'Unknown',
      status: Status.Pending,
      date: formData.date || new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + (formData.validityDays || 15) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: formItems,
      financials: financials,
      validityDays: formData.validityDays || 15,
      advancePercent: formData.advancePercent || 75,
      deliveryTime: formData.deliveryTime || '6 to 7 Days',
      transportationTerms: formData.transportationTerms || ''
    };

    setQuotations([newQuote, ...quotations]);
    setSelectedQuotation(newQuote);
    setViewMode('PREVIEW');
  };

  // --- Components ---

  const QuotationTemplate: React.FC<{ data: EQuotation }> = ({ data }) => {
    return (
      <div className="bg-white text-black p-8 max-w-[210mm] mx-auto shadow-2xl min-h-[297mm] relative print:shadow-none print:w-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#8dc63f] rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-[#d1e8a8]">
              W
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1e3a8a]">WoodEx Furniture</h1>
              <p className="text-sm text-gray-600">LG 89 Zainab Tower, Model Town, Link Road, Lahore</p>
              <p className="text-sm font-bold text-gray-800">93 322 4000768</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-400 uppercase tracking-wider">Quotation</h2>
            <div className="mt-2 inline-block border-b-2 border-gray-300 pb-1">
              <span className="font-bold text-[#1e3a8a] text-lg">NO. {data.id}</span>
            </div>
            <div className="flex justify-end bg-gray-200 mt-2 px-2 py-1 rounded-t-md">
               <div className="text-xs font-bold mr-2">Date</div>
               <div className="text-xs">{data.date}</div>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="mb-6 pl-2">
          <div className="grid grid-cols-[100px_1fr] gap-y-1">
            <div className="font-bold text-gray-700">Company</div>
            <div>{data.clientName}</div>
            <div className="font-bold text-gray-700">Location:</div>
            <div>{data.location}</div>
          </div>
        </div>

        {/* Table */}
        <div className="mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#458926] text-white uppercase text-sm">
                <th className="py-2 px-2 text-center w-12 border border-[#458926]">Sr:</th>
                <th className="py-2 px-2 text-left w-32 border border-[#458926]">Item</th>
                <th className="py-2 px-2 text-left border border-[#458926]">DESCRIPTION</th>
                <th className="py-2 px-2 text-center w-16 border border-[#458926]">QTY</th>
                <th className="py-2 px-2 text-right w-28 border border-[#458926]">UNIT PRICE</th>
                <th className="py-2 px-2 text-right w-28 border border-[#458926]">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, idx) => (
                <tr key={idx} className="text-sm">
                  <td className="border border-black px-2 py-3 text-center">{item.srNo}</td>
                  <td className="border border-black px-2 py-3 font-bold">{item.item}</td>
                  <td className="border border-black px-2 py-3">{item.description}</td>
                  <td className="border border-black px-2 py-3 text-center">{item.qty}</td>
                  <td className="border border-black px-2 py-3 text-right">{item.unitPrice.toFixed(2)}</td>
                  <td className="border border-black px-2 py-3 text-right">{item.total.toFixed(2)}</td>
                </tr>
              ))}
              {/* Filler Rows to mimic PDF look */}
              {[...Array(Math.max(0, 6 - data.items.length))].map((_, i) => (
                 <tr key={`fill-${i}`} className="h-8">
                    <td className="border border-black"></td>
                    <td className="border border-black"></td>
                    <td className="border border-black"></td>
                    <td className="border border-black"></td>
                    <td className="border border-black"></td>
                    <td className="border border-black text-right">{i === 5 ? '0.00' : ''}</td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Financials */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-1 px-2 font-bold text-gray-800 text-sm">
              <span>SUBTOTAL</span>
              <span>Rs: {data.financials.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 px-2 border-b border-gray-300 text-sm">
              <span className="font-bold text-gray-700">Rent</span>
              <span></span>
            </div>
             <div className="flex justify-between py-1 px-2 font-bold text-gray-800 text-sm">
              <span>SUBTOTAL</span>
              <span>Rs: {data.financials.subtotal.toLocaleString()}</span>
            </div>
             <div className="flex justify-between py-1 px-2 border-b border-gray-300 text-sm">
              <span className="font-bold text-gray-700">Advance</span>
              <span>Rs: {data.financials.advance.toLocaleString()}</span>
            </div>
             <div className="flex justify-between py-1 px-2 border-b border-gray-300 text-sm">
              <span className="font-bold text-gray-700">TOTAL TAX</span>
              <span></span>
            </div>
             <div className="flex justify-between py-1 px-2 border-b border-black font-bold text-gray-700 text-sm">
              <span>SHIPPING/HANDLING</span>
              <span>Rs: {data.financials.shipping || 0}</span>
            </div>
             <div className="flex justify-between py-2 px-2 font-bold text-black text-lg">
              <span>Balance Due</span>
              <span>Rs: {data.financials.balanceDue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Terms Footer */}
        <div className="mt-auto text-sm text-gray-800 border-t-2 border-[#8dc63f] pt-4">
           <div className="grid grid-cols-[160px_1fr] gap-y-1 mb-8">
              <div className="font-bold">Quotation Validity</div>
              <div>{data.validityDays} Days</div>
              
              <div className="font-bold">Advance</div>
              <div>{data.advancePercent}%</div>
              
              <div className="font-bold">Delivery Time</div>
              <div>{data.deliveryTime}</div>
              
              <div className="font-bold">Transportation</div>
              <div>{data.transportationTerms}</div>
              
              <div className="font-bold">Taxes</div>
              <div>The above quote excludes all applicable taxes.</div>
           </div>
           
           <div className="bg-gray-300 text-center font-bold py-1 text-xs uppercase">
             Thank You For Your Business!
           </div>
        </div>
        
        {/* Footer Green Bar */}
        <div className="absolute bottom-0 right-0 w-1/3 h-4 bg-[#458926]"></div>
      </div>
    );
  };

  const renderBuilder = () => (
    <div className="max-w-5xl mx-auto bg-[#1E1E1E] border border-woodex-600 rounded-xl p-8">
       <div className="flex items-center gap-4 mb-8 border-b border-woodex-600 pb-4">
         <button onClick={() => setViewMode('LIST')} className="p-2 bg-[#252525] rounded-full hover:bg-[#333] transition-colors"><ArrowLeft size={20}/></button>
         <h2 className="text-xl font-bold text-white">Create Master Quotation</h2>
         <div className="ml-auto bg-[#252525] px-3 py-1 rounded text-sm text-gray-400 font-mono">
            Next ID: {getNextId()}
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
             <label className="text-xs font-medium text-gray-400">Client Company</label>
             <input type="text" value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} className="w-full bg-[#121212] border border-woodex-600 rounded px-3 py-2 text-sm text-white focus:border-teal-500 outline-none" placeholder="e.g. Pachem Global" />
          </div>
          <div className="space-y-2">
             <label className="text-xs font-medium text-gray-400">Location</label>
             <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-[#121212] border border-woodex-600 rounded px-3 py-2 text-sm text-white focus:border-teal-500 outline-none" placeholder="e.g. Model Town, Lahore" />
          </div>
       </div>

       <div className="mb-8">
          <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Line Items</h3>
          <div className="space-y-3">
             {formItems.map((item, index) => (
               <div key={item.id} className="grid grid-cols-12 gap-3 items-start bg-[#252525] p-3 rounded-lg border border-woodex-600">
                  <div className="col-span-1 pt-2 text-center text-gray-500 font-mono text-xs">{index + 1}</div>
                  <div className="col-span-3 space-y-2">
                     <input type="text" value={item.item} onChange={(e) => handleItemChange(item.id, 'item', e.target.value)} placeholder="Item Name" className="w-full bg-[#121212] border border-woodex-600 rounded px-2 py-1 text-sm text-white font-medium" />
                  </div>
                  <div className="col-span-4 space-y-2">
                     <textarea value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} placeholder="Detailed Description" rows={2} className="w-full bg-[#121212] border border-woodex-600 rounded px-2 py-1 text-xs text-gray-300 resize-none" />
                  </div>
                  <div className="col-span-1">
                     <input type="number" value={item.qty} onChange={(e) => handleItemChange(item.id, 'qty', Number(e.target.value))} className="w-full bg-[#121212] border border-woodex-600 rounded px-2 py-1 text-sm text-white text-center" />
                  </div>
                  <div className="col-span-2">
                     <input type="number" value={item.unitPrice} onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))} placeholder="Price" className="w-full bg-[#121212] border border-woodex-600 rounded px-2 py-1 text-sm text-white text-right" />
                  </div>
                  <div className="col-span-1 flex flex-col items-end justify-between h-full">
                     <div className="text-sm font-bold text-teal-400 pt-1">{item.total.toLocaleString()}</div>
                     {formItems.length > 1 && (
                       <button onClick={() => handleRemoveItem(item.id)} className="text-red-400 hover:text-red-300"><Trash2 size={14}/></button>
                     )}
                  </div>
               </div>
             ))}
          </div>
          <button onClick={handleAddItem} className="mt-4 flex items-center gap-2 text-xs font-medium text-teal-400 hover:text-teal-300 uppercase tracking-wide">
             <Plus size={14} /> Add Line Item
          </button>
       </div>

       <div className="flex justify-end mb-8">
          <div className="w-64 bg-[#252525] p-4 rounded-xl border border-woodex-600">
             <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white font-bold">{calculateFinancials().subtotal.toLocaleString()}</span>
             </div>
             <div className="flex justify-between pt-2 border-t border-woodex-600 text-lg font-bold">
                <span className="text-teal-400">Total</span>
                <span className="text-white">{calculateFinancials().subtotal.toLocaleString()}</span>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-t border-woodex-600 pt-6">
          <div className="space-y-2">
             <label className="text-xs font-medium text-gray-400">Delivery Time</label>
             <input type="text" value={formData.deliveryTime} onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})} className="w-full bg-[#121212] border border-woodex-600 rounded px-3 py-2 text-sm text-white" />
          </div>
          <div className="space-y-2">
             <label className="text-xs font-medium text-gray-400">Transport Terms</label>
             <input type="text" value={formData.transportationTerms} onChange={(e) => setFormData({...formData, transportationTerms: e.target.value})} className="w-full bg-[#121212] border border-woodex-600 rounded px-3 py-2 text-sm text-white" />
          </div>
       </div>

       <div className="flex justify-end gap-3">
          <button onClick={() => setViewMode('LIST')} className="px-6 py-2.5 rounded-lg text-gray-400 hover:bg-[#252525] transition-colors">Cancel</button>
          <button onClick={handleSaveQuotation} className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium shadow-lg shadow-teal-500/20 flex items-center gap-2">
             <Save size={18} /> Save & Preview
          </button>
       </div>
    </div>
  );

  // --- Main Render ---

  if (viewMode === 'PREVIEW' && selectedQuotation) {
     return (
       <div className="space-y-6">
          <div className="flex items-center justify-between">
             <button onClick={() => setViewMode('LIST')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
               <ArrowLeft size={20} /> Back to Dashboard
             </button>
             <div className="flex gap-3">
                <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg">
                   <Printer size={18} /> Print PDF
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#252525] text-white border border-woodex-600 rounded-lg hover:bg-[#333] transition-colors">
                   <Download size={18} /> Download
                </button>
             </div>
          </div>
          <div className="overflow-auto py-8 bg-gray-100 rounded-xl border border-woodex-600">
             <QuotationTemplate data={selectedQuotation} />
          </div>
       </div>
     );
  }

  if (viewMode === 'CREATE') {
     return renderBuilder();
  }

  // List View
  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">E-Quotation System</h2>
          <p className="text-gray-400 mt-1">Master tracking system with WF-Series</p>
        </div>
        <button 
          onClick={() => setViewMode('CREATE')}
          className="flex items-center gap-2 px-6 py-2.5 bg-teal-500 hover:bg-teal-600 rounded-lg text-white font-medium transition-colors shadow-lg shadow-teal-500/20"
        >
          <Plus size={18} /> New Quotation
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1E1E1E] border border-woodex-600 rounded-xl p-5">
           <div className="text-sm text-gray-400 font-medium bg-[#252525] inline-block px-2 py-0.5 rounded mb-2">Total Quotations</div>
           <div className="text-3xl font-bold text-white">{quotations.length}</div>
        </div>
        <div className="bg-[#1E1E1E] border border-woodex-600 rounded-xl p-5">
           <div className="text-sm text-gray-400 font-medium bg-[#252525] inline-block px-2 py-0.5 rounded mb-2">Approved</div>
           <div className="text-3xl font-bold text-white">{quotations.filter(q => q.status === Status.Approved).length}</div>
        </div>
        <div className="bg-[#1E1E1E] border border-woodex-600 rounded-xl p-5">
           <div className="text-sm text-gray-400 font-medium bg-[#252525] inline-block px-2 py-0.5 rounded mb-2">Pending</div>
           <div className="text-3xl font-bold text-white">{quotations.filter(q => q.status === Status.Pending).length}</div>
        </div>
        <div className="bg-[#1E1E1E] border border-woodex-600 rounded-xl p-5">
           <div className="text-sm text-gray-400 font-medium bg-[#252525] inline-block px-2 py-0.5 rounded mb-2">Total Value</div>
           <div className="text-3xl font-bold text-white">$1.2M</div>
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-end sm:items-center">
        <div className="flex bg-[#1E1E1E] p-1 rounded-lg border border-woodex-600">
          {['All Quotations', 'Pending', 'Approved', 'Rejected'].map((tab) => {
             const tabName = tab.split(' ')[0] as any;
             return (
              <button
                key={tab}
                onClick={() => setActiveTab(tabName)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tabName ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
              >
                {tab}
              </button>
             );
          })}
        </div>
      </div>

      {/* Quotation List */}
      <div className="space-y-4">
        {filteredQuotations.map((quote) => (
          <div key={quote.id} className="bg-[#1E1E1E] border border-woodex-600 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-teal-500/30 transition-all group">
             <div className="flex items-start gap-4">
               <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 flex-shrink-0 font-bold font-mono text-xs">
                 {quote.id.split('-')[1]}
               </div>
               <div>
                 <div className="flex items-center gap-3 mb-1">
                   <h3 className="text-lg font-bold text-white">{quote.id}</h3>
                   <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                     quote.status === Status.Approved ? 'bg-teal-500 text-white border-teal-600' :
                     quote.status === Status.Rejected ? 'bg-red-500 text-white border-red-600' :
                     'bg-[#252525] text-gray-400 border-gray-600'
                   }`}>
                     {quote.status === Status.Approved ? '✓ Approved' : 
                      quote.status === Status.Rejected ? 'ⓧ Rejected' : 
                      `🕒 ${quote.status}`}
                   </span>
                 </div>
                 <div className="text-gray-400 font-medium mb-1">{quote.clientName}</div>
                 <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Created: {quote.date}</span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span>{quote.items.length} Items</span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span>{quote.location}</span>
                 </div>
               </div>
             </div>

             <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
               <div className="text-right">
                 <div className="text-xs text-gray-500 mb-1">Total Amount</div>
                 <div className="text-2xl font-bold text-teal-400">{quote.financials.subtotal.toLocaleString()}</div>
               </div>

               <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => { setSelectedQuotation(quote); setViewMode('PREVIEW'); }} className="p-2 border border-woodex-600 rounded-lg text-gray-400 hover:bg-[#252525] hover:text-white transition-colors" title="View">
                   <Eye size={18} />
                 </button>
                 <button onClick={() => { setSelectedQuotation(quote); setViewMode('PREVIEW'); setTimeout(() => window.print(), 500); }} className="p-2 border border-woodex-600 rounded-lg text-gray-400 hover:bg-[#252525] hover:text-white transition-colors" title="Print">
                   <Printer size={18} />
                 </button>
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EQuotations;
