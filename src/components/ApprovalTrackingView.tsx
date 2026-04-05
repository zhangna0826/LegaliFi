import React, { useState } from 'react';
import { 
  ChevronLeft, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Mail, 
  MessageSquare, 
  Send,
  User,
  Info,
  ShieldCheck,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Contract } from '../types';

interface ApprovalTrackingViewProps {
  contract: Contract;
  onBack: () => void;
}

export const ApprovalTrackingView: React.FC<ApprovalTrackingViewProps> = ({ contract, onBack }) => {
  const [isNudging, setIsNudging] = useState(false);
  const [isNudged, setIsNudged] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [nudgeTime, setNudgeTime] = useState('');

  const isContractD = contract.id === '4';
  const isNewInfluencer = contract.id === 'new-influencer';

  const handleNudge = () => {
    setIsNudging(true);
    setTimeout(() => {
      setIsNudging(false);
      setIsNudged(true);
      setShowToast(true);
      setNudgeTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  const timelineSteps = isNewInfluencer ? [
    { id: 1, role: 'Submission', name: 'Na Zhang', title: 'APPLICANT', status: 'Submitted', time: 'Just now', icon: <CheckCircle2 size={16} className="text-emerald-500" />, color: 'bg-emerald-500' },
    { id: 2, role: 'Manager Review', name: 'David L.', title: 'MANAGER', status: 'Pending', time: 'Awaiting', icon: <Clock size={16} className="text-slate-400" />, color: 'bg-slate-200' },
    { id: 3, role: 'Legal Review', name: 'Sarah J.', title: 'LEGAL', status: 'Pending', time: 'Awaiting', icon: <Clock size={16} className="text-slate-400" />, color: 'bg-slate-200' },
    { id: 4, role: 'Finance Review', name: 'Michael H.', title: 'FINANCE', status: 'Pending', time: 'Awaiting', icon: <Clock size={16} className="text-slate-400" />, color: 'bg-slate-200' },
    { id: 5, role: 'CEO Approval', name: 'James W.', title: 'CEO', status: 'Pending', time: 'Awaiting', icon: <Clock size={16} className="text-slate-400" />, color: 'bg-slate-200' },
  ] : [
    { id: 1, role: 'Submission', name: 'Na Zhang', title: 'APPLICANT', status: 'Submitted', time: '2026-03-20 09:30:00 (7 days ago)', comment: '"Submitted for standard review."', icon: <CheckCircle2 size={16} className="text-emerald-500" />, color: 'bg-emerald-500' },
    { id: 2, role: 'Manager Review', name: 'David L.', title: 'MANAGER', status: 'Approved', time: '2026-03-21 02:15:00 (6 days ago)', comment: '"Approved. Standard terms."', icon: <CheckCircle2 size={16} className="text-emerald-500" />, color: 'bg-emerald-500' },
    { id: 3, role: 'Legal Review', name: 'James W.', title: 'LEGAL', status: isNudged ? 'Approved' : 'In Progress', time: isNudged ? 'Approved just now' : 'Delayed: 5 days', isStuck: !isNudged, delay: '5 days', comment: 'No comments provided', icon: isNudged ? <CheckCircle2 size={16} className="text-emerald-500" /> : <AlertCircle size={16} className="text-red-500" />, color: isNudged ? 'bg-emerald-500' : 'bg-red-500' },
    { id: 4, role: 'Finance Review', name: 'Michael H.', title: 'FINANCE', status: isNudged ? 'In Progress' : 'Pending', time: isNudged ? 'Awaiting review' : 'Awaiting Legal approval', comment: 'No comments provided', icon: isNudged ? <Clock size={16} className="text-blue-500" /> : <Clock size={16} className="text-slate-400" />, color: isNudged ? 'bg-blue-500' : 'bg-slate-200' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[110] bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <CheckCircle2 size={20} />
            <span className="font-bold text-sm">✓ Reminder sent to James W. — Legal Review</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">{contract.title}</h1>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isContractD && !isNudged ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'
              }`}>
                {isContractD && !isNudged ? 'STUCK' : 'IN APPROVAL'}
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">{contract.partner} • ${contract.amount.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isContractD && !isNudged && (
            <button 
              onClick={handleNudge}
              disabled={isNudging}
              className="px-6 py-2 bg-indigo-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/20 hover:bg-indigo-950 transition-all flex items-center gap-2"
            >
              {isNudging ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={16} />}
              One-click Nudge
            </button>
          )}
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Clock size={18} className="text-indigo-600" />
                APPROVAL TIMELINE
              </h3>
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Approved</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /> In Progress</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-300" /> Pending</div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="relative space-y-12">
                {/* Vertical Line */}
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100" />

                {timelineSteps.map((step, idx) => (
                  <div key={step.id} className="relative flex gap-6">
                    {/* Dot */}
                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                      step.status === 'Submitted' || step.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 
                      step.status === 'In Progress' ? (step.isStuck ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600') :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      {step.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-800 text-sm">#{String(step.id).padStart(2, '0')} {step.role}</h4>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                            step.status === 'Submitted' || step.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                            step.status === 'In Progress' ? (step.isStuck ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600') :
                            'bg-slate-50 text-slate-400'
                          }`}>
                            {step.status}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold ${step.isStuck ? 'text-red-600' : 'text-slate-400'}`}>{step.time}</span>
                      </div>
                      
                      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                              {step.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">{step.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{step.title}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" /> Read
                          </div>
                        </div>

                        {step.comment && (
                          <div className="mb-3">
                            <p className="text-xs text-slate-600 italic">"{step.comment}"</p>
                          </div>
                        )}

                        {!step.comment && step.status !== 'Pending' && (
                          <div className="mb-3">
                            <p className="text-xs text-slate-400 italic">No comments provided</p>
                          </div>
                        )}

                        {step.isStuck && (
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                              CC: 3 of 3 📎
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={handleNudge}
                                disabled={isNudged || isNudging}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                  isNudged 
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                    : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 shadow-sm active:scale-95'
                                }`}
                              >
                                {isNudging ? (
                                  <div className="w-4 h-4 border-2 border-red-200 border-t-red-600 rounded-full animate-spin" />
                                ) : (
                                  <Send size={14} />
                                )}
                                <span>{isNudged ? 'Nudged ✓' : 'Nudge Now'}</span>
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {isNudged && step.isStuck && (
                          <p className="text-[10px] text-emerald-600 font-bold mt-2">Reminder sent just now</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Actions</h3>
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">FULL HISTORY</button>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">Seal</button>
              <button className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">Reject</button>
              <button className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">More</button>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">CONTRACT INFO</h3>
            <div className="space-y-4">
              <InfoItem label="Contract Name" value={contract.title} />
              <InfoItem label="Contract No" value={`00000${contract.id === 'new-influencer' ? '9' : contract.id}`} />
              <InfoItem label="Contract Type" value={isNewInfluencer ? 'Influencer Agreement' : 'Service Agreement'} />
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">APPLICANT</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">NZ</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Na Zhang</p>
                    <p className="text-[10px] text-slate-500 font-medium">Marketing</p>
                  </div>
                </div>
                <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider">[View Details]</button>
              </div>
            </div>
          </div>

          <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <ShieldCheck size={80} />
            </div>
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <SparklesIcon size={16} className="text-amber-400" />
              AI Compliance Check
            </h4>
            <p className="text-xs text-indigo-100 leading-relaxed mb-4">This contract has passed all 12 internal compliance checks with a 98% confidence score.</p>
            <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all">View Report</button>
          </div>
        </div>
      </div>
    </div>
  );
};

function InfoItem({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-xs font-bold text-slate-800">{value}</p>
    </div>
  );
}

function SparklesIcon({ size, className }: { size: number, className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>;
}
