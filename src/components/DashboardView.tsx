import React, { useState } from 'react';
import { 
  FileText, Clock, AlertCircle, CreditCard, CheckCircle2, ChevronRight, 
  Plus, Send, History, MessageSquare, ShieldAlert, Zap, Check, Sparkles,
  Mail, Search, FileEdit, PenTool, Flag, X, Bot, Wand2
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
  const [pipelineFilter, setPipelineFilter] = useState<string>('All');
  const [showAiModal, setShowAiModal] = useState(false);

  const [tasks, setTasks] = useState([
    { id: 1, title: "Nudge Required", subtitle: "Global Events - Stuck for 5 days", time: "2h ago", icon: <Clock size={16} className="text-red-500" /> },
    { id: 2, title: "New Comment", subtitle: "TechVibe - Legal needs clarification", time: "5h ago", icon: <MessageSquare size={16} className="text-blue-500" /> },
    { id: 3, title: "Urgent Edit", subtitle: "CloudScale - Version conflict", time: "Yesterday", icon: <AlertCircle size={16} className="text-amber-500" /> },
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
    <div className="space-y-4">
      {/* Hero Section - Inspired by DocuSign/Feishu */}
      <div className="relative overflow-hidden bg-indigo-900 rounded-2xl p-6 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-bold mb-1">Welcome back, Na Zhang</h2>
          <p className="text-indigo-100 mb-0 text-base font-medium">Your AI copilot for safer contracts.</p>
        </div>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/20 to-transparent" />
        <Zap className="absolute -bottom-8 -right-8 w-64 h-64 text-indigo-500/10 rotate-12" />
      </div>

      {/* Status Summary Cards - Compact Version */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => setPipelineFilter('Drafting & Negotiation')}>
          <StatusCard 
            title="Drafting & Negotiation" 
            value="3" 
            icon={<FileEdit size={18} className="text-indigo-600" />} 
            color="indigo"
            active={pipelineFilter === 'Drafting & Negotiation'}
          />
        </div>
        <div onClick={() => setPipelineFilter('Approval & Signature')}>
          <StatusCard 
            title="Approval & Signature" 
            value="5" 
            icon={<PenTool size={18} className="text-amber-600" />} 
            color="amber"
            active={pipelineFilter === 'Approval & Signature'}
          />
        </div>
        <div onClick={() => setPipelineFilter('Payment Prep')}>
          <StatusCard 
            title="Payment Prep" 
            value="2" 
            icon={<CreditCard size={18} className="text-blue-600" />} 
            color="blue"
            active={pipelineFilter === 'Payment Prep'}
          />
        </div>
        <div onClick={() => setPipelineFilter('Completed')}>
          <StatusCard 
            title="Completed" 
            value="8" 
            icon={<Flag size={18} className="text-emerald-600" />} 
            color="emerald"
            active={pipelineFilter === 'Completed'}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Contract List - Timeline Dashboard */}
        <div className="lg:col-span-2 glass-card p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              {pipelineFilter === 'All' ? 'All Contracts' : pipelineFilter}
            </h3>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
              <select className="bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-600 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>All Time</option>
              </select>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <button 
                onClick={() => setPipelineFilter('All')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                  pipelineFilter === 'All' ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                )}
              >
                Show All
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {contracts
              .filter(contract => {
                if (pipelineFilter === 'All') return true;
                if (pipelineFilter === 'Drafting & Negotiation') return contract.status === 'Drafting' || contract.status === 'Negotiation';
                if (pipelineFilter === 'Approval & Signature') return contract.status === 'Internal Consultation' || contract.status === 'Legal Review' || contract.status === 'Finance Approval' || contract.status === 'Final Approval';
                if (pipelineFilter === 'Payment Prep') return contract.status === 'Payment Ready';
                if (pipelineFilter === 'Completed') return contract.status === 'Signed';
                return true;
              })
              .map((contract) => {
              const currentStageIndex = STAGES.indexOf(contract.status);
              const currentApprover = contract.approvalPath?.find(p => p.status === 'Pending')?.name;
              
              // Map status to aligned summary card styles
              const getStatusConfig = (status: ContractStatus, risk: string) => {
                if (status === 'Drafting' || status === 'Negotiation') {
                  return {
                    icon: <FileEdit size={20} />,
                    color: 'indigo',
                    bg: 'bg-indigo-50',
                    text: 'text-indigo-600',
                    border: 'border-indigo-100',
                    badge: 'bg-indigo-100 text-indigo-700',
                    label: 'Active Negotiations'
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
                if (status === 'Payment Ready') {
                  return {
                    icon: <CreditCard size={20} />,
                    color: 'blue',
                    bg: 'bg-blue-50',
                    text: 'text-blue-600',
                    border: 'border-blue-100',
                    badge: 'bg-blue-100 text-blue-700',
                    label: 'Payment Prep'
                  };
                }
                if (status === 'Signed') {
                  return {
                    icon: <Flag size={20} />,
                    color: 'emerald',
                    bg: 'bg-emerald-50',
                    text: 'text-emerald-600',
                    border: 'border-emerald-100',
                    badge: 'bg-emerald-100 text-emerald-700',
                    label: 'Completed'
                  };
                }
                return {
                  icon: <PenTool size={20} />,
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
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-slate-400">Updated at {format(new Date(contract.updatedAt), 'MM-dd HH:mm')}</span>
                        {config.label === 'Stuck' && (
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={(e) => { e.stopPropagation(); }}
                              className="flex items-center gap-1.5 px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded-md text-[10px] font-bold hover:bg-red-100 transition-all"
                            >
                              <Send size={10} /> Nudge Now
                            </button>
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Mail size={12} className="hover:text-indigo-500 transition-colors" />
                              <MessageSquare size={12} className="hover:text-indigo-500 transition-colors" />
                            </div>
                          </div>
                        )}
                      </div>
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
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card p-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Needs Attention</h3>
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
        </div>
      </div>
      {/* Floating AI Assistant Button */}
      <button 
        onClick={() => setShowAiModal(true)}
        className="fixed bottom-8 right-8 bg-indigo-500 text-white px-6 py-4 rounded-full shadow-2xl shadow-indigo-200 flex items-center gap-3 hover:bg-indigo-600 hover:scale-105 transition-all z-50 group"
      >
        <div className="relative">
          <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
        </div>
        <span className="font-bold text-sm">Ask AI copilot</span>
      </button>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {showAiModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAiModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="bg-indigo-900 p-6 text-white relative">
                <button 
                  onClick={() => setShowAiModal(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Bot className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">LegaliFi AI Copilot</h3>
                    <p className="text-indigo-200 text-sm">Always ready to help with your contracts</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    "Hello Na Zhang! I've analyzed your current pipeline. You have <span className="font-bold text-indigo-600">3 overdue tasks</span> that need immediate attention. Would you like me to draft a follow-up email for the <span className="font-bold text-indigo-600">Global Logistics Agreement</span>?"
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <button className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left group">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                      <Wand2 size={16} className="text-slate-500 group-hover:text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Draft follow-up email</p>
                      <p className="text-[10px] text-slate-500">For Global Logistics Agreement</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left group">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                      <Search size={16} className="text-slate-500 group-hover:text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Summarize contract risks</p>
                      <p className="text-[10px] text-slate-500">Analyze the latest draft version</p>
                    </div>
                  </button>
                </div>
                
                <div className="relative mt-4">
                  <input 
                    type="text" 
                    placeholder="Ask me anything about your contracts..." 
                    className="w-full pl-4 pr-12 py-3 bg-slate-100 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

function StatusCard({ title, value, icon, color, active }: { 
  title: string, value: string, icon: React.ReactNode, color: string, active?: boolean
}) {
  const colorClasses: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    red: "bg-red-50 text-red-600 border-red-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
  };

  return (
    <div className={cn(
      "glass-card p-3 flex items-center gap-3 hover:shadow-md transition-all cursor-pointer group border-slate-100",
      active 
        ? (title === 'Drafting & Negotiation' ? "bg-indigo-50 border-indigo-200 shadow-sm ring-1 ring-indigo-200" : "bg-slate-100 border-slate-300 shadow-inner")
        : "hover:bg-white"
    )}>
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 relative transition-colors",
        colorClasses[color]
      )}>
        {icon}
        <div className={cn(
          "absolute -top-1.5 -right-1.5 w-5 h-5 border rounded-full flex items-center justify-center shadow-sm bg-white border-slate-100 text-slate-700"
        )}>
          <span className="text-[10px] font-bold">{value}</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-xs font-bold uppercase tracking-tight leading-tight text-slate-800"
        )}>{title}</p>
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
