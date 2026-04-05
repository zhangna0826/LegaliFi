/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  Settings, 
  Search, 
  Bell, 
  Plus, 
  ShieldCheck,
  History,
  MessageSquare,
  CheckCircle2,
  X,
  Zap,
  ChevronDown,
  ChevronRight,
  FileEdit,
  FileStack
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Contract, MetricData } from './types';

// Views
import { DashboardView } from './components/DashboardView';
import { DraftingView } from './components/DraftingView';
import { NegotiationView } from './components/NegotiationView';
import { ApprovalView } from './components/ApprovalView';
import { PaymentView } from './components/PaymentView';
import { CreateContractView } from './components/CreateContractView';
import { AdminView } from './components/AdminView';
import { ContractListView } from './components/ContractListView';
import { ApprovalTrackingView } from './components/ApprovalTrackingView';
import { PaymentPreparationView } from './components/PaymentPreparationView';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Comprehensive Mock Data - Adjusted to match requested numbers:
// 1 completed, 2 in approval, 3 waiting for signature, 1 overdue/stuck
const MOCK_CONTRACTS: Contract[] = [
  // Scenario 1: Drafting (New)
  { id: 'new-influencer', title: 'Influencer Cooperation Agreement', partner: 'Alex Rivera', amount: 12500, status: 'Drafting', updatedAt: '2026-03-27T10:23:00Z', owner: 'Na Zhang', riskLevel: 'Low', versions: [], comments: [], deliverables: [], approvalPath: [] },
  
  // Drafting & Negotiation (3 items)
  { id: '1', title: 'Contract A', partner: 'Company A', amount: 12500, status: 'Drafting', updatedAt: '2026-03-24T17:37:00Z', owner: 'Na Zhang', riskLevel: 'Low', versions: [], comments: [], deliverables: [], approvalPath: [] },
  { id: '2', title: 'Contract B', partner: 'Company B', amount: 4800, status: 'Drafting', updatedAt: '2026-03-25T14:15:00Z', owner: 'Na Zhang', riskLevel: 'Low', versions: [], comments: [], deliverables: [], approvalPath: [] },
  { id: '3', title: 'Contract C', partner: 'Company C', amount: 25000, status: 'Negotiation', updatedAt: '2026-03-26T18:48:00Z', owner: 'Na Zhang', riskLevel: 'Low', versions: [], comments: [], deliverables: [], approvalPath: [] },
  
  // Scenario 2: Approval & Signature (Contract D)
  { id: '4', title: 'Contract D', partner: 'Company D', amount: 8000, status: 'Approval Stuck', updatedAt: '2026-03-25T15:22:00Z', owner: 'Na Zhang', riskLevel: 'High', versions: [], comments: [], deliverables: [], approvalPath: [
    { role: 'Applicant', name: 'Na Zhang', status: 'Approved', estimatedDays: 0 },
    { role: 'Manager', name: 'David L.', status: 'Approved', estimatedDays: 1 },
    { role: 'Legal', name: 'James W.', status: 'Pending', estimatedDays: 5 },
    { role: 'Finance', name: 'Michael H.', status: 'Pending', estimatedDays: 2 }
  ] },
  
  // Approval & Signature (4 more items)
  { id: '5', title: 'Contract E', partner: 'Company E', amount: 15000, status: 'In Approval', updatedAt: '2026-03-26T21:45:00Z', owner: 'Erin Z.', riskLevel: 'Low', versions: [], comments: [], deliverables: [], approvalPath: [{ role: 'Finance', name: 'Lisa M.', status: 'Pending', estimatedDays: 2 }] },
  { id: '6', title: 'Contract F', partner: 'Company F', amount: 32000, status: 'Approval Stuck', updatedAt: '2026-03-24T16:10:00Z', owner: 'Erin Z.', riskLevel: 'High', versions: [], comments: [], deliverables: [], approvalPath: [{ role: 'CEO', name: 'James W.', status: 'Pending', estimatedDays: 3 }] },
  { id: '7', title: 'Contract G', partner: 'Company G', amount: 50000, status: 'In Approval', updatedAt: '2026-03-26T13:30:00Z', owner: 'Erin Z.', riskLevel: 'Low', versions: [], comments: [], deliverables: [], approvalPath: [{ role: 'Strategy', name: 'Rachel K.', status: 'Pending', estimatedDays: 4 }] },
  { id: '8', title: 'Contract H', partner: 'Company H', amount: 18000, status: 'Signing', updatedAt: '2026-03-26T22:05:00Z', owner: 'Erin Z.', riskLevel: 'Low', versions: [], comments: [], deliverables: [], approvalPath: [] },
  
  // Scenario 3: Payment Prep (Contract I)
  { id: '9', title: 'Contract I', partner: 'Company I', amount: 12000, status: 'Payment Ready', updatedAt: '2026-03-25T23:20:00Z', owner: 'Na Zhang', riskLevel: 'Low', versions: [], comments: [], deliverables: [], approvalPath: [] },
  
  // Payment Prep (1 more item)
  { id: '10', title: 'Contract J', partner: 'Company J', amount: 9500, status: 'Payment Ready', updatedAt: '2026-03-26T15:45:00Z', owner: 'Erin Z.', riskLevel: 'Low', versions: [], comments: [], deliverables: [], approvalPath: [] },
  
  // Completed (8 items)
  { id: '11', title: 'Contract K', partner: 'Company K', amount: 10000, status: 'Signed', updatedAt: '2026-03-20T16:30:00Z', owner: 'Na Zhang', riskLevel: 'Low', versions: [], comments: [], deliverables: [], approvalPath: [] },
  { id: '12', title: 'Contract L', partner: 'Company L', amount: 20000, status: 'Signed', updatedAt: '2026-03-18T23:15:00Z', owner: 'Na Zhang', riskLevel: 'Low', versions: [], comments: [], deliverables: [], approvalPath: [] },
  { id: '13', title: 'Contract M', partner: 'Company M', amount: 30000, status: 'Signed', updatedAt: '2026-03-15T14:50:00Z', owner: 'Na Zhang', riskLevel: 'Low', versions: [], comments: [], deliverables: [], approvalPath: [] },
  { id: '14', title: 'Contract N', partner: 'Company N', amount: 40000, status: 'Signed', updatedAt: '2026-03-10T21:30:00Z', owner: 'Na Zhang', riskLevel: 'Low', versions: [], comments: [], deliverables: [], approvalPath: [] },
  { id: '15', title: 'Contract O', partner: 'Company O', amount: 6500, status: 'Signed', updatedAt: '2026-03-08T14:00:00Z', owner: 'Na Zhang', riskLevel: 'Low', versions: [], comments: [], deliverables: [], approvalPath: [] },
  { id: '16', title: 'Contract P', partner: 'Company P', amount: 22000, status: 'Signed', updatedAt: '2026-03-05T15:00:00Z', owner: 'Na Zhang', riskLevel: 'Low', versions: [], comments: [], deliverables: [], approvalPath: [] },
  { id: '17', title: 'Contract Q', partner: 'Company Q', amount: 15500, status: 'Signed', updatedAt: '2026-02-28T16:00:00Z', owner: 'Na Zhang', riskLevel: 'Low', versions: [], comments: [], deliverables: [], approvalPath: [] },
  { id: '18', title: 'Contract R', partner: 'Company R', amount: 8200, status: 'Signed', updatedAt: '2026-02-25T17:00:00Z', owner: 'Na Zhang', riskLevel: 'Low', versions: [], comments: [], deliverables: [], approvalPath: [] }
];

