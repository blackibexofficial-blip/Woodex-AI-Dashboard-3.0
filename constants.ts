
import { Product, Lead, Order, Conversation, Status, Template, Project, RoadmapPhase, Delivery, ShowroomVisitor, EQuotation } from './types';

// WoodEx 2.0 Product Catalog (High Ticket, Build-to-Order)
export const MOCK_PRODUCTS: Product[] = [
  { id: 'WDX-CEO-001', name: 'Royal Prestige CEO Desk', category: 'Executive', price: 450000, stock: 0, status: Status.Active, rating: 4.9 },
  { id: 'WDX-CEO-002', name: 'Imperial Luxury CEO Desk', category: 'Executive', price: 520000, stock: 0, status: Status.Active, rating: 4.8 },
  { id: 'WDX-WS-001', name: 'Modular Hybrid Workstation', category: 'Workstations', price: 85000, stock: 0, status: Status.Active, rating: 4.6 },
  { id: 'WDX-CHR-005', name: 'ErgoMaster High Back Chair', category: 'Seating', price: 45000, stock: 12, status: Status.Active, rating: 4.7 },
  { id: 'WDX-STR-012', name: 'Executive File Cabinet', category: 'Storage', price: 35000, stock: 5, status: Status.LowStock, rating: 4.5 },
  { id: 'WDX-CNF-003', name: 'Grand Boardroom Table (12-Seater)', category: 'Conference', price: 320000, stock: 0, status: Status.Active, rating: 4.9 },
];

// Leads aligned with B2B/Corporate targets
export const MOCK_LEADS: Lead[] = [
  { id: 'LD-001', name: 'Procurement Head', company: 'TechVantage Systems', phone: '+92 300 123 4567', status: Status.New, value: 'PKR 2.5M', lastContact: '2 mins ago', source: 'LinkedIn' },
  { id: 'LD-002', name: 'Facility Manager', company: 'Nexus Corp', phone: '+92 333 987 6543', status: Status.Contacted, value: 'PKR 1.8M', lastContact: '1 hour ago', source: 'Website' },
  { id: 'LD-003', name: 'Dr. Alvi', company: 'Alvi Clinic', phone: '+92 321 555 1234', status: Status.Proposal, value: 'PKR 850K', lastContact: '1 day ago', source: 'Referral' },
  { id: 'LD-004', name: 'Mr. Kamran', company: 'Kamran Traders', phone: '+92 300 555 9999', status: Status.Qualified, value: 'PKR 1.2M', lastContact: '3 days ago', source: 'Showroom' },
  { id: 'LD-005', name: 'CEO', company: 'Creative Sparks', phone: '+92 312 444 7777', status: Status.Won, value: 'PKR 3.5M', lastContact: '1 week ago', source: 'Direct' },
];

// Active Projects (WoodEx operates on 4-6 week project cycles)
export const MOCK_PROJECTS: Project[] = [
  { id: 'PRJ-24-001', name: 'HQ Renovation', client: 'TechVantage Systems', value: 'PKR 3.2M', status: Status.Active, deadline: 'Nov 30, 2025', progress: 65 },
  { id: 'PRJ-24-002', name: 'Executive Wing', client: 'Nexus Corp', value: 'PKR 1.5M', status: Status.Pending, deadline: 'Dec 15, 2025', progress: 30 },
  { id: 'PRJ-24-003', name: 'Clinic Setup', client: 'Alvi Clinic', value: 'PKR 900K', status: Status.Completed, deadline: 'Oct 20, 2025', progress: 100 },
  { id: 'PRJ-24-004', name: 'Coworking Space A', client: 'Kickstart', value: 'PKR 5.5M', status: Status.Active, deadline: 'Jan 10, 2026', progress: 15 },
];

