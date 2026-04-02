import { useState, useRef, useEffect } from 'react';
import { Send, Copy, Check, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ChatArea({ messages, onSendMessage, isTyping }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [copiedId, setCopiedId] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full relative z-20">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
            <Bot size={48} className="text-primary-500/50" />
            <h2 className="text-2xl font-bold text-slate-200">AI Doubt Solver</h2>
            <p className="max-w-md text-center">Ask me any question about your studies, and I'll help you understand the concepts clearly.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={msg.id || idx} className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary-600/20 border border-primary-500/30 flex items-center flex-shrink-0 justify-center text-primary-400 mt-1">
                  <Bot size={18} />
                </div>
              )}
              
              <div className={`relative group p-4 rounded-2xl max-w-[85%] ${
                msg.role === 'user' 
                  ? 'bg-primary-600 text-white rounded-tr-sm shadow-md' 
                  : 'glass-panel rounded-tl-sm'
              }`}>
                {msg.role === 'assistant' && (
                  <button 
                    onClick={() => handleCopy(msg.content, msg.id || idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                  >
                    {copiedId === (msg.id || idx) ? <Check size={14} className="text-green-400"/> : <Copy size={14} />}
                  </button>
                )}
                
                <div className={`text-sm md:text-base leading-relaxed ${msg.role === 'user' ? '' : 'text-slate-200'} prose prose-invert max-w-none`}>
                  <ReactMarkdown
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <SyntaxHighlighter
                            children={String(children).replace(/\n$/, '')}
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-md border border-white/10 my-4"
                            {...props}
                          />
                        ) : (
                          <code className="bg-black/30 px-1.5 py-0.5 rounded text-sm text-primary-200" {...props}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-700/50 border border-slate-600 flex items-center flex-shrink-0 justify-center text-slate-300 mt-1">
                  <User size={18} />
                </div>
              )}
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex gap-4 max-w-4xl mx-auto">
             <div className="w-8 h-8 rounded-full bg-primary-600/20 border border-primary-500/30 flex items-center flex-shrink-0 justify-center text-primary-400 mt-1">
                <Bot size={18} />
            </div>
            <div className="glass-panel p-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5 w-16 h-12">
              <div className="w-2 h-2 rounded-full bg-primary-400 typing-dot" />
              <div className="w-2 h-2 rounded-full bg-primary-400 typing-dot" />
              <div className="w-2 h-2 rounded-full bg-primary-400 typing-dot" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 md:p-6 bg-gradient-to-t from-dark-bg to-transparent">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="glass-input w-full pr-12 py-4 pl-6 rounded-full shadow-lg"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 p-2 rounded-full bg-primary-600 hover:bg-primary-500 text-white disabled:opacity-50 disabled:bg-slate-700 transition-colors"
          >
            <Send size={20} className="ml-0.5" />
          </button>
        </form>
        <div className="text-center text-xs text-slate-500 mt-3 font-medium">
          AI can make mistakes. Verify important information.
        </div>
      </div>
    </div>
  );
}
