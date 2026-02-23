import { useState } from 'react';
import { documentApi } from '../api/client';
import { Sparkles, Loader2, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

export default function SummaryView({ documentId, initialSummary }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summaryData, setSummaryData] = useState(initialSummary ? { short: initialSummary, bullets: [] } : null);

  const generateSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await documentApi.summarize(documentId);
      setSummaryData({
        short: data.short_summary,
        bullets: data.bullet_points
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate summary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Action Header */}
      {!summaryData && !loading && (
        <div className="premium-card p-12 text-center max-w-2xl mx-auto shadow-premium">
           <div className="bg-blue-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3 group-hover:rotate-0 transition-transform">
              <Sparkles className="w-10 h-10 text-accent" />
           </div>
           <h2 className="text-3xl font-extrabold text-primaryText mb-4">Ready to Summarize?</h2>
           <p className="text-secondaryText mb-8 max-w-sm mx-auto">Get a concise overview and key takeaways from this document in seconds using AI.</p>
           <button 
             onClick={generateSummary}
             className="bg-primary hover:bg-accent text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 mx-auto shadow-lg shadow-blue-900/10 hover:shadow-accent/30 transition-all hover:-translate-y-1"
           >
             <Sparkles className="w-5 h-5" />
             Generate Intelligence Report
           </button>
        </div>
      )}

      {loading && (
        <div className="premium-card p-16 text-center max-w-2xl mx-auto shadow-premium flex flex-col items-center">
          <div className="relative mb-8">
             <div className="w-24 h-24 border-4 border-blue-50 border-t-accent rounded-full animate-spin"></div>
             <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-accent animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-primaryText mb-2">Analyzing Patterns...</h3>
          <p className="text-secondaryText animate-pulse">Filtering through the noise to find the core insights.</p>
        </div>
      )}

      {error && (
        <div className="max-w-2xl mx-auto p-4 bg-red-50 text-error rounded-2xl border border-red-100 flex items-center gap-3">
           <AlertCircle className="w-5 h-5" />
           <p className="font-semibold">{error}</p>
        </div>
      )}

      {summaryData && !loading && (
        <div className="max-w-4xl mx-auto space-y-8">
           <div className="premium-card p-8 md:p-12 shadow-premium relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-accent"></div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100/50 p-2.5 rounded-xl">
                    <FileText className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-primaryText">Study Abstract</h3>
                </div>
                <button 
                  onClick={generateSummary}
                  className="text-accent hover:text-primary p-2 hover:bg-blue-50 rounded-xl transition-all flex items-center gap-2 font-bold text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  Regenerate
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                  <p className="text-lg text-primaryText leading-relaxed first-letter:text-4xl first-letter:font-bold first-letter:mr-1 first-letter:float-left first-letter:text-accent">
                    {summaryData.short}
                  </p>
                </div>

                {summaryData.bullets && summaryData.bullets.length > 0 && (
                  <div className="pt-6">
                    <h4 className="text-sm uppercase tracking-widest font-extrabold text-slate-400 mb-6 flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4 text-success" />
                       Key Insights
                    </h4>
                    <ul className="grid gap-4">
                      {summaryData.bullets.map((point, i) => (
                        <li key={i} className="flex gap-4 items-start group/li p-4 hover:bg-blue-50/30 rounded-xl transition-colors duration-300">
                          <div className="w-2 h-2 rounded-full bg-accent mt-2 group-hover/li:scale-150 transition-transform"></div>
                          <p className="text-primaryText font-medium">{point}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
