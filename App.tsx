import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import WhatsAppCRM from './pages/WhatsAppCRM';
import Products from './pages/Products';
import LeadGeneration from './pages/LeadGeneration';
import Orders from './pages/Orders';
import EQuotations from './pages/EQuotations';
import Deliveries from './pages/Deliveries';
import Showroom from './pages/Showroom';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
      <Sidebar />
      <div className="ml-60 min-h-screen flex flex-col">
        <Header title="WoodEx Dashboard" />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/whatsapp-crm" element={<WhatsAppCRM />} />
          <Route path="/products" element={<Products />} />
          <Route path="/leads" element={<LeadGeneration />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/quotations" element={<EQuotations />} />
          <Route path="/deliveries" element={<Deliveries />} />
          <Route path="/showroom" element={<Showroom />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
