
export interface AnalysisReport {
  documentType: string;
  wordCount: string;
  overallRisk: 'Low' | 'Medium' | 'High';
  justification: string;
  similarityRisk: {
    level: 'Low' | 'Medium' | 'High';
    phrases: string[];
    reasoning: string;
  };
  aiRisk: {
    level: 'Low' | 'Medium' | 'High';
    details: string;
  };
  citations: {
    missing: string[];
    suggestions: string[];
  };
  consistency: {
    notes: string;
    flags: string[];
  };
  improvement: string[];
  rewrite?: string;
}

export type AppState = 'idle' | 'loading' | 'completed' | 'error';
