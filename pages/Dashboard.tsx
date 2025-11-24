
import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Briefcase, 
  Activity,
  MoreHorizontal,
  Target,
  Calendar,
  Loader2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Line
} from 'recharts';
import { DataService } from '../services/dataService';
import { Project, RoadmapPhase } from '../types';

const MetricCard: React.FC<{ title: string; value: string; subtext: string; isPositive: boolean; icon: any; isLoading: boolean }> = ({ title, value, subtext, isPositive, icon: Icon, isLoading }) => (
  <div className="bg-[#1E1E1E] p-6 rounded-xl border border-woodex-600 hover:border-woodex-500 transition-all duration-200">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 bg-[#252525] rounded-lg text-blue-400">
        <Icon size={20} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${isPositive ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10'}`}>
        {subtext}
      </div>
    </div>
    <div className="text-gray-400 text-sm font-medium mb-1">{title}</div>
    <div className="text-2xl font-bold text-white">
      {isLoading ? <div className="h-8 w-24 bg-[#252525] rounded animate-pulse"></div> : value}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [metrics, setMetrics] = useState<any>({ revenue: '...', activeProjects: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>([]);
  const [aiInsights, setAiInsights] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetching from "Runtime" (DataService)
        const [projData, metricData, cData, rData] = await Promise.all([
          DataService.getProjects(),
          DataService.getDashboardMetrics(),
          DataService.getChartData(),
          DataService.getRoadmap()
        ]);

        setProjects(projData);
        setMetrics(metricData);
        setChartData(cData);
        setRoadmap(rData);

        // Hardcoded analysis based on the uploaded PDF report
        const reportAnalysis = `**WoodEx 2.1 Strategic Analysis:**\n
        1. **Foundation (Current):** Solid direct-factory model. 6-Year Warranty is a key differentiator. Capacity is 6-8 projects/mo.\n
        2. **Optimization Needed:** UX frictions and missing assets are blocking conversions. Immediate fix required (Phase 1).\n
        3. **Growth Opportunity:** Launch B2B Portal & 3D Configurator to reach PKR 7.2M monthly revenue target.`;
        
        setAiInsights(reportAnalysis);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Business Model 2.1 Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Proj. Monthly Revenue" 
          value={metrics.revenue} 
          subtext="Target: PKR 7.2M" 
          isPositive={true} 
          icon={TrendingUp}
          isLoading={isLoading}
        />
        <MetricCard 
          title="Active Projects" 
          value={metrics.activeProjects} 
          subtext="Capacity: 8" 
          isPositive={false} 
          icon={Briefcase} 
          isLoading={isLoading}
        />
        <MetricCard 
          title="Avg Project Value" 
          value={metrics.avgProjectValue} 
          subtext="+13% vs Baseline" 
          isPositive={true} 
          icon={Target} 
          isLoading={isLoading}
        />
        <MetricCard 
          title="Net Profit Margin" 
          value={metrics.netProfit} 
          subtext="Target: 42%" 
          isPositive={true} 
          icon={Activity} 
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Projection Chart */}
        <div className="lg:col-span-2 bg-[#1E1E1E] p-6 rounded-xl border border-woodex-600">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Revenue Projection (2.1 Plan)</h3>
              <p className="text-xs text-gray-500">Actual vs Target Growth (PKR Millions)</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Revenue
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> Target
            </div>
          </div>
          <div className="h-80 flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="animate-spin text-blue-500" size={32} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}M`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#333', borderRadius: '8px', color: '#fff' }} 
                    itemStyle={{ color: '#ccc' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Actual Revenue" />
                  <Line type="monotone" dataKey="target" stroke="#22c55e" strokeWidth={2} dot={{r: 4}} name="Target (2.1 Plan)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* AI Strategic Analysis Panel */}
        <div className="bg-[#1E1E1E] p-6 rounded-xl border border-woodex-600 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Activity size={120} className="text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
             <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
             Executive Summary
          </h3>
          <div className="space-y-4 text-sm text-gray-300 flex-1">
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-4 bg-[#252525] rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-[#252525] rounded w-full animate-pulse"></div>
                <div className="h-4 bg-[#252525] rounded w-5/6 animate-pulse"></div>
              </div>
            ) : (
              <div className="whitespace-pre-line leading-relaxed font-light">
                {aiInsights}
              </div>
            )}
          </div>
          
          {/* Roadmap Mini-View */}
          <div className="mt-6 pt-6 border-t border-woodex-600">
            <h4 className="text-xs uppercase font-semibold text-gray-500 mb-3">Implementation Roadmap</h4>
            <div className="space-y-3">
              {roadmap.map((phase, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${idx === 0 ? 'bg-blue-600 text-white' : 'bg-[#252525] text-gray-500'}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-white">{phase.title} <span className="text-gray-600">({phase.duration})</span></div>
                    <div className="text-[10px] text-gray-500">{phase.focus}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project Tracker (Replacing simple Orders) */}
      <div className="bg-[#1E1E1E] rounded-xl border border-woodex-600 overflow-hidden">
        <div className="p-6 border-b border-woodex-600 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Active Projects (Pipeline)</h3>
          <button className="text-gray-500 hover:text-white"><MoreHorizontal size={20} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#252525] text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-3">Project</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Value (PKR)</th>
                <th className="px-6 py-3">Deadline</th>
                <th className="px-6 py-3">Progress</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-woodex-600">
              {isLoading ? (
                 [1, 2, 3].map(i => (
                   <tr key={i}>
                     <td colSpan={6} className="px-6 py-4"><div className="h-8 bg-[#252525] rounded animate-pulse"></div></td>
                   </tr>
                 ))
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-[#252525]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{project.name}</div>
                      <div className="text-xs text-gray-500">{project.id}</div>
                    </td>
                    <td className="px-6 py-4">{project.client}</td>
                    <td className="px-6 py-4 text-white font-medium">{project.value}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <Calendar size={14} /> {project.deadline}
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${project.progress > 80 ? 'bg-green-500' : 'bg-blue-500'}`} 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-[10px] mt-1 text-gray-500">{project.progress}% Complete</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        project.status === 'Completed' ? 'bg-green-500/10 text-green-400' : 
                        project.status === 'Active' ? 'bg-blue-500/10 text-blue-400' : 
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
