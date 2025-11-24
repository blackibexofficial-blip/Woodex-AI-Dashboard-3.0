import { 
  MOCK_PRODUCTS, 
  MOCK_LEADS, 
  MOCK_ORDERS, 
  MOCK_PROJECTS, 
  MOCK_CONVERSATIONS,
  MOCK_DELIVERIES,
  MOCK_EQUOTATIONS,
  MOCK_SHOWROOM_VISITORS,
  CHART_DATA,
  ROADMAP_DATA
} from '../constants';
import { Product, Lead, Order, Project, Conversation, Delivery, EQuotation, ShowroomVisitor } from '../types';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase from LocalStorage (Real-time configuration)
const supabaseUrl = localStorage.getItem('woodex_supabase_url');
const supabaseKey = localStorage.getItem('woodex_supabase_key');

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log("DataService: Connected to Supabase Live");
  } catch (e) {
    console.error("DataService: Failed to init Supabase", e);
  }
} else {
  console.log("DataService: Using Mock Data (No Keys Found)");
}

export const DataService = {
  
  getDashboardMetrics: async () => {
    // In a real scenario, we would aggregate this from Supabase tables
    // await supabase.from('orders').select('total')...
    return new Promise(resolve => {
      setTimeout(() => resolve({
        revenue: "PKR 5.1M",
        activeProjects: 4,
        avgProjectValue: "PKR 850K",
        netProfit: "35%"
      }), 800);
    });
  },

  getChartData: async () => {
    return CHART_DATA;
  },

  getRoadmap: async () => {
    return ROADMAP_DATA;
  },

  getProjects: async (): Promise<Project[]> => {
    if (supabase) {
      const { data, error } = await supabase.from('projects').select('*');
      if (!error && data && data.length > 0) return data as any;
    }
    // Fallback to mock
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_PROJECTS), 600); 
    });
  },

  getLeads: async (): Promise<Lead[]> => {
    if (supabase) {
      const { data, error } = await supabase.from('leads').select('*');
      if (!error && data && data.length > 0) return data as any;
    }
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_LEADS), 500));
  },

  getProducts: async (): Promise<Product[]> => {
    if (supabase) {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) return data as any;
    }
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_PRODUCTS), 400));
  },

  getOrders: async (): Promise<Order[]> => {
    if (supabase) {
        const { data, error } = await supabase.from('orders').select('*');
        if (!error && data && data.length > 0) return data as any;
    }
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_ORDERS), 500));
  },

  getConversations: async (): Promise<Conversation[]> => {
    // For WhatsApp, we usually fetch from a webhook database table
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_CONVERSATIONS), 300));
  },

  getDeliveries: async (): Promise<Delivery[]> => {
    return MOCK_DELIVERIES;
  },

  getQuotations: async (): Promise<EQuotation[]> => {
    return MOCK_EQUOTATIONS;
  },

  getShowroomVisitors: async (): Promise<ShowroomVisitor[]> => {
    return MOCK_SHOWROOM_VISITORS;
  }
};