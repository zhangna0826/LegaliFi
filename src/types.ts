export type ContractStatus = 'Drafting' | 'Negotiation' | 'Internal Consultation' | 'Legal Review' | 'Finance Approval' | 'Final Approval' | 'Signed' | 'Payment Ready' | 'Paid';

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  replies?: Comment[];
}

export interface Version {
  id: string;
  versionNumber: string;
  author: string;
  timestamp: string;
  content: string;
  changes?: string[];
}

export interface Deliverable {
  id: string;
  type: 'Link' | 'File';
  url: string;
  title: string;
  status: 'Pending' | 'Verified';
}

export interface Risk {
  id: string;
  category: string;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  suggestion: string;
  status: 'Pending' | 'Ignored' | 'Fixed';
}

export interface Contract {
  id: string;
  title: string;
  partner: string;
  amount: number;
  invoiceAmount?: number;
  status: ContractStatus;
  updatedAt: string;
  owner: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  paymentStatus?: 'Pending' | 'Processing' | 'Paid';
  versions: Version[];
  comments: Comment[];
  deliverables: Deliverable[];
  risks?: Risk[];
  approvalPath: {
    role: string;
    name: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    estimatedDays: number;
  }[];
}

export interface MetricData {
  name: string;
  baseline: number;
  goal: number;
}
