
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Paperclip, 
  Send, 
  MoreVertical, 
  Phone, 
  Video,
  User,
  Clock,
  CheckCircle2,
  Bot,
  FileText,
  X,
  Copy,
  Forward,
  Trash2,
  Loader2,
  Sparkles,
  BrainCircuit,
  Tag,
  MapPin,
  Mail,
  Briefcase,
  Zap,
  MessageCircle,
  Plus,
  CornerUpRight,
  LayoutDashboard,
  Users,
  Headphones,
  Settings,
  MessageSquare,
  Filter,
  MoreHorizontal,
  PenSquare,
  ChevronRight,
  Play,
  Pause,
  Edit3,
  UserPlus,
  Trophy,
  Target,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Shield
} from 'lucide-react';
import { MOCK_CONVERSATIONS, MOCK_TEMPLATES, MOCK_LEADS } from '../constants';
import { Conversation, Message, Template } from '../types';
import { generateDraftReply, analyzeConversation } from '../services/geminiService';

const WhatsAppCRM: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'contacts' | 'messages' | 'live-support' | 'templates' | 'settings' | 'agents' | 'automation'>('dashboard');
  
  // Chat State
  const [activeChat, setActiveChat] = useState<Conversation>(MOCK_CONVERSATIONS[0]);
  const [inputText, setInputText] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<'profile' | 'ai'>('profile');
  const [aiAnalysis, setAiAnalysis] = useState<{ summary: string; suggestions: string[] } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAutoPilot, setIsAutoPilot] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Template State
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);

  // Live Support State
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [supportInput, setSupportInput] = useState('');

  // CRM Settings State
  const [crmSettings, setCrmSettings] = useState({
    autoReply: true,
    workingHoursStart: '09:00',
    workingHoursEnd: '18:00',
    desktopNotifications: true,
    soundAlerts: false
  });

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'messages') {
      scrollToBottom();
    }
  }, [activeChat.messages, isUserTyping, activeTab]);

  // Trigger Analysis on Chat Change, New Message, or Tab Switch
  useEffect(() => {
    // Auto-run analysis if we are in the messages tab and the AI panel is open
    // OR if we just received a new message (length changed) to keep background state fresh
    if (activeTab === 'messages') {
      handleRunAnalysis();
    }
  }, [activeChat.messages.length, activeChat.id, rightPanelTab, activeTab]);

  const handleRunAnalysis = async () => {
    // Prevent double analysis if already running
    // if (isAnalyzing) return; 

    setIsAnalyzing(true);
    try {
      const result = await analyzeConversation(activeChat.messages);
      setAiAnalysis(result);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      // Small artificial delay to make the spinner visible to the user (UX)
      setTimeout(() => setIsAnalyzing(false), 500);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isSending) return;
    
    setIsSending(true);
    const textToSend = inputText;
    // Do not clear input immediately to keep context if needed, but here we clear for UX
    // We'll disable the input instead
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'agent',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setActiveChat(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      lastMessage: "You: " + textToSend,
      timestamp: "Just now"
    }));

    setInputText('');
    setIsSending(false);
  };

  // Demo Feature: Simulate Incoming Customer Message
  const handleSimulateIncoming = async () => {
    setIsUserTyping(true);
    
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsUserTyping(false);

    const responses = [
      "That sounds good. Can you send the official invoice?",
      "What are the payment terms for this?",
      "I need to check with my manager first.",
      "Is delivery included in this price?",
      "Thanks for the update!",
      "Can we schedule a call to discuss the layout?"
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const incomingMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: randomResponse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setActiveChat(prev => ({
      ...prev,
      messages: [...prev.messages, incomingMsg],
      unreadCount: prev.unreadCount + 1,
      lastMessage: randomResponse,
      timestamp: "Just now"
    }));

    // Auto-Pilot Logic
    if (isAutoPilot) {
      triggerAutoPilotResponse([...activeChat.messages, incomingMsg]);
    }
  };

  const triggerAutoPilotResponse = async (history: Message[]) => {
    setIsDrafting(true); // Reuse drafting spinner for bot thinking
    
    // 1. Analyze context
    const context = history.map(m => `${m.sender}: ${m.text}`).join('\n');
    
    // 2. Generate Reply
    const botReplyText = await generateDraftReply(context);
    
    await new Promise(resolve => setTimeout(resolve, 1500)); // Thinking delay

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: botReplyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setActiveChat(prev => ({
      ...prev,
      messages: [...prev.messages, botMsg],
      lastMessage: "Bot: " + botReplyText
    }));
    
    setIsDrafting(false);
  };

  const handleAIDraft = async () => {
    setIsDrafting(true);
    const context = activeChat.messages.map(m => `${m.sender}: ${m.text}`).join('\n');
    const draft = await generateDraftReply(context);
    setInputText(draft);
    setIsDrafting(false);
  };

  const selectTemplate = (text: string) => {
    setInputText(text);
    setShowTemplates(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleForward = (text: string) => {
    setInputText(`Fwd: ${text}`);
  };

  const handleDeleteMessage = (messageId: string) => {
    setActiveChat(prev => ({
      ...prev,
      messages: prev.messages.filter(m => m.id !== messageId)
    }));
  };

  const handleSmartAction = (action: string) => {
    const systemMsg: Message = {
      id: Date.now().toString(),
      sender: 'system',
      text: `Action Logged: ${action}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setActiveChat(prev => ({
      ...prev,
      messages: [...prev.messages, systemMsg]
    }));
    
    // Optional: Add a draft message relevant to the action
    if (action === 'Create Order') {
      setInputText("I've started the order process. Could you confirm your billing address?");
    } else if (action === 'Send Invoice') {
      setInputText("I've generated the invoice. Sending it over now.");
    }
  };

  // Live Support Handlers
  const handleResolveTicket = () => {
    if (!activeTicket) return;
    setActiveTicket({ ...activeTicket, status: 'Resolved' });
  };

  const handleSendSupportMessage = () => {
    if (!supportInput.trim() || !activeTicket) return;
    
    const newMsg = {
        id: Date.now().toString(),
        sender: 'agent',
        text: supportInput,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setActiveTicket({
        ...activeTicket,
        history: [...activeTicket.history, newMsg]
    });
    setSupportInput('');
  };

  const renderMessage = (msg: Message) => {
    if (msg.sender === 'system') {
      return (
        <div key={msg.id} className="flex justify-center my-4 animate-in fade-in zoom-in duration-300">
          <span className="bg-[#252525] text-gray-500 text-[10px] uppercase font-medium px-3 py-1 rounded-full border border-woodex-600 flex items-center gap-2">
            <Zap size={10} /> {msg.text}
          </span>
        </div>
      );
    }

    const isUser = msg.sender === 'user';
    const isBot = msg.sender === 'bot';
    
    return (
      <div key={msg.id} className={`flex items-center gap-2 group mb-4 ${isUser ? 'justify-start' : 'justify-end'}`}>
        {/* Agent/Bot Actions (Left of bubble) */}
        {!isUser && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 items-center px-2">
            <button onClick={() => handleCopy(msg.text)} title="Copy" className="p-1.5 text-gray-500 hover:text-white hover:bg-[#252525] rounded-full"><Copy size={14} /></button>
            <button onClick={() => handleForward(msg.text)} title="Forward" className="p-1.5 text-gray-500 hover:text-white hover:bg-[#252525] rounded-full"><Forward size={14} /></button>
            <button onClick={() => handleDeleteMessage(msg.id)} title="Delete" className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-[#252525] rounded-full"><Trash2 size={14} /></button>
          </div>
        )}

        {/* Message Bubble */}
        <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm shadow-sm relative ${
          isUser ? 'bg-[#252525] text-gray-200 rounded-tl-none border border-gray-700' : 
          isBot ? 'bg-purple-900/30 border border-purple-500/50 text-purple-100 rounded-tr-none' :
          'bg-blue-600 text-white rounded-tr-none shadow-blue-900/20'
        }`}>
          {isBot && (
            <div className="text-[10px] text-purple-300 font-bold mb-1 uppercase flex items-center gap-1">
              <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                <Bot size={10} className="text-white" />
              </div>
              AI Copilot
            </div>
          )}
          <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
          <div className={`flex items-center justify-end gap-1 mt-1`}>
            <span className={`text-[10px] ${isUser ? 'text-gray-500' : 'text-white/70'}`}>
              {msg.timestamp}
            </span>
            {!isUser && !isBot && <CheckCircle2 size={10} className="text-white/70" />}
          </div>
        </div>

        {/* User Actions (Right of bubble) */}
        {isUser && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 items-center px-2">
            <button onClick={() => handleCopy(msg.text)} title="Copy" className="p-1.5 text-gray-500 hover:text-white hover:bg-[#252525] rounded-full"><Copy size={14} /></button>
            <button onClick={() => handleForward(msg.text)} title="Forward" className="p-1.5 text-gray-500 hover:text-white hover:bg-[#252525] rounded-full"><Forward size={14} /></button>
            <button onClick={() => handleDeleteMessage(msg.id)} title="Delete" className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-[#252525] rounded-full"><Trash2 size={14} /></button>
          </div>
        )}
      </div>
    );
  };

  const renderDashboardTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1E1E1E] p-6 rounded-xl border border-woodex-600">
          <div className="flex justify-between items-start mb-4">
             <div>
               <div className="text-sm text-gray-400 font-medium">Total Conversations</div>
               <div className="text-2xl font-bold text-white mt-1">1,284</div>
             </div>
             <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
               <MessageSquare size={20} />
             </div>
          </div>
          <div className="text-xs text-green-400 flex items-center gap-1">
            <span className="text-green-400 font-bold">↑ 12%</span> from last week
          </div>
        </div>

        <div className="bg-[#1E1E1E] p-6 rounded-xl border border-woodex-600">
          <div className="flex justify-between items-start mb-4">
             <div>
               <div className="text-sm text-gray-400 font-medium">Active Contacts</div>
               <div className="text-2xl font-bold text-white mt-1">843</div>
             </div>
             <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
               <Users size={20} />
             </div>
          </div>
          <div className="text-xs text-green-400 flex items-center gap-1">
            <span className="text-green-400 font-bold">↑ 8%</span> new leads
          </div>
        </div>

        <div className="bg-[#1E1E1E] p-6 rounded-xl border border-woodex-600">
          <div className="flex justify-between items-start mb-4">
             <div>
               <div className="text-sm text-gray-400 font-medium">Messages Sent</div>
               <div className="text-2xl font-bold text-white mt-1">15.2k</div>
             </div>
             <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg">
               <Send size={20} />
             </div>
          </div>
          <div className="text-xs text-green-400 flex items-center gap-1">
            <span className="text-green-400 font-bold">↑ 23%</span> engagement
          </div>
        </div>

        <div className="bg-[#1E1E1E] p-6 rounded-xl border border-woodex-600">
          <div className="flex justify-between items-start mb-4">
             <div>
               <div className="text-sm text-gray-400 font-medium">Avg Response Time</div>
               <div className="text-2xl font-bold text-white mt-1">2m 34s</div>
             </div>
             <div className="p-2 bg-yellow-500/10 text-yellow-400 rounded-lg">
               <Clock size={20} />
             </div>
          </div>
          <div className="text-xs text-red-400 flex items-center gap-1">
            <span className="text-red-400 font-bold">↓ 15%</span> faster
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Conversations */}
        <div className="bg-[#1E1E1E] rounded-xl border border-woodex-600 p-6 h-96 flex flex-col">
           <h3 className="text-lg font-semibold text-white mb-4">Recent Conversations</h3>
           {MOCK_CONVERSATIONS.length > 0 ? (
             <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {MOCK_CONVERSATIONS.map((chat, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 hover:bg-[#252525] rounded-lg transition-colors border border-transparent hover:border-woodex-600 cursor-pointer" onClick={() => { setActiveChat(chat); setActiveTab('messages'); }}>
                     <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                       {chat.contactName.substring(0,2)}
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between">
                           <h4 className="text-sm font-medium text-white">{chat.contactName}</h4>
                           <span className="text-xs text-gray-500">{chat.timestamp}</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{chat.lastMessage}</p>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <MessageSquare size={32} className="mb-2 opacity-50" />
                <p>No conversations yet</p>
             </div>
           )}
        </div>

        {/* Analytics Bars */}
        <div className="bg-[#1E1E1E] rounded-xl border border-woodex-600 p-6 h-96 flex flex-col">
           <h3 className="text-lg font-semibold text-white mb-6">Today's Analytics</h3>
           
           <div className="space-y-8 flex-1">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Messages Delivered</span>
                  <span className="text-white font-bold">94%</span>
                </div>
                <div className="h-2 bg-[#252525] rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 w-[94%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Messages Read</span>
                  <span className="text-white font-bold">78%</span>
                </div>
                <div className="h-2 bg-[#252525] rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 w-[78%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Reply Rate</span>
                  <span className="text-white font-bold">45%</span>
                </div>
                <div className="h-2 bg-[#252525] rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 w-[45%] rounded-full"></div>
                </div>
              </div>
           </div>
           
           <div className="flex justify-between items-center pt-6 border-t border-woodex-600">
              <div>
                <div className="text-2xl font-bold text-green-500">156</div>
                <div className="text-xs text-gray-500">Successful</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">8</div>
                <div className="text-xs text-gray-500">Failed</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderContactsTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div className="relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
           <input type="text" placeholder="Search contacts..." className="bg-[#1E1E1E] border border-woodex-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white w-64 focus:border-blue-500 outline-none" />
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-[#1E1E1E] border border-woodex-600 rounded-lg text-sm text-gray-300 hover:text-white flex items-center gap-2">
             <Filter size={16} /> Filter
           </button>
           <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white font-medium flex items-center gap-2">
             <Plus size={16} /> Add Contact
           </button>
        </div>
      </div>

      <div className="bg-[#1E1E1E] border border-woodex-600 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-400">
           <thead className="bg-[#252525] text-xs uppercase font-semibold border-b border-woodex-600">
             <tr>
               <th className="px-6 py-4">Name</th>
               <th className="px-6 py-4">Phone</th>
               <th className="px-6 py-4">Company</th>
               <th className="px-6 py-4">Tags</th>
               <th className="px-6 py-4">Last Active</th>
               <th className="px-6 py-4 text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-woodex-600">
              {MOCK_LEADS.map((lead) => (
                <tr key={lead.id} className="hover:bg-[#252525] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-xs">
                         {lead.name.substring(0, 2)}
                       </div>
                       <div className="text-white font-medium">{lead.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{lead.phone}</td>
                  <td className="px-6 py-4">{lead.company}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-xs">Customer</span>
                  </td>
                  <td className="px-6 py-4">{lead.lastContact}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 hover:bg-[#333] rounded text-gray-400 hover:text-white transition-colors"><MoreHorizontal size={16} /></button>
                  </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>
    </div>
  );

  const renderAgentsTab = () => {
    const MOCK_AGENTS = [
      { id: 1, name: 'Sarah Johnson', role: 'Senior Sales Agent', email: 'sarah@woodex.com', phone: '+1 234-567-8901', location: 'New York, USA', status: 'active', performance: '94%', deals: 47, revenue: '$125K', initials: 'SJ', color: 'bg-teal-500' },
      { id: 2, name: 'Michael Chen', role: 'Sales Agent', email: 'michael@woodex.com', phone: '+1 234-567-8902', location: 'San Francisco, USA', status: 'active', performance: '87%', deals: 32, revenue: '$98K', initials: 'MC', color: 'bg-blue-500' },
      { id: 3, name: 'Emma Williams', role: 'Sales Agent', email: 'emma@woodex.com', phone: '+1 234-567-8903', location: 'London, UK', status: 'active', performance: '91%', deals: 39, revenue: '$112K', initials: 'EW', color: 'bg-purple-500' },
      { id: 4, name: 'James Martinez', role: 'Junior Sales Agent', email: 'james@woodex.com', phone: '+1 234-567-8904', location: 'Miami, USA', status: 'inactive', performance: '76%', deals: 18, revenue: '$45K', initials: 'JM', color: 'bg-orange-500' },
    ];

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Agent Management</h2>
            <p className="text-gray-400 text-sm mt-1">Manage your sales team and track performance</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-sm text-white font-medium transition-colors">
            <UserPlus size={16} /> Add Agent
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#1E1E1E] p-4 rounded-xl border border-woodex-600 flex items-center gap-4">
             <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg"><Users size={20} /></div>
             <div>
               <div className="text-xs text-gray-400">Total Agents</div>
               <div className="text-xl font-bold text-white">18</div>
             </div>
          </div>
          <div className="bg-[#1E1E1E] p-4 rounded-xl border border-woodex-600 flex items-center gap-4">
             <div className="p-3 bg-green-500/10 text-green-400 rounded-lg"><Zap size={20} /></div>
             <div>
               <div className="text-xs text-gray-400">Active Agents</div>
               <div className="text-xl font-bold text-white">15</div>
             </div>
          </div>
          <div className="bg-[#1E1E1E] p-4 rounded-xl border border-woodex-600 flex items-center gap-4">
             <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-lg"><Trophy size={20} /></div>
             <div>
               <div className="text-xs text-gray-400">Top Performer</div>
               <div className="text-xl font-bold text-white">Sofia A.</div>
             </div>
          </div>
          <div className="bg-[#1E1E1E] p-4 rounded-xl border border-woodex-600 flex items-center gap-4">
             <div className="p-3 bg-teal-500/10 text-teal-400 rounded-lg"><MessageSquare size={20} /></div>
             <div>
               <div className="text-xs text-gray-400">Total Deals</div>
               <div className="text-xl font-bold text-white">324</div>
             </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
             <input type="text" placeholder="Search agents..." className="w-full bg-[#1E1E1E] border border-woodex-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-teal-500 outline-none" />
           </div>
           <button className="p-2 bg-[#1E1E1E] border border-woodex-600 rounded-lg text-gray-400 hover:text-white"><Filter size={18} /></button>
        </div>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {MOCK_AGENTS.map(agent => (
             <div key={agent.id} className="bg-[#1E1E1E] rounded-xl border border-woodex-600 p-6 flex flex-col gap-4 hover:border-teal-500/30 transition-colors">
                <div className="flex justify-between items-start">
                   <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-full ${agent.color} flex items-center justify-center text-white font-bold text-sm`}>{agent.initials}</div>
                      <div>
                        <h3 className="font-bold text-white">{agent.name}</h3>
                        <p className="text-xs text-gray-400">{agent.role}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${agent.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-600/20 text-gray-500'}`}>
                        {agent.status}
                      </span>
                      <button className="text-gray-500 hover:text-white"><MoreVertical size={16} /></button>
                   </div>
                </div>

                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-xs text-gray-400"><Mail size={12} /> {agent.email}</div>
                   <div className="flex items-center gap-2 text-xs text-gray-400"><Phone size={12} /> {agent.phone}</div>
                   <div className="flex items-center gap-2 text-xs text-gray-400"><MapPin size={12} /> {agent.location}</div>
                </div>

                <div className="pt-4 border-t border-woodex-600 flex justify-between">
                   <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Performance</div>
                      <div className={`font-bold ${parseInt(agent.performance) > 90 ? 'text-green-400' : 'text-teal-400'}`}>{agent.performance}</div>
                   </div>
                   <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Deals</div>
                      <div className="font-bold text-white">{agent.deals}</div>
                   </div>
                   <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Revenue</div>
                      <div className="font-bold text-teal-400">{agent.revenue}</div>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    );
  };

  const renderAutomationTab = () => {
    const MOCK_RULES = [
      { id: 1, name: 'Welcome Message', description: 'Send welcome message to new contacts', trigger: 'new_contact', action: 'send_message', runs: 1, status: 'active' },
      { id: 2, name: 'Welcome Message', description: 'Send welcome message to new contacts', trigger: 'new_contact', action: 'send_message', runs: 0, status: 'inactive' },
      { id: 3, name: 'WoodEx Quote Follow-up', description: 'Follow up on quotation requests', trigger: 'keyword_match', action: 'send_message', runs: 0, status: 'active' },
      { id: 4, name: 'Price Inquiry', description: 'Auto-respond to pricing questions', trigger: 'keyword_match', action: 'send_message', runs: 1, status: 'active' },
      { id: 5, name: 'Price Inquiry', description: 'Auto-respond to pricing questions', trigger: 'keyword_match', action: 'send_message', runs: 0, status: 'active' },
    ];

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Automation Rules</h2>
            <p className="text-gray-400 text-sm mt-1">Create and manage automated WhatsApp responses</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#d4f032] hover:bg-[#c3dd2e] text-black rounded-lg text-sm font-medium transition-colors">
            <Plus size={16} /> Add Rule
          </button>
        </div>

        {/* Quick Templates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
           {[
             { title: 'Welcome Message', desc: 'Automatically greet new contacts', icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500' },
             { title: 'Price Inquiry', desc: 'Auto-respond to pricing questions', icon: Zap, color: 'text-green-400', bg: 'bg-green-500' },
             { title: 'Follow-up Sequence', desc: 'Automated follow-up messages', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500' },
           ].map((card, i) => (
             <div key={i} className="bg-[#1E1E1E] border border-woodex-600 p-5 rounded-xl hover:border-woodex-500 cursor-pointer transition-colors">
                <div className={`w-10 h-10 rounded-lg ${card.bg}/10 flex items-center justify-center mb-3`}>
                   <card.icon className={card.color} size={20} />
                </div>
                <h3 className="font-bold text-white mb-1">{card.title}</h3>
                <p className="text-xs text-gray-400 mb-3">{card.desc}</p>
                <span className={`text-xs ${card.color} font-medium hover:underline`}>Use Template</span>
             </div>
           ))}
        </div>

        {/* Rules List */}
        <div className="space-y-4">
           {MOCK_RULES.map(rule => (
             <div key={rule.id} className="bg-[#1E1E1E] border border-woodex-600 p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-gray-500 transition-colors">
                <div className="flex-1">
                   <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-white text-sm">{rule.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${rule.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-600/20 text-gray-500'}`}>
                        {rule.status}
                      </span>
                   </div>
                   <p className="text-xs text-gray-400 mb-2">{rule.description}</p>
                   <div className="flex items-center gap-4 text-[10px] text-gray-500 font-mono">
                      <span>Trigger: <span className="text-gray-300">{rule.trigger}</span></span>
                      <span>Action: <span className="text-gray-300">{rule.action}</span></span>
                      <span>Runs: <span className="text-gray-300">{rule.runs}</span></span>
                   </div>
                </div>
                
                <div className="flex items-center gap-2">
                   {rule.status === 'active' ? (
                     <button className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"><Pause size={18} /></button>
                   ) : (
                     <button className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors"><Play size={18} /></button>
                   )}
                   <button className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"><Edit3 size={18} /></button>
                   <button className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
                </div>
             </div>
           ))}
        </div>
      </div>
    );
  };

  const renderLiveSupportTab = () => {
    const MOCK_SUPPORT_QUEUE = [
      { id: 'TKT-201', user: 'Bilal Khan', issue: 'Damaged Delivery', priority: 'High', status: 'Open', waitTime: '15m', history: [ { id: '1', sender: 'user', text: 'My desk arrived with a scratch.', timestamp: '10:00 AM' } ] },
      { id: 'TKT-202', user: 'Ayesha Ali', issue: 'Payment Failed', priority: 'Medium', status: 'In Progress', waitTime: '5m', history: [ { id: '1', sender: 'user', text: 'I cannot pay via card.', timestamp: '10:10 AM' } ] },
      { id: 'TKT-203', user: 'Omar Farooq', issue: 'Refund Status', priority: 'Low', status: 'Open', waitTime: '2m', history: [ { id: '1', sender: 'user', text: 'Where is my refund?', timestamp: '10:13 AM' } ] },
    ];

    return (
      <div className="h-[calc(100vh-12rem)] flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Queue List */}
        <div className="w-80 bg-[#1E1E1E] border border-woodex-600 rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-woodex-600 bg-[#252525] flex justify-between items-center">
             <div>
                <h3 className="text-sm font-semibold text-white">Live Queue</h3>
                <div className="text-xs text-gray-500">{MOCK_SUPPORT_QUEUE.filter(t => t.status !== 'Resolved').length} active cases</div>
             </div>
             <div className="p-1.5 bg-red-500/10 rounded-md">
                <AlertCircle size={16} className="text-red-500" />
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
             {MOCK_SUPPORT_QUEUE.filter(t => t.status !== 'Resolved').map(ticket => (
                <div 
                  key={ticket.id} 
                  onClick={() => setActiveTicket(ticket)}
                  className={`p-4 border-b border-woodex-600 cursor-pointer hover:bg-[#252525] transition-colors ${activeTicket?.id === ticket.id ? 'bg-[#252525] border-l-2 border-l-blue-500' : ''}`}
                >
                   <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-mono text-gray-500">{ticket.id}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                         ticket.priority === 'High' ? 'bg-red-500/10 text-red-500' : 
                         ticket.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' : 
                         'bg-blue-500/10 text-blue-500'
                      }`}>{ticket.priority}</span>
                   </div>
                   <div className="font-medium text-white text-sm mb-1">{ticket.issue}</div>
                   <div className="flex justify-between items-center text-xs text-gray-400">
                      <span className="flex items-center gap-1"><User size={10}/> {ticket.user}</span>
                      <span className="flex items-center gap-1"><Clock size={10}/> {ticket.waitTime}</span>
                   </div>
                </div>
             ))}
             {MOCK_SUPPORT_QUEUE.filter(t => t.status !== 'Resolved').length === 0 && (
                <div className="p-8 text-center text-gray-500">
                   <CheckCircle size={32} className="mx-auto mb-2 opacity-30" />
                   <p className="text-sm">All caught up!</p>
                </div>
             )}
          </div>
        </div>

        {/* Ticket Workspace */}
        <div className="flex-1 bg-[#1E1E1E] border border-woodex-600 rounded-xl flex flex-col overflow-hidden relative">
           {activeTicket ? (
              <>
                 {/* Header */}
                 <div className="p-4 border-b border-woodex-600 bg-[#1E1E1E] flex justify-between items-center">
                    <div>
                       <div className="flex items-center gap-3">
                          <h3 className="font-bold text-white text-sm">{activeTicket.issue}</h3>
                          <span className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">{activeTicket.id}</span>
                       </div>
                       <div className="text-xs text-blue-400 mt-1 flex items-center gap-2">
                          <User size={12} /> {activeTicket.user} 
                          <span className="text-gray-600">•</span> 
                          <span className="text-gray-500">Via WhatsApp</span>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button className="px-3 py-1.5 border border-woodex-600 rounded-lg text-xs text-gray-300 hover:bg-[#252525]">Transfer</button>
                       <button onClick={handleResolveTicket} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium flex items-center gap-2">
                          <CheckCircle size={14} /> Resolve
                       </button>
                    </div>
                 </div>
                 
                 {/* Chat Area */}
                 <div className="flex-1 p-4 overflow-y-auto bg-[#121212] custom-scrollbar space-y-4">
                    <div className="flex justify-center">
                       <span className="text-[10px] text-gray-500 bg-[#1E1E1E] px-2 py-1 rounded-full">Ticket Created Today</span>
                    </div>
                    {activeTicket.history.map((msg: any, idx: number) => (
                       <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                             msg.sender === 'user' ? 'bg-[#252525] text-gray-200 rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none'
                          }`}>
                             {msg.text}
                          </div>
                       </div>
                    ))}
                 </div>

                 {/* Input */}
                 <div className="p-4 bg-[#1E1E1E] border-t border-woodex-600">
                    <div className="flex items-center gap-2 mb-2">
                       <button className="text-xs text-gray-500 hover:text-white flex items-center gap-1"><Shield size={12}/> Internal Note</button>
                       <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"><MessageCircle size={12}/> Reply to Customer</button>
                    </div>
                    <div className="flex gap-2">
                       <input 
                          type="text" 
                          value={supportInput}
                          onChange={(e) => setSupportInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendSupportMessage()}
                          placeholder="Type your reply..." 
                          className="flex-1 bg-[#252525] border border-woodex-600 rounded-lg px-4 py-2 text-sm text-white focus:border-blue-500 outline-none"
                       />
                       <button onClick={handleSendSupportMessage} className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"><Send size={18}/></button>
                    </div>
                 </div>
              </>
           ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                  <Headphones size={64} className="mb-4 opacity-20" />
                  <p className="text-lg font-medium text-gray-400">Select a case to start helping</p>
                  <p className="text-sm mt-2">Pick a ticket from the queue on the left.</p>
              </div>
           )}
        </div>
      </div>
    );
  };

  const renderTemplatesTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white">Message Templates</h3>
          <p className="text-sm text-gray-400">Pre-configured messages for quick responses</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-sm text-white font-medium transition-colors">
          <Plus size={16} /> Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {templates.map((template) => (
           <div key={template.id} className="bg-[#1E1E1E] p-6 rounded-xl border border-woodex-600 hover:border-teal-500/50 transition-all group cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                 <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg">
                   <FileText size={20} />
                 </div>
                 <button className="text-gray-500 hover:text-white"><MoreHorizontal size={16} /></button>
              </div>
              <h4 className="font-semibold text-white mb-2">{template.title}</h4>
              <p className="text-sm text-gray-400 line-clamp-3 mb-4">{template.text}</p>
              <div className="flex justify-between items-center pt-4 border-t border-woodex-600">
                 <span className="text-xs text-gray-500">Used 24 times</span>
                 <button className="text-xs text-teal-400 font-medium hover:underline">Edit</button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );

  const renderCRMSettingsTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white">CRM Configuration</h3>
          <p className="text-sm text-gray-400">Manage chat behavior and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* General Settings */}
         <div className="bg-[#1E1E1E] p-6 rounded-xl border border-woodex-600 space-y-6">
            <h4 className="text-base font-semibold text-white flex items-center gap-2">
                <Settings size={18} className="text-teal-500" /> General Preferences
            </h4>
            
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[#252525] rounded-lg border border-woodex-600">
                    <div>
                        <div className="text-sm font-medium text-white">Desktop Notifications</div>
                        <div className="text-xs text-gray-500">Get alerted when new messages arrive</div>
                    </div>
                    <button 
                        onClick={() => setCrmSettings(s => ({...s, desktopNotifications: !s.desktopNotifications}))}
                        className={`w-10 h-5 rounded-full relative transition-colors ${crmSettings.desktopNotifications ? 'bg-teal-500' : 'bg-gray-600'}`}
                    >
                         <span className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${crmSettings.desktopNotifications ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#252525] rounded-lg border border-woodex-600">
                    <div>
                        <div className="text-sm font-medium text-white">Sound Alerts</div>
                        <div className="text-xs text-gray-500">Play a sound for incoming messages</div>
                    </div>
                    <button 
                        onClick={() => setCrmSettings(s => ({...s, soundAlerts: !s.soundAlerts}))}
                        className={`w-10 h-5 rounded-full relative transition-colors ${crmSettings.soundAlerts ? 'bg-teal-500' : 'bg-gray-600'}`}
                    >
                         <span className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${crmSettings.soundAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>
         </div>

         {/* Automation Settings */}
         <div className="bg-[#1E1E1E] p-6 rounded-xl border border-woodex-600 space-y-6">
            <h4 className="text-base font-semibold text-white flex items-center gap-2">
                <Bot size={18} className="text-purple-500" /> Automation
            </h4>

            <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-medium text-white">Auto-Reply (Away Mode)</div>
                        <div className="text-xs text-gray-500">Send automated replies outside business hours</div>
                    </div>
                    <button 
                        onClick={() => setCrmSettings(s => ({...s, autoReply: !s.autoReply}))}
                        className={`w-10 h-5 rounded-full relative transition-colors ${crmSettings.autoReply ? 'bg-purple-500' : 'bg-gray-600'}`}
                    >
                         <span className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${crmSettings.autoReply ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                 </div>

                 {crmSettings.autoReply && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Start Time</label>
                            <input type="time" value={crmSettings.workingHoursStart} onChange={(e) => setCrmSettings({...crmSettings, workingHoursStart: e.target.value})} className="w-full bg-[#121212] border border-woodex-600 rounded px-3 py-2 text-sm text-white" />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">End Time</label>
                            <input type="time" value={crmSettings.workingHoursEnd} onChange={(e) => setCrmSettings({...crmSettings, workingHoursEnd: e.target.value})} className="w-full bg-[#121212] border border-woodex-600 rounded px-3 py-2 text-sm text-white" />
                        </div>
                    </div>
                 )}
            </div>
         </div>

         {/* Tags Management */}
         <div className="bg-[#1E1E1E] p-6 rounded-xl border border-woodex-600 space-y-6 md:col-span-2">
            <div className="flex justify-between items-center">
                <h4 className="text-base font-semibold text-white flex items-center gap-2">
                    <Tag size={18} className="text-blue-400" /> Conversation Tags
                </h4>
                <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                    <Plus size={12} /> Add New
                </button>
            </div>
            
            <div className="flex flex-wrap gap-3">
                {['Corporate', 'High Value', 'Negotiation', 'Inquiry', 'Logistics', 'Complaint', 'Urgent', 'VIP', 'Pending Payment'].map((tag) => (
                     <div key={tag} className="px-3 py-1.5 bg-[#252525] border border-woodex-600 rounded-lg text-sm text-gray-300 flex items-center gap-2 group">
                        {tag}
                        <button className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
                    </div>
                ))}
            </div>
         </div>
      </div>
    </div>
  );

  const renderChatInterface = () => (
    <div className="h-[calc(100vh-12rem)] flex gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Left Panel: Contact List */}
      <div className="w-80 flex-shrink-0 bg-[#1E1E1E] rounded-xl border border-woodex-600 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-woodex-600 bg-[#1E1E1E]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full bg-[#252525] border border-woodex-600 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {MOCK_CONVERSATIONS.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`p-4 flex items-start gap-3 cursor-pointer hover:bg-[#252525] transition-colors border-b border-woodex-600 last:border-0 ${activeChat.id === chat.id ? 'bg-[#252525] border-l-2 border-l-blue-500' : ''}`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-sm font-medium text-white flex-shrink-0 relative">
                {chat.contactName.substring(0, 2).toUpperCase()}
                {chat.sentiment === 'Negative' && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-500 border border-[#1E1E1E] rounded-full"></span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-medium text-white truncate">{chat.contactName}</h4>
                  <span className="text-xs text-gray-500">{chat.timestamp}</span>
                </div>
                <p className="text-xs text-gray-400 truncate">{chat.lastMessage}</p>
                <div className="flex gap-1 mt-2">
                   {chat.tags.slice(0, 2).map(tag => (
                     <span key={tag} className="text-[10px] bg-[#121212] text-gray-500 px-1.5 py-0.5 rounded border border-woodex-600">{tag}</span>
                   ))}
                </div>
              </div>
              {chat.unreadCount > 0 && (
                <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold mt-1">
                  {chat.unreadCount}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Center Panel: Chat Area */}
      <div className="flex-1 bg-[#1E1E1E] rounded-xl border border-woodex-600 flex flex-col overflow-hidden relative">
        {/* Chat Header */}
        <div className="p-4 border-b border-woodex-600 flex justify-between items-center bg-[#1E1E1E] z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold">
              {activeChat.contactName.substring(0, 2)}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                {activeChat.contactName}
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] rounded-full border border-blue-500/20 font-medium uppercase tracking-wide">
                  {activeChat.intent}
                </span>
              </h3>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online via WhatsApp
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Demo Tool: Simulate Incoming */}
            <button 
              onClick={handleSimulateIncoming}
              disabled={isUserTyping}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-800 text-gray-400 border border-woodex-600 hover:text-white hover:border-gray-400 transition-all mr-2"
              title="Simulate a customer reply for demo"
            >
              <MessageCircle size={14} />
              Simulate Reply
            </button>

             {/* Auto-Pilot Toggle */}
            <button 
              onClick={() => setIsAutoPilot(!isAutoPilot)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${isAutoPilot ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-[#252525] text-gray-400 border border-woodex-600'}`}
            >
              <Bot size={14} />
              Auto-Pilot {isAutoPilot ? 'ON' : 'OFF'}
            </button>
            <div className="h-6 w-[1px] bg-woodex-600 mx-2"></div>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-full transition-colors"><Phone size={18} /></button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-full transition-colors"><Video size={18} /></button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-full transition-colors"><MoreVertical size={18} /></button>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#121212] custom-scrollbar flex flex-col">
          {activeChat.messages.map(renderMessage)}
          
          {isUserTyping && (
            <div className="flex items-center gap-2 mb-4 animate-pulse">
               <div className="w-8 h-8 rounded-full bg-[#252525] flex items-center justify-center text-[10px] text-gray-500">
                 ...
               </div>
               <div className="text-xs text-gray-500 italic">{activeChat.contactName} is typing...</div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#1E1E1E] border-t border-woodex-600 relative">
           {/* Template Popup */}
           {showTemplates && (
             <div className="absolute bottom-full mb-2 left-4 w-80 bg-[#1E1E1E] border border-woodex-600 rounded-xl shadow-2xl overflow-hidden z-20 animate-in fade-in slide-in-from-bottom-2">
                <div className="p-3 border-b border-woodex-600 flex justify-between items-center bg-[#252525]">
                  <span className="text-xs font-semibold text-white flex items-center gap-2"><FileText size={14}/> Quick Templates</span>
                  <button onClick={() => setShowTemplates(false)} className="text-gray-500 hover:text-white"><X size={14} /></button>
                </div>
                <div className="max-h-64 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => selectTemplate(template.text)}
                      className="w-full text-left p-3 rounded-lg hover:bg-[#252525] transition-colors group border border-transparent hover:border-woodex-600"
                    >
                      <div className="font-medium text-white text-sm mb-1">{template.title}</div>
                      <div className="text-xs text-gray-400 group-hover:text-gray-300 line-clamp-2">{template.text}</div>
                    </button>
                  ))}
                </div>
             </div>
           )}

           {isDrafting && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-purple-900/90 text-purple-100 text-xs px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md animate-pulse border border-purple-500/50 shadow-xl z-20">
                <Sparkles size={12} /> AI Copilot is thinking...
              </div>
           )}

          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-full transition-colors">
              <Paperclip size={20} />
            </button>

            <button 
              onClick={() => setShowTemplates(!showTemplates)}
              className={`p-2 rounded-full transition-colors ${showTemplates ? 'text-blue-400 bg-blue-500/10' : 'text-gray-400 hover:text-white hover:bg-[#252525]'}`}
              title="Use Template"
            >
              <FileText size={20} />
            </button>

             <button 
              onClick={handleAIDraft}
              className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-full transition-colors tooltip"
              title="Generate AI Draft"
            >
              <Sparkles size={20} />
            </button>
            
            <div className="flex-1 relative group">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
                placeholder={isAutoPilot ? "Auto-Pilot is Active (Type to override...)" : "Type a message..."}
                disabled={isSending}
                className="w-full bg-[#252525] border border-woodex-600 rounded-full pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all group-hover:border-woodex-500"
              />
              {isSending && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 size={16} className="animate-spin text-blue-400" />
                </div>
              )}
            </div>

            <button 
              onClick={handleSendMessage}
              disabled={isSending || !inputText.trim()}
              className={`p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center min-w-[40px] min-h-[40px] ${(isSending || !inputText.trim()) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Info & AI */}
      <div className="w-80 flex-shrink-0 bg-[#1E1E1E] rounded-xl border border-woodex-600 hidden xl:flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-woodex-600">
          <button 
            onClick={() => setRightPanelTab('profile')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${rightPanelTab === 'profile' ? 'text-white border-b-2 border-blue-500 bg-[#252525]' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Profile
          </button>
          <button 
            onClick={() => setRightPanelTab('ai')}
            className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${rightPanelTab === 'ai' ? 'text-purple-400 border-b-2 border-purple-500 bg-purple-500/10' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <BrainCircuit size={14} /> AI Copilot
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {rightPanelTab === 'profile' ? (
            <div className="space-y-6 animate-in slide-in-from-right-2 fade-in duration-300">
               <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 mb-4 flex items-center justify-center text-2xl text-white font-bold border-2 border-[#252525]">
                  {activeChat.contactName.substring(0, 2)}
                </div>
                <h3 className="text-lg font-semibold text-white">{activeChat.contactName}</h3>
                <p className="text-sm text-blue-400">{activeChat.company}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Briefcase size={14} className="text-gray-500" /> {activeChat.company}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Mail size={14} className="text-gray-500" /> {activeChat.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Phone size={14} className="text-gray-500" /> {activeChat.phone}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <MapPin size={14} className="text-gray-500" /> {activeChat.location}
                  </div>
                </div>

                <div className="pt-4 border-t border-woodex-600">
                  <h4 className="text-xs uppercase font-semibold text-gray-500 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeChat.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-[#252525] border border-woodex-600 rounded-md text-xs text-gray-400 flex items-center gap-1">
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                    <button className="px-2 py-1 border border-dashed border-gray-600 rounded-md text-xs text-gray-500 hover:text-white hover:border-gray-400 transition-colors"><Plus size={10} /></button>
                  </div>
                </div>

                <div className="pt-4 border-t border-woodex-600">
                  <h4 className="text-xs uppercase font-semibold text-gray-500 mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleSmartAction('Create Order')}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-medium transition-colors shadow-lg shadow-blue-900/20"
                    >
                      Create Order
                    </button>
                    <button 
                      onClick={() => handleSmartAction('Send Invoice')}
                      className="bg-[#252525] hover:bg-[#333] text-white py-2 rounded-lg text-xs font-medium border border-woodex-600 transition-colors"
                    >
                      Send Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-2 fade-in duration-300">
              <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl">
                <h4 className="text-purple-400 text-xs font-bold uppercase mb-2 flex items-center gap-2">
                  <Sparkles size={12} /> Analysis Ready
                </h4>
                <div className="flex justify-between items-center mb-2">
                   <span className="text-gray-400 text-xs">Sentiment</span>
                   <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                     activeChat.sentiment === 'Positive' ? 'bg-green-500/10 text-green-400' : 
                     activeChat.sentiment === 'Negative' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                   }`}>
                     {activeChat.sentiment}
                   </span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-gray-400 text-xs">Intent</span>
                   <span className="text-xs font-medium text-blue-300">{activeChat.intent}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase font-semibold text-gray-500 mb-3 flex items-center justify-between">
                  Smart Summary
                  <div className="flex items-center gap-2">
                    {isAnalyzing && <Loader2 size={12} className="animate-spin text-blue-400" />}
                    <button onClick={handleRunAnalysis} className="text-blue-400 hover:text-blue-300" title="Refresh Analysis"><Zap size={12}/></button>
                  </div>
                </h4>
                <div className="p-3 bg-[#252525] rounded-lg border border-woodex-600 min-h-[80px] relative">
                  {aiAnalysis ? (
                    <p className={`text-sm text-gray-300 leading-relaxed ${isAnalyzing ? 'opacity-50 transition-opacity' : ''}`}>{aiAnalysis.summary}</p>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 gap-2 text-xs">
                      <Loader2 size={14} className="animate-spin" /> Analyzing Context...
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase font-semibold text-gray-500 mb-3">Suggested Actions</h4>
                <div className={`space-y-2 ${isAnalyzing ? 'opacity-50 transition-opacity' : ''}`}>
                  {aiAnalysis ? (
                    aiAnalysis.suggestions.map((suggestion, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setInputText(`${suggestion}`)}
                        className="w-full text-left px-3 py-2.5 bg-[#252525] hover:bg-[#303030] border border-woodex-600 rounded-lg text-sm text-gray-300 transition-colors flex items-center justify-between group"
                      >
                        {suggestion}
                        <CornerUpRight size={14} className="opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity" />
                      </button>
                    ))
                  ) : (
                     [1,2,3].map(i => (
                       <div key={i} className="h-10 bg-[#252525] rounded-lg animate-pulse"></div>
                     ))
                  )}
                </div>
              </div>
              
              <div className="pt-4 border-t border-woodex-600 text-center">
                 <p className="text-[10px] text-gray-600">AI analysis is based on the last 10 messages.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex border-b border-woodex-600 mb-6 space-x-1">
        {[
          { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
          { id: 'contacts', label: 'Contacts', icon: Users },
          { id: 'messages', label: 'Inbox', icon: MessageSquare },
          { id: 'live-support', label: 'Live Support', icon: Headphones },
          { id: 'templates', label: 'Templates', icon: FileText },
          { id: 'automation', label: 'Automation', icon: Zap },
          { id: 'agents', label: 'Agents', icon: Users },
          { id: 'settings', label: 'Configuration', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === tab.id 
                ? 'border-blue-500 text-white bg-[#252525]' 
                : 'border-transparent text-gray-400 hover:text-white hover:bg-[#1E1E1E]'
            } rounded-t-lg`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'dashboard' && renderDashboardTab()}
        {activeTab === 'contacts' && renderContactsTab()}
        {activeTab === 'messages' && renderChatInterface()}
        {activeTab === 'live-support' && renderLiveSupportTab()}
        {activeTab === 'templates' && renderTemplatesTab()}
        {activeTab === 'automation' && renderAutomationTab()}
        {activeTab === 'agents' && renderAgentsTab()}
        {activeTab === 'settings' && renderCRMSettingsTab()}
      </div>
    </div>
  );
};

export default WhatsAppCRM;
