import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UploadForm from './components/UploadForm';
import DocumentList from './components/DocumentList';
import DocumentDetail from './pages/DocumentDetail';
import { Sparkles } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] px-4 py-12">
      <header className="max-w-2xl w-full text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-accent text-sm font-medium mb-4 border border-blue-100/50">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Learning</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-primary tracking-tight mb-4">
          SmartNote <span className="text-accent underline decoration-blue-200 underline-offset-8">AI</span>
        </h1>
        <p className="text-secondaryText text-xl max-w-lg mx-auto leading-relaxed">
          The most intuitive way to summarize, quiz, and chat with your academic documents.
        </p>
      </header>

      <main className="max-w-4xl w-full grid md:grid-cols-1 gap-12 items-center justify-center">
        {/* Centralized Upload Area */}
        <div className="w-full max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="premium-card p-2 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
             <UploadForm />
          </div>
          
          <div className="text-center">
             <h2 className="text-2xl font-bold text-primaryText mb-6">Recent Documents</h2>
             <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <DocumentList />
             </div>
          </div>
        </div>
      </main>

      <footer className="mt-24 text-slate-400 text-sm">
        Built with Precision & AI Intelligence
      </footer>
    </div>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-background">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/documents/:id" element={<DocumentDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
