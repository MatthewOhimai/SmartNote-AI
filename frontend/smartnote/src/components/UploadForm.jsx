import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentApi } from '../api/client';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, FileText, X } from 'lucide-react';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setError('');
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setError('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');
    try {
      const result = await documentApi.upload(file);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/documents/${result.id}`);
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="w-full space-y-6">
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-10 transition-all duration-500 flex flex-col items-center justify-center cursor-pointer group overflow-hidden
          ${isDragging 
            ? 'border-accent bg-blue-50/50 scale-[0.98] shadow-inner' 
            : file 
              ? 'border-success/30 bg-green-50/10' 
              : 'border-slate-300 hover:border-accent hover:bg-slate-50/50'
          }`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Ambient Glow */}
        <div className={`absolute -inset-24 bg-accent/5 rounded-full blur-3xl transition-opacity duration-1000 ${isDragging ? 'opacity-100' : 'opacity-0'}`}></div>

        {file ? (
          <div className="relative animate-in zoom-in-95 duration-300 flex flex-col items-center">
            <div className="bg-success/10 p-5 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-500">
               <FileText className="w-12 h-12 text-success" />
               <button 
                 onClick={removeFile}
                 className="absolute -top-1 -right-1 bg-white shadow-md border border-slate-200 rounded-full p-1 hover:bg-red-50 hover:text-error transition-colors"
               >
                 <X className="w-4 h-4" />
               </button>
            </div>
            <p className="text-primaryText font-bold text-center max-w-[240px] truncate">{file.name}</p>
            <p className="text-slate-400 text-xs mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="bg-accent/10 p-6 rounded-3xl mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 ease-out shadow-sm group-hover:shadow-accent/20">
              <UploadCloud className="w-14 h-14 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-primaryText mb-2">Drop your PDF here</h3>
            <p className="text-secondaryText text-sm max-w-[200px] leading-relaxed">
              Drag and drop or <span className="text-accent underline font-semibold">browse</span> your computer
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-3 text-error bg-red-50/80 backdrop-blur-sm p-4 rounded-2xl border border-red-100 animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 text-success bg-green-50/80 backdrop-blur-sm p-4 rounded-2xl border border-green-100 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-semibold">Document analyzed! Redirecting...</p>
        </div>
      )}

      <button 
        type="submit" 
        disabled={!file || loading || success}
        className="w-full relative overflow-hidden group bg-primary hover:bg-primary/95 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="animate-pulse">Analyzing Document...</span>
          </>
        ) : (
          <>
            <span>Process Document</span>
            <div className="w-1 h-1 bg-white/20 rounded-full group-hover:w-12 transition-all duration-500"></div>
          </>
        )}
      </button>
    </form>
  );
}
