import React from 'react';
import { Contract, ContractStatus } from '../types';
import { FileText, ChevronRight, Clock, Zap, AlertCircle, CheckCircle2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

interface ContractListViewProps {
  contracts: Contract[];
  filterStatus?: ContractStatus | 'All';
  onSelectContract: (c: Contract) => void;
  onNewContract: () => void;
  title: string;
}

export const ContractListView: React.FC<ContractListViewProps> = ({ 
  contracts, 
  filterStatus = 'All', 
  onSelectContract,
  onNewContract,
  title
}) => {
  const filteredContracts = filterStatus === 'All' 
    ? contracts 
    : contracts.filter(c => c.status === filterStatus);

  const getStatusConfig = (contract: Contract) => {
    const { id, status, riskLevel } = contract;
    
    // Drafting & Negotiation
    if (id === '1') return { label: 'Drafting', icon: <FileText size={16} className="text-blue-500" /> };
    if (id === '2') return { label: 'In Review', icon: <FileText size={16} className="text-teal-500" /> };
    if (id === '3') return { label: 'Negotiating', icon: <Zap size={16} className="text-orange-500" /> };
    
    // Approval & Signature
    if (id === '4' || id === '6') return { label: 'Approval Stuck', icon: <AlertCircle size={16} className="text-red-500" /> };
    if (id === '5' || id === '7') return { label: 'In Approval', icon: <Clock size={16} className="text-amber-500" /> };
    if (id === '8') return { label: 'Signing', icon: <CheckCircle2 size={16} className="text-emerald-500" /> };
    
    // Payment Preparation
    if (id === '9') return { label: 'Manager Review', icon: <Clock size={16} className="text-amber-500" /> };
    if (id === '10') return { label: 'Evidence Collection', icon: <Clock size={16} className="text-amber-500" /> };
    
    // Completed
    if (parseInt(id) >= 11 || status === 'Signed') return { label: 'Completed', icon: <CheckCircle2 size={16} className="text-emerald-500" /> };
    
    return { label: status, icon: <Clock size={16} className="text-slate-400" /> };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {filteredContracts.length} CONTRACTS
          </span>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">CONTRACT NAME</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">PARTNER</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">STATUS</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">AMOUNT</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">LAST UPDATED</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContracts.map((contract) => {
                const config = getStatusConfig(contract);
                return (
                  <tr 
                    key={contract.id} 
                    onClick={() => onSelectContract(contract)}
                    className="hover:bg-slate-50/50 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{contract.title}</p>
                          <p className="text-[10px] text-slate-400">ID: {contract.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-600">{contract.partner}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {config.icon}
                        <span className="text-xs font-bold text-slate-700">
                          {config.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-bold text-slate-600">
                        ${contract.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500">
                        {format(new Date(contract.updatedAt), 'MMM d, yyyy')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-400 transition-colors inline-block" />
                    </td>
                  </tr>
                );
              })}
              {filteredContracts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-sm text-slate-400 font-medium">No contracts found in this category.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
