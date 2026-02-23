import { useState, useRef, useEffect } from 'react';
import { documentApi } from '../api/client';
import { MessageSquare, Send, Loader2, Bot, User, AlertCircle, Trash2 } from 'lucide-react';

export default function ChatBox({ documentId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const data = await documentApi.chat(documentId, userMsg);
      setMessages(prev => [...prev, { role: 'ai', content: data.answer }]);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Sorry, I encountered an error communicating with the server.';
      setMessages(prev => [...prev, { role: 'ai', content: errorMsg, isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-card h-[calc(100vh-220px)] flex flex-col overflow-hidden bg-slate-50/30">
      {/* Chat header */}
      <div className="p-4 border-b border-slate-200/60 bg-white/50 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-accent/10 p-2 rounded-xl">
            <MessageSquare className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-bold text-primaryText">Document Assistant</h3>
            <p className="text-[10px] uppercase tracking-widest font-bold text-success animate-pulse">Online</p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([])}
          className="p-2 hover:bg-red-50 text-slate-300 hover:text-error transition-all rounded-lg"
          title="Clear Chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 select-none">
            <div className="bg-slate-100 p-8 rounded-full mb-4">
               <Bot className="w-12 h-12 text-slate-400" />
            </div>
            <p className="text-lg font-medium text-secondaryText">Ask me anything about this document!</p>
            <p className="text-sm">I can help you understand complex concepts or find specific info.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center shadow-sm
                  ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-accent'}
                `}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed
                  ${msg.role === 'user' 
                    ? 'bg-accent text-white rounded-tr-none' 
                    : msg.isError 
                      ? 'bg-red-50 border border-red-100 text-error' 
                      : 'bg-white border border-slate-200 text-primaryText rounded-tl-none'}
                `}>
                  {msg.isError && <AlertCircle className="w-4 h-4 mb-2" />}
                  {msg.content}
                </div>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-accent">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
                <div className="flex gap-1.5">
                   <div className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                   <div className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 bg-white/50 backdrop-blur-md border-t border-slate-200/60">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about the PDF..."
            disabled={loading}
            className="w-full bg-slate-100/50 hover:bg-slate-100 focus:bg-white border-none rounded-2xl pl-10 pr-20 py-4 text-sm focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-50"
          />
          <MessageSquare className="absolute left-3.5 w-4 h-4 text-slate-400" />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 bg-primary hover:bg-accent text-white p-2.5 rounded-xl transition-all disabled:bg-slate-300 shadow-sm flex items-center gap-2 group"
          >
            <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            <span className="hidden sm:inline font-bold text-xs uppercase tracking-tight pr-1">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
