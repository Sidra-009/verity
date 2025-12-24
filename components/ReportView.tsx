import React from 'react';
import { AnalysisReport } from '../types';
import { FileCheck, Info, BarChart3, Fingerprint, Search } from 'lucide-react';

interface ReportViewProps {
  report: AnalysisReport;
  fileName: string;
}

export const ReportView: React.FC<ReportViewProps> = ({ report, fileName }) => {
  const getRiskStyles = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': 
        return 'text-[#1E4D2B] bg-[#E8F5E9] border-[#C8E6C9] dark:bg-[#1B3322] dark:text-[#A5D6A7]';
      case 'medium': 
        return 'text-[#7D4F00] bg-[#FFF3E0] border-[#FFE0B2] dark:bg-[#3D2B1F] dark:text-[#FFCC80]';
      case 'high': 
        return 'text-[#8E0000] bg-[#FFEBEE] border-[#FFCDD2] dark:bg-[#3F1A1A] dark:text-[#EF9A9A]';
      default: 
        return 'text-academic-charcoal bg-white border-academic-mainBlue/20 dark:bg-academic-surface dark:text-academic-offWhite';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 animate-in fade-in duration-1000">
      <div className="bg-white/50 dark:bg-academic-surface/50 backdrop-blur-xl p-10 rounded-[3rem] border border-white/60 dark:border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none">
          <Fingerprint className="w-32 h-32 text-academic-mainBlue dark:text-blue-300" />
        </div>

        <div className="border-b border-academic-charcoal/5 dark:border-white/10 pb-8 mb-10 text-center md:text-left relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-black text-academic-charcoal dark:text-white uppercase tracking-tighter leading-none">
                Check <span className="text-academic-mainBlue dark:text-blue-400">Result</span>
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[10px] font-black text-academic-charcoal/40 dark:text-academic-offWhite/30 uppercase tracking-[0.3em] font-mono">
                <span className="bg-academic-mainBlue/10 dark:bg-blue-400/10 px-2 py-1 rounded">ID: {Math.random().toString(36).substr(2, 7).toUpperCase()}</span>
                <span className="py-1">|</span>
                <span className="text-academic-mainBlue dark:text-blue-400 py-1">FILE: {fileName}</span>
              </div>
            </div>
            <div className="hidden md:flex flex-col items-end">
               <BarChart3 className="w-12 h-12 text-academic-mainBlue dark:text-blue-400 opacity-30" />
               <p className="text-[9px] font-bold text-academic-charcoal/30 dark:text-white/20 uppercase tracking-widest mt-2">v2025.01</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12 relative z-10">
          <div className="p-8 bg-white/60 dark:bg-academic-surface/60 rounded-[2rem] shadow-sm border border-white/80 dark:border-white/5 backdrop-blur-sm">
            <h3 className="text-xs font-black text-academic-mainBlue dark:text-blue-400 uppercase tracking-[0.2em] mb-8 border-b border-academic-mainBlue/10 pb-3">File Summary</h3>
            <div className="space-y-6 text-sm font-bold">
              <div className="flex justify-between items-center pb-3 border-b border-academic-charcoal/5 dark:border-white/5">
                <span className="text-academic-charcoal/40 dark:text-academic-offWhite/30 uppercase text-[10px] tracking-widest">Type</span>
                <span className="text-academic-charcoal dark:text-white uppercase tracking-tight">{report.documentType}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-academic-charcoal/5 dark:border-white/5">
                <span className="text-academic-charcoal/40 dark:text-academic-offWhite/30 uppercase text-[10px] tracking-widest">Words</span>
                <span className="text-academic-charcoal dark:text-white">{report.wordCount}</span>
              </div>
            </div>
          </div>

          <div className={`p-8 rounded-[2rem] border-2 shadow-xl flex flex-col justify-between transition-all duration-700 hover:scale-[1.01] ${getRiskStyles(report.overallRisk)}`}>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 opacity-60">Total Score</h3>
              <div className="flex items-center gap-2">
                <span className="text-5xl font-black uppercase tracking-tighter">{report.overallRisk}</span>
              </div>
            </div>
            <p className="text-[13px] font-bold leading-relaxed italic mt-8 border-t border-current/10 pt-6">
              "{report.justification}"
            </p>
          </div>
        </div>

        <div className="grid gap-10 relative z-10">
          <Section title="Matching Content" icon={<Search className="w-5 h-5" />}>
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <span className={`px-5 py-2 rounded-full text-[11px] font-black uppercase border shadow-lg ${getRiskStyles(report.similarityRisk.level)}`}>
                  SIMILARITY: {report.similarityRisk.level}
                </span>
              </div>
              <p className="text-base text-academic-charcoal/80 dark:text-academic-offWhite/80 font-semibold leading-relaxed">
                {report.similarityRisk.reasoning}
              </p>
              {report.similarityRisk.phrases.length > 0 && (
                <div className="space-y-5">
                  <h4 className="text-[10px] font-black text-academic-mainBlue dark:text-blue-400 uppercase tracking-[0.25em]">Identified Text Blocks</h4>
                  <div className="grid gap-3">
                    {report.similarityRisk.phrases.map((phrase, i) => (
                      <div key={i} className="text-[13px] font-mono p-5 bg-white/40 dark:bg-academic-blueStart/10 border border-academic-mainBlue/20 dark:border-white/5 text-academic-charcoal dark:text-white rounded-2xl shadow-inner group transition-colors">
                        <span className="text-academic-mainBlue dark:text-blue-400 mr-3 font-black">#</span>
                        {phrase}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>

          <Section title="Writing Style" icon={<Fingerprint className="w-5 h-5" />}>
            <div className="flex items-center gap-3 mb-8">
              <span className={`px-5 py-2 rounded-full text-[11px] font-black uppercase border shadow-lg ${getRiskStyles(report.aiRisk.level)}`}>
                PATTERN: {report.aiRisk.level}
              </span>
            </div>
            <p className="text-base text-academic-charcoal/80 dark:text-academic-offWhite/80 font-semibold leading-relaxed">{report.aiRisk.details}</p>
          </Section>

          <Section title="References & Citations" icon={<FileCheck className="w-5 h-5" />}>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-white/60 dark:bg-academic-surface/60 border border-red-100 dark:border-red-900/20 rounded-[2rem] shadow-sm">
                <h4 className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest mb-6">Missing Details</h4>
                <ul className="space-y-4">
                  {report.citations.missing.map((item, i) => (
                    <li key={i} className="text-[13px] font-bold text-academic-charcoal dark:text-academic-offWhite/80 flex items-start gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400 mt-1 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 bg-white/60 dark:bg-academic-surface/60 border border-academic-mainBlue/30 dark:border-white/5 rounded-[2rem] shadow-sm">
                <h4 className="text-[10px] font-black text-academic-mainBlue dark:text-blue-400 uppercase tracking-widest mb-6">Quick Fixes</h4>
                <ul className="space-y-4">
                  {report.citations.suggestions.map((item, i) => (
                    <li key={i} className="text-[13px] font-bold text-academic-charcoal dark:text-academic-offWhite/80 flex items-start gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-academic-mainBlue dark:bg-blue-400 mt-1 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          <Section title="Ways to Improve" icon={<Info className="w-5 h-5" />}>
            <div className="grid sm:grid-cols-2 gap-5">
              {report.improvement.map((tip, i) => (
                <div key={i} className="p-6 bg-white dark:bg-academic-surface border border-academic-mainBlue/10 dark:border-white/10 rounded-2xl flex items-center gap-5 hover:border-academic-mainBlue/30 transition-all shadow-md group">
                  <span className="text-xs font-black text-academic-mainBlue dark:text-blue-400 font-mono bg-academic-mainBlue/5 px-2 py-1 rounded">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-[13px] font-bold text-academic-charcoal dark:text-white leading-tight tracking-tight group-hover:translate-x-1 transition-transform">{tip}</p>
                </div>
              ))}
            </div>
          </Section>

          {report.rewrite && (
            <Section title="Example Rewriting" icon={<Info className="w-5 h-5" />}>
              <div className="p-12 bg-academic-charcoal dark:bg-academic-darkEnd text-white rounded-[3rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-32 -top-32 w-80 h-80 bg-academic-mainBlue/20 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-1000"></div>
                <h4 className="text-[10px] font-black text-academic-mainBlue dark:text-blue-400 uppercase tracking-[0.5em] mb-8 opacity-70">Suggested Change</h4>
                <p className="text-xl leading-[1.8] italic font-serif opacity-90 relative z-10 border-l-2 border-academic-mainBlue/30 pl-8">
                  "{report.rewrite}"
                </p>
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="space-y-8 pt-10 first:pt-0">
    <div className="flex items-center gap-4 border-b border-academic-charcoal/5 dark:border-white/10 pb-5">
       <div className="bg-white/80 dark:bg-academic-mainBlue/10 p-2.5 rounded-xl text-academic-mainBlue dark:text-blue-400 shadow-sm border border-white/50 dark:border-white/5">
          {icon}
       </div>
       <h2 className="text-base font-black text-academic-charcoal dark:text-white uppercase tracking-[0.25em]">
         {title}
       </h2>
    </div>
    <div className="pt-2">{children}</div>
  </div>
);