export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-892', customer: 'TechVantage Systems', total: 'PKR 540,000', items: 4, status: Status.Completed, date: 'Oct 24, 2025' },
  { id: 'ORD-891', customer: 'Nexus Corp', total: 'PKR 210,000', items: 2, status: Status.Pending, date: 'Oct 23, 2025' },
  { id: 'ORD-889', customer: 'Private Client', total: 'PKR 85,000', items: 1, status: Status.Completed, date: 'Oct 22, 2025' },
  { id: 'ORD-888', customer: 'Startup Hub', total: 'PKR 120,000', items: 5, status: Status.InTransit, date: 'Oct 21, 2025' },
  { id: 'ORD-887', customer: 'Govt Office', total: 'PKR 1,500,000', items: 12, status: Status.Active, date: 'Oct 20, 2025' },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'CONV-1',
    contactName: 'Arham Khan',
    company: 'TechVantage Systems',
    email: 'arham.k@techvantage.com',
    phone: '+92 300 123 4567',
    location: 'Lahore, PK',
    tags: ['Corporate', 'High Value', 'Negotiation'],
    sentiment: 'Positive',
    intent: 'Purchase',
    lastMessage: 'Can you send me the quotation for the CEO desk?',
    timestamp: '10:42 AM',
    unreadCount: 1,
    messages: [
      { id: 'm1', sender: 'user', text: 'Hi, I am interested in the Royal Prestige Desk for our new CEO office.', timestamp: '10:40 AM' },
      { id: 'sys1', sender: 'system', text: 'Ticket #9021 Created: "CEO Office Inquiry"', timestamp: '10:40 AM' },
      { id: 'm2', sender: 'agent', text: 'Hello Arham! Excellent choice. The Royal Prestige is our flagship model. It is available in Mahogany and Walnut finishes.', timestamp: '10:41 AM' },
      { id: 'm3', sender: 'user', text: 'Walnut matches our decor. Can you send me the quotation for the CEO desk including installation?', timestamp: '10:42 AM' },
    ]
  },
  {
    id: 'CONV-2',
    contactName: 'Ms. Sara',
    company: 'Nexus Corp',
    email: 'sara.admin@nexuscorp.pk',
    phone: '+92 333 987 6543',
    location: 'Islamabad, PK',
    tags: ['Inquiry', 'Logistics'],
    sentiment: 'Neutral',
    intent: 'Inquiry',
    lastMessage: 'Is delivery available to Islamabad?',
    timestamp: 'Yesterday',
    unreadCount: 0,
    messages: [
      { id: 'm1', sender: 'user', text: 'Hi there, do you deliver outside Lahore?', timestamp: '9:00 AM' },
      { id: 'm2', sender: 'bot', text: 'Hi! Yes, WoodEx delivers nationwide. For which city are you inquiring?', timestamp: '9:00 AM' },
      { id: 'm3', sender: 'user', text: 'Is delivery available to Islamabad specifically for bulk orders?', timestamp: '9:10 AM' },
    ]
  },
  {
    id: 'CONV-3',
    contactName: 'Mr. Bilal',
    company: 'StartUp Hub',
    email: 'bilal@hub.co',
    phone: '+92 321 555 8888',
    location: 'Karachi, PK',
    tags: ['Complaint', 'Urgent'],
    sentiment: 'Negative',
    intent: 'Complaint',
    lastMessage: 'My order is delayed by 3 days.',
    timestamp: 'Mon',
    unreadCount: 2,
    messages: [
      { id: 'm1', sender: 'user', text: 'Where is my order #ORD-889?', timestamp: 'Mon' },
      { id: 'm2', sender: 'user', text: 'My order is delayed by 3 days. This is unacceptable.', timestamp: 'Mon' },
    ]
  }
];

export const MOCK_TEMPLATES: Template[] = [
  { id: 't1', title: 'Greeting', text: 'Hello! Welcome to Woodex AI. How can I assist you with your office furniture needs today?' },
  { id: 't2', title: 'Send E-Quotation', text: 'I have generated the E-Quotation based on our discussion. Please find the attached PDF details.' },
  { id: 't3', title: 'Customization Policy', text: 'Since we operate on a zero-inventory, build-to-order model, we can fully customize dimensions and finishes. What are your requirements?' },
  { id: 't4', title: 'Lead Time Info', text: 'Our standard production timeline is 4-6 weeks to ensure premium quality and craftsmanship.' },
  { id: 't5', title: 'Warranty Info', text: 'This product is backed by our industry-leading 6-year structural warranty.' },
];

export const CHART_DATA = [
  { name: 'Month 1', revenue: 3.0, target: 3.0 },
  { name: 'Month 2', revenue: 3.2, target: 3.5 },
  { name: 'Month 3', revenue: 3.8, target: 4.2 },
  { name: 'Month 4', revenue: 4.5, target: 5.1 },
  { name: 'Month 5', revenue: 5.2, target: 6.0 },
  { name: 'Month 6', revenue: 5.8, target: 7.2 },
  { name: 'Month 7', revenue: 6.5, target: 7.5 },
];

export const ROADMAP_DATA: RoadmapPhase[] = [
  { phase: 'Phase 1', title: 'Foundation', duration: 'Months 1-3', focus: 'Fix UX, Transparent Pricing, Basic CRM', status: Status.OnTrack },
  { phase: 'Phase 2', title: 'Experience', duration: 'Months 2-6', focus: '3D/AR Configurator, KPI Dashboard', status: Status.Pending },
  { phase: 'Phase 3', title: 'Scale', duration: 'Months 6-12', focus: 'B2B Portal, FaaS, Geo-Expansion', status: Status.Pending },
];

export const MOCK_DELIVERIES: Delivery[] = [
  { id: 'DLV-001', orderId: 'ORD-888', customer: 'Startup Hub', address: 'Block 6, PECHS, Karachi', status: Status.InTransit, date: 'Oct 26, 2025', driver: 'Ahmed Ali' },
  { id: 'DLV-002', orderId: 'ORD-892', customer: 'TechVantage Systems', address: 'DHA Phase 5, Lahore', status: Status.Scheduled, date: 'Oct 28, 2025', driver: 'Bilal Khan' },
  { id: 'DLV-003', orderId: 'ORD-889', customer: 'Private Client', address: 'F-7/2, Islamabad', status: Status.Delivered, date: 'Oct 24, 2025', driver: 'Rashid Mehmood' },
];

export const MOCK_SHOWROOM_VISITORS: ShowroomVisitor[] = [
  { id: 'VST-045', name: 'Mr. Asif', purpose: 'Consultation', checkInTime: '10:30 AM', status: 'Active', assignedAgent: 'Sara' },
  { id: 'VST-044', name: 'Mrs. Huma', purpose: 'Browsing', checkInTime: '10:15 AM', status: 'Active', assignedAgent: 'Ali' },
  { id: 'VST-043', name: 'Design Studio Team', purpose: 'Consultation', checkInTime: '09:45 AM', status: 'Checked Out', assignedAgent: 'Omer' },
];

// --- E-Quotation Master Data ---

export const MOCK_EQUOTATIONS: EQuotation[] = [
  {
    id: 'WF-10104',
    clientName: 'Pachem Global',
    location: 'Model Town, Lahore',
    status: Status.Pending,
    date: '2025-11-22',
    expiryDate: '2025-12-07',
    validityDays: 15,
    advancePercent: 75,
    deliveryTime: '6 to 7 Days',
    transportationTerms: 'Outstation charges depend on city, quantity and load',
    items: [
      { id: '1', srNo: 1, item: 'Gray Night Marble', description: 'Gray Night marble size 42" x 24" center hole and edge polish', qty: 1, unitPrice: 10000, total: 10000 },
      { id: '2', srNo: 2, item: 'Vanity', description: 'Box PVC Sheet Box PVC Louver front size 23" x 41 in. height 12" bottom shelf size 20" x 41"', qty: 1, unitPrice: 20000, total: 20000 },
      { id: '3', srNo: 3, item: 'Mirror Glass', description: 'Mirror glass pasting over wooden box size 42" x 46" base light strip', qty: 1, unitPrice: 15000, total: 15000 },
    ],
    financials: {
      subtotal: 45000,
      rent: 0,
      advance: 0,
      tax: 0,
      shipping: 0,
      balanceDue: 45000
    }
  },
  {
    id: 'WF-10105',
    clientName: 'Acme Corp',
    location: 'Gulberg III, Lahore',
    status: Status.Approved,
    date: '2025-11-20',
    expiryDate: '2025-12-05',
    validityDays: 15,
    advancePercent: 50,
    deliveryTime: '10 to 12 Days',
    transportationTerms: 'Included in Lahore',
    items: [
      { id: '1', srNo: 1, item: 'CEO Desk', description: 'Royal Prestige CEO Desk, Walnut Finish', qty: 1, unitPrice: 450000, total: 450000 },
      { id: '2', srNo: 2, item: 'Executive Chair', description: 'ErgoMaster High Back', qty: 1, unitPrice: 45000, total: 45000 }
    ],
    financials: {
      subtotal: 495000,
      rent: 0,
      advance: 247500,
      balanceDue: 247500
    }
  }
];