const PERFORMANCE_METRICS: MetricData[] = [
  { name: 'Turnaround', baseline: 15, goal: 8 },
  { name: 'Legal Review', baseline: 7, goal: 3 },
  { name: 'Payment Cycle', baseline: 12, goal: 5 },
  { name: 'Email Count', baseline: 25, goal: 10 },
  { name: 'Error Rate', baseline: 5, goal: 1 },
];

type ViewType = 'dashboard' | 'drafting' | 'negotiation' | 'approval' | 'payment' | 'admin' | 'all-contracts' | 'drafts-list' | 'negotiations-list' | 'create-contract' | 'workflow-drafting' | 'workflow-approval' | 'workflow-payment' | 'approval-tracking' | 'payment-preparation';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [contractsExpanded, setContractsExpanded] = useState(true);
  const [draftingContent, setDraftingContent] = useState<string>('');
  const [draftingTitle, setDraftingTitle] = useState<string>('');

  const selectedContract = MOCK_CONTRACTS.find(c => c.id === selectedContractId) || MOCK_CONTRACTS[0];

  const handleContractClick = (contractId: string) => {
    const contract = MOCK_CONTRACTS.find(c => c.id === contractId);
    if (!contract) return;

    setSelectedContractId(contractId);

    // Scenario-specific navigation
    if (contractId === 'new-influencer') {
      setActiveView('drafting');
    } else if (contractId === '4') { // Contract D
      setActiveView('approval-tracking');
    } else if (contractId === '9') { // Contract I
      setActiveView('payment-preparation');
    } else {
      // Default behavior for other contracts (display only or generic view)
      // For the prototype, we only want these 3 to be interactive
    }
  };

  const handleCreateContract = () => {
    setActiveView('create-contract');
  };

  const handleSelectTemplate = (content: string, title: string) => {
    setDraftingContent(content);
    setDraftingTitle(title);
    setActiveView('drafting');
  };

  const handleUploadContract = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setDraftingContent(content || `# Uploaded Content: ${file.name}\n\n(Simulated content for ${file.name})`);
      setDraftingTitle(file.name);
      setActiveView('drafting');
    };
    if (file.type.startsWith('text/') || file.name.endsWith('.md')) {
      reader.readAsText(file);
    } else {
      setDraftingContent(`# File: ${file.name}\n\nThis is a simulated view of the uploaded file: ${file.name}.\n\nIn a production environment, this would be processed by a document parser.`);
      setDraftingTitle(file.name);
      setActiveView('drafting');
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView 
            contracts={MOCK_CONTRACTS} 
            onSelectContract={handleContractClick} 
            onNewContract={handleCreateContract}
            onNavigate={(view) => setActiveView(view as ViewType)}
          />
        );
      case 'all-contracts':
        return (
          <ContractListView 
            title="All Contracts"
            contracts={MOCK_CONTRACTS}
            onSelectContract={handleContractClick}
            onNewContract={handleCreateContract}
          />
        );
      case 'drafts-list':
        return (
          <ContractListView 
            title="Draft Contracts"
            filterStatus="Drafting"
            contracts={MOCK_CONTRACTS}
            onSelectContract={handleContractClick}
            onNewContract={handleCreateContract}
          />
        );
      case 'negotiations-list':
        return (
          <ContractListView 
            title="Active Negotiations"
            filterStatus="Negotiation"
            contracts={MOCK_CONTRACTS}
            onSelectContract={handleContractClick}
            onNewContract={handleCreateContract}
          />
        );
      case 'drafting':
        return <DraftingView 
          initialContent={draftingContent} 
          initialTitle={draftingTitle} 
          onBack={() => setActiveView('create-contract')} 
          onNext={() => setActiveView('negotiation')}
          onSendForApproval={() => {
            // This is handled inside DraftingView now with a success modal
            // But we can keep this as a fallback or for state updates
          }}
          onViewApprovalStatus={() => {
            setSelectedContractId('new-influencer');
            setActiveView('approval-tracking');
          }}
        />;
      case 'approval-tracking':
        return <ApprovalTrackingView contract={selectedContract} onBack={() => setActiveView('dashboard')} />;
      case 'payment-preparation':
        return <PaymentPreparationView 
          contract={selectedContract} 
          onBack={() => setActiveView('dashboard')} 
          onSubmit={() => setActiveView('dashboard')}
        />;
      case 'workflow-drafting':
        return (
          <ContractListView 
            title="Drafting & Negotiation"
            contracts={MOCK_CONTRACTS.filter(c => ['Drafting', 'Negotiation'].includes(c.status))}
            onSelectContract={handleContractClick}
            onNewContract={handleCreateContract}
          />
        );
      case 'workflow-approval':
        return (
          <ContractListView 
            title="Approval & Signature"
            contracts={MOCK_CONTRACTS.filter(c => ['Legal Review', 'Finance Approval', 'Final Approval', 'Internal Consultation', 'IN APPROVAL', 'Approval Stuck', 'In Approval', 'Signing'].includes(c.status))}
            onSelectContract={handleContractClick}
            onNewContract={handleCreateContract}
          />
        );
      case 'workflow-payment':
        return (
          <ContractListView 
            title="Payment Preparation"
            contracts={MOCK_CONTRACTS.filter(c => c.status === 'Payment Ready')}
            onSelectContract={handleContractClick}
            onNewContract={handleCreateContract}
          />
        );
      case 'negotiation':
        return <NegotiationView contract={selectedContract} />;
      case 'approval':
        return <ApprovalView contract={selectedContract} />;
      case 'payment':
        return <PaymentView contract={selectedContract} />;
      case 'admin':
        return <AdminView contracts={MOCK_CONTRACTS} />;
      case 'create-contract':
        return <CreateContractView 
          onBack={() => setActiveView('dashboard')} 
          onSelectTemplate={handleSelectTemplate}
          onUpload={handleUploadContract}
        />;
      default:
        return <DashboardView contracts={MOCK_CONTRACTS} onSelectContract={handleContractClick} onNewContract={handleCreateContract} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-[240px] bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-900 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 relative">
            <FileText className="text-white w-6 h-6" />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-white">
              <ShieldCheck className="text-white w-3 h-3" />
            </div>
          </div>
          <span className="font-bold text-2xl tracking-tight text-indigo-900">LegaliFi</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
          <button 
            onClick={handleCreateContract}
            className="w-full flex items-center justify-start gap-3 mb-6 px-4 py-3 bg-indigo-900 text-white rounded-xl font-bold shadow-lg shadow-indigo-900/20 hover:bg-indigo-950 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={20} />
            <span>Create New Contract</span>
          </button>

          <NavItem 
            icon={<LayoutDashboard size={18} />} 
            label="Dashboard" 
            active={activeView === 'dashboard'} 
            onClick={() => setActiveView('dashboard')} 
          />
          
          <div className="pt-4">
            <button 
              onClick={() => setContractsExpanded(!contractsExpanded)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all text-left whitespace-nowrap"
            >
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-slate-400" />
                <span>Contracts</span>
              </div>
              {contractsExpanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
            </button>
            
            {contractsExpanded && (
              <div className="mt-1 space-y-1">
                <SubNavItem 
                  icon={<ChevronRight size={14} />}
                  label="All Contracts" 
                  active={activeView === 'all-contracts'} 
                  onClick={() => setActiveView('all-contracts')} 
                />
                <SubNavItem 
                  icon={<FileStack size={14} />}
                  label="Contract Templates" 
                  active={activeView === 'templates'} 
                  onClick={() => {}} 
                />
              </div>
            )}
          </div>

          <div className="pt-4">
            <p className="px-4 py-2.5 text-sm font-bold text-slate-400 uppercase tracking-wider">Workflows</p>
            <NavItem icon={<FileEdit size={18} />} label="Drafting & Negotiation" active={activeView === 'workflow-drafting'} onClick={() => setActiveView('workflow-drafting')} />
            <NavItem icon={<MessageSquare size={18} />} label="Approval & Signature" active={activeView === 'workflow-approval' || activeView === 'approval-tracking'} onClick={() => setActiveView('workflow-approval')} />
            <NavItem icon={<CreditCard size={18} />} label="Payment Preparation" active={activeView === 'workflow-payment' || activeView === 'payment-preparation'} onClick={() => setActiveView('workflow-payment')} />
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <NavItem icon={<ShieldCheck size={18} />} label="Admin Portal" active={activeView === 'admin'} onClick={() => {}} />
          </div>
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xs">NZ</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">Na Zhang</p>
              <p className="text-[10px] text-slate-500 truncate">Marketing Specialist</p>
            </div>
            <Settings size={16} className="text-slate-400" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {activeView !== 'drafting' && (
          <header className="h-14 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-10 shrink-0">
            <div className="flex items-center gap-4">
              <h1 className="text-base font-bold text-slate-800">{
                activeView === 'dashboard' ? 'Dashboard Overview' : 
                activeView === 'all-contracts' ? 'All Contracts' :
                activeView === 'drafts-list' ? 'Draft Contracts' :
                activeView === 'negotiations-list' ? 'Active Negotiations' :
                activeView === 'workflow-drafting' ? 'Drafting & Negotiation' :
                activeView === 'workflow-approval' || activeView === 'approval-tracking' ? 'Approval & Signature' :
                activeView === 'workflow-payment' || activeView === 'payment-preparation' ? 'Payment Preparation' :
                activeView === 'create-contract' ? 'Create New Contract' :
                activeView === 'drafting' ? 'Contract Drafting' :
                activeView === 'negotiation' ? 'Negotiation & Versions' :
                activeView === 'approval' ? 'Approval Workflow' :
                activeView === 'payment' ? 'Deliverables & Payment' : 'Admin Portal'
              }</h1>
              {activeView === 'drafting' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-900 rounded-lg border border-indigo-800">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">New Vendor Onboarding</span>
                  <button className="text-indigo-200 hover:text-white"><X size={12} /></button>
                </div>
              )}
              {selectedContract && (activeView === 'negotiation' || activeView === 'approval' || activeView === 'payment') && (
                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
                  <span className="text-xs font-bold text-indigo-600 truncate max-w-[200px]">{selectedContract.title}</span>
                  <button onClick={() => setSelectedContractId(null)} className="text-indigo-400 hover:text-indigo-600"><X size={14} /></button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Search contracts, partners..." className="pl-10 pr-4 py-1.5 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-indigo-600 transition-all w-64" />
              </div>
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </header>
        )}

        <div className={cn(
          activeView === 'drafting' ? "p-0 flex-1 overflow-hidden" : "px-6 pt-4 pb-10"
        )}>
          {renderView()}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left whitespace-nowrap",
        active ? "bg-slate-100 text-indigo-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
      )}
    >
      <span className={cn(active ? "text-indigo-600" : "text-slate-400")}>{icon}</span>
      {label}
    </button>
  );
}

function SubNavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 pl-5 pr-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left whitespace-nowrap",
        active ? "text-indigo-900 bg-slate-100/50" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
      )}
    >
      <span className={cn(active ? "text-indigo-600" : "text-slate-400")}>{icon}</span>
      {label}
    </button>
  );
}
