import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { documentApi } from '../api/client';
import { FileText, ChevronRight, Loader2, AlertCircle, Clock, FileType } from 'lucide-react';

export default function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await documentApi.list();
        setDocuments(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load documents.');
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 text-error bg-red-50/50 p-6 rounded-2xl border border-red-100 transition-all scale-100 hover:scale-[1.01]">
        <AlertCircle className="w-6 h-6 flex-shrink-0" />
        <p className="font-semibold text-lg">{error}</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center p-12 bg-white/40 rounded-3xl border border-dashed border-slate-200">
        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
           <FileType className="w-10 h-10 text-slate-300" />
        </div>
        <p className="text-secondaryText font-medium text-lg">No documents found yet.</p>
        <p className="text-slate-400 text-sm mt-1">Upload your first PDF to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {documents.map((doc, index) => (
        <Link 
          key={doc.id} 
          to={`/documents/${doc.id}`}
          className="premium-card group relative overflow-hidden flex items-center p-5 animate-in fade-in zoom-in-95 duration-500"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Subtle Accent Bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500"></div>
          
          <div className="bg-blue-50 p-4 rounded-xl text-primary group-hover:bg-accent group-hover:text-white transition-colors duration-300">
            <FileText className="w-6 h-6" />
          </div>
          
          <div className="flex-1 ml-5 text-left overflow-hidden">
            <h3 className="font-bold text-xl text-primaryText truncate group-hover:text-accent transition-colors duration-300">
              {doc.title}
            </h3>
            <div className="flex items-center gap-4 mt-1 text-sm text-secondaryText">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {new Date(doc.created_at).toLocaleDateString()}
              </span>
              {doc.summary && (
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Summarized
                </span>
              )}
            </div>
          </div>
          
          <div className="bg-slate-50 p-2 rounded-full transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
             <ChevronRight className="w-5 h-5 text-accent" />
          </div>
        </Link>
      ))}
    </div>
  );
}
