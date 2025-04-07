import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Cpu, BookText, Clock, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { askGemini } from '@/lib/gemini';
import { toast } from '@/hooks/use-toast';
import { saveToLocalStorage, getFromLocalStorage, STORAGE_KEYS } from '@/lib/localStorage';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const Assistant = () => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = getFromLocalStorage<Message[]>(STORAGE_KEYS.MESSAGES, []);
    
    // If no messages are saved, add the welcome message
    if (savedMessages.length === 0) {
      return [{
        id: '1',
        content: "Hello! I'm your Airavat Smart Assistant. How can I help you today?",
        sender: 'assistant',
        timestamp: new Date()
      }];
    }
    
    // Parse stored timestamps back to Date objects
    return savedMessages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.MESSAGES, messages);
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      const response = await askGemini({
        prompt: `You are Airavat, an AI assistant specialized in productivity, time management, personal development, and habit building. 
                Provide actionable advice, concise explanations, and motivational insights in response to this user query: ${input} , make sue no ** comes in response` ,
        temperature: 0.7
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      const sanitizedResponse = response.text.replace(/\*\*/g, ''); // Remove all occurrences of '**'
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: sanitizedResponse,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    "How can I improve my focus during work?",
    "Create a daily schedule for better productivity",
    "Tips for managing work-life balance",
    "How to build a habit of reading daily?"
  ];
  
  const clearConversation = () => {
    // Save the welcome message
    const welcomeMessage = {
      id: Date.now().toString(),
      content: "Hello! I'm your Airavat Smart Assistant. How can I help you today?",
      sender: 'assistant' as const,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    toast({
      title: "Conversation cleared",
      description: "All messages have been cleared."
    });
  };

  return (
    <div className="p-6 lg:p-10 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-orbitron mb-2 flex items-center">
          <BrainCircuit className="text-airavat-cyan mr-3" size={28} />
          Smart Assistant
        </h1>
        <p className="text-white/70">
          Powered by Gemini AI to help with your productivity needs
        </p>
      </div>
      
      <div className="glass rounded-xl p-6 flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 pr-2">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-xl p-3 ${
                  msg.sender === 'user' 
                    ? 'bg-airavat-cyan/20 rounded-tr-none' 
                    : 'glass-dark rounded-tl-none'
                }`}
              >
                <div className="flex items-start mb-1">
                  <div 
                    className={`flex items-center justify-center h-6 w-6 rounded-full mr-2 ${
                      msg.sender === 'user' 
                        ? 'bg-gradient-to-r from-airavat-cyan to-airavat-blue' 
                        : 'bg-gradient-to-r from-airavat-purple to-airavat-cyan'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <User className="h-3 w-3 text-white" />
                    ) : (
                      <Bot className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-white/60">
                      {msg.sender === 'user' ? 'You' : 'Airavat Assistant'}
                      <span className="ml-2">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="ml-8 text-sm whitespace-pre-line">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {messages.length === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {suggestions.map((suggestion, index) => (
              <Card 
                key={index} 
                className="p-3 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border-white/10"
                onClick={() => {
                  setInput(suggestion);
                }}
              >
                <div className="flex items-start">
                  {index % 4 === 0 && <Cpu size={16} className="text-airavat-cyan mr-2 mt-0.5" />}
                  {index % 4 === 1 && <BookText size={16} className="text-purple-400 mr-2 mt-0.5" />}
                  {index % 4 === 2 && <Clock size={16} className="text-green-400 mr-2 mt-0.5" />}
                  {index % 4 === 3 && <BrainCircuit size={16} className="text-airavat-orange mr-2 mt-0.5" />}
                  <p className="text-sm">{suggestion}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        <div className="flex items-end">
          <Textarea 
            placeholder="Type your message here..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-white/5 border-white/10 focus-visible:ring-airavat-cyan/50 resize-none"
            rows={1}
          />
          <Button 
            className="ml-2 bg-airavat-cyan hover:bg-airavat-cyan/80 h-[42px] px-3"
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {messages.length > 1 && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={clearConversation}>
              Clear Conversation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assistant;

