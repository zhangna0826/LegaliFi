import React, { useState } from 'react';
import { 
  ChevronLeft, 
  FileText, 
  CheckCircle2, 
  ExternalLink, 
  Upload, 
  File, 
  X,
  CreditCard,
  Building2,
  Calendar,
  DollarSign,
  ArrowRight,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Contract } from '../types';
import { SuccessModal } from './SuccessModal';

interface PaymentPreparationViewProps {
  contract: Contract;
  onBack: () => void;
  onSubmit: () => void;
}

export const PaymentPreparationView: React.FC<PaymentPreparationViewProps> = ({ contract, onBack, onSubmit }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    setShowSuccess(true);
  };

  const deliverables = [
    { id: 1, name: 'IG Post 1', link: 'https://instagram.com/p/abc123', date: '04/15/2026', status: 'VERIFIED' },
    { id: 2, name: 'YouTube Video', link: 'https://youtube.com/watch?v=xyz789', date: '04/22/2026', status: 'VERIFIED' },
    { id: 3, name: 'TikTok Post', link: 'https://tiktok.com/@creator/video/456', date: '04/29/2026', status: 'VERIFIED' },
  ];

  const attachments = [
    { name: 'Invoice_CompanyI_April2026.pdf', size: '1.2 MB' },
    { name: 'Campaign_Report_Final.pdf', size: '3.5 MB' },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Payment Request Submitted"
        message="Contract I — Company I"
        subMessage="Amount: $8,400 (Milestone 2 of 2)"
        primaryActionLabel="Back to Dashboard"
        onPrimaryAction={onSubmit}
        secondaryActionLabel="View Tracking"
        onSecondaryAction={() => setShowSuccess(false)}
        details={[
          { label: 'Status', value: 'Submitted to Finance' },
          { label: 'Estimated Processing', value: '15 business days' }
        ]}
      />

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
              <span className="px-3 py-1 bg-teal-100 text-teal-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                PAYMENT PREPARATION
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">{contract.partner} • ${contract.amount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Payment Application Form */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                Payment Application
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">Cash, check and other types of payment applications</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Linked Contract</p>
                  <p className="text-sm font-bold text-slate-800">Influencer Campaign Contract</p>
                  <div className="flex items-center gap-4 mt-0.5">
                    <span className="text-[10px] text-slate-500 font-medium">No: 000009</span>
                    <span className="text-[10px] text-slate-500 font-medium">Total: $12,000</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Application Details</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Payment Reason *</label>
                    <div className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium">
                      Payment for contract: Influencer Campaign
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Payment Amount *</label>
                      <div className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-bold flex items-center justify-between">
                        <span>8,400</span>
                        <span className="text-[10px] text-slate-400 font-bold">USD</span>
                      </div>
                      <p className="text-[10px] text-indigo-600 font-bold mt-1.5">Milestone 2 of 2: Completion payment (70%)</p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Payment Method *</label>
                      <div className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium flex items-center gap-2">
                        <Building2 size={14} className="text-slate-400" />
                        <span>Wire Transfer</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Payment Date *</label>
                      <div className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        <span>04/15/2026</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Bank Account *</label>
                      <div className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium flex items-center gap-2">
                        <CreditCard size={14} className="text-slate-400" />
                        <span>****5678</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Deliverable Verification */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                Deliverable Verification
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">Auto-generated from contract deliverables</p>
            </div>
            
            <div className="p-6 space-y-3">
              {deliverables.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl group hover:border-indigo-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                      <File size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{d.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <a href={d.link} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-600 font-medium flex items-center gap-1 hover:underline">
                          {d.link}
                          <ExternalLink size={10} />
                        </a>
                        <span className="text-[10px] text-slate-400 font-medium">· Posted: {d.date}</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded text-[8px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 size={10} />
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Attachments */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                Attachments
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all flex flex-col items-center justify-center gap-2">
                <Upload size={20} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Upload Files</span>
                <span className="text-[8px] font-medium">Up to 10 files, max 5.00MB each</span>
              </button>

              <div className="space-y-2">
                {attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <File size={14} className="text-slate-400" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-700 truncate max-w-[120px]">{file.name}</p>
                        <p className="text-[8px] text-slate-400 font-medium">{file.size}</p>
                      </div>
                    </div>
                    <button className="p-1 text-slate-300 hover:text-red-500 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Approval Process */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                Approval Process
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">Displayed after information is completed</p>
            </div>
            <div className="p-8">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2" />
                
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-sm">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Applicant</span>
                  <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-tighter">(Completed)</span>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-sm">
                    <ArrowRight size={16} />
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Finance</span>
                  <span className="text-[8px] font-bold text-blue-600 uppercase tracking-tighter">(Next)</span>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="w-8 h-8 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center shadow-sm">
                    <Clock size={16} />
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">CEO</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">(Pending)</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-end gap-4">
        <button 
          onClick={onBack}
          className="px-8 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all"
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit}
          className="px-8 py-3 bg-indigo-900 text-white rounded-xl font-bold shadow-xl shadow-indigo-900/20 hover:bg-indigo-950 transition-all flex items-center gap-2 group"
        >
          <span>Submit Payment Request</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
