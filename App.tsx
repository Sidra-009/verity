import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle, Loader2, Sun, Moon } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { ReportView } from './components/ReportView';
import { analyzeDocument } from './geminiService';
import { AnalysisReport, AppState } from './types';

function App() {
  const [state, setState] = useState<AppState>('idle');
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleFileSelect = async (file: File, base64: string) => {
    setFileName(file.name);
    setState('loading');
    setError(null);
    
    try {
      const result = await analyzeDocument(base64, file.type, file.name);
      setReport(result);
      setState('completed');
    } catch (err: any) {
      setError(err.message || 'Something went wrong while checking your file.');
      setState('error');
    }
  };

  const reset = () => {
    setState('idle');
    setReport(null);
    setFileName('');
    setError(null);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      <header className="bg-white/30 dark:bg-academic-darkStart/30 backdrop-blur-md border-b border-white/20 dark:border-white/5 no-print sticky top-0 z-50 transition-all">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-academic-mainBlue dark:bg-blue-600 p-2 rounded-xl shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-black text-academic-charcoal dark:text-white uppercase tracking-widest leading-none">VERITY</h1>
              <p className="text-[10px] font-bold text-academic-mainBlue dark:text-blue-400 uppercase tracking-widest leading-none mt-1">Quick Check</p>
            </div>
          </div>
          <button 
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full hover:bg-white/40 dark:hover:bg-white/10 transition-colors text-academic-charcoal dark:text-white"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-6 py-12 flex flex-col items-center justify-center">
        {state === 'idle' && (
          <div className="w-full max-w-2xl space-y-12 animate-in fade-in duration-700">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-academic-charcoal dark:text-white tracking-tight">
                Check Your <span className="text-academic-mainBlue dark:text-blue-400">Document</span>
              </h2>
              <p className="text-lg text-academic-charcoal/70 dark:text-academic-offWhite/70 leading-relaxed max-w-lg mx-auto font-medium">
                Upload your document to quickly find citation issues and check for originality.
              </p>
            </div>

            <FileUpload onFileSelect={handleFileSelect} disabled={false} />
          </div>
        )}

        {state === 'loading' && (
          <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-300">
            <div className="p-10 bg-white dark:bg-academic-surface rounded-[2.5rem] shadow-2xl border border-white/40 dark:border-white/5">
              <Loader2 className="w-12 h-12 text-academic-mainBlue dark:text-blue-400 animate-spin" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-black text-academic-charcoal dark:text-white uppercase tracking-widest mb-2">Analyzing Your File...</h3>
              <p className="text-xs text-academic-mainBlue dark:text-blue-400 animate-pulse font-bold uppercase tracking-widest">Scanning details</p>
            </div>
          </div>
        )}

        {state === 'error' && (
          <div className="max-w-md mx-auto text-center animate-in fade-in duration-500">
            <div className="bg-white dark:bg-academic-surface p-10 rounded-[2.5rem] border border-red-100 dark:border-red-900/30 shadow-2xl mb-8">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-6" />
              <h3 className="text-xl font-black text-academic-charcoal dark:text-white mb-3">Check Interrupted</h3>
              <p className="text-sm text-academic-charcoal/60 dark:text-academic-offWhite/60 mb-8 font-medium">{error}</p>
              <button 
                onClick={reset}
                className="w-full py-4 bg-academic-mainBlue dark:bg-blue-600 text-white font-black rounded-2xl hover:opacity-90 transition-all uppercase text-xs tracking-widest shadow-lg shadow-blue-500/20"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {state === 'completed' && report && (
          <div className="w-full py-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <ReportView report={report} fileName={fileName} />
            <div className="mt-16 text-center no-print pb-16">
              <button 
                onClick={reset}
                className="px-10 py-4 bg-academic-mainBlue dark:bg-blue-600 text-white font-black rounded-2xl hover:scale-105 transition-all uppercase text-xs tracking-widest shadow-xl shadow-blue-500/30"
              >
                Check Another File
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white/10 dark:bg-black/10 py-10 no-print border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[10px] text-academic-charcoal/40 dark:text-academic-offWhite/30 font-black uppercase tracking-[0.4em]">
            VERITY — Quick Document Checks &copy; 2025
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;