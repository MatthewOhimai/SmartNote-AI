import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { documentApi } from '../api/client';
import { ArrowLeft, Loader2, BookOpen, BrainCircuit, MessageCircle, FileText, Calendar } from 'lucide-react';
import SummaryView from '../components/SummaryView';
import QuizView from '../components/QuizView';
import ChatBox from '../components/ChatBox';

export default function DocumentDetail() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const docs = await documentApi.list();
        const found = docs.find(d => d.id === parseInt(id));
        if (found) {
          setDoc(found);
        } else {
          setError('Document not found.');
        }
      } catch {
        setError('Failed to load document details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-accent" />
          <p className="text-secondaryText font-medium animate-pulse">Loading study session...</p>
        </div>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="max-w-md w-full premium-card p-10 text-center">
          <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-error" />
          </div>
          <h2 className="text-2xl font-bold text-primaryText mb-2">Oops!</h2>
          <p className="text-secondaryText mb-8">{error || 'Something went wrong.'}</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Premium Header */}
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6 overflow-hidden">
            <Link to="/" className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-secondaryText hover:text-primary transition-all group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div className="overflow-hidden">
              <h1 className="text-xl font-bold text-primaryText truncate max-w-xs md:max-w-md leading-tight">{doc.title}</h1>
              <div className="flex items-center gap-3 text-xs text-secondaryText mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(doc.created_at).toLocaleDateString()}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="font-semibold text-accent uppercase tracking-wider">Analysis Mode</span>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50">
            {[
              { id: 'summary', icon: BookOpen, label: 'Summary' },
              { id: 'quiz', icon: BrainCircuit, label: 'Quiz' },
              { id: 'chat', icon: MessageCircle, label: 'Chat' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all
                  ${activeTab === tab.id 
                    ? 'bg-white text-accent shadow-sm' 
                    : 'text-secondaryText hover:text-primaryText hover:bg-white/40'}`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-accent' : ''}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
         <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            {activeTab === 'summary' && <SummaryView documentId={doc.id} initialSummary={doc.summary} />}
            {activeTab === 'quiz' && <QuizView documentId={doc.id} />}
            {activeTab === 'chat' && <ChatBox documentId={doc.id} />}
         </div>
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-40">
        <nav className="glass-effect p-2 rounded-3xl border border-slate-200/50 shadow-premium flex justify-around items-center">
          {[
            { id: 'summary', icon: BookOpen, label: 'Summary' },
            { id: 'quiz', icon: BrainCircuit, label: 'Quiz' },
            { id: 'chat', icon: MessageCircle, label: 'Chat' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all flex-1
                ${activeTab === tab.id ? 'text-accent' : 'text-secondaryText opacity-60'}`}
            >
              <tab.icon className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-tight">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
