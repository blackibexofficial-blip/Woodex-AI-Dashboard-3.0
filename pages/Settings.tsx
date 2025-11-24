
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  Globe, 
  Save, 
  Database, 
  MessageSquare, 
  CheckCircle2, 
  Camera, 
  Mail, 
  Smartphone,
  Shield,
  CreditCard,
  LogOut,
  Sparkles,
  Building
} from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'integrations' | 'notifications' | 'security' | 'ai'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  // Config State
  const [supabaseConfig, setSupabaseConfig] = useState({ url: '', key: '' });
  const [whatsappConfig, setWhatsappConfig] = useState({ phoneId: '', token: '' });
  const [profile, setProfile] = useState({ firstName: 'Admin', lastName: 'User', email: 'admin@woodex.pk', phone: '+92 300 123 4567', bio: 'Senior Manager at Woodex Retail.' });
  
  // AI Settings State
  const [aiSettings, setAiSettings] = useState({
    enableQuotations: true,
    enableRecommendations: true,
    enableAutoResponse: false,
    model: 'gemini-2.5-flash',
    tone: 'Professional'
  });

  useEffect(() => {
    const url = localStorage.getItem('woodex_supabase_url') || '';
    const key = localStorage.getItem('woodex_supabase_key') || '';
    const phoneId = localStorage.getItem('woodex_wa_phone_id') || '';
    const token = localStorage.getItem('woodex_wa_token') || '';
    
    setSupabaseConfig({ url, key });
    setWhatsappConfig({ phoneId, token });
  }, []);

  const handleSave = () => {
    setIsLoading(true);
    
    // Save to LocalStorage
    localStorage.setItem('woodex_supabase_url', supabaseConfig.url);
    localStorage.setItem('woodex_supabase_key', supabaseConfig.key);
    localStorage.setItem('woodex_wa_phone_id', whatsappConfig.phoneId);
    localStorage.setItem('woodex_wa_token', whatsappConfig.token);
    
    // Save AI Settings (Mock persistence)
    console.log('AI Settings Saved:', aiSettings);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
      
      // Reload to apply changes if needed, or just let the user know
      if (activeTab === 'integrations') {
         window.location.reload();
      }
    }, 1000);
  };

  const renderProfileTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Avatar Section */}
      <div className="flex items-center gap-6 p-6 bg-[#1E1E1E] border border-woodex-600 rounded-xl">
        <div className="relative group cursor-pointer">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-3xl font-bold text-white border-4 border-[#252525]">
            {profile.firstName[0]}{profile.lastName[0]}
          </div>
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={24} className="text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Profile Photo</h3>
          <p className="text-sm text-gray-400 mb-3">This will be displayed on your profile.</p>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-[#252525] hover:bg-[#333] border border-woodex-600 rounded-lg text-xs font-medium text-white transition-colors">Change Photo</button>
            <button className="px-4 py-2 hover:bg-red-500/10 text-red-400 rounded-lg text-xs font-medium transition-colors">Remove</button>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-[#1E1E1E] border border-woodex-600 rounded-xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white border-b border-woodex-600 pb-4">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400">First Name</label>
            <input 
              type="text" 
              value={profile.firstName}
              onChange={e => setProfile({...profile, firstName: e.target.value})}
              className="w-full bg-[#121212] border border-woodex-600 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400">Last Name</label>
            <input 
              type="text" 
              value={profile.lastName}
              onChange={e => setProfile({...profile, lastName: e.target.value})}
              className="w-full bg-[#121212] border border-woodex-600 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="email" 
                value={profile.email}
                onChange={e => setProfile({...profile, email: e.target.value})}
                className="w-full bg-[#121212] border border-woodex-600 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400">Phone Number</label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                value={profile.phone}
                onChange={e => setProfile({...profile, phone: e.target.value})}
                className="w-full bg-[#121212] border border-woodex-600 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="text-xs font-medium text-gray-400">Bio</label>
            <textarea 
              value={profile.bio}
              onChange={e => setProfile({...profile, bio: e.target.value})}
              rows={3}
              className="w-full bg-[#121212] border border-woodex-600 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-none"
            />
            <p className="text-xs text-gray-500">Brief description for your profile. URLs are hyperlinked.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-4">
        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
          <Database size={24} />
        </div>
        <div>
          <h4 className="text-blue-400 font-medium">Live Database Connection</h4>
          <p className="text-sm text-gray-300 mt-1">
            Connecting to Supabase enables real-time data sync with your live website. 
            Keys are stored locally in your browser.
          </p>
        </div>
      </div>

      {/* Supabase Config */}
      <div className="bg-[#1E1E1E] border border-woodex-600 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Database size={18} className="text-green-400" /> Supabase Configuration
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${supabaseConfig.url ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-700/30 text-gray-400 border-gray-600'}`}>
            {supabaseConfig.url ? 'Connected' : 'Not Configured'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400">Project URL</label>
            <input 
              type="text" 
              placeholder="https://your-project.supabase.co"
              value={supabaseConfig.url}
              onChange={(e) => setSupabaseConfig({...supabaseConfig, url: e.target.value})}
              className="w-full bg-[#121212] border border-woodex-600 rounded-lg px-4 py-2.5 text-sm text-white font-mono focus:border-green-500 focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400">API Key (anon/public)</label>
            <input 
              type="password" 
              placeholder="your-public-anon-key"
              value={supabaseConfig.key}
              onChange={(e) => setSupabaseConfig({...supabaseConfig, key: e.target.value})}
              className="w-full bg-[#121212] border border-woodex-600 rounded-lg px-4 py-2.5 text-sm text-white font-mono focus:border-green-500 focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* WhatsApp Config */}
      <div className="bg-[#1E1E1E] border border-woodex-600 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <MessageSquare size={18} className="text-green-400" /> WhatsApp Cloud API
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${whatsappConfig.token ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-700/30 text-gray-400 border-gray-600'}`}>
            {whatsappConfig.token ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
             <label className="text-xs font-medium text-gray-400">Phone Number ID</label>
             <input 
               type="text" 
               placeholder="123456789..."
               value={whatsappConfig.phoneId}
               onChange={(e) => setWhatsappConfig({...whatsappConfig, phoneId: e.target.value})}
               className="w-full bg-[#121212] border border-woodex-600 rounded-lg px-4 py-2.5 text-sm text-white font-mono focus:border-green-500 focus:outline-none transition-all"
             />
          </div>
          <div className="space-y-2">
             <label className="text-xs font-medium text-gray-400">Permanent Access Token</label>
             <input 
               type="password" 
               placeholder="EAAG..."
               value={whatsappConfig.token}
               onChange={(e) => setWhatsappConfig({...whatsappConfig, token: e.target.value})}
               className="w-full bg-[#121212] border border-woodex-600 rounded-lg px-4 py-2.5 text-sm text-white font-mono focus:border-green-500 focus:outline-none transition-all"
             />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAISettingsTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#1E1E1E] border border-woodex-600 rounded-xl p-8 space-y-8">
        <h3 className="text-lg font-semibold text-white">AI Configuration</h3>

        {/* Toggles Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">AI-Powered Quotations</h4>
              <p className="text-xs text-gray-400 mt-1">Enable AI to generate quotations automatically</p>
            </div>
            <button 
              onClick={() => setAiSettings({...aiSettings, enableQuotations: !aiSettings.enableQuotations})}
              className={`w-12 h-6 rounded-full relative transition-colors duration-200 ease-in-out ${aiSettings.enableQuotations ? 'bg-teal-500' : 'bg-gray-600'}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${aiSettings.enableQuotations ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">Smart Product Recommendations</h4>
              <p className="text-xs text-gray-400 mt-1">AI suggests products based on customer behavior</p>
            </div>
             <button 
              onClick={() => setAiSettings({...aiSettings, enableRecommendations: !aiSettings.enableRecommendations})}
              className={`w-12 h-6 rounded-full relative transition-colors duration-200 ease-in-out ${aiSettings.enableRecommendations ? 'bg-teal-500' : 'bg-gray-600'}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${aiSettings.enableRecommendations ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">Automated Responses</h4>
              <p className="text-xs text-gray-400 mt-1">AI handles customer inquiries on WhatsApp</p>
            </div>
             <button 
              onClick={() => setAiSettings({...aiSettings, enableAutoResponse: !aiSettings.enableAutoResponse})}
              className={`w-12 h-6 rounded-full relative transition-colors duration-200 ease-in-out ${aiSettings.enableAutoResponse ? 'bg-teal-500' : 'bg-gray-600'}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${aiSettings.enableAutoResponse ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Dropdowns Section */}
        <div className="space-y-6 pt-6 border-t border-woodex-600">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400">AI Model</label>
            <select 
              value={aiSettings.model}
              onChange={(e) => setAiSettings({...aiSettings, model: e.target.value})}
              className="w-full bg-[#F9FAFB] dark:bg-[#121212] border border-woodex-600 rounded-lg px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 focus:border-teal-500 focus:outline-none transition-all"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
              <option value="gemini-pro">Gemini Pro</option>
              <option value="gpt-4">GPT-4 (via API)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400">Response Tone</label>
             <select 
              value={aiSettings.tone}
              onChange={(e) => setAiSettings({...aiSettings, tone: e.target.value})}
              className="w-full bg-[#F9FAFB] dark:bg-[#121212] border border-woodex-600 rounded-lg px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 focus:border-teal-500 focus:outline-none transition-all"
            >
              <option value="Professional">Professional</option>
              <option value="Friendly">Friendly</option>
              <option value="Persuasive">Persuasive</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>
        
        {/* Local Save Button (as per screenshot) */}
         <div className="mt-4">
             <button 
               onClick={handleSave}
               className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-teal-500/20"
             >
               Save AI Settings
             </button>
          </div>

      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Settings</h2>
        <p className="text-gray-400 mt-2">Manage your application preferences and configurations</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-1">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-[#F3F4F6] dark:bg-gray-100 text-black font-semibold' : 'text-gray-400 hover:bg-[#1E1E1E] hover:text-white'}`}
            style={activeTab === 'profile' ? { backgroundColor: '#F3F4F6', color: '#111827' } : {}}
          >
            <User size={18} /> Profile
          </button>
           <button 
            onClick={() => setActiveTab('integrations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'integrations' ? 'bg-[#F3F4F6] dark:bg-gray-100 text-black font-semibold' : 'text-gray-400 hover:bg-[#1E1E1E] hover:text-white'}`}
             style={activeTab === 'integrations' ? { backgroundColor: '#F3F4F6', color: '#111827' } : {}}
          >
            <Globe size={18} /> Company
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'notifications' ? 'bg-[#F3F4F6] dark:bg-gray-100 text-black font-semibold' : 'text-gray-400 hover:bg-[#1E1E1E] hover:text-white'}`}
             style={activeTab === 'notifications' ? { backgroundColor: '#F3F4F6', color: '#111827' } : {}}
          >
            <Bell size={18} /> Notifications
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'security' ? 'bg-[#F3F4F6] dark:bg-gray-100 text-black font-semibold' : 'text-gray-400 hover:bg-[#1E1E1E] hover:text-white'}`}
             style={activeTab === 'security' ? { backgroundColor: '#F3F4F6', color: '#111827' } : {}}
          >
            <Shield size={18} /> Security
          </button>
           <button 
            onClick={() => setActiveTab('ai')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'ai' ? 'bg-[#F3F4F6] dark:bg-gray-100 text-black font-semibold' : 'text-gray-400 hover:bg-[#1E1E1E] hover:text-white'}`}
             style={activeTab === 'ai' ? { backgroundColor: '#F3F4F6', color: '#111827' } : {}}
          >
            <Sparkles size={18} /> AI Settings
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'integrations' && renderIntegrationsTab()}
          {activeTab === 'ai' && renderAISettingsTab()}
          
          {activeTab === 'notifications' && (
            <div className="bg-[#1E1E1E] border border-woodex-600 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-semibold text-white mb-4">Email Notifications</h3>
              <div className="space-y-4">
                {['New Lead Assigned', 'Order Status Updates', 'System Alerts', 'Weekly Analytics Report'].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 hover:bg-[#252525] rounded-lg transition-colors">
                    <span className="text-sm text-gray-300">{item}</span>
                    <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${i < 3 ? 'bg-blue-600' : 'bg-gray-600'}`}>
                      <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${i < 3 ? 'left-6' : 'left-1'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
             <div className="bg-[#1E1E1E] border border-woodex-600 rounded-xl p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h3 className="text-lg font-semibold text-white">Change Password</h3>
               <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <input type="password" className="w-full bg-[#121212] border border-woodex-600 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <input type="password" className="w-full bg-[#121212] border border-woodex-600 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none" />
                    </div>
                 </div>
               </div>
               <div className="pt-6 border-t border-woodex-600">
                  <button className="text-red-400 text-sm font-medium flex items-center gap-2 hover:text-red-300 transition-colors">
                    <LogOut size={16} /> Log out of all sessions
                  </button>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
    