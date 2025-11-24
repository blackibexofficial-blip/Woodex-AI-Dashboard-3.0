
export enum Status {
  Active = 'Active',
  Pending = 'Pending',
  Completed = 'Completed',
  New = 'New',
  LowStock = 'Low Stock',
  OnTrack = 'On Track',
  Delayed = 'Delayed',
  Phase1 = 'Foundation',
  Phase2 = 'Experience',
  Phase3 = 'Scale',
  Scheduled = 'Scheduled',
  InTransit = 'In Transit',
  Delivered = 'Delivered',
  Draft = 'Draft',
  Sent = 'Sent',
  Accepted = 'Accepted',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Contacted = 'Contacted',
  Qualified = 'Qualified',
  Proposal = 'Proposal',
  Won = 'Won'
}

export interface Metric {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: any;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: Status;
  rating: number;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  phone: string;
  status: Status;
  value: string;
  lastContact: string;
  source: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'agent' | 'system' | 'bot';
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  contactName: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  tags: string[];
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: Message[];
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  intent: 'Purchase' | 'Support' | 'Inquiry' | 'Complaint';
  notes?: string;
}

export interface Order {
  id: string;
  customer: string;
  total: string;
  items: number;
  status: Status;
  date: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  value: string;
  status: Status;
  deadline: string;
  progress: number;
}

export interface RoadmapPhase {
  phase: string;
  title: string;
  duration: string;
  focus: string;
  status: Status;
}

export interface Template {
  id: string;
  title: string;
  text: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  customer: string;
  address: string;
  status: Status;
  date: string;
  driver: string;
}

export interface ShowroomVisitor {
  id: string;
  name: string;
  purpose: 'Browsing' | 'Consultation' | 'Pickup';
  checkInTime: string;
  status: 'Active' | 'Checked Out';
  assignedAgent?: string;
}

// --- E-Quotation Master Solution Types ---

export interface QuotationItem {
  id: string;
  srNo: number;
  item: string;
  description: string;
  qty: number;
  unitPrice: number;
  total: number;
}

export interface QuotationFinancials {
  subtotal: number;
  rent?: number;
  advance: number; // Amount paid or required
  tax?: number;
  shipping?: number;
  balanceDue: number;
}

export interface EQuotation {
  id: string; // e.g., WF-10104
  clientName: string;
  location: string; // Client location
  phone?: string;
  
  items: QuotationItem[];
  financials: QuotationFinancials;
  
  status: Status;
  date: string;
  expiryDate: string;
  
  // Terms specific to the quote
  validityDays: number;
  advancePercent: number;
  deliveryTime: string;
  transportationTerms: string;
}
