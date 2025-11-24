import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Package, 
  FileText, 
  Settings, 
  LogOut, 
  ShoppingCart,
  PieChart,
  Truck,
  Store
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: MessageSquare, label: 'WhatsApp CRM', path: '/whatsapp-crm' },
    { icon: Users, label: 'Lead Generation', path: '/leads' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: ShoppingCart, label: 'Orders', path: '/orders' },
    { icon: FileText, label: 'E-Quotations', path: '/quotations' },
    { icon: Truck, label: 'Deliveries', path: '/deliveries' },
    { icon: Store, label: 'Showroom', path: '/showroom' },
    { icon: PieChart, label: 'Analytics', path: '/analytics' },
  ];

  return (
    <div className="w-60 h-screen bg-[#121212] border-r border-woodex-600 flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6 border-b border-woodex-600 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
          W
        </div>
        <span className="text-xl font-bold tracking-tight text-white">Woodex AI</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">Main Menu</div>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-blue-600/10 text-blue-400 font-medium'
                : 'text-gray-400 hover:bg-[#1E1E1E] hover:text-white'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}
        
        <div className="mt-6 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">System</div>
        <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-[#1E1E1E] hover:text-white transition-all">
            <Settings size={18} />
            Settings
        </Link>
      </nav>

      <div className="p-4 border-t border-woodex-600">
        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-all">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;