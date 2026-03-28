export type CaseStatus = 'active' | 'archived' | 'pending' | 'urgent';

export interface Case {
  id: string;
  title: string;
  clientName: string;
  courtName: string;
  caseType: string;
  status: CaseStatus;
  nextSessionDate?: string;
  filingDate: string;
  description?: string;
  parties: {
    plaintiffs: string[];
    defendants: string[];
  };
  timeline: TimelineEvent[];
  documents: Document[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'session' | 'judgment' | 'filing' | 'other';
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  url: string;
}
