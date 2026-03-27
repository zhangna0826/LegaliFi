import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, XCircle, ArrowRight, User } from 'lucide-react';
import { Contract } from '../types';
import { format } from 'date-fns';

interface AdminViewProps {
  contracts: Contract[];
}

export const AdminView: React.FC<AdminViewProps> = ({ contracts }) => {
  const pendingApprovals = contracts.filter(c => c.status === 'Legal Review' || c.status === 'Finance Approval');

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-indigo-600">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">My Pending Tasks</p>
          <h4 className="text-2xl font-bold text-slate-800">{pendingApprovals.length}</h4>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-red-600">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">High Risk Contracts</p>
          <h4 className="text-2xl font-bold text-slate-800">{contracts.filter(c => c.riskLevel === 'High').length}</h4>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-emerald-600">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Approved Today</p>
          <h4 className="text-2xl font-bold text-slate-800">8</h4>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Approval Queue</h3>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">All Roles</span>
            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded uppercase">Legal Only</span>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {pendingApprovals.map((contract) => (
            <div key={contract.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between mb-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{contract.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500">From: {contract.owner}</span>
                      <span className="text-xs text-slate-300">•</span>
                      <span className="text-xs text-slate-500">Partner: {contract.partner}</span>
                      <span className="text-xs text-slate-300">•</span>
                      <span className={`text-[10px] font-bold uppercase ${contract.riskLevel === 'High' ? 'text-red-600' : 'text-amber-600'}`}>
                        {contract.riskLevel} Risk
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-mono font-bold text-slate-800">${contract.amount.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400">Submitted {format(new Date(contract.updatedAt), 'MMM d')}</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <User size={16} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Add a review note..." 
                    className="bg-transparent border-none text-xs focus:ring-0 w-64"
                  />
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-white border border-slate-200 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-red-50 transition-colors">
                    <XCircle size={14} /> Reject
                  </button>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm">
                    <CheckCircle2 size={14} /> Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
