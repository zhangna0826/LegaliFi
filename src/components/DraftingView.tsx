import React, { useState, useRef } from 'react';
import { 
  ShieldAlert, FileText, Sparkles, Save, Send, 
  ChevronLeft, ChevronRight, Download, Eye, 
  Bold, Italic, Underline, List, AlignLeft, 
  AlignCenter, AlignRight, MessageSquare, 
  Info, Flag, Users, Bot, X, Check,
  MoreHorizontal, Trash2, Reply, Search,
  Minus, Plus, Type as TypeIcon, FileUp, FileDown,
  Highlighter, ListOrdered, Quote, Bell, History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { analyzeContractClause } from '../services/geminiService';
import { Risk, Comment as ContractComment } from '../types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type SidebarTab = 'details' | 'comments' | 'risks' | 'files';

interface DraftingViewProps {
  initialContent?: string;
  initialTitle?: string;
  onBack?: () => void;
}

export const DraftingView: React.FC<DraftingViewProps> = ({ initialContent, initialTitle, onBack }) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('details');
  const [content, setContent] = useState(initialContent || `
# OFFICE SUPPLIES PROCUREMENT AGREEMENT

**Contract No:** BGHC10000
**Buyer (Party A):** Fontara
**Address:** 123 Business Ave, Tech City
**Seller (Party B):** Stellar Logical Software
**Address:** 456 Innovation Way, Software Park

This Office Supplies Procurement Agreement ("Agreement") is entered into effective as of July 1, 2025 between Fontara ("Customer"), and Stellar Logical Software ("Supplier").

## ARTICLE I SERVICES TO BE PROVIDED

**Section 1.1 Services.** Each individual service to be provided by Supplier to Customer under this Agreement will be defined by a Service Order in the form of the template attached as Exhibit A. Each Service Order shall be signed by both parties and will describe the services to be performed ("Services"), the schedule for the performance of the Services (the "Period of Performance"), any identifiable work product to be delivered by Supplier ("Deliverables"), the fixed price or hourly rate for the Services ("Fees"), and any other terms that apply to that specific Service Order ("Special Terms").

## ARTICLE II TOTAL CONTRACT VALUE

**Section 2.1 Fees.** The total contract value for the initial term is estimated at $450,000.00 USD. Payment shall be made within 30 days of invoice receipt.

## ARTICLE III TERMINATION

**Section 3.1 Termination for Convenience.** Either party may terminate this Agreement or any Service Order at any time upon 30 days' prior written notice to the other party.
  `);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [risks, setRisks] = useState<Risk[]>([
    {
      id: 'r1',
      category: 'Payment',
      severity: 'Medium',
      description: 'The payment term of 30 days is standard, but consider adding interest for late payments.',
      suggestion: 'Add: "Late payments shall accrue interest at a rate of 1.5% per month."',
      status: 'Pending'
    },
    {
      id: 'r2',
      category: 'Termination',
      severity: 'High',
      description: '30 days notice for termination for convenience might be too short for critical services.',
      suggestion: 'Increase notice period to 60 or 90 days for critical service orders.',
      status: 'Pending'
    }
  ]);

  const [comments, setComments] = useState<ContractComment[]>([
    {
      id: 'c1',
      author: 'Sarah J.',
      text: 'Is the contract value inclusive of taxes?',
      timestamp: '2024-03-13T10:30:00Z',
      replies: [
        {
          id: 'c2',
          author: 'Na Zhang',
          text: 'I will check with the finance team.',
          timestamp: '2024-03-13T10:45:00Z'
        }
      ]
    }
  ]);

  const [attachments, setAttachments] = useState([
    { id: 'a1', name: 'NDA_Template.pdf', size: '1.2 MB', type: 'PDF' },
    { id: 'a2', name: 'Partner_Qualification.docx', size: '850 KB', type: 'DOCX' },
  ]);

  const [riskFilter, setRiskFilter] = useState<'Pending' | 'Ignored' | 'All'>('Pending');

  const handleAIReview = async () => {
    setIsAnalyzing(true);
    // In a real app, we'd send the whole content or specific parts
    const result = await analyzeContractClause(content.substring(0, 1000));
    if (result) {
      const newRisk: Risk = {
        id: Math.random().toString(36).substr(2, 9),
        category: 'AI Identified',
        severity: result.riskLevel as any,
        description: result.summary,
        suggestion: result.suggestions[0] || 'Review this clause carefully.',
        status: 'Pending'
      };
      setRisks([newRisk, ...risks]);
      setActiveTab('risks');
    }
    setIsAnalyzing(false);
  };

  const filteredRisks = risks.filter(r => {
    if (riskFilter === 'All') return true;
    return r.status === riskFilter;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-white overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-white border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-800 truncate max-w-[300px]">{initialTitle || 'Office Supplies Procurement Agreement.docx'}</h2>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded">Drafting</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">Negotiating</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400">V1.0 • Auto-saved at 18:55</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            <Users size={16} /> Invite Collaborators
          </button>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
            <Download size={18} />
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg font-bold text-xs hover:bg-indigo-900 transition-all shadow-md">
            Next Step
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-4 h-[40px] bg-white border-b border-slate-200 overflow-x-auto no-scrollbar shadow-sm z-10">
        <div className="flex items-center gap-1 px-2 border-r border-slate-200 mr-1">
          <select className="text-xs font-medium bg-transparent outline-none hover:bg-slate-100 p-1 rounded transition-colors">
            <option>Times New Roman</option>
            <option>Arial</option>
            <option>Inter</option>
          </select>
          <select className="text-xs font-medium bg-transparent outline-none hover:bg-slate-100 p-1 rounded transition-colors w-12">
            <option>12</option>
            <option>14</option>
            <option>16</option>
          </select>
        </div>
        <ToolbarButton icon={<Bold size={16} />} />
        <ToolbarButton icon={<Italic size={16} />} />
        <ToolbarButton icon={<Underline size={16} />} />
        <ToolbarButton icon={<Highlighter size={16} />} />
        <div className="h-4 w-px bg-slate-200 mx-1" />
        <ToolbarButton icon={<List size={16} />} />
        <ToolbarButton icon={<ListOrdered size={16} />} />
        <ToolbarButton icon={<Quote size={16} />} />
        <div className="h-4 w-px bg-slate-200 mx-1" />
        <ToolbarButton icon={<AlignLeft size={16} />} />
        <ToolbarButton icon={<AlignCenter size={16} />} />
        <ToolbarButton icon={<AlignRight size={16} />} />
        <div className="h-4 w-px bg-slate-200 mx-1" />
        <ToolbarButton icon={<TypeIcon size={16} />} label="Heading 1" />
        <div className="h-4 w-px bg-slate-200 mx-1" />
        <ToolbarButton icon={<Search size={16} />} />
        <div className="flex-1" />
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg">
          <button className="p-1 hover:bg-slate-200 rounded transition-colors"><Minus size={14} /></button>
          <span className="text-[10px] font-bold w-10 text-center text-slate-600">100%</span>
          <button className="p-1 hover:bg-slate-200 rounded transition-colors"><Plus size={14} /></button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Area */}
        <div className="flex-1 bg-slate-100 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-0 md:p-2 flex justify-center custom-scrollbar">
            <div className="w-full max-w-[850px] bg-white shadow-lg min-h-[1100px] p-6 md:p-12 rounded-sm border border-slate-200 relative group transition-all">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full resize-none border-none focus:ring-0 text-slate-800 leading-[1.8] font-serif text-lg outline-none bg-transparent"
                placeholder="Start typing your contract..."
              />
              {/* Mock Highlight for Comment */}
              <div className="absolute top-[420px] left-12 right-12 h-8 bg-indigo-50/50 -z-0 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Sidebar Icons (Moved to right) */}
        <div className="w-14 bg-white border-l border-slate-200 flex flex-col items-center py-4 gap-6">
          <SidebarIconButton 
            icon={<Info size={20} />} 
            active={activeTab === 'details'} 
            onClick={() => setActiveTab('details')} 
            color="text-indigo-600"
          />
          <SidebarIconButton 
            icon={<MessageSquare size={20} />} 
            active={activeTab === 'comments'} 
            onClick={() => setActiveTab('comments')} 
            badge={comments.length}
            color="text-indigo-600"
          />
          <SidebarIconButton 
            icon={<Bot size={20} />} 
            active={activeTab === 'risks'} 
            onClick={() => setActiveTab('risks')} 
            isAi
            badge={risks.filter(r => r.status === 'Pending').length}
            color="text-red-500"
          />
        </div>

        {/* Right Sidebar Panel */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-white border-l border-slate-200 flex flex-col overflow-hidden"
          >
            {activeTab === 'details' && (
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-800">Review & Edit Details</h3>
                  <button onClick={() => setActiveTab('details')} className="text-slate-400 hover:text-slate-600">
                    <X size={18} />
                  </button>
                </div>
                
                <button className="flex items-center gap-2 mb-6 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                  <History size={14} />
                  VIEW VERSION HISTORY
                </button>
                
                <div className="space-y-3 overflow-y-auto pr-2">
                  <DetailField label="Title" value="Office Supplies Procurement Agreement" />
                  <DetailField label="Buyer (Party A)" value="Fontara" />
                  <DetailField label="Seller (Party B)" value="Stellar Logical Software" />
                  <DetailField label="Total Contract Value" value="$450,000.00 USD" />
                  <DetailField label="Effective Date" value="2025-07-01" />
                </div>

                <div className="mt-auto pt-6 flex gap-3">
                  <button className="flex-1 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                  <button className="flex-1 py-2 bg-indigo-900 text-white rounded-lg text-xs font-bold hover:bg-indigo-950">Save</button>
                </div>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-800">Discussion (2)</h3>
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                <div className="space-y-4 overflow-y-auto pr-2">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-800">{comment.author}</span>
                        <span className="text-[10px] text-slate-400">10:30</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{comment.text}</p>
                      
                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="pl-4 border-l-2 border-indigo-200">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-slate-800">{reply.author}</span>
                                <span className="text-[10px] text-slate-400">10:45</span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">{reply.text}</p>
                              <div className="mt-2 flex items-center gap-3">
                                <button className="text-[10px] font-bold text-indigo-600 flex items-center gap-1">
                                  <Reply size={12} /> Reply
                                </button>
                                <button className="text-[10px] font-bold text-slate-400">Resolve</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {!comment.replies || comment.replies.length === 0 ? (
                        <div className="mt-3 flex items-center gap-3">
                          <button className="text-[10px] font-bold text-indigo-600 flex items-center gap-1">
                            <Reply size={12} /> Reply
                          </button>
                          <button className="text-[10px] font-bold text-slate-400">Resolve</button>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-4">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Add a comment..." 
                      className="w-full p-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600">
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'files' && (
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-800">Attachments</h3>
                  <button className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                    <FileUp size={18} />
                  </button>
                </div>

                <div className="space-y-3 overflow-y-auto pr-2">
                  {attachments.map((file) => (
                    <div key={file.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-indigo-200 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                          <FileText size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase">{file.type} • {file.size}</p>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                          <FileDown size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-4 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-indigo-300 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-2 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all">
                      <Plus size={20} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500">Click or drag to upload</p>
                    <p className="text-[9px] text-slate-400 mt-1">NDAs, Partner Quals, etc.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'risks' && (
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800">AI Risk Review</h3>
                  <button 
                    onClick={handleAIReview}
                    disabled={isAnalyzing}
                    className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50"
                  >
                    <Bot size={18} />
                  </button>
                </div>

                <div className="flex gap-2 mb-6">
                  <RiskFilterTab label="To Confirm" count={filteredRisks.length} active={riskFilter === 'Pending'} onClick={() => setRiskFilter('Pending')} />
                  <RiskFilterTab label="Ignored" count={0} active={riskFilter === 'Ignored'} onClick={() => setRiskFilter('Ignored')} />
                  <RiskFilterTab label="All" count={risks.length} active={riskFilter === 'All'} onClick={() => setRiskFilter('All')} />
                </div>

                <div className="space-y-4 overflow-y-auto pr-2 flex-1">
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
                      <p className="text-xs text-slate-500 font-medium">AI is scanning for risks...</p>
                    </div>
                  ) : filteredRisks.length > 0 ? (
                    filteredRisks.map((risk) => (
                      <div key={risk.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow relative group">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{risk.category}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            risk.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {risk.severity} Risk
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium mb-2 leading-relaxed">{risk.description}</p>
                        <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 mb-3">
                          <p className="text-[10px] text-indigo-700 italic leading-relaxed">
                            Suggestion: {risk.suggestion}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-900 transition-colors">
                            Apply Fix
                          </button>
                          <button className="px-3 py-1.5 border border-slate-200 text-slate-500 rounded-lg text-[10px] font-bold hover:bg-slate-50">
                            Ignore
                          </button>
                        </div>
                        <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded transition-all">
                          <MoreHorizontal size={14} className="text-slate-400" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
                      <ShieldAlert size={48} className="text-slate-300 mb-4" />
                      <p className="text-xs text-slate-500">No risks found in this view.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Word Status Bar (Word-like) - Moved to very bottom */}
      <div className="h-7 bg-indigo-900 text-white flex items-center justify-between px-4 text-[10px] font-medium shrink-0 z-20">
        <div className="flex items-center gap-4">
          <span>Page {Math.max(1, Math.ceil(content.length / 3000))} of {Math.max(1, Math.ceil(content.length / 3000))}</span>
          <span>{content.trim() ? content.trim().split(/\s+/).length : 0} Words</span>
          <div className="h-3 w-px bg-white/30" />
          <span className="flex items-center gap-1"><Check size={10} /> Accessibility: Good</span>
        </div>
        <div className="flex items-center gap-4">
          <span>English (United States)</span>
          <div className="flex items-center gap-2">
            <LayoutIcon size={12} />
            <BookOpenIcon size={12} />
          </div>
        </div>
      </div>
    </div>
  );
};

function ToolbarButton({ icon, label }: { icon: React.ReactNode, label?: string }) {
  return (
    <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600 flex items-center gap-2">
      {icon}
      {label && <span className="text-xs font-medium">{label}</span>}
    </button>
  );
}

function SidebarIconButton({ icon, active, onClick, isAi, badge, color }: { icon: React.ReactNode, active?: boolean, onClick: () => void, isAi?: boolean, badge?: number, color?: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-2.5 rounded-xl transition-all relative group",
        active 
          ? (isAi ? 'bg-red-500 text-white shadow-lg shadow-red-100' : 'bg-slate-100 text-indigo-600') 
          : cn('hover:bg-slate-50', color || 'text-slate-400')
      )}
    >
      <div className={cn("transition-colors", !active && color)}>
        {icon}
      </div>
      {badge && badge > 0 && (
        <div className={cn(
          "absolute -top-1 -right-1 w-4 h-4 text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white",
          isAi ? "bg-red-600" : "bg-indigo-600"
        )}>
          {badge}
        </div>
      )}
      {active && !isAi && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-600 rounded-l-full" />}
    </button>
  );
}

function LayoutIcon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>;
}

function BookOpenIcon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>;
}

function DetailField({ label, value, isSelect }: { label: string, value: string, isSelect?: boolean }) {
  return (
    <div className="space-y-0.5">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
      <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-center justify-between">
        <span className="truncate">{value}</span>
        {isSelect && <ChevronRight size={14} className="text-slate-400" />}
      </div>
    </div>
  );
}

function RiskFilterTab({ label, count, active, onClick }: { label: string, count: number, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
        active 
          ? 'bg-indigo-50 text-indigo-600 border-indigo-200 shadow-sm' 
          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
      }`}
    >
      {label} <span className="ml-1 opacity-50">{count}</span>
    </button>
  );
}
