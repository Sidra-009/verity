import React, { useRef, useState } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File, base64: string) => void;
  disabled: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      setError('Please use a PDF, DOCX, or TXT file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Your file is too big (limit 10MB).');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      onFileSelect(file, base64);
    };
    reader.readAsDataURL(file);
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-[2.5rem] p-16 transition-all duration-500 group overflow-hidden ${
          dragActive 
            ? 'border-academic-mainBlue bg-white/80 dark:bg-academic-surface/80 scale-[1.01] shadow-2xl' 
            : 'border-academic-mainBlue/20 dark:border-white/10 bg-white/50 dark:bg-academic-surface/40 hover:border-academic-mainBlue/50 dark:hover:border-white/30 hover:shadow-xl'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-academic-blueStart/5 to-academic-pinkAccent/5 dark:from-academic-darkStart/5 dark:to-academic-darkPink/5 opacity-30 transition-opacity group-hover:opacity-60"></div>
        
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx,.txt"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center justify-center space-y-8 relative z-10">
          <div className="p-6 bg-white dark:bg-academic-surface/80 rounded-[1.5rem] text-academic-mainBlue dark:text-blue-400 group-hover:scale-110 transition-transform duration-500 shadow-lg border border-white/50 dark:border-white/5">
            <Upload className="w-10 h-10" />
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-academic-charcoal dark:text-white uppercase tracking-[0.1em]">
              Upload Document
            </p>
            <p className="text-xs text-academic-mainBlue dark:text-blue-400 mt-3 font-bold uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">
              Drag & Drop or Click (PDF, DOCX, TXT)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-8 p-5 bg-white/90 dark:bg-academic-surface/90 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-start gap-4 text-red-600 dark:text-red-400 shadow-xl animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-black uppercase tracking-tight">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto opacity-40 hover:opacity-100 transition-opacity" aria-label="Dismiss error">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};