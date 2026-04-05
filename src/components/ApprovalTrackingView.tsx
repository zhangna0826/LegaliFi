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
  Search,
  Trash2,
  X,
  Zap,
  Bell,
  History,
  Paperclip,
  PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Contract } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ApprovalTrackingViewProps {
  contract: Contract;
  onBack: () => void;
}

export const ApprovalTrackingView: React.FC<ApprovalTrackingViewProps> = ({ contract, onBack }) => {
  const [isNudging, setIsNudging] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const handleNudge = (name: string) => {
    setIsNudging(true);
    setTimeout(() => {
      setIsNudging(false);
      setShowToast(`Reminder sent to ${name} successfully`);
      setTimeout(() => setShowToast(null), 3000);
    }, 800);
  };

  const handleWithdrawConfirm = () => {
    setShowWithdrawModal(false);
    setShowToast('Application withdrawn successfully');
    setTimeout(() => onBack(), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 z-[110] bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] justify-center"
          >
            <CheckCircle2 size={20} className="text-emerald-400" />
            <span className="font-bold text-sm">{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb & Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-2">
          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors text-xs font-bold uppercase tracking-wider group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Approval Workflow</h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
              <span className="text-xs font-bold text-indigo-600">Contract D - Company D</span>
              <button className="text-indigo-300 hover:text-indigo-500"><X size={14} /></button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search contracts, partners..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:ring-2 focus:ring-indigo-600 transition-all w-72 shadow-sm" 
            />
          </div>
          <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-full relative bg-white border border-slate-200 shadow-sm">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      {/* Progress Summary Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-8 flex-1">
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Overall Progress</p>
            <div className="flex items-center gap-3">
              <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 w-[50%]" />
              </div>
              <span className="text-xs font-bold text-slate-700">2 of 4 steps completed</span>
            </div>
          </div>
          <div className="h-10 w-px bg-slate-100" />
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Status</p>
            <p className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Legal Director Approval · <span className="text-red-600">Delayed 2 days</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estimated Completion</p>
            <p className="text-xs font-bold text-slate-800">March 31, 2026</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/30">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Approval Process</h3>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Full audit trail and real-time status</p>
            </div>
            
            <div className="p-6">
              <div className="relative space-y-6">
                {/* Vertical Line */}
                <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-100" />

                {/* Step 0: Submission */}
                <div className="relative flex gap-6 opacity-60">
                  <div className="relative z-10 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm border-4 border-white">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="flex-1 flex items-center justify-between py-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-slate-800 text-xs">#00 Submission</h4>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[8px] font-bold uppercase tracking-wider">SUBMITTED</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">2026-03-25 08:45 AM (2 days ago)</span>
                  </div>
                </div>

                {/* Step 1: Department Manager Review */}
                <div className="relative flex gap-6">
                  <div className="relative z-10 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm border-4 border-white">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800 text-sm">#01 Department Manager Review</h4>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[8px] font-bold uppercase tracking-wider">APPROVED</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">2026-03-25 09:30 AM (2 days ago)</span>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">ST</div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">MARKETING MANAGER</p>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">MANAGER</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100/50">
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Reviewed and approved.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Legal Review */}
                <div className="relative flex gap-6">
                  <div className="relative z-10 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm border-4 border-white">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800 text-sm">#02 Legal Review</h4>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[8px] font-bold uppercase tracking-wider">APPROVED</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">2026-03-25 10:22 AM (2 days ago)</span>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">SK</div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">Sarah K.</p>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">LEGAL COUNSEL</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100/50">
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Contract terms comply with company policy. Approved for legal director sign-off.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Legal Director Approval (STUCK) */}
                <div className="relative flex gap-6">
                  <div className="relative z-10 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 shadow-sm border-4 border-white ring-4 ring-red-50">
                    <Clock size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800 text-sm">#03 Legal Director Approval</h4>
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[8px] font-bold uppercase tracking-wider">IN PROGRESS</span>
                      </div>
                      <span className="text-[10px] font-bold text-red-600">Delayed: 2 days</span>
                    </div>
                    <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm ring-1 ring-red-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">JW</div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">James W.</p>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">LEGAL DIRECTOR</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-red-50 rounded-lg p-3 border border-red-100 mb-4">
                        <p className="text-[11px] text-red-700 font-medium flex items-center gap-2">
                          <AlertCircle size={14} />
                          Awaiting response for 2 days. This node is currently exceeding the expected processing time.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Mail size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <MessageSquare size={18} />
                        </button>
                        <div className="flex flex-col items-center">
                          <button 
                            onClick={() => handleNudge('James W.')}
                            disabled={isNudging}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all active:scale-95"
                          >
                            {isNudging ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Zap size={14} className="fill-current" />}
                            <span>Nudge Now</span>
                          </button>
                          <span className="text-[8px] text-slate-400 font-bold mt-1">Remind James W.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4: Finance Review */}
                <div className="relative flex gap-6">
                  <div className="relative z-10 w-8 h-8 rounded-full bg-white text-slate-300 flex items-center justify-center shrink-0 shadow-sm border-4 border-white border-slate-100">
                    <User size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800 text-sm">#04 Finance Review</h4>
                        <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-400 text-[8px] font-bold uppercase tracking-wider">PENDING</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">Awaiting</span>
                    </div>
                    <div className="bg-white border border-slate-100 border-dashed rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 font-bold text-xs border border-slate-100">MR</div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">Mike R.</p>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">FINANCE</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100/50">
                        <p className="text-xs text-slate-400 italic">
                          No comments provided
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  className="px-5 py-2.5 bg-white border border-indigo-600 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all flex items-center gap-2"
                >
                  <PlusCircle size={16} />
                  Add Comment
                </button>
                <button 
                  className="px-5 py-2.5 bg-white border border-indigo-600 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all flex items-center gap-2"
                >
                  <Paperclip size={16} />
                  Attach File
                </button>
              </div>
              <div className="flex items-center gap-6">
                <button 
                  className="px-5 py-2.5 bg-white border border-red-600 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition-all flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Withdraw Application
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info Cards */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Info size={14} />
              CONTRACT INFO
            </h3>
            <div className="space-y-4">
              <InfoItem label="Contract Name" value="Contract D" />
              <InfoItem label="Contract No." value="CON-00004" />
              <InfoItem label="Contract Type" value="Service Agreement" />
              <InfoItem label="Submitted Date" value="2026-03-25" />
              <InfoItem label="Contract Value" value="$8,000" />
              <InfoItem label="Partner Company" value="Company D" />
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <User size={14} />
                APPLICANT
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">NZ</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Na Zhang</p>
                    <p className="text-[10px] text-slate-500 font-medium">Marketing Department</p>
                  </div>
                </div>
                <button className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[10px] font-bold rounded-xl transition-all uppercase tracking-wider border border-slate-200">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCommentModal && (
          <Modal title="Add Comment" onClose={() => setShowCommentModal(false)}>
            <div className="space-y-4">
              <textarea 
                placeholder="Type your comment here..." 
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowCommentModal(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg">Cancel</button>
                <button onClick={() => { setShowCommentModal(false); setShowToast('Comment added successfully'); setTimeout(() => setShowToast(null), 3000); }} className="px-6 py-2 bg-indigo-900 text-white text-sm font-bold rounded-lg hover:bg-indigo-800">Post Comment</button>
              </div>
            </div>
          </Modal>
        )}

        {showAttachModal && (
          <Modal title="Attach File" onClose={() => setShowAttachModal(false)}>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                  <Paperclip size={24} className="text-slate-400" />
                </div>
                <p className="text-sm font-bold text-slate-700">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-400 mt-1">PDF, DOCX, XLSX up to 10MB</p>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowAttachModal(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg">Cancel</button>
                <button onClick={() => { setShowAttachModal(false); setShowToast('File attached successfully'); setTimeout(() => setShowToast(null), 3000); }} className="px-6 py-2 bg-indigo-900 text-white text-sm font-bold rounded-lg hover:bg-indigo-800">Upload</button>
              </div>
            </div>
          </Modal>
        )}

        {showWithdrawModal && (
          <Modal title="Withdraw Application" onClose={() => setShowWithdrawModal(false)}>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-sm text-red-700 font-medium leading-relaxed">
                  Are you sure you want to withdraw this application? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowWithdrawModal(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg">Cancel</button>
                <button onClick={handleWithdrawConfirm} className="px-6 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700">Confirm Withdrawal</button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

function InfoItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{label}</p>
      <p className="text-xs font-bold text-slate-800 text-right">{value}</p>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
