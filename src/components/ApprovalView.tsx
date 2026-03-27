import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  Send,
  MessageSquare,
  Search,
  MoreHorizontal,
  FileText,
  History,
  Info,
  ShieldCheck,
  FileCheck,
  ArrowRight,
  Mail,
  Zap
} from 'lucide-react';
import { Contract } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ApprovalRecord {
  id: string;
  nodeName: string;
  status: 'Approved' | 'Submitted' | 'Pending' | 'In Progress';
  operator: {
    name: string;
    avatar?: string;
    initials: string;
    comment?: string;
    role?: string;
  };
  time: string;
  relativeTime: string;
}

interface ApprovalViewProps {
  contract: Contract;
}

export const ApprovalView: React.FC<ApprovalViewProps> = ({ contract }) => {
  const [activeTab, setActiveTab] = useState('records');
  const [isNudging, setIsNudging] = useState(false);

  const handleNudge = () => {
    setIsNudging(true);
    setTimeout(() => setIsNudging(false), 2000);
  };

  const approvalRecords: ApprovalRecord[] = [
    {
      id: '01',
      nodeName: 'Submission',
      status: 'Submitted',
      operator: {
        name: 'Na Zhang',
        initials: 'NZ',
        role: 'APPLICANT',
        comment: 'This application is quite special, please pay attention.'
      },
      time: '2026-03-01 10:00:00',
      relativeTime: '14 days ago'
    },
    {
      id: '02',
      nodeName: 'Business Manager Review',
      status: 'Approved',
      operator: {
        name: 'David L.',
        initials: 'DL',
        role: 'MANAGER',
        comment: '1. Business & R&D evaluation, S05e modified: adding one 4T SSD can achieve higher utilization, confirmed by the supply chain planning team; 2. Sourcing initiated procurement approval, investigating the server original factory.'
      },
      time: '2026-03-02 14:30:00',
      relativeTime: '13 days ago'
    },
    {
      id: '03',
      nodeName: 'Legal Review',
      status: 'In Progress',
      operator: {
        name: 'Sarah K.',
        initials: 'SK',
        role: 'LEGAL',
        comment: 'Awaiting response for 2 days. This node is currently exceeding the expected processing time.'
      },
      time: '-',
      relativeTime: 'In Progress'
    },
    {
      id: '04',
      nodeName: 'Finance Review',
      status: 'Pending',
      operator: {
        name: 'Mike R.',
        initials: 'MR',
        role: 'FINANCE'
      },
      time: '-',
      relativeTime: 'Pending'
    },
    {
      id: '05',
      nodeName: 'CEO Review',
      status: 'Pending',
      operator: {
        name: 'CEO',
        initials: 'CEO',
        role: 'EXECUTIVE'
      },
      time: '-',
      relativeTime: 'Pending'
    }
  ];

  const getStatusBadge = (status: ApprovalRecord['status']) => {
    switch (status) {
      case 'Approved':
        return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">Approved</span>;
      case 'Submitted':
        return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">Submitted</span>;
      case 'Pending':
        return <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">Pending</span>;
      case 'In Progress':
        return <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-bold">In Progress</span>;
      default:
        return null;
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      {/* Streamlined Timeline Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
          <div>
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Approval Process</h2>
            <p className="text-[9px] text-slate-500">Full audit trail and real-time status</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 mr-3 border-r border-slate-100 pr-3">
              <StatusLegend color="bg-emerald-500" label="Approved" />
              <StatusLegend color="bg-indigo-600" label="In Progress" />
              <StatusLegend color="bg-slate-200" label="Pending" />
            </div>
            <button 
              onClick={handleNudge}
              disabled={isNudging}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all shadow-sm",
                isNudging 
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                  : "bg-red-600 text-white hover:bg-red-700 active:scale-95"
              )}
            >
              {isNudging ? (
                <>
                  <CheckCircle2 size={10} />
                  Nudged
                </>
              ) : (
                <>
                  <Zap size={10} fill="currentColor" />
                  One-click Nudge
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-5 bg-slate-50/10">
          <div className="relative space-y-3 max-w-5xl mx-auto">
            {/* Vertical Line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-200 z-0" />

            {approvalRecords.map((record, idx) => {
              const isApproved = record.status === 'Approved' || record.status === 'Submitted';
              const isInProgress = record.status === 'In Progress';
              const isPending = record.status === 'Pending';
              const isDelayed = isInProgress && record.operator.name === 'Sarah K.'; // Mocking delay for Sarah
              
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  key={idx} 
                  className="relative z-10 flex gap-4 group"
                >
                  {/* Node Icon */}
                  <div className={cn(
                    "w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center shrink-0 transition-all duration-500",
                    isApproved ? "bg-emerald-500 text-white" : 
                    isInProgress ? (isDelayed ? "bg-red-500 text-white scale-105 ring-2 ring-red-50" : "bg-indigo-600 text-white scale-105 ring-2 ring-indigo-50") : 
                    "bg-white text-slate-300"
                  )}>
                    {isApproved ? <CheckCircle2 size={16} /> : 
                     isInProgress ? <Clock size={16} className="animate-pulse" /> : 
                     <User size={16} />}
                  </div>

                  {/* Node Card */}
                  <div className={cn(
                    "flex-1 p-3 rounded-xl border transition-all duration-300",
                    isInProgress ? (isDelayed ? "bg-white border-red-200 shadow-lg ring-1 ring-red-50" : "bg-white border-indigo-200 shadow-lg ring-1 ring-indigo-50") : 
                    isApproved ? "bg-white border-slate-200" : 
                    "bg-slate-50/50 border-slate-100 opacity-80"
                  )}>
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Left Side: Operator Info */}
                      <div className="w-full sm:w-1/3 shrink-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1 py-0.5 rounded">#{record.id}</span>
                            <h4 className={cn("text-xs font-bold", isDelayed ? "text-red-600" : "text-slate-800")}>{record.nodeName}</h4>
                          </div>
                          {getStatusBadge(record.status)}
                        </div>

                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] border border-white shadow-sm shrink-0",
                            isDelayed ? "bg-red-50 text-red-600" : "bg-indigo-50 text-indigo-600"
                          )}>
                            {record.operator.initials}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 overflow-hidden">
                              <span className="text-[11px] font-bold text-slate-700 truncate">{record.operator.name}</span>
                              <span className="text-[8px] font-bold text-slate-400 px-1 py-0.2 bg-slate-100 rounded uppercase shrink-0">{record.operator.role}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[8px] text-emerald-600 font-bold flex items-center gap-0.5">
                                <FileCheck size={8} /> Read
                              </span>
                              <span className="text-[8px] text-slate-400">•</span>
                              <span className={cn("text-[8px] font-medium", isDelayed ? "text-red-500" : "text-slate-400")}>
                                {record.time !== '-' ? `${record.time} (${record.relativeTime})` : (isDelayed ? 'Delayed: 2 days' : 'Awaiting')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Note/Comment & Actions */}
                      <div className="flex-1 flex flex-col justify-between">
                        {record.operator.comment ? (
                          <div className={cn(
                            "rounded-lg p-2 border relative h-full",
                            isDelayed ? "bg-red-50/30 border-red-100" : "bg-slate-50/50 border-slate-100"
                          )}>
                            <MessageSquare size={10} className={cn("absolute -top-1.5 -left-1.5 rounded-full p-0.5 bg-white border", isDelayed ? "text-red-400 border-red-100" : "text-slate-300 border-slate-100")} />
                            <p className={cn("text-[10px] leading-relaxed", isDelayed ? "text-red-700" : "text-slate-600")}>
                              {record.operator.comment}
                            </p>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center border border-dashed border-slate-200 rounded-lg bg-slate-50/30">
                            <span className="text-[9px] text-slate-400 italic">No comments provided</span>
                          </div>
                        )}

                        {isInProgress && (
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <div className="flex -space-x-1.5">
                                {[1, 2].map(i => (
                                  <div key={i} className="w-5 h-5 rounded-full border border-white bg-slate-200 flex items-center justify-center text-[7px] font-bold text-slate-500 shadow-xs">
                                    CC
                                  </div>
                                ))}
                              </div>
                              <span className="text-[9px] text-slate-400 font-medium">2 CC'd</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 transition-colors border border-slate-100">
                                <Mail size={12} />
                              </button>
                              <button className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 transition-colors border border-slate-100">
                                <MessageSquare size={12} />
                              </button>
                              <button 
                                onClick={handleNudge}
                                className={cn(
                                  "px-3 py-1 rounded-md text-[9px] font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1",
                                  isDelayed ? "bg-red-600 text-white hover:bg-red-700" : "bg-indigo-600 text-white hover:bg-indigo-700"
                                )}
                              >
                                <Zap size={10} fill="currentColor" />
                                Nudge Now
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 bg-white border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="px-5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm active:scale-95">
              Seal
            </button>
            <button className="px-5 py-1.5 bg-white border border-indigo-200 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-all active:scale-95">
              Reject
            </button>
            <button className="px-5 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all active:scale-95">
              More
            </button>
          </div>
          <button className="flex items-center gap-1 text-slate-400 hover:text-indigo-600 transition-colors text-[9px] font-bold uppercase tracking-wider">
            <History size={12} />
            Full History
          </button>
        </div>
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="glass-card p-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Contract Info</h3>
          <div className="space-y-2">
            <InfoItem label="Contract Name" value={contract.title} />
            <InfoItem label="Contract No." value={`CON-${contract.id.padStart(5, '0')}`} />
            <InfoItem label="Contract Type" value="Service Agreement" />
          </div>
        </div>
        <div className="glass-card p-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Applicant</h3>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
              NZ
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Na Zhang</p>
              <p className="text-[9px] text-slate-500">Operations Department</p>
            </div>
          </div>
          <button className="w-full mt-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

function StatusLegend({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
      <div className={cn("w-2.5 h-2.5 rounded-full", color)} /> {label}
    </div>
  );
}

function InfoItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className="text-[11px] font-bold text-slate-700">{value}</span>
    </div>
  );
}
