import React, { useState, useRef } from 'react';
import { 
  ShieldAlert, FileText, Sparkles, Save, Send, 
  ChevronLeft, ChevronRight, ChevronDown, Download, Eye, 
  Bold, Italic, Underline, List, AlignLeft, 
  AlignCenter, AlignRight, MessageSquare, MapPin,
  Info, Flag, Users, Bot, X, Check,
  MoreHorizontal, Trash2, Reply, Search,
  Minus, Plus, Type as TypeIcon, FileUp, FileDown,
  Highlighter, ListOrdered, Quote, Bell, History,
  Clock, ArrowRight, ShieldCheck, AlertTriangle, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { analyzeContractClause } from '../services/geminiService';
import { Risk, Comment as ContractComment } from '../types';
import { SuccessModal } from './SuccessModal';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type SidebarTab = 'details' | 'comments' | 'risks' | 'files';

interface DraftingViewProps {
  initialContent?: string;
  initialTitle?: string;
  onBack?: () => void;
  onNext?: () => void;
  onSendForApproval?: () => void;
  onViewApprovalStatus?: () => void;
}

const SECTIONS = [
  { id: 'article-1', title: 'Article I: Parties', fields: ['effectiveDate', 'partyA.companyName', 'partyA.jurisdiction', 'partyA.address', 'partyA.contactPerson', 'partyA.email', 'partyB.legalName', 'partyB.platformHandles', 'partyB.address', 'partyB.email', 'partyB.taxId'] },
  { id: 'article-2', title: 'Article II: Deliverables', fields: ['deliverables'] },
  { id: 'article-3', title: 'Article III: Review', fields: ['review.submit', 'review.respond', 'review.live'] },
  { id: 'article-4', title: 'Article IV: Payment', fields: ['compensation.total', 'compensation.currency', 'compensation.structure', 'milestones', 'payment.method', 'payment.bank', 'payment.routing', 'payment.days', 'payment.interest'] },
  { id: 'article-5', title: 'Article V: IP', fields: ['ip.type', 'ip.duration'] },
  { id: 'article-6', title: 'Article VI: Exclusivity', fields: ['exclusivity.days', 'exclusivity.category', 'exclusivity.competitors'] },
  { id: 'article-7', title: 'Article VII: Compliance', fields: [] },
  { id: 'article-8', title: 'Article VIII: Confidentiality', fields: [] },
  { id: 'article-9', title: 'Article IX: Termination', fields: [] },
  { id: 'article-10', title: 'Article X: Governing Law', fields: ['governingLaw.jurisdiction'] }
];

export const DraftingView: React.FC<DraftingViewProps> = ({ initialContent, initialTitle, onBack, onNext, onSendForApproval, onViewApprovalStatus }) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('details');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formData, setFormData] = useState({
    title: initialTitle || "Influencer Cooperation Agreement",
    effectiveDate: "",
    partyA: {
      companyName: "",
      jurisdiction: "",
      address: "",
      contactPerson: "",
      email: ""
    },
    partyB: {
      legalName: "",
      platformHandles: "",
      address: "",
      email: "",
      taxId: ""
    },
    deliverables: [
      { id: 'd1', name: 'Post #1: Product Teaser', platform: 'Instagram', link: 'instagram.com/creator', format: 'Reel', date: '04/15/26', duration: '30 sec', reqs: 'Show product unboxing' },
      { id: 'd2', name: 'Post #2: Feature Demo', platform: 'YouTube', link: 'youtube.com/creator', format: 'Video', date: '04/22/26', duration: '5 min', reqs: 'Explain ISU Tech features' },
      { id: 'd3', name: 'Post #3: Final Review', platform: 'TikTok', link: 'tiktok.com/@creator', format: 'Short', date: '04/29/26', duration: '60 sec', reqs: 'Include CTA to website' }
    ],
    review: {
      submit: "5",
      respond: "3",
      live: "90"
    },
    compensation: {
      total: "",
      currency: "USD",
      structure: ""
    },
    milestones: [
      { id: 'm1', name: 'Signing', amount: '', due: '', cond: 'Upon execution' },
      { id: 'm2', name: 'Publication', amount: '', due: '', cond: 'Upon all posts live' }
    ],
    payment: {
      method: "",
      bank: "",
      routing: "",
      days: "15",
      interest: "1.5"
    },
    ip: {
      type: "non-exclusive",
      duration: "12 months"
    },
    exclusivity: {
      days: "30",
      category: "",
      competitors: ""
    },
    governingLaw: {
      jurisdiction: ""
    }
  });

  const updateField = (path: string, value: any) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const updateDeliverable = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newDeliverables = [...prev.deliverables];
      newDeliverables[index] = { ...newDeliverables[index], [field]: value };
      return { ...prev, deliverables: newDeliverables };
    });
  };

  const updateMilestone = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newMilestones = [...prev.milestones];
      newMilestones[index] = { ...newMilestones[index], [field]: value };
      return { ...prev, milestones: newMilestones };
    });
  };

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const rightPanelScrollRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  const checkScroll = () => {
    if (rightPanelScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = rightPanelScrollRef.current;
      setShowScrollIndicator(scrollHeight > clientHeight && scrollTop + clientHeight < scrollHeight - 10);
    }
  };

  React.useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [currentSectionIndex, activeTab]);

  const HARDCODED_DATA: Record<string, any> = {
    'article-1': {
      effectiveDate: "March 15, 2026",
      'partyA.companyName': "ISU Tech Ltd.",
      'partyA.jurisdiction': "Iowa, USA",
      'partyA.address': "2711 S Loop Dr, Suite 4700, Ames, IA 50010",
      'partyA.contactPerson': "Na Zhang, Marketing Specialist",
      'partyA.email': "na.zhang@isutech.com",
      'partyB.legalName': "Alex Rivera",
      'partyB.platformHandles': "@alexrivera — Instagram, YouTube, TikTok",
      'partyB.address': "1840 Marketplace Dr, Apt 302, Ames, IA 50014",
      'partyB.email': "alex.rivera@email.com",
      'partyB.taxId': "XXX-XX-1234"
    },
    'article-2': {
      deliverables: [
        { id: 'd1', name: 'Product Teaser', platform: 'Instagram', link: 'instagram.com/alexrivera', format: 'Reel', date: '04/15/2026', duration: '60 sec', reqs: 'Show product features' },
        { id: 'd2', name: 'Feature Demo', platform: 'YouTube', link: 'youtube.com/@alexrivera', format: 'Dedicated Video', date: '04/22/2026', duration: '8-12 min', reqs: 'Explain ISU Tech features' },
        { id: 'd3', name: 'Final Review', platform: 'TikTok', link: 'tiktok.com/@alexrivera', format: 'Short-form video', date: '04/29/2026', duration: '30-60 sec', reqs: 'Include CTA to website' }
      ]
    },
    'article-3': {
      'review.submit': "5",
      'review.respond': "3",
      'review.live': "90"
    },
    'article-4': {
      'compensation.total': "$12,500.00",
      'compensation.currency': "USD",
      'compensation.structure': "30% upon signing ($3,750), 70% upon completion ($8,750)",
      'milestones': [
        { id: 'm1', name: 'Signing', amount: '$3,750', due: 'Within 5 days', cond: 'Upon execution' },
        { id: 'm2', name: 'Publication', amount: '$8,750', due: 'Within 15 days', cond: 'Upon all posts live' }
      ],
      'payment.method': "Wire Transfer",
      'payment.bank': "First National Bank, Alex Rivera, ****5678",
      'payment.routing': "073000228"
    },
    'article-5': {
      'ip.type': "Non-exclusive",
      'ip.duration': "12 months"
    },
    'article-6': {
      'exclusivity.days': "30",
      'exclusivity.category': "AI-powered technology products",
      'exclusivity.competitors': "TechNova Inc., SmartAI Corp."
    },
    'article-7': {
      'governingLaw.jurisdiction': "Iowa"
    }
  };

  const handleSaveNext = () => {
    const currentSectionId = SECTIONS[currentSectionIndex].id;
    const dataToFill = HARDCODED_DATA[currentSectionId];

    if (dataToFill) {
      Object.entries(dataToFill).forEach(([path, value]) => {
        if (path === 'deliverables' || path === 'milestones') {
          setFormData(prev => ({ ...prev, [path]: value }));
        } else {
          updateField(path, value);
        }
      });
    }

    if (currentSectionIndex < SECTIONS.length - 1) {
      const nextIndex = currentSectionIndex + 1;
      setCurrentSectionIndex(nextIndex);
      setTimeout(() => {
        document.getElementById(SECTIONS[nextIndex].id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else {
      setIsFinished(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Also scroll the editor container to top
      const editorContainer = document.querySelector('.overflow-y-auto.p-0.md\\:p-8');
      if (editorContainer) {
        editorContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };
  const [risks, setRisks] = useState<Risk[]>([
    {
      id: 'r1',
      category: 'No refund clause for non-delivery',
      severity: 'High',
      description: 'If the Creator receives the 30% signing payment but fails to deliver any content, ISU Tech has no contractual right to recover the payment.',
      suggestion: 'Add clause requiring full refund if no deliverables are published within 30 days of agreed date.',
      status: 'Pending',
      article: 'Article IX — Termination'
    },
    {
      id: 'r2',
      category: 'Payment verification undefined',
      severity: 'Medium',
      description: 'The contract does not specify who verifies deliverables or the timeline for verification after publication.',
      suggestion: 'Add 5-day verification window with auto-approval if Party A does not respond.',
      status: 'Pending',
      article: 'Article IV — Compensation'
    }
  ]);

  const [highlightedRiskId, setHighlightedRiskId] = useState<string | null>(null);
  const [pulsingRiskIconId, setPulsingRiskIconId] = useState<string | null>(null);
  const [highlightedClauseId, setHighlightedClauseId] = useState<string | null>(null);
  const [isFixing, setIsFixing] = useState<string | null>(null);

  const [commentsFilter, setCommentsFilter] = useState<'All' | 'Internal'>('All');
  const [newCommentVisibility, setNewCommentVisibility] = useState<'All' | 'Internal'>('All');
  const [highlightedCommentId, setHighlightedCommentId] = useState<string | null>(null);
  const [highlightedArticleId, setHighlightedArticleId] = useState<string | null>(null);
  const [pulsingBubbleId, setPulsingBubbleId] = useState<string | null>(null);
  const [comments, setComments] = useState<ContractComment[]>([
    {
      id: 'c1',
      author: 'Sarah J.',
      role: 'Legal Reviewer',
      text: 'Which entity should we use for this contract? If the creator is US-based, ISU Tech Ltd. is preferred for tax purposes.',
      timestamp: '09:15',
      article: 'Article I — Parties',
      isInternal: true,
      isResolved: true,
      resolvedBy: 'Na Zhang',
      replies: [
        {
          id: 'c1-r1',
          author: 'Na Zhang',
          role: 'Marketing Specialist',
          text: "Creator is based in Iowa, so I'll go with ISU Tech Ltd.",
          timestamp: '09:22'
        }
      ]
    },
    {
      id: 'c2',
      author: 'Sarah J.',
      role: 'Legal Reviewer',
      text: 'Is the contract value inclusive of taxes? We need to clarify this before sending to the creator.',
      timestamp: '10:30',
      article: 'Article IV — Compensation',
      isInternal: false,
      isResolved: false,
      replies: [
        {
          id: 'c2-r1',
          author: 'Na Zhang',
          role: 'Marketing Specialist',
          text: 'I will check with the finance team.',
          timestamp: '10:45'
        }
      ]
    },
    {
      id: 'c3',
      author: 'Michael H.',
      role: 'Finance',
      text: '12-month license duration seems short for a $12,500 contract. Should we negotiate for 18 months?',
      timestamp: '11:00',
      article: 'Article V — Intellectual Property',
      isInternal: true,
      isResolved: false
    },
    {
      id: 'c4',
      author: 'Alex Rivera',
      role: 'Creator / Influencer',
      text: 'Can I use my own creative direction for the TikTok post, or do you need me to follow a specific script?',
      timestamp: 'Yesterday',
      article: 'Article II — Deliverables',
      isInternal: false,
      isResolved: false
    }
  ]);

  const [attachments, setAttachments] = useState([
    { id: 'a1', name: 'NDA_Template.pdf', size: '1.2 MB', type: 'PDF' },
    { id: 'a2', name: 'Partner_Qualification.docx', size: '850 KB', type: 'DOCX' },
  ]);

  const [riskFilter, setRiskFilter] = useState<'Pending' | 'Ignored' | 'All'>('Pending');

  const handleAIReview = async () => {
    setIsAnalyzing(true);
    // Simulate a scan
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsAnalyzing(false);
    setActiveTab('risks');
    setRiskFilter('Pending');
  };

  const handleCommentBubbleClick = (commentId: string) => {
    setActiveTab('comments');
    setHighlightedCommentId(commentId);
    setTimeout(() => {
      const element = document.getElementById(`comment-${commentId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
    setTimeout(() => setHighlightedCommentId(null), 2000);
  };

  const handleCommentClick = (articleTitle?: string) => {
    if (!articleTitle) return;
    
    // Map comment article titles to section IDs
    const mapping: Record<string, string> = {
      'Article I — Parties': 'article-1',
      'Article II — Deliverables': 'article-2',
      'Article IV — Compensation': 'article-4',
      'Article V — Intellectual Property': 'article-5'
    };
    
    const sectionId = mapping[articleTitle];
    if (sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Trigger animations
        setHighlightedArticleId(sectionId);
        setPulsingBubbleId(sectionId);
        
        setTimeout(() => {
          setHighlightedArticleId(null);
          setPulsingBubbleId(null);
        }, 2000);
      }
    }
  };

  const handleResolveComment = (id: string) => {
    setComments(prev => prev.map(c => 
      c.id === id ? { ...c, isResolved: true, resolvedBy: 'Na Zhang' } : c
    ));
  };

  const handleReopenComment = (id: string) => {
    setComments(prev => prev.map(c => 
      c.id === id ? { ...c, isResolved: false, resolvedBy: undefined } : c
    ));
  };

  const handleAddComment = (text: string) => {
    if (!text.trim()) return;
    const newComment: ContractComment = {
      id: `c${Date.now()}`,
      author: 'Na Zhang',
      role: 'Marketing Specialist',
      text,
      timestamp: 'Just now',
      isInternal: newCommentVisibility === 'Internal',
      isResolved: false
    };
    setComments([...comments, newComment]);
  };

  const filteredComments = comments.filter(c => {
    if (commentsFilter === 'Internal') return c.isInternal;
    return true;
  });

  const handleRiskIconClick = (riskId: string) => {
    setActiveTab('risks');
    setHighlightedRiskId(riskId);
    setTimeout(() => {
      const element = document.getElementById(`risk-${riskId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
    setTimeout(() => setHighlightedRiskId(null), 2000);
  };

  const handleRiskAnchorClick = (articleTitle?: string, riskId?: string) => {
    if (!articleTitle) return;
    
    const section = SECTIONS.find(s => s.title.includes(articleTitle.split(' — ')[0] || ''));
    if (section) {
      const element = document.getElementById(section.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setPulsingRiskIconId(section.id);
        setHighlightedClauseId(section.id);
        
        setTimeout(() => {
          setPulsingRiskIconId(null);
          setHighlightedClauseId(null);
        }, 3000);
      }
    }
  };

  const handleApplyFix = (riskId: string) => {
    setIsFixing(riskId);
    setTimeout(() => {
      setRisks(prev => prev.map(r => 
        r.id === riskId ? { ...r, status: 'Fixed' } : r
      ));
      setIsFixing(null);
    }, 500);
  };

  const handleIgnoreRisk = (riskId: string) => {
    setRisks(prev => prev.map(r => 
      r.id === riskId ? { ...r, status: 'Ignored' } : r
    ));
  };

  const filteredRisks = risks.filter(r => {
    if (riskFilter === 'All') return true;
    return r.status === riskFilter;
  });

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Contract Submitted"
        message='"Influencer Cooperation Agreement" has been sent for approval.'
        subMessage="Approval routing: Manager → Legal → Finance → CEO"
        primaryActionLabel="View Approval Status"
        onPrimaryAction={() => {
          setShowSuccessModal(false);
          onViewApprovalStatus?.();
        }}
        details={[
          { label: 'Contract Type', value: 'Influencer Agreement' },
          { label: 'Total Amount', value: '$12,500' }
        ]}
      />
      {/* Top Header */}
      <div className="h-14 border-b border-slate-200 flex items-center justify-between px-6 shrink-0 bg-white z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-800 truncate max-w-[300px]">Influencer Cooperation Agreement</h2>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">Drafting</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400">V1.0 • Auto-saved at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
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
          <button 
            onClick={onSendForApproval}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-900 text-white rounded-lg text-xs font-bold hover:bg-indigo-950 shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            <Send size={14} />
            <span>Send for Approval</span>
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
        <div className="flex-1 bg-slate-100 overflow-hidden flex flex-col relative">
          <AnimatePresence>
            {isFinished && (
              <motion.div 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
              >
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
                  <CheckCircleIcon size={20} className="text-emerald-500" />
                  <span className="font-bold text-sm">All sections completed. Your contract is ready for review.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex-1 overflow-y-auto p-0 md:p-8 flex flex-col items-center custom-scrollbar gap-8">
            {/* Page 1 */}
            <div className="w-full max-w-[850px] bg-white shadow-xl min-h-[1100px] p-12 md:p-20 rounded-sm border border-slate-200 relative group transition-all font-sans text-slate-800 shrink-0">
              {/* Document Title */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold tracking-tight uppercase">Influencer Cooperation Agreement</h1>
              </div>

              <div className="h-px bg-slate-900 w-full mb-8" />

              {/* ARTICLE I */}
              <section 
                id="article-1"
                className={cn(
                  "mb-10 p-4 -m-4 rounded-xl transition-all cursor-pointer",
                  currentSectionIndex === 0 || highlightedArticleId === 'article-1' ? "border-2 border-dashed border-indigo-500 bg-indigo-50/10" : "hover:bg-slate-50/50"
                )}
                onClick={() => { setCurrentSectionIndex(0); setActiveTab('details'); }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">ARTICLE I — PARTIES</h2>
                  <CommentBubble count={1} onClick={() => handleCommentBubbleClick('c1')} isPulsing={pulsingBubbleId === 'article-1'} />
                </div>
                <LockedSection className="mb-6">
                  This Influencer Cooperation Agreement (the "Agreement") is entered into as of <FillableField value={formData.effectiveDate} onChange={(v) => updateField('effectiveDate', v)} placeholder="[Effective Date]" width="140px" /> by and between:
                </LockedSection>

                <div className="mb-8">
                  <h3 className="text-sm font-bold mb-3 text-slate-600">Party A — Company</h3>
                  <table className="w-full border-collapse text-sm">
                    <tbody>
                      <tr className="border border-slate-200">
                        <td className="w-1/3 bg-slate-50 p-3 font-bold border-r border-slate-200">Company Name</td>
                        <td className="p-3">
                          <FillableField 
                            value={formData.partyA.companyName} 
                            onChange={(v) => updateField('partyA.companyName', v)} 
                            placeholder="[ISU Tech Ltd. / ISU Tech Canada Inc. / ISU Tech Singapore Pte. Ltd.]" 
                            className="w-full"
                          />
                        </td>
                      </tr>
                      <tr className="border border-slate-200">
                        <td className="bg-slate-50 p-3 font-bold border-r border-slate-200">Jurisdiction</td>
                        <td className="p-3">
                          <FillableField 
                            value={formData.partyA.jurisdiction} 
                            onChange={(v) => updateField('partyA.jurisdiction', v)} 
                            placeholder="[e.g., Iowa, USA / Ontario, Canada / Singapore]" 
                            className="w-full"
                          />
                        </td>
                      </tr>
                      <tr className="border border-slate-200">
                        <td className="bg-slate-50 p-3 font-bold border-r border-slate-200">Business Address</td>
                        <td className="p-3">
                          <FillableField 
                            value={formData.partyA.address} 
                            onChange={(v) => updateField('partyA.address', v)} 
                            placeholder="[Full registered address]" 
                            className="w-full"
                          />
                        </td>
                      </tr>
                      <tr className="border border-slate-200">
                        <td className="bg-slate-50 p-3 font-bold border-r border-slate-200">Contact Person</td>
                        <td className="p-3">
                          <FillableField 
                            value={formData.partyA.contactPerson} 
                            onChange={(v) => updateField('partyA.contactPerson', v)} 
                            placeholder="[Name, Title]" 
                            className="w-full"
                          />
                        </td>
                      </tr>
                      <tr className="border border-slate-200">
                        <td className="bg-slate-50 p-3 font-bold border-r border-slate-200">Email</td>
                        <td className="p-3">
                          <FillableField 
                            value={formData.partyA.email} 
                            onChange={(v) => updateField('partyA.email', v)} 
                            placeholder="[Contact email]" 
                            className="w-full"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mb-8">
                  <h3 className="text-sm font-bold mb-3 text-slate-600">Party B — Creator / Influencer</h3>
                  <table className="w-full border-collapse text-sm">
                    <tbody>
                      <tr className="border border-slate-200">
                        <td className="w-1/3 bg-slate-50 p-3 font-bold border-r border-slate-200">Legal Name</td>
                        <td className="p-3">
                          <FillableField 
                            value={formData.partyB.legalName} 
                            onChange={(v) => updateField('partyB.legalName', v)} 
                            placeholder="[Full legal name or registered entity]" 
                            className="w-full"
                          />
                        </td>
                      </tr>
                      <tr className="border border-slate-200">
                        <td className="bg-slate-50 p-3 font-bold border-r border-slate-200">Platform Handle(s)</td>
                        <td className="p-3">
                          <FillableField 
                            value={formData.partyB.platformHandles} 
                            onChange={(v) => updateField('partyB.platformHandles', v)} 
                            placeholder="[e.g., @handle — Instagram, YouTube, TikTok]" 
                            className="w-full"
                          />
                        </td>
                      </tr>
                      <tr className="border border-slate-200">
                        <td className="bg-slate-50 p-3 font-bold border-r border-slate-200">Address</td>
                        <td className="p-3">
                          <FillableField 
                            value={formData.partyB.address} 
                            onChange={(v) => updateField('partyB.address', v)} 
                            placeholder="[Mailing address]" 
                            className="w-full"
                          />
                        </td>
                      </tr>
                      <tr className="border border-slate-200">
                        <td className="bg-slate-50 p-3 font-bold border-r border-slate-200">Email</td>
                        <td className="p-3">
                          <FillableField 
                            value={formData.partyB.email} 
                            onChange={(v) => updateField('partyB.email', v)} 
                            placeholder="[Contact email]" 
                            className="w-full"
                          />
                        </td>
                      </tr>
                      <tr className="border border-slate-200">
                        <td className="bg-slate-50 p-3 font-bold border-r border-slate-200">Tax ID (EIN) or SSN</td>
                        <td className="p-3">
                          <FillableField 
                            value={formData.partyB.taxId} 
                            onChange={(v) => updateField('partyB.taxId', v)} 
                            placeholder="[For IRS Form 1099 reporting]" 
                            className="w-full"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ARTICLE II */}
              <section 
                id="article-2"
                className={cn(
                  "mb-10 p-4 -m-4 rounded-xl transition-all cursor-pointer",
                  currentSectionIndex === 1 || highlightedArticleId === 'article-2' ? "border-2 border-dashed border-indigo-500 bg-indigo-50/10" : "hover:bg-slate-50/50"
                )}
                onClick={() => { setCurrentSectionIndex(1); setActiveTab('details'); }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">ARTICLE II — DELIVERABLES</h2>
                  <CommentBubble count={1} onClick={() => handleCommentBubbleClick('c4')} isPulsing={pulsingBubbleId === 'article-2'} />
                </div>
                <LockedSection className="mb-4">
                  Party B agrees to create and publish the following content deliverables on the designated platforms:
                </LockedSection>

                <div className="overflow-x-auto -mx-4 px-4 mb-4">
                  <table className="w-full border-collapse text-[11px] table-fixed">
                    <thead>
                      <tr className="bg-indigo-950 text-white">
                        <th className="p-2 border border-indigo-900 text-left w-[15%]">Deliverable</th>
                        <th className="p-2 border border-indigo-900 text-left w-[12%]">Platform</th>
                        <th className="p-2 border border-indigo-900 text-left w-[15%]">Profile Link</th>
                        <th className="p-2 border border-indigo-900 text-left w-[12%]">Format</th>
                        <th className="p-2 border border-indigo-900 text-left w-[12%]">Publish By</th>
                        <th className="p-2 border border-indigo-900 text-left w-[10%]">Duration</th>
                        <th className="p-2 border border-indigo-900 text-left w-[24%]">Requirements</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.deliverables.map((d, i) => (
                        <tr key={d.id} className="border border-slate-200">
                          <td className="p-1.5 border border-slate-200"><FillableField value={d.name} onChange={(v) => updateDeliverable(i, 'name', v)} placeholder="[Post #1]" className="w-full text-[10px]" /></td>
                          <td className="p-1.5 border border-slate-200"><FillableField value={d.platform} onChange={(v) => updateDeliverable(i, 'platform', v)} placeholder="[Instagram]" className="w-full text-[10px]" /></td>
                          <td className="p-1.5 border border-slate-200"><FillableField value={d.link} onChange={(v) => updateDeliverable(i, 'link', v)} placeholder="[URL]" className="w-full text-[10px]" /></td>
                          <td className="p-1.5 border border-slate-200"><FillableField value={d.format} onChange={(v) => updateDeliverable(i, 'format', v)} placeholder="[Reel / Story]" className="w-full text-[10px]" /></td>
                          <td className="p-1.5 border border-slate-200"><FillableField value={d.date} onChange={(v) => updateDeliverable(i, 'date', v)} placeholder="[MM/DD/YY]" className="w-full text-[10px]" /></td>
                          <td className="p-1.5 border border-slate-200"><FillableField value={d.duration} onChange={(v) => updateDeliverable(i, 'duration', v)} placeholder="[60 sec]" className="w-full text-[10px]" /></td>
                          <td className="p-1.5 border border-slate-200"><FillableField value={d.reqs} onChange={(v) => updateDeliverable(i, 'reqs', v)} placeholder="[See below]" className="w-full text-[10px]" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <LockedSection>
                  Each deliverable must include: required hashtags ([#ad, #sponsored, brand hashtags]), mentions ([@brand handle]), and key talking points as provided by Party A. Content must comply with FTC Endorsement Guidelines (16 CFR Part 255) and include proper paid partnership disclosures.
                </LockedSection>
              </section>
            </div>

            {/* Page 2 */}
            <div className="w-full max-w-[850px] bg-white shadow-xl min-h-[1100px] p-12 md:p-20 rounded-sm border border-slate-200 relative group transition-all font-sans text-slate-800 shrink-0">
              {/* ARTICLE III */}
              <section 
                id="article-3"
                className={cn(
                  "mb-10 p-4 -m-4 rounded-xl transition-all cursor-pointer",
                  currentSectionIndex === 2 ? "border-2 border-dashed border-indigo-500 bg-indigo-50/10" : "hover:bg-slate-50/50"
                )}
                onClick={() => { setCurrentSectionIndex(2); setActiveTab('details'); }}
              >
                <h2 className="text-lg font-bold mb-4">ARTICLE III — CONTENT REVIEW & APPROVAL</h2>
                <LockedSection>
                  Party B shall submit draft content to Party A at least <FillableField value={formData.review.submit} onChange={(v) => updateField('review.submit', v)} placeholder="[5]" width="30px" /> business days before the scheduled publish date. Party A shall respond with approval or revision requests within <FillableField value={formData.review.respond} onChange={(v) => updateField('review.respond', v)} placeholder="[3]" width="30px" /> business days. If Party A does not respond within this period, content is deemed approved. Published content must remain live for a minimum of <FillableField value={formData.review.live} onChange={(v) => updateField('review.live', v)} placeholder="[90]" width="40px" /> days from publication. Party B shall not include content that is defamatory, obscene, or infringes upon third-party intellectual property.
                </LockedSection>
              </section>

              {/* ARTICLE IV */}
              <section 
                id="article-4"
                className={cn(
                  "mb-10 p-4 -m-4 rounded-xl transition-all cursor-pointer",
                  currentSectionIndex === 3 || highlightedArticleId === 'article-4' ? "border-2 border-dashed border-indigo-500 bg-indigo-50/10" : "hover:bg-slate-50/50",
                  highlightedClauseId === 'article-4' && "bg-orange-50 ring-2 ring-orange-200"
                )}
                onClick={() => { setCurrentSectionIndex(3); setActiveTab('details'); }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">ARTICLE IV — COMPENSATION & PAYMENT</h2>
                  <div className="flex items-center gap-2">
                    <AIRiskIcon 
                      severity="Medium" 
                      status={risks.find(r => r.id === 'r2')?.status || 'Pending'} 
                      onClick={() => handleRiskIconClick('r2')} 
                      isPulsing={pulsingRiskIconId === 'article-4'}
                    />
                    <CommentBubble count={1} onClick={() => handleCommentBubbleClick('c2')} isPulsing={pulsingBubbleId === 'article-4'} />
                  </div>
                </div>
                <table className="w-full border-collapse text-sm mb-6">
                  <tbody>
                    <tr className="border border-slate-200">
                      <td className="w-1/3 bg-slate-50 p-3 font-bold border-r border-slate-200">Total Fee</td>
                      <td className="p-3"><FillableField value={formData.compensation.total} onChange={(v) => updateField('compensation.total', v)} placeholder="[USD $__________]" className="w-full" /></td>
                    </tr>
                    <tr className="border border-slate-200">
                      <td className="bg-slate-50 p-3 font-bold border-r border-slate-200">Currency</td>
                      <td className="p-3"><FillableField value={formData.compensation.currency} onChange={(v) => updateField('compensation.currency', v)} placeholder="[USD / CAD / SGD / Other]" className="w-full" /></td>
                    </tr>
                    <tr className="border border-slate-200">
                      <td className="bg-slate-50 p-3 font-bold border-r border-slate-200">Payment Structure</td>
                      <td className="p-3"><FillableField value={formData.compensation.structure} onChange={(v) => updateField('compensation.structure', v)} placeholder="[e.g., 30% upon signing, 70% upon completion]" className="w-full" /></td>
                    </tr>
                  </tbody>
                </table>

                <table className="w-full border-collapse text-[11px] mb-6">
                  <thead>
                    <tr className="bg-indigo-950 text-white">
                      <th className="p-2 border border-indigo-900 text-left">Milestone</th>
                      <th className="p-2 border border-indigo-900 text-left">Amount</th>
                      <th className="p-2 border border-indigo-900 text-left">Due</th>
                      <th className="p-2 border border-indigo-900 text-left">Condition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.milestones.map((m, i) => (
                      <tr key={m.id} className="border border-slate-200">
                        <td className="p-2 border border-slate-200 font-bold bg-slate-50">{m.name}</td>
                        <td className="p-2 border border-slate-200"><FillableField value={m.amount} onChange={(v) => updateMilestone(i, 'amount', v)} placeholder="[$ amount]" className="w-full" /></td>
                        <td className="p-2 border border-slate-200"><FillableField value={m.due} onChange={(v) => updateMilestone(i, 'due', v)} placeholder="[Within X days]" className="w-full" /></td>
                        <td className="p-2 border border-slate-200">{m.cond}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <table className="w-full border-collapse text-sm mb-4">
                  <tbody>
                    <tr className="border border-slate-200">
                      <td className="w-1/3 bg-slate-50 p-3 font-bold border-r border-slate-200">Payment Method</td>
                      <td className="p-3"><FillableField value={formData.payment.method} onChange={(v) => updateField('payment.method', v)} placeholder="[Wire Transfer / PayPal / Check]" className="w-full" /></td>
                    </tr>
                    <tr className="border border-slate-200">
                      <td className="bg-slate-50 p-3 font-bold border-r border-slate-200">Bank / Account Info</td>
                      <td className="p-3"><FillableField value={formData.payment.bank} onChange={(v) => updateField('payment.bank', v)} placeholder="[Bank name, account holder, account number]" className="w-full" /></td>
                    </tr>
                    <tr className="border border-slate-200">
                      <td className="bg-slate-50 p-3 font-bold border-r border-slate-200">Routing / SWIFT</td>
                      <td className="p-3"><FillableField value={formData.payment.routing} onChange={(v) => updateField('payment.routing', v)} placeholder="[Routing number or SWIFT code for international transfers]" className="w-full" /></td>
                    </tr>
                  </tbody>
                </table>

                <LockedSection className="relative">
                  Payment shall be processed within <FillableField value={formData.payment.days} onChange={(v) => updateField('payment.days', v)} placeholder="[15]" width="30px" /> business days of milestone completion and invoice receipt. Late payments accrue interest at <FillableField value={formData.payment.interest} onChange={(v) => updateField('payment.interest', v)} placeholder="[1.5]" width="40px" />% per month. Party B is responsible for all applicable taxes. Party A may withhold taxes as required by law and will provide IRS Form 1099 where applicable.
                </LockedSection>
              </section>

              {/* ARTICLE V */}
              <section 
                id="article-5"
                className={cn(
                  "mb-10 p-4 -m-4 rounded-xl transition-all cursor-pointer",
                  currentSectionIndex === 4 || highlightedArticleId === 'article-5' ? "border-2 border-dashed border-indigo-500 bg-indigo-50/10" : "hover:bg-slate-50/50"
                )}
                onClick={() => { setCurrentSectionIndex(4); setActiveTab('details'); }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">ARTICLE V — INTELLECTUAL PROPERTY</h2>
                  <CommentBubble count={1} onClick={() => handleCommentBubbleClick('c3')} isPulsing={pulsingBubbleId === 'article-5'} />
                </div>
                <LockedSection>
                  Party A is granted a <FillableField value={formData.ip.type} onChange={(v) => updateField('ip.type', v)} placeholder="[non-exclusive]" width="120px" /> license to use, reproduce, and distribute the Deliverables for <FillableField value={formData.ip.duration} onChange={(v) => updateField('ip.duration', v)} placeholder="[12 months]" width="100px" /> across Party A's owned and paid channels (social media, website, email, paid advertising). Party B retains ownership of original content and may use Deliverables in their personal portfolio. Any use beyond the scope defined herein requires Party B's prior written consent and may be subject to additional fees.
                </LockedSection>
              </section>
            </div>

            {/* Page 3 */}
            <div className="w-full max-w-[850px] bg-white shadow-xl min-h-[1100px] p-12 md:p-20 rounded-sm border border-slate-200 relative group transition-all font-sans text-slate-800 shrink-0 mb-8">
              {/* ARTICLE VI */}
              <section 
                id="article-6"
                className={cn(
                  "mb-10 p-4 -m-4 rounded-xl transition-all cursor-pointer",
                  currentSectionIndex === 5 ? "border-2 border-dashed border-indigo-500 bg-indigo-50/10" : "hover:bg-slate-50/50"
                )}
                onClick={() => { setCurrentSectionIndex(5); setActiveTab('details'); }}
              >
                <h2 className="text-lg font-bold mb-4">ARTICLE VI — EXCLUSIVITY</h2>
                <LockedSection>
                  During the Agreement term and for <FillableField value={formData.exclusivity.days} onChange={(v) => updateField('exclusivity.days', v)} placeholder="[30]" width="30px" /> days following the last publication date, Party B shall not promote any direct competitor of Party A in the <FillableField value={formData.exclusivity.category} onChange={(v) => updateField('exclusivity.category', v)} placeholder="[product category]" width="140px" /> space. Competitors include: <FillableField value={formData.exclusivity.competitors} onChange={(v) => updateField('exclusivity.competitors', v)} placeholder="[list or describe competitors]" width="200px" />.
                </LockedSection>
              </section>

              {/* ARTICLE VII - IX */}
              <section className="mb-10">
                <h2 className="text-lg font-bold mb-4">ARTICLE VII — COMPLIANCE & VIOLATIONS</h2>
                <LockedSection>
                  If any Deliverable is removed by the platform due to a violation caused by Party B, Party B shall re-publish compliant replacement content within 5 business days at no additional cost. Failure to publish by agreed dates without prior written notice shall result in a penalty of 2% of the total fee per day of delay, capped at 20% of the total fee.
                </LockedSection>
              </section>

              <section className="mb-10">
                <h2 className="text-lg font-bold mb-4">ARTICLE VIII — CONFIDENTIALITY</h2>
                <LockedSection>
                  Both parties shall keep confidential all proprietary information, campaign strategies, unpublished materials, and financial terms disclosed during this Agreement. This obligation survives termination for a period of 2 years.
                </LockedSection>
              </section>

              <section 
                id="article-9"
                className={cn(
                  "mb-10 p-4 -m-4 rounded-xl transition-all cursor-pointer",
                  currentSectionIndex === 8 || highlightedArticleId === 'article-9' ? "border-2 border-dashed border-indigo-500 bg-indigo-50/10" : "hover:bg-slate-50/50",
                  highlightedClauseId === 'article-9' && "bg-red-50 ring-2 ring-red-200"
                )}
                onClick={() => { setCurrentSectionIndex(8); setActiveTab('details'); }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">ARTICLE IX — TERMINATION</h2>
                  <AIRiskIcon 
                    severity="High" 
                    status={risks.find(r => r.id === 'r1')?.status || 'Pending'} 
                    onClick={() => handleRiskIconClick('r1')} 
                    isPulsing={pulsingRiskIconId === 'article-9'}
                  />
                </div>
                <LockedSection className="relative">
                  Either party may terminate this Agreement with 14 days' written notice if the other party materially breaches any provision and fails to cure within 10 days of receiving notice. Upon termination, Party A shall compensate Party B for all completed and accepted Deliverables. Articles V, VIII, and X survive termination.
                </LockedSection>
              </section>

              {/* ARTICLE X */}
              <section 
                id="article-7"
                className={cn(
                  "mb-10 p-4 -m-4 rounded-xl transition-all cursor-pointer",
                  currentSectionIndex === 6 ? "border-2 border-dashed border-indigo-500 bg-indigo-50/10" : "hover:bg-slate-50/50"
                )}
                onClick={() => { setCurrentSectionIndex(6); setActiveTab('details'); }}
              >
                <h2 className="text-lg font-bold mb-4">ARTICLE X — GOVERNING LAW</h2>
                <LockedSection>
                  This Agreement shall be governed by the laws of the State of <FillableField value={formData.governingLaw.jurisdiction} onChange={(v) => updateField('governingLaw.jurisdiction', v)} placeholder="[Iowa / applicable jurisdiction]" width="200px" />, USA. Disputes shall first be resolved through good-faith negotiation. If unresolved within 30 days, disputes shall be submitted to binding arbitration under the rules of the American Arbitration Association (AAA). This Agreement constitutes the entire agreement between the parties. No modification is valid unless in writing and signed by both parties.
                </LockedSection>
              </section>

              {/* SIGNATURES */}
              <section className="mt-20">
                <div className="h-px bg-slate-900 w-full mb-8" />
                <h2 className="text-lg font-bold mb-4">SIGNATURES</h2>
                <LockedSection className="mb-12">
                  IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.
                </LockedSection>

                <div className="grid grid-cols-2 gap-x-12 gap-y-16">
                  <div>
                    <p className="font-bold mb-12">Party A — Company</p>
                    <div className="border-b border-slate-900 mb-2" />
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Signature / Date</p>
                  </div>
                  <div>
                    <p className="font-bold mb-12">Party B — Creator / Influencer</p>
                    <div className="border-b border-slate-900 mb-2" />
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Signature / Date</p>
                  </div>
                </div>
              </section>
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
            badge={risks.filter(r => r.status === 'Pending').length}
            isAi={risks.filter(r => r.status === 'Pending').length > 0}
            color={risks.filter(r => r.status === 'Pending').length > 0 ? "text-red-500" : "text-slate-400"}
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
              <div className="p-6 flex flex-col h-full relative">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-800">{isFinished ? 'Review Complete' : 'Review & Edit Details'}</h3>
                  <button onClick={() => setActiveTab('details')} className="text-slate-400 hover:text-slate-600">
                    <X size={18} />
                  </button>
                </div>
                
                {!isFinished ? (
                  <>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 transition-all duration-500" 
                          style={{ width: `${((currentSectionIndex + 1) / SECTIONS.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                        {currentSectionIndex + 1} / {SECTIONS.length}
                      </span>
                    </div>

                    <div className="bg-[#EBF0FF] p-3 rounded-xl border-l-4 border-indigo-500 mb-6 shadow-sm">
                      <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Current Section</p>
                      <p className="text-xs font-bold text-slate-900">{SECTIONS[currentSectionIndex].title}</p>
                    </div>
                    
                    <div 
                      ref={rightPanelScrollRef}
                      onScroll={checkScroll}
                      className="space-y-2.5 overflow-y-auto pr-2 flex-1 custom-scrollbar"
                    >
                      {currentSectionIndex === 0 ? (
                        <div className="space-y-6">
                          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                            <p className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Party A — Company</p>
                            <DetailField label="Effective Date" value={formData.effectiveDate} onChange={(v) => updateField('effectiveDate', v)} />
                            <DetailField label="Company Name" value={formData.partyA.companyName} onChange={(v) => updateField('partyA.companyName', v)} />
                            <DetailField label="Jurisdiction" value={formData.partyA.jurisdiction} onChange={(v) => updateField('partyA.jurisdiction', v)} />
                            <DetailField label="Business Address" value={formData.partyA.address} onChange={(v) => updateField('partyA.address', v)} />
                            <DetailField label="Contact Person" value={formData.partyA.contactPerson} onChange={(v) => updateField('partyA.contactPerson', v)} />
                            <DetailField label="Email" value={formData.partyA.email} onChange={(v) => updateField('partyA.email', v)} />
                          </div>
                          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                            <p className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Party B — Creator / Influencer</p>
                            <DetailField label="Legal Name" value={formData.partyB.legalName} onChange={(v) => updateField('partyB.legalName', v)} />
                            <DetailField label="Platform Handle(s)" value={formData.partyB.platformHandles} onChange={(v) => updateField('partyB.platformHandles', v)} />
                            <DetailField label="Address" value={formData.partyB.address} onChange={(v) => updateField('partyB.address', v)} />
                            <DetailField label="Email" value={formData.partyB.email} onChange={(v) => updateField('partyB.email', v)} />
                            <DetailField label="Tax ID (EIN) or SSN" value={formData.partyB.taxId} onChange={(v) => updateField('partyB.taxId', v)} />
                          </div>
                        </div>
                      ) : (
                        SECTIONS[currentSectionIndex].fields.map((fieldPath) => {
                          if (fieldPath === 'deliverables') {
                            return (
                              <div key="deliverables-panel" className="space-y-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deliverables List</p>
                                {formData.deliverables.map((d, idx) => (
                                  <div key={d.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2.5 relative">
                                    <p className="text-[10px] font-bold text-indigo-600">Post #{idx + 1}</p>
                                    <DetailField label="NAME" value={d.name} onChange={(v) => updateDeliverable(idx, 'name', v)} />
                                    <DetailField label="PLATFORM" value={d.platform} onChange={(v) => updateDeliverable(idx, 'platform', v)} />
                                    <DetailField label="PROFILE LINK" value={d.link} onChange={(v) => updateDeliverable(idx, 'link', v)} />
                                    <DetailField label="FORMAT" value={d.format} onChange={(v) => updateDeliverable(idx, 'format', v)} />
                                    <DetailField label="PUBLISH BY" value={d.date} onChange={(v) => updateDeliverable(idx, 'date', v)} />
                                    <DetailField label="DURATION" value={d.duration} onChange={(v) => updateDeliverable(idx, 'duration', v)} />
                                    <DetailField label="REQUIREMENTS" value={d.reqs} onChange={(v) => updateDeliverable(idx, 'reqs', v)} />
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          if (fieldPath === 'milestones') {
                            return (
                              <div key="milestones-panel" className="space-y-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment Milestones</p>
                                {formData.milestones.map((m, idx) => (
                                  <div key={m.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                                    <p className="text-[10px] font-bold text-indigo-600">{m.name}</p>
                                    <DetailField label="AMOUNT" value={m.amount} onChange={(v) => updateMilestone(idx, 'amount', v)} />
                                    <DetailField label="DUE" value={m.due} onChange={(v) => updateMilestone(idx, 'due', v)} />
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          
                          // Standard fields
                          const label = fieldPath.split('.').pop()?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) || fieldPath;
                          const value = (fieldPath.split('.').reduce((obj, key) => obj?.[key], formData as any) || '') as string;
                          
                          return (
                            <DetailField 
                              key={fieldPath}
                              label={label} 
                              value={value} 
                              onChange={(v) => updateField(fieldPath, v)}
                              isDropdown={fieldPath.includes('currency') || fieldPath.includes('type')}
                            />
                          );
                        })
                      )}
                    </div>

                    <div className="relative h-6 flex items-center justify-center">
                      <AnimatePresence>
                        {showScrollIndicator && (
                          <motion.div 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex flex-col items-center gap-0.5 text-slate-400"
                          >
                            <ChevronDown size={14} className="animate-bounce" />
                            <span className="text-[8px] font-bold uppercase tracking-widest">Scroll for more</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="mt-auto pt-4 flex gap-3">
                      <button 
                        onClick={() => setCurrentSectionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentSectionIndex === 0}
                        className="flex-1 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                      >
                        Back
                      </button>
                      <button 
                        onClick={handleSaveNext}
                        className="flex-1 py-2 bg-indigo-900 text-white rounded-lg text-xs font-bold hover:bg-indigo-950 shadow-lg shadow-indigo-100"
                      >
                        {currentSectionIndex === SECTIONS.length - 1 ? 'Save & Finish' : 'Save & Next'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <Check size={32} />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2 uppercase tracking-tight">Review Complete ✓</h4>
                      <p className="text-xs text-slate-500 mb-8 leading-relaxed">All 7 sections have been reviewed and completed.</p>
                      
                      <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Next Steps</p>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3 text-xs text-slate-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                            <span>Review the full contract document on the left</span>
                          </li>
                          <li className="flex items-start gap-3 text-xs text-slate-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                            <span>Click <strong className="text-indigo-900">"Send for Approval"</strong> to submit for internal review</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-6">
                      <button 
                        onClick={() => {
                          setShowSuccessModal(true);
                          onSendForApproval();
                        }}
                        className="w-full py-3 bg-indigo-900 text-white rounded-xl font-bold shadow-xl shadow-indigo-900/20 hover:bg-indigo-950 transition-all flex items-center justify-center gap-2 group"
                      >
                        <span>Send for Approval</span>
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="flex flex-col h-full overflow-hidden">
                <div className="p-6 pb-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800">Comments ({comments.length})</h3>
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>

                  {/* Internal/External Toggle */}
                  <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                    <button 
                      onClick={() => setCommentsFilter('All')}
                      className={cn(
                        "flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all",
                        commentsFilter === 'All' ? "bg-indigo-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      All Parties
                    </button>
                    <button 
                      onClick={() => setCommentsFilter('Internal')}
                      className={cn(
                        "flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all",
                        commentsFilter === 'Internal' ? "bg-indigo-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      Internal Only
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 space-y-4 custom-scrollbar pb-6">
                  {filteredComments.map((comment) => (
                    <div 
                      key={comment.id} 
                      id={`comment-${comment.id}`}
                      onClick={() => handleCommentClick(comment.article)}
                      className={cn(
                        "p-4 rounded-xl border transition-all duration-500 cursor-pointer hover:border-indigo-200 group/comment",
                        comment.isInternal ? "bg-blue-50/30 border-blue-100 border-l-4 border-l-blue-400" : "bg-white border-slate-100",
                        highlightedCommentId === comment.id && "ring-2 ring-indigo-500 shadow-lg scale-[1.02] bg-indigo-50/50",
                        comment.isResolved && "opacity-60 grayscale-[0.5]"
                      )}
                    >
                      {/* Location Anchor */}
                      {comment.article && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCommentClick(comment.article);
                          }}
                          className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-600 mb-3 hover:underline transition-colors uppercase tracking-wider"
                        >
                          <MapPin size={10} />
                          {comment.article}
                        </button>
                      )}

                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white",
                            comment.author === 'Sarah J.' && "bg-purple-500",
                            comment.author === 'Na Zhang' && "bg-indigo-600",
                            comment.author === 'Michael H.' && "bg-emerald-500",
                            comment.author === 'Alex Rivera' && "bg-orange-500"
                          )}>
                            {comment.author.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-800">{comment.author}</span>
                              {comment.isInternal && (
                                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[8px] font-bold rounded uppercase tracking-tighter">Internal</span>
                              )}
                            </div>
                            <p className="text-[9px] text-slate-400 font-medium">{comment.role}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400">{comment.timestamp}</span>
                      </div>

                      {comment.isResolved ? (
                        <div className="space-y-1">
                          <p className="text-xs text-slate-500 italic line-clamp-1">{comment.text}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                              <Check size={12} /> Resolved by {comment.resolvedBy}
                            </p>
                            <button 
                              onClick={() => handleReopenComment(comment.id)}
                              className="text-[10px] font-bold text-indigo-600 hover:underline"
                            >
                              Reopen
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs text-slate-600 leading-relaxed mb-3">{comment.text}</p>
                          
                          {/* Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="pl-3 border-l-2 border-slate-200">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-bold text-slate-800">{reply.author}</span>
                                    <span className="text-[9px] text-slate-400">{reply.timestamp}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-600 leading-relaxed">{reply.text}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="mt-3 flex items-center gap-3">
                            <button className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-800">
                              <Reply size={12} /> Reply
                            </button>
                            <button 
                              onClick={() => handleResolveComment(comment.id)}
                              className="text-[10px] font-bold text-slate-400 hover:text-emerald-600 flex items-center gap-1"
                            >
                              <Check size={12} /> Resolve
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-6 pt-2 border-t border-slate-100 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Visible to:</span>
                      <button 
                        onClick={() => setNewCommentVisibility(prev => prev === 'All' ? 'Internal' : 'All')}
                        className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-indigo-600 hover:bg-slate-100"
                      >
                        {newCommentVisibility === 'All' ? 'All Parties' : 'Internal Only'}
                        <ChevronDown size={10} />
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Add a comment..." 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="w-full p-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
                    />
                    <button 
                      onClick={(e) => {
                        const input = e.currentTarget.previousSibling as HTMLInputElement;
                        handleAddComment(input.value);
                        input.value = '';
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-800"
                    >
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
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">AI Assistant</h3>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {/* CONTRACT SUMMARY */}
                  <div className="p-4 border-b border-slate-100">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3">Contract Summary</h4>
                    <div className="space-y-3">
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        A 3-month influencer cooperation agreement between ISU Tech Ltd. and a creator for social media content across Instagram, YouTube, and TikTok.
                      </p>
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold text-slate-700">Key terms:</p>
                        <ul className="space-y-1">
                          <li className="text-[10px] text-slate-600 flex items-start gap-2">
                            <span className="mt-1 w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                            <span>Payment: milestone-based, 30% on signing + 70% on completion</span>
                          </li>
                          <li className="text-[10px] text-slate-600 flex items-start gap-2">
                            <span className="mt-1 w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                            <span>IP License: non-exclusive, 12 months</span>
                          </li>
                          <li className="text-[10px] text-slate-600 flex items-start gap-2">
                            <span className="mt-1 w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                            <span>Non-compete: 30 days post-publication</span>
                          </li>
                          <li className="text-[10px] text-slate-600 flex items-start gap-2">
                            <span className="mt-1 w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                            <span>Content must comply with FTC Guidelines (16 CFR Part 255)</span>
                          </li>
                          <li className="text-[10px] text-slate-600 flex items-start gap-2">
                            <span className="mt-1 w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                            <span>Late payment interest: 1.5%/month</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* RISK ALERTS */}
                  <div className="p-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4">
                      Risk Alerts ({risks.filter(r => r.status === 'Pending').length})
                    </h4>
                    
                    <div className="space-y-3">
                      {risks.map((risk) => (
                        <motion.div
                          key={risk.id}
                          layout
                          onClick={() => handleRiskAnchorClick(risk.article, risk.id)}
                          className={cn(
                            "rounded-xl border transition-all overflow-hidden cursor-pointer",
                            risk.status === 'Fixed' ? "bg-emerald-50/30 border-emerald-100" :
                            risk.status === 'Ignored' ? "bg-slate-50 border-slate-200" :
                            "bg-white border-slate-200"
                          )}
                        >
                          {risk.status === 'Pending' ? (
                            <div className="p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                  <span className="text-[10px] font-bold text-slate-800 uppercase">{risk.article}</span>
                                </div>
                                <span className={cn(
                                  "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                                  risk.severity === 'High' ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                                )}>
                                  {risk.severity} Risk
                                </span>
                              </div>
                              
                              <h5 className="text-[11px] font-bold text-slate-800 mb-1">{risk.category}</h5>
                              <p className="text-[10px] text-slate-600 leading-relaxed mb-3">{risk.description}</p>
                              
                              <div className="flex items-start gap-1.5 mb-3">
                                <span className="text-xs">💡</span>
                                <p className="text-[10px] text-slate-700 font-medium leading-relaxed italic">{risk.suggestion}</p>
                              </div>

                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleApplyFix(risk.id)}
                                  disabled={isFixing === risk.id}
                                  className="flex-1 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5"
                                >
                                  {isFixing === risk.id ? <Check size={12} className="animate-pulse" /> : <Check size={12} />}
                                  Apply Fix
                                </button>
                                <button 
                                  onClick={() => handleIgnoreRisk(risk.id)}
                                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                  Ignore
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="px-3 py-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400">{risk.status === 'Fixed' ? '✓' : '○'}</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{risk.article}</span>
                              </div>
                              <span className={cn(
                                "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                                risk.status === 'Fixed' ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                              )}>
                                {risk.status === 'Fixed' ? 'Fixed' : 'Ignored'}
                              </span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Word Status Bar (Word-like) - Moved to very bottom */}
      <div className="h-7 bg-indigo-900 text-white flex items-center justify-between px-4 text-[10px] font-medium shrink-0 z-20 mt-auto">
        <div className="flex items-center gap-4">
          <span>Page 1 of 3</span>
          <span>~770 Words</span>
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

      {/* Invite Collaborators Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">Invite Collaborators</h3>
                      <p className="text-[10px] text-slate-400 font-medium">Share this contract with your team or partners</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsInviteModalOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input 
                        type="email" 
                        placeholder="Enter email address..."
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                      />
                    </div>
                    <button className="px-4 py-3 bg-indigo-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-950 transition-all shadow-lg shadow-indigo-900/20">
                      Invite
                    </button>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Current Collaborators</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">NZ</div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">Na Zhang (You)</p>
                            <p className="text-[10px] text-slate-400">Owner • zhangna@legalifi.com</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded">Full Access</span>
                      </div>
                      <div className="flex items-center justify-between opacity-60">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">SJ</div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">Sarah J.</p>
                            <p className="text-[10px] text-slate-400">Editor • sarah.j@partner.com</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded">Editor</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 flex justify-end">
                <button 
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
      {badge > 0 && (
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

const DetailField: React.FC<{ label: string, value: string, onChange?: (v: string) => void, isDropdown?: boolean }> = ({ label, value, onChange, isDropdown }) => {
  return (
    <div className="space-y-0.5">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
      {onChange ? (
        <div className="relative group">
          <input 
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
          {isDropdown && <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
        </div>
      ) : (
        <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-center justify-between">
          <span className="truncate">{value}</span>
          {isDropdown && <ChevronDown size={14} className="text-slate-400" />}
        </div>
      )}
    </div>
  );
};

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

function CheckCircleIcon({ size, className }: { size: number, className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
}

function FillableField({ value, onChange, placeholder, width, className }: { 
  value: string, 
  onChange: (v: string) => void, 
  placeholder: string, 
  width?: string,
  className?: string
}) {
  const [isFocused, setIsFocused] = useState(false);
  const isFilled = value && value.trim().length > 0;

  return (
    <div 
      className={cn(
        "inline-block min-h-[1.5em] px-1 rounded transition-all duration-200 w-full",
        !isFocused && !isFilled && "bg-[#FFF9E6] border-b border-dashed border-amber-300",
        !isFocused && isFilled && "bg-white border-b border-transparent",
        isFocused && "bg-white ring-2 ring-indigo-500 border-transparent shadow-sm",
        className
      )}
      style={{ width: width || '100%', minWidth: !isFilled ? (width || '40px') : 'auto' }}
    >
      <textarea
        rows={1}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          // Auto-resize height
          e.target.style.height = 'auto';
          e.target.style.height = e.target.scrollHeight + 'px';
        }}
        onFocus={(e) => {
          setIsFocused(true);
          e.target.style.height = 'auto';
          e.target.style.height = e.target.scrollHeight + 'px';
        }}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={cn(
          "w-full bg-transparent outline-none text-sm transition-colors resize-none overflow-hidden block",
          !isFilled && !isFocused ? "text-[#888888] italic" : "text-slate-800 font-medium",
          "placeholder:text-[#888888] placeholder:italic"
        )}
      />
    </div>
  );
}

function AIRiskIcon({ severity, status, onClick, isPulsing }: { severity: 'High' | 'Medium' | 'Low', status: 'Pending' | 'Ignored' | 'Fixed', onClick: () => void, isPulsing?: boolean }) {
  const color = severity === 'High' ? 'bg-red-500' : severity === 'Medium' ? 'bg-orange-500' : 'bg-blue-500';
  const dotColor = status === 'Fixed' ? 'bg-emerald-500' : status === 'Ignored' ? 'bg-slate-400' : color;
  
  return (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-full border border-slate-200 hover:bg-slate-100 transition-all shadow-sm group relative",
        isPulsing && "animate-pulse ring-4 ring-indigo-500/30 scale-110"
      )}
    >
      <Bot size={12} className="text-slate-600" />
      <div className={cn("w-2 h-2 rounded-full", dotColor)} />
      {isPulsing && (
        <span className="absolute inset-0 rounded-full bg-indigo-400/20 animate-ping" />
      )}
    </button>
  );
}

function CommentBubble({ count, onClick, isPulsing }: { count: number, onClick: () => void, isPulsing?: boolean }) {
  return (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-all shadow-sm group relative",
        isPulsing && "animate-pulse ring-4 ring-indigo-500/30 scale-110 bg-indigo-100"
      )}
    >
      <MessageSquare size={12} className={cn("group-hover:scale-110 transition-transform", isPulsing && "scale-110")} />
      <span className="text-[10px] font-bold">{count}</span>
      {isPulsing && (
        <span className="absolute inset-0 rounded-full bg-indigo-400/20 animate-ping" />
      )}
    </button>
  );
}

function LockedSection({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("relative group/locked p-2 -m-2 rounded-lg hover:bg-slate-50/80 transition-colors", className)}>
      <div className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/locked:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-slate-800 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1.5 whitespace-nowrap shadow-lg">
          <ShieldAlert size={10} className="text-amber-400" />
          Locked Legal Clause
        </div>
      </div>
      <div className="text-sm leading-relaxed text-slate-700">
        {children}
      </div>
    </div>
  );
}
