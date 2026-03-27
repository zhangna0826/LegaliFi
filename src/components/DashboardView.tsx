import React, { useState } from 'react';
import { 
  FileText, Clock, AlertCircle, CreditCard, CheckCircle2, ChevronRight, 
  Plus, Send, History, MessageSquare, ShieldAlert, Zap, Check
} from 'lucide-react';
import { Contract, ContractStatus } from '../types';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const STAGES: ContractStatus[] = [
  'Drafting', 'Negotiation', 'Internal Consultation', 'Legal Review', 'Finance Approval', 'Final Approval', 'Signed', 'Payment Ready'
];

interface DashboardViewProps {
  contracts: Contract[];
  onSelectContract: (c: Contract) => void;
  onNewContract: () => void;
  onNavigate?: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ contracts, onSelectContract, onNewContract, onNavigate }) => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Reply to Legal", subtitle: "TechVibe Marketing Agreement", time: "2h ago", icon: <MessageSquare size={16} className="text-blue-500" /> },
    { id: 2, title: "Version Conflict", subtitle: "CloudScale Subscription", time: "5h ago", icon: <History size={16} className="text-amber-500" /> },
    { id: 3, title: "Submit Payment Request", subtitle: "SocialAds Q2 Placement", time: "Yesterday", icon: <Send size={16} className="text-emerald-500" /> },
  ]);

  const [completingId, setCompletingId] = useState<number | null>(null);

  const handleComplete = (id: number) => {
    setCompletingId(id);
    setTimeout(() => {
      setTasks(prev => prev.filter(t => t.id !== id));
      setCompletingId(null);
    }, 600);
  };

  // Use requested numbers for summary
  const completedCount = 16;
  const inApprovalCount = 6;
  const waitingSignatureCount = 8; 
  const overdueCount = 3;

  return (
    <div className="space-y-8">
      {/* Hero Section - Inspired by DocuSign/Feishu */}
      <div className="relative overflow-hidden bg-indigo-900 rounded-3xl p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-2">Welcome back, Na Zhang</h2>
          <p className="text-indigo-100 mb-6 text-lg font-medium">AI-Powered Risk Diagnosis for Smarter Decisions & Compliance</p>
          <div className="flex gap-4">
            <button 
              onClick={onNewContract}
              className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-50 transition-all shadow-lg"
            >
              <Plus size={20} /> Create New Contract
            </button>
            <button className="bg-indigo-700/50 backdrop-blur-sm border border-indigo-500/30 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700/70 transition-all">
              View All Templates
            </button>
          </div>
        </div>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/20 to-transparent" />
        <Zap className="absolute -bottom-8 -right-8 w-64 h-64 text-indigo-500/10 rotate-12" />
      </div>

      {/* Status Summary Cards - Compact Version */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => onNavigate?.('payment')}>
          <StatusCard 
            title="Completed" 
            label="Payment & Archive"
            value={completedCount.toString()} 
            icon={<CheckCircle2 size={18} className="text-emerald-600" />} 
            color="emerald"
          />
        </div>
        <div onClick={() => onNavigate?.('negotiations-list')}>
          <StatusCard 
            title="Active Negotiations" 
            label="AI-Assisted Review"
            value={inApprovalCount.toString()} 
            icon={<Zap size={18} className="text-indigo-600" />} 
            color="indigo"
          />
        </div>
        <div onClick={() => onNavigate?.('all-contracts')}>
          <StatusCard 
            title="In Approval" 
            label="Automated Workflow"
            value={waitingSignatureCount.toString()} 
            icon={<Clock size={18} className="text-amber-600" />} 
            color="amber"
          />
        </div>
        <div onClick={() => onNavigate?.('all-contracts')}>
          <StatusCard 
            title="Stuck" 
            label="Attention Required"
            value={overdueCount.toString()} 
            icon={<AlertCircle size={18} className="text-red-600" />} 
            color="red"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Contract List - Timeline Dashboard */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Workflow Pipeline</h3>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
              <select className="bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-600 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>All Time</option>
              </select>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <select className="bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-600 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                <option>All Status</option>
                <option>Completed</option>
                <option>Active Negotiations</option>
                <option>In Approval</option>
                <option>Stuck</option>
              </select>
            </div>
          </div>
          <div className="space-y-6">
            {contracts.map((contract) => {
              const currentStageIndex = STAGES.indexOf(contract.status);
              const currentApprover = contract.approvalPath?.find(p => p.status === 'Pending')?.name;
              
              // Map status to aligned summary card styles
              const getStatusConfig = (status: ContractStatus, risk: string) => {
                if (status === 'Signed' || status === 'Payment Ready') {
                  return {
                    icon: <CheckCircle2 size={20} />,
                    color: 'emerald',
                    bg: 'bg-emerald-50',
                    text: 'text-emerald-600',
                    border: 'border-emerald-100',
                    badge: 'bg-emerald-100 text-emerald-700',
                    label: 'Completed'
                  };
                }
                if (risk === 'High') {
                  return {
                    icon: <AlertCircle size={20} />,
                    color: 'red',
                    bg: 'bg-red-50',
                    text: 'text-red-600',
                    border: 'border-red-100',
                    badge: 'bg-red-100 text-red-700',
                    label: 'Stuck'
                  };
                }
                if (status === 'Drafting' || status === 'Negotiation') {
                  return {
                    icon: <Zap size={20} />,
                    color: 'indigo',
                    bg: 'bg-indigo-50',
                    text: 'text-indigo-600',
                    border: 'border-indigo-100',
                    badge: 'bg-indigo-100 text-indigo-700',
                    label: 'Active Negotiations'
                  };
                }
                return {
                  icon: <Clock size={20} />,
                  color: 'amber',
                  bg: 'bg-amber-50',
                  text: 'text-amber-600',
                  border: 'border-amber-100',
                  badge: 'bg-amber-100 text-amber-700',
                  label: 'In Approval'
                };
              };

              const config = getStatusConfig(contract.status, contract.riskLevel || 'Low');
              
              return (
                <div key={contract.id} className="flex items-start gap-4 group cursor-pointer" onClick={() => onSelectContract(contract)}>
                  <div className="mt-1">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
                      config.bg, config.text, config.border,
                      config.label === 'Stuck' && "animate-pulse"
                    )}>
                      {config.icon}
                    </div>
                  </div>
                  <div className="flex-1 border-b border-slate-100 pb-4 group-last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{contract.title}</h4>
                      <span className="text-xs font-mono text-slate-500">${contract.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase", config.badge)}>
                        {config.label}
                      </span>
                      <span className="text-xs text-slate-500">{contract.partner}</span>
                      {contract.riskLevel === 'High' && (
                        <span className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                          <ShieldAlert size={12} /> Approval Stuck
                        </span>
                      )}
                    </div>
                    {/* Timeline Progress Bar */}
                    <div className="relative h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full transition-all duration-1000", config.label === 'Stuck' ? 'bg-red-500' : 'bg-indigo-500')}
                        style={{ width: `${(currentStageIndex + 1) / STAGES.length * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-[10px] text-slate-400">Updated at {format(new Date(contract.updatedAt), 'MM-dd HH:mm')}</span>
                      <span className="text-[10px] font-bold text-slate-500">
                        Stage {currentStageIndex + 1} / {STAGES.length}
                        {currentApprover && <span className="ml-2 text-indigo-600">Current: {currentApprover}</span>}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 mt-3 group-hover:text-indigo-400 transition-colors" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions / Tasks Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">To Do Tasks</h3>
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                    transition={{ duration: 0.3 }}
                  >
                    <TaskItem 
                      icon={task.icon}
                      title={task.title}
                      subtitle={task.subtitle}
                      time={task.time}
                      isCompleting={completingId === task.id}
                      onComplete={() => handleComplete(task.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              {tasks.length === 0 && (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={24} />
                  </div>
                  <p className="text-xs font-bold text-slate-400">All caught up!</p>
                </div>
              )}
            </div>
            <button className="w-full mt-6 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              View Task Center
            </button>
          </div>

          <div className="glass-card p-6 bg-indigo-50 border-indigo-100">
            <h3 className="text-sm font-bold text-indigo-900 mb-4">AI Assistant Suggestions</h3>
            <p className="text-xs text-indigo-700 leading-relaxed mb-4">
              Detected that the <strong>Global Events</strong> contract has been in "Negotiation" for over 5 days. Suggest using AI to re-evaluate disputed clauses.
            </p>
            <button className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline">
              Take Action <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function StatusCard({ title, value, label, icon, color }: { 
  title: string, value: string, label: string, icon: React.ReactNode, color: string
}) {
  const colorClasses: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    red: "bg-red-50 text-red-600 border-red-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
  };

  return (
    <div className="glass-card p-3 flex items-center gap-3 hover:shadow-md transition-all cursor-pointer group border-slate-100">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 relative ${colorClasses[color]}`}>
        {icon}
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm">
          <span className="text-[10px] font-bold text-slate-700">{value}</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">{title}</p>
        <p className="text-xs font-bold text-slate-800">{label}</p>
      </div>
    </div>
  );
}

function FilterButton({ label, active }: { label: string, active?: boolean }) {
  return (
    <button className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
      active ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
    }`}>
      {label}
    </button>
  );
}

function TaskItem({ icon, title, subtitle, time, isCompleting, onComplete }: { 
  icon: React.ReactNode, title: string, subtitle: string, time: string, isCompleting: boolean, onComplete: () => void 
}) {
  return (
    <div className={cn(
      "flex items-start gap-3 p-3 rounded-xl transition-all border border-transparent",
      isCompleting ? "bg-emerald-50 border-emerald-100 scale-95 opacity-50" : "hover:bg-slate-50 hover:border-slate-100"
    )}>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onComplete();
        }}
        className={cn(
          "mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0",
          isCompleting ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-200 hover:border-indigo-500 bg-white"
        )}
      >
        {isCompleting && <Check size={12} strokeWidth={4} />}
      </button>
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-xs font-bold text-slate-800 truncate transition-all", isCompleting && "line-through text-slate-400")}>{title}</p>
        <p className="text-[10px] text-slate-500 truncate">{subtitle}</p>
      </div>
      <span className="text-[10px] text-slate-400 whitespace-nowrap">{time}</span>
    </div>
  );
}
