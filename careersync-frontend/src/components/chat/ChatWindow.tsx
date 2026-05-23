"use client";

import { getChatResponse } from "@/services/apiService";
import { useState } from "react";
import { Search, Send, X, MessageSquare } from "lucide-react";

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

interface ChatWindowProps {
  onClose?: () => void;
}

export function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessage] = useState<Message[]>([
    { sender: 'ai', text: "Hi! I'm your CareerSync AI Recruiter assistant. Ask me about active tech jobs, required skills, or interview preparation! 😊" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessage(prev  => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getChatResponse(input);
      const aiMessage: Message = { sender: 'ai', text: response.data.reply };
      setMessage(prev => [...prev, aiMessage]);
    } catch (error) {
      let errorText = "Sorry, I'm having trouble connecting.";
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { status?: number }; code?: string };
        if (axiosError.response?.status === 400) {
          errorText = "Please provide a valid message.";
        } else if (axiosError.response?.status === 500) {
          errorText = "Our AI service is temporarily unavailable. Please try again later.";
        } else if (axiosError.code === 'NETWORK_ERROR') {
          errorText = "Network error. Please check your internet connection.";
        }
      }
      
      const errorMessage: Message = {sender: 'ai', text: errorText};
      setMessage(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to parse markdown links [Text](URL) and render as clickable button CTAs
  const renderMessageText = (text: string) => {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        parts.push(<span key={lastIndex}>{text.substring(lastIndex, matchIndex)}</span>);
      }

      const linkText = match[1];
      const linkUrl = match[2];

      parts.push(
        <a
          key={matchIndex}
          href={linkUrl}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 mt-2 mb-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl border border-indigo-200/60 transition-colors shadow-sm cursor-pointer"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          {linkText}
          <span>→</span>
        </a>
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(<span key={lastIndex}>{text.substring(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="flex flex-col h-[500px] w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-650 to-indigo-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">CareerSync Assistant</h3>
            <p className="text-indigo-200 text-xs font-medium">Online • AI Recruiter</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-indigo-200 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-slate-50/30">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 bg-indigo-100 border border-indigo-200/50 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 shadow-sm">
                <span className="text-indigo-700 text-xs font-bold font-serif">AI</span>
              </div>
            )}
            <div className={`rounded-2xl px-3.5 py-2.5 max-w-[80%] shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-sm' 
                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'
            }`}>
              <div className="text-xs leading-relaxed whitespace-pre-wrap">
                {renderMessageText(msg.text)}
              </div>
            </div>
            {msg.sender === 'user' && (
              <div className="w-8 h-8 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center ml-2 mt-0.5 flex-shrink-0 shadow-sm">
                <span className="text-slate-600 text-xs font-bold">U</span>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 bg-indigo-100 border border-indigo-200/50 rounded-full flex items-center justify-center mr-2 mt-0.5">
              <span className="text-indigo-700 text-xs font-bold font-serif">AI</span>
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about active job postings..."
            disabled={isLoading}
            className="flex-1 bg-slate-50/50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 focus:bg-white text-slate-800 placeholder-slate-400 transition-all text-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2 transition-colors duration-200 flex items-center justify-center min-w-[44px]"
          >
            <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  );
}