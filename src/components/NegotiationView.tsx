import React, { useState, useEffect } from 'react';
import { History, MessageSquare, ArrowLeftRight, User, Send } from 'lucide-react';
import { Contract, Version, Comment } from '../types';
import { format } from 'date-fns';

interface NegotiationViewProps {
  contract: Contract;
}

export const NegotiationView: React.FC<NegotiationViewProps> = ({ contract }) => {
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(contract.versions?.[0] || null);
  const [compareWith, setCompareWith] = useState<Version | null>(contract.versions?.[1] || null);

  useEffect(() => {
    setSelectedVersion(contract.versions?.[0] || null);
    setCompareWith(contract.versions?.[1] || null);
  }, [contract]);

  if (!selectedVersion) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] glass-card p-8 text-center">
        <History size={48} className="text-slate-200 mb-4" />
        <h3 className="text-lg font-bold text-slate-800 mb-2">No Versions Yet</h3>
        <p className="text-sm text-slate-500 max-w-md">
          This contract doesn't have any versions recorded. Go to the Drafting view to create the initial version.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-12rem)]">
      {/* Version Sidebar */}
      <div className="lg:col-span-1 glass-card p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-6 px-2">
          <History size={18} className="text-slate-400" />
          <h3 className="text-sm font-bold text-slate-800">Version History</h3>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto">
          {contract.versions?.filter(v => !!v).map((v) => (
            <button 
              key={v.id}
              onClick={() => setSelectedVersion(v)}
              className={`w-full text-left p-3 rounded-xl transition-all ${selectedVersion?.id === v.id ? 'bg-indigo-50 border-indigo-100 border shadow-sm' : 'hover:bg-slate-50 border border-transparent'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-indigo-600">v{v.versionNumber}</span>
                <span className="text-[10px] text-slate-400">{v.timestamp ? format(new Date(v.timestamp), 'MMM d') : '-'}</span>
              </div>
              <p className="text-xs font-medium text-slate-700 truncate">{v.author}</p>
            </button>
          ))}
        </div>
        <button className="mt-4 w-full py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
          <ArrowLeftRight size={14} /> Compare Versions
        </button>
      </div>

      {/* Editor/Diff View */}
      <div className="lg:col-span-2 glass-card flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-500">Viewing: v{selectedVersion?.versionNumber}</span>
            {compareWith && <span className="text-xs font-bold text-amber-500">Comparing with: v{compareWith?.versionNumber}</span>}
          </div>
          <button className="text-xs font-bold text-indigo-600 hover:underline">Edit Clause</button>
        </div>
        <div className="flex-1 p-6 overflow-y-auto font-mono text-sm leading-relaxed text-slate-700">
          {/* Simulated Diffing */}
          <p className="mb-4">
            This Agreement is entered into by and between {contract.partner} ("Partner") and ContractFlow Corp ("Client").
          </p>
          <p className="mb-4 bg-red-50 text-red-700 p-1 rounded line-through">
            The Partner shall deliver the services within 30 days of signing.
          </p>
          <p className="mb-4 bg-emerald-50 text-emerald-700 p-1 rounded">
            The Partner shall deliver the services within 15 business days of signing, subject to Client approval of initial drafts.
          </p>
          <p>
            {selectedVersion?.content}
          </p>
        </div>
      </div>

      {/* Comment Sidebar */}
      <div className="lg:col-span-1 glass-card p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-6 px-2">
          <MessageSquare size={18} className="text-slate-400" />
          <h3 className="text-sm font-bold text-slate-800">Comments</h3>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-2">
          {contract.comments.map((c) => (
            <div key={c.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                  {c.author[0]}
                </div>
                <span className="text-[10px] font-bold text-slate-800">{c.author}</span>
                <span className="text-[10px] text-slate-400 ml-auto">{format(new Date(c.timestamp), 'h:mm a')}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-600 border border-slate-100">
                {c.text}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 relative">
          <input 
            type="text" 
            placeholder="Add a comment..." 
            className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white transition-all"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
