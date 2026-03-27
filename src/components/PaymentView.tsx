import React, { useState } from 'react';
import { Link as LinkIcon, FileCheck, ExternalLink, Plus, ChevronDown, ChevronUp, FileText, CheckCircle2, Clock } from 'lucide-react';
import { Contract, Deliverable } from '../types';

interface PaymentViewProps {
  contract: Contract;
}

export const PaymentView: React.FC<PaymentViewProps> = ({ contract }) => {
  const [deliverables, setDeliverables] = useState<Deliverable[]>(contract.deliverables || []);
  const [isApprovalOpen, setIsApprovalOpen] = useState(true);
  
  // Form state
  const [reason, setReason] = useState(`Payment for contract: ${contract.title}`);
  const [amount, setAmount] = useState(contract.amount.toString());
  const [method, setMethod] = useState('');
  const [date, setDate] = useState('');
  const [account, setAccount] = useState('');

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Payment Application</h1>
          <p className="text-sm text-slate-500 mt-1">Cash, check and other types of payment applications</p>
        </div>
      </div>

      {/* Linked Contract Info */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Linked Contract</p>
            <p className="text-sm font-bold text-slate-800">{contract.title}</p>
          </div>
        </div>
        <div className="flex gap-8">
          <div className="text-right">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Contract No.</p>
            <p className="text-sm font-mono font-bold text-slate-700">CON-{contract.id.padStart(5, '0')}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Total Amount</p>
            <p className="text-sm font-mono font-bold text-slate-700">${contract.amount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-8 space-y-8">
          <h2 className="text-lg font-bold text-slate-800 border-l-4 border-indigo-600 pl-4 flex items-center gap-2">
            Application Details
            <span className="text-[10px] font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">(Payment info extracted from contract by AI)</span>
          </h2>
          
          <div className="space-y-6">
            {/* Reason */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                Payment Reason <span className="text-red-500">*</span>
              </label>
              <textarea 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full min-h-[100px] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm outline-none"
                placeholder="Please enter the reason for payment"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Amount */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                  Payment Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative flex">
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-l-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm font-mono outline-none"
                    placeholder="Enter amount"
                  />
                  <div className="px-4 bg-slate-100 border border-l-0 border-slate-200 rounded-r-xl flex items-center text-xs font-bold text-slate-500">
                    USD - US Dollar
                  </div>
                </div>
              </div>

              {/* Method */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm appearance-none outline-none"
                  >
                    <option value="">Please select</option>
                    <option value="transfer">Bank Transfer</option>
                    <option value="check">Check</option>
                    <option value="cash">Cash</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                  Payment Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm outline-none"
                  />
                </div>
              </div>

              {/* Bank Account */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                  Bank Account <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm appearance-none outline-none"
                  >
                    <option value="">Please select</option>
                    <option value="main">Main Corporate Account (...8892)</option>
                    <option value="ops">Operations Account (...4421)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  Deliverable Verification
                  <span className="text-[10px] font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">(Auto-generated)</span>
                </label>
                <button className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 hover:bg-indigo-50 px-2 py-1 rounded transition-colors">
                  <Plus size={12} /> Upload Supplementary
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {deliverables.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${d.status === 'Verified' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                        {d.type === 'Link' ? <LinkIcon size={14} /> : <FileCheck size={14} />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{d.title}</p>
                        <a href={d.url} target="_blank" rel="noreferrer" className="text-[9px] text-indigo-500 flex items-center gap-1 hover:underline">
                          {d.url} <ExternalLink size={8} />
                        </a>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${d.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Attachments / Invoice Upload */}
            <div className="space-y-2 pt-4">
              <label className="text-sm font-bold text-slate-700">Attachments</label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-indigo-300 transition-all cursor-pointer group bg-slate-50/50">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:text-indigo-600 transition-colors">
                  <Plus size={20} />
                </div>
                <p className="text-xs font-bold text-slate-700">Upload Files</p>
                <p className="text-[10px] text-slate-400 mt-1">Up to 30 files, max 500MB each</p>
              </div>
            </div>

            {/* Approval Process Section */}
            <div className="pt-6 border-t border-slate-100">
              <button 
                onClick={() => setIsApprovalOpen(!isApprovalOpen)}
                className="flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors"
              >
                Approval Process
                {isApprovalOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {isApprovalOpen && (
                <div className="mt-6 space-y-6">
                  <p className="text-[10px] text-slate-400 italic">The approval process will be displayed after the information is completed.</p>
                  
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                        <CheckCircle2 size={16} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600">Applicant</span>
                    </div>
                    <div className="h-px w-12 bg-slate-200" />
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200">
                        <Clock size={16} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">Finance</span>
                    </div>
                    <div className="h-px w-12 bg-slate-200" />
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200">
                        <Clock size={16} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">CEO</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center gap-3">
          <button className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95">
            Submit
          </button>
          <button className="px-8 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all active:scale-95">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
