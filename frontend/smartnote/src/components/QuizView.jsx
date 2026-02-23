import { useState } from 'react';
import { documentApi } from '../api/client';
import { BrainCircuit, Loader2, AlertCircle, CheckCircle2, XCircle, Trophy, RefreshCcw } from 'lucide-react';

export default function QuizView({ documentId }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const generateQuiz = async () => {
    setLoading(true);
    setError('');
    setSubmitted(false);
    setSelectedAnswers({});
    try {
      const data = await documentApi.generateQuiz(documentId);
      setQuestions(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qIndex, key) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: key }));
  };

  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      setError('Please answer all questions before submitting.');
      return;
    }
    setError('');
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  let score = 0;
  if (submitted) {
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct_answer) score++;
    });
  }

  const scorePercentage = (score / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Quiz Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-secondary/10 p-3 rounded-2xl">
            <BrainCircuit className="w-8 h-8 text-secondary" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-primaryText">Self-Assessment</h2>
            <p className="text-secondaryText font-medium">Test your mastery of the material</p>
          </div>
        </div>
        
        <button
          onClick={generateQuiz}
          disabled={loading}
          className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-900/10 hover:shadow-indigo-900/20 active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
             <RefreshCcw className="w-5 h-5" />
          )}
          {questions.length > 0 ? "Regenerate Questions" : "Start Evaluation"}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-error rounded-2xl border border-red-100 flex items-center gap-3 animate-bounce">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-bold">{error}</p>
        </div>
      )}

      {/* Score Results Card */}
      {submitted && (
        <div className="premium-card p-8 md:p-12 text-center relative overflow-hidden bg-gradient-to-br from-indigo-50/50 to-white">
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-amber-50 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-sm border border-amber-100">
               <Trophy className={`w-12 h-12 ${scorePercentage >= 60 ? 'text-amber-500' : 'text-slate-400'}`} />
            </div>
            <h3 className="text-4xl font-black text-primaryText mb-2">Quiz Complete!</h3>
            <div className="flex items-center gap-4 mb-6">
               <span className="text-5xl font-black text-accent">{score}</span>
               <span className="text-2xl text-slate-300 font-bold">/</span>
               <span className="text-3xl text-secondaryText font-bold">{questions.length}</span>
            </div>
            <div className="w-full max-w-sm h-3 bg-slate-100 rounded-full overflow-hidden mb-8 border border-slate-200">
               <div 
                 className={`h-full transition-all duration-1000 ease-out ${scorePercentage >= 60 ? 'bg-success' : 'bg-amber-500'}`}
                 style={{ width: `${scorePercentage}%` }}
               ></div>
            </div>
            <button 
              onClick={generateQuiz}
              className="text-secondary font-bold hover:underline py-2"
            >
               Try another set?
            </button>
          </div>
          {/* Confetti effect placeholder / Background accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-8 pb-20">
        {questions.length > 0 ? (
          questions.map((q, idx) => (
            <div 
              key={idx} 
              className="premium-card p-6 md:p-10 group"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="flex items-start gap-4 mb-8">
                <span className="bg-slate-100 text-slate-500 w-10 h-10 rounded-xl flex items-center justify-center font-black flex-shrink-0 border border-slate-200 group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-500">
                  {idx + 1}
                </span>
                <p className="text-2xl font-bold text-primaryText leading-tight pt-1">{q.question}</p>
              </div>
              
              <div className="grid gap-4">
                {Object.entries(q.options).map(([key, value]) => {
                  const isSelected = selectedAnswers[idx] === key;
                  const isCorrect = submitted && key === q.correct_answer;
                  const isWrongSelected = submitted && isSelected && !isCorrect;

                  let btnClass = "w-full text-left px-6 py-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between text-lg ";
                  
                  if (submitted) {
                    if (isCorrect) btnClass += "bg-green-50/50 border-success text-success font-bold ring-4 ring-success/5";
                    else if (isWrongSelected) btnClass += "bg-red-50/50 border-error text-error opacity-100";
                    else btnClass += "bg-white border-slate-100 text-slate-300 opacity-50 grayscale scale-95";
                  } else {
                    if (isSelected) btnClass += "bg-blue-50/50 border-accent text-accent font-bold ring-4 ring-accent/5 scale-[1.02] shadow-md";
                    else btnClass += "bg-white border-slate-100 text-primaryText hover:border-slate-300 hover:bg-slate-50/50";
                  }

                  return (
                    <button
                      key={key}
                      onClick={() => handleSelect(idx, key)}
                      disabled={submitted}
                      className={btnClass}
                    >
                      <span className="flex-1">
                        <span className={`inline-block w-8 font-black ${isSelected ? 'text-accent' : 'text-slate-400'}`}>{key}.</span> 
                        {value}
                      </span>
                      {submitted && isCorrect && <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 animate-in zoom-in" />}
                      {submitted && isWrongSelected && <XCircle className="w-6 h-6 text-error flex-shrink-0 animate-in zoom-in" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          !loading && (
            <div className="text-center py-20 px-4 bg-white/40 rounded-[3rem] border border-dashed border-slate-200">
              <div className="bg-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <BrainCircuit className="w-12 h-12 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-400">Knowledge evaluation is one click away</h3>
              <p className="text-slate-400 mt-2">Generate a personalized quiz based on your document's content.</p>
            </div>
          )
        )}

        {questions.length > 0 && !submitted && (
          <button
            onClick={handleSubmit}
            className="w-full bg-primary hover:bg-primary/95 text-white font-black py-5 px-8 rounded-3xl text-xl shadow-xl shadow-blue-900/10 hover:shadow-blue-900/20 active:scale-[0.98] transition-all"
          >
            Submit Final Answers
          </button>
        )}
      </div>
    </div>
  );
}
