'use client';
import React, { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '@/lib/authContext';
import { X, Send, Bot, User as UserIcon } from 'lucide-react';

interface AppShellProps {
  title: string;
  children: ReactNode;
}

export default function AppShell({ title, children }: AppShellProps) {
  const { user } = useAuth();
  const [isGeminiOpen, setIsGeminiOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: 'Bonjour Massamba ! Je suis votre assistant IA basé sur le Gem "Assistant IA Stratégique SADA". Comment puis-je vous aider avec l\'optimisation de vos opérations aujourd\'hui ?' }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: chatMessage }]);
    const currentMsg = chatMessage;
    setChatMessage('');
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: `Analyse en cours pour : "${currentMsg}". (Ceci est une interface de démonstration native. L'intégration réelle utilisera l'API Gemini).` }]);
    }, 1000);
  };
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto p-6 animate-fade-in" style={{ background: 'var(--bg-primary)' }}>
          {children}
        </main>
        
        {/* Native Gemini Mock Chatbot for CEO */}
        {user?.role === 'CEO' && (
          <>
            {/* Toggle Button */}
            {!isGeminiOpen && (
              <button
                onClick={() => setIsGeminiOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-[0_10px_40px_-10px_rgba(37,99,235,0.8)] flex items-center justify-center hover:scale-105 transition-all z-[60] border border-white/20 group animate-fade-in"
                style={{ background: 'linear-gradient(135deg, #2563EB, #A855F7)' }}
              >
                <span className="text-white text-2xl drop-shadow-md">✨</span>
                <span className="absolute right-full mr-4 bg-gray-900 border border-gray-700 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                  Assistant IA Stratégique SADA
                </span>
              </button>
            )}

            {/* Chat Drawer Widget */}
            {isGeminiOpen && (
              <div className="fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 z-[60] flex flex-col animate-fade-in">
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex justify-between items-center z-10 shadow-sm shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <Bot size={18} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm leading-tight">Assistant SADA IA</h3>
                      <p className="text-[10px] text-blue-100 opacity-80">Basé sur Gemini Pro</p>
                    </div>
                  </div>
                  <button onClick={() => setIsGeminiOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                    <X size={18} />
                  </button>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'user' ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20' : 'bg-blue-100 text-blue-600 dark:bg-blue-500/20'}`}>
                        {msg.role === 'user' ? <UserIcon size={12} /> : <Bot size={12} />}
                      </div>
                      <div className={`p-3 rounded-2xl text-sm ${
                        msg.role === 'user' 
                          ? 'bg-orange-500 text-white rounded-tr-sm' 
                          : 'bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm shadow-sm'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Footer */}
                <div className="p-3 bg-white dark:bg-gray-900 border-t dark:border-gray-800 shrink-0">
                  <form onSubmit={handleSendMessage} className="relative flex items-center">
                    <input 
                      type="text"
                      className="input w-full pr-12 text-sm bg-gray-50 dark:bg-gray-800 focus:bg-white"
                      placeholder="Posez votre question à l'IA..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                    />
                    <button 
                      type="submit" 
                      disabled={!chatMessage.trim()}
                      className="absolute right-2 w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                      <Send size={16} />
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
