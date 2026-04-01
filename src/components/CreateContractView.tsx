import React, { useState, useRef } from 'react';
import { 
  FileUp, FileText, Sparkles, Plus, 
  ChevronRight, Building2, ShieldCheck, 
  ArrowLeft, Upload, Check, Info
} from 'lucide-react';
import { motion } from 'motion/react';

interface CreateContractViewProps {
  onBack: () => void;
  onSelectTemplate: (content: string, title: string) => void;
  onUpload: (file: File) => void;
}

export const CreateContractView: React.FC<CreateContractViewProps> = ({ onBack, onSelectTemplate, onUpload }) => {
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const companyTemplates = [
    { 
      id: 'isu-1', 
      title: 'Influencer Cooperation Agreement', 
      description: 'Standard agreement for MCN influencer partnerships.', 
      content: `# INFLUENCER COOPERATION AGREEMENT

**THIS AGREEMENT** is made on this [Date] (the "Effective Date")

**BETWEEN:**

(1) **ISU Tech**, a company incorporated in [Jurisdiction] with its registered office at [Address] (the "**Company**"); and

(2) **[INFLUENCER NAME]**, an individual residing at [Address] (the "**Influencer**").

---

### 1. SCOPE OF SERVICES
1.1 The Influencer agrees to provide social media marketing and promotion services for the Company's designated brands on the following platforms: [TikTok / Instagram / YouTube].
1.2 The Influencer shall create and publish [Number] posts per month, subject to the Company's prior written approval of all content.
1.3 All content must comply with the Company's Brand Guidelines and applicable advertising regulations (e.g., FTC guidelines).

### 2. COMPENSATION AND PAYMENT
2.1 **Fixed Fee:** The Company shall pay the Influencer a monthly retainer of $[Amount] USD.
2.2 **Commission:** The Influencer is eligible for a [Percentage]% commission on net sales generated through their unique affiliate link.
2.3 **Payment Terms:** Payments shall be made within 15 days following the end of each calendar month, subject to receipt of a valid invoice.

### 3. INTELLECTUAL PROPERTY RIGHTS
3.1 **Ownership:** All content created by the Influencer under this Agreement ("Work Product") shall be owned by the Company as "work made for hire."
3.2 **Usage Rights:** The Influencer grants the Company a perpetual, worldwide, royalty-free license to use the Influencer's name, image, and likeness in connection with the Work Product.

### 4. EXCLUSIVITY
4.1 During the Term of this Agreement, the Influencer shall not promote, endorse, or provide services to any direct competitors of the Company in the [Category] category.

### 5. TERM AND TERMINATION
5.1 This Agreement shall commence on the Effective Date and continue for a period of [Number] months.
5.2 Either party may terminate this Agreement for convenience upon 30 days' prior written notice.

### 6. CONFIDENTIALITY
6.1 The Influencer shall maintain the strict confidentiality of all non-public information received from the Company, including campaign strategies, pricing, and technical data.

### 7. GOVERNING LAW
7.1 This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction].

---

**IN WITNESS WHEREOF**, the parties have executed this Agreement as of the date first above written.

**For ISU Tech:**
__________________________
Name: [Name]
Title: [Title]

**For THE INFLUENCER:**
__________________________
Name: [Influencer Name]
` 
    },
    { id: 'isu-2', title: 'Live Streaming Service Contract', description: 'Terms for live streaming events and commissions.', content: '# Live Streaming Service Contract\n\nScope of services for live streaming...' },
    { id: 'isu-3', title: 'Brand Sponsorship Agreement', description: 'Agreement for brand placement and promotion.', content: '# Brand Sponsorship Agreement\n\nBrand promotion terms and conditions...' },
  ];

  const legalifiTemplates = [
    { id: 'lg-1', title: 'Master Service Agreement (MSA)', description: 'Comprehensive framework for ongoing services.', content: '# Master Service Agreement\n\nGeneral terms and conditions for services...' },
    { id: 'lg-2', title: 'Non-Disclosure Agreement (NDA)', description: 'Standard confidentiality agreement.', content: '# Non-Disclosure Agreement\n\nConfidentiality terms...' },
    { id: 'lg-3', title: 'Employment Contract', description: 'Standard terms for new hires.', content: '# Employment Contract\n\nTerms of employment...' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="min-h-full bg-slate-50/50 p-6 sm:p-10 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Create New Contract</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Module 1: Upload */}
          <div 
            className="lg:col-span-1"
            onMouseEnter={() => setHoveredModule('upload')}
            onMouseLeave={() => setHoveredModule(null)}
          >
            <div className="h-full bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-500 overflow-hidden flex flex-col group">
              <div className="p-8 flex-1">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Upload size={28} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-3">Upload Contract</h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-8">
                  Upload your existing document to start reviewing and editing with LegaliFi.
                </p>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden" 
                  accept=".doc,.docx,.pdf,.txt,.md"
                />
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  <FileUp size={18} />
                  Choose File to Upload
                </button>
              </div>
              <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                <Info size={14} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Supports .docx, .pdf, .txt</span>
              </div>
            </div>
          </div>

          {/* Module 2: Company Templates */}
          <div className="lg:col-span-1">
            <div className="h-full bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-500 overflow-hidden flex flex-col group">
              <div className="p-8 flex-1">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Building2 size={28} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-3">ISU Tech</h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Select from ISU Tech's pre-approved templates.
                </p>
                
                <div className="space-y-3">
                  {companyTemplates.map((t) => (
                    <button 
                      key={t.id}
                      onClick={() => onSelectTemplate(t.content, t.title)}
                      className="w-full p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 text-left transition-all flex items-center justify-between group/item"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-700">{t.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{t.description}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover/item:text-emerald-500 group-hover/item:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Legal Approved</span>
              </div>
            </div>
          </div>

          {/* Module 3: Legalifi Templates */}
          <div className="lg:col-span-1">
            <div className="h-full bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-500 overflow-hidden flex flex-col group">
              <div className="p-8 flex-1">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Sparkles size={28} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-3">LegaliFi Templates</h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Use our library of industry-standard professional templates.
                </p>
                
                <div className="space-y-3">
                  {legalifiTemplates.map((t) => (
                    <button 
                      key={t.id}
                      onClick={() => onSelectTemplate(t.content, t.title)}
                      className="w-full p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 text-left transition-all flex items-center justify-between group/item"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-700">{t.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{t.description}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover/item:text-indigo-500 group-hover/item:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                <Check size={14} className="text-indigo-500" />
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Industry Standard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Option: Blank Document */}
        <div className="mt-12 flex justify-center">
          <button 
            onClick={() => onSelectTemplate('', 'Untitled Contract')}
            className="flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-slate-600 transition-colors group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-sm font-medium">Or start from a blank document</span>
          </button>
        </div>
      </div>
    </div>
  );
};
