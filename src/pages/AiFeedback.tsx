
import React, { useState } from 'react';
import { MessageSquare, Brain, ClipboardCheck, Loader2, CheckCircle2, XCircle, Send, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FeedbackRequest } from '@/lib/models';
import { getAIFeedback } from '@/lib/gemini';
import { toast } from '@/hooks/use-toast';

const AiFeedback = () => {
  const [loading, setLoading] = useState(false);
  const [activeFeedback, setActiveFeedback] = useState<FeedbackRequest | null>(null);
  const [formData, setFormData] = useState({
    content: '',
    feedbackType: 'writing',
    concerns: ''
  });
  const [history, setHistory] = useState<FeedbackRequest[]>([
    {
      id: '1',
      content: "We're excited to announce our new productivity platform that helps users optimize their daily workflows. Using AI-powered insights, we identify patterns in your work habits and suggest improvements. The system also includes time blocking and task prioritization features.",
      feedbackType: 'writing',
      concerns: 'Is this messaging clear and compelling?',
      feedback: "Your announcement is clear but could be more compelling. Consider:\n\n1. Start with a stronger hook that highlights a pain point: 'Tired of ending each day with unfinished tasks?'\n\n2. Be more specific about benefits: Instead of just 'suggest improvements,' explain HOW these improvements help users (e.g., 'increase focus by 40% by identifying your optimal work hours')\n\n3. Add a call-to-action that creates urgency\n\nStrengths: Good explanation of features, clear language, good length for an announcement.",
      createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString()
    },
    {
      id: '2',
      content: "function calculateTotalTime(tasks) {\n  let total = 0;\n  for (let i=0; i<tasks.length; i++) {\n    total = total + tasks[i].duration;\n  }\n  return total;\n}",
      feedbackType: 'code',
      concerns: 'Can this code be more efficient?',
      feedback: "Your code is functional but can be improved:\n\n1. Use modern JavaScript: Replace the for loop with reduce() for cleaner code:\n\n```javascript\nfunction calculateTotalTime(tasks) {\n  return tasks.reduce((total, task) => total + task.duration, 0);\n}\n```\n\n2. Add error handling: What if tasks is null or empty? What if a task doesn't have a duration property?\n\n3. Consider type checking for a more robust function\n\nThe current implementation works fine for basic use cases, but these changes would make it more maintainable and resilient.",
      createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString()
    }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getFeedback = async () => {
    if (!formData.content) {
      toast({
        title: "Missing content",
        description: "Please provide content for the AI to review",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await getAIFeedback(
        formData.content,
        formData.feedbackType,
        formData.concerns
      );

      if (response.error) {
        throw new Error(response.error);
      }

      const newFeedback: FeedbackRequest = {
        id: `fb-${Date.now()}`,
        content: formData.content,
        feedbackType: formData.feedbackType,
        concerns: formData.concerns,
        feedback: response.text,
        createdAt: new Date().toISOString()
      };

      setHistory(prev => [newFeedback, ...prev]);
      setActiveFeedback(newFeedback);
      
      toast({
        title: "Feedback received!",
        description: "AI has analyzed your content and provided feedback",
        variant: "default"
      });
    } catch (error) {
      console.error('Error getting feedback:', error);
      toast({
        title: "Failed to get feedback",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      variant: "default"
    });
  };

  const getDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold font-orbitron mb-2 flex items-center">
          <MessageSquare className="text-airavat-cyan mr-3" size={28} />
          AI Feedback System
        </h1>
        <p className="text-white/70">
          Get personalized AI feedback on your work, writing, presentations, and more
        </p>
      </div>
      
      <Tabs defaultValue="feedback" className="glass rounded-xl p-6">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="feedback">Get Feedback</TabsTrigger>
          <TabsTrigger value="history">Feedback History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feedback" className="space-y-6">
          <Card className="glass-dark p-6">
            <div className="flex items-center mb-4">
              <Brain className="text-airavat-cyan mr-2" size={20} />
              <h3 className="text-lg font-bold">AI Feedback Assistant</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="feedbackType">What type of content do you need feedback on?</Label>
                <RadioGroup 
                  className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2"
                  value={formData.feedbackType}
                  onValueChange={value => handleSelectChange('feedbackType', value)}
                >
                  <div className="flex items-center space-x-2 bg-black/20 rounded-md px-4 py-2">
                    <RadioGroupItem value="writing" id="writing" />
                    <Label htmlFor="writing" className="cursor-pointer">Writing & Copy</Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-black/20 rounded-md px-4 py-2">
                    <RadioGroupItem value="code" id="code" />
                    <Label htmlFor="code" className="cursor-pointer">Code Review</Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-black/20 rounded-md px-4 py-2">
                    <RadioGroupItem value="design" id="design" />
                    <Label htmlFor="design" className="cursor-pointer">Design Concept</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label htmlFor="content">Paste your content here</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  placeholder={
                    formData.feedbackType === 'writing' 
                      ? "Paste your text, email draft, presentation, etc..." 
                      : formData.feedbackType === 'code'
                      ? "Paste your code snippet here..."
                      : "Describe your design concept in detail..."
                  }
                  value={formData.content}
                  onChange={handleInputChange}
                  className="mt-1 font-mono"
                  rows={8}
                />
              </div>
              
              <div>
                <Label htmlFor="concerns">Specific concerns or questions (optional)</Label>
                <Textarea 
                  id="concerns" 
                  name="concerns" 
                  placeholder="E.g., Is this clear? How can I improve the structure? Is there a more efficient approach?" 
                  value={formData.concerns}
                  onChange={handleInputChange}
                  className="mt-1"
                  rows={2}
                />
              </div>
              
              <Button 
                onClick={getFeedback} 
                disabled={loading}
                className="w-full mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing your content...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Get AI Feedback
                  </>
                )}
              </Button>
            </div>
          </Card>
          
          {activeFeedback && (
            <Card className="p-6 border-airavat-cyan/30 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center">
                  <MessageSquare className="text-airavat-cyan mr-2" size={18} />
                  AI Feedback
                </h3>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => copyToClipboard(activeFeedback.feedback)}
                >
                  <Copy size={16} />
                </Button>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg mb-4 max-h-96 overflow-y-auto font-mono text-sm whitespace-pre-line">
                {activeFeedback.feedback}
              </div>
              
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Generated {new Date(activeFeedback.createdAt).toLocaleTimeString()}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-7 gap-1">
                    <CheckCircle2 size={14} className="text-green-400" />
                    <span>Helpful</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 gap-1">
                    <XCircle size={14} className="text-red-400" />
                    <span>Not Helpful</span>
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto text-white/30 mb-4" size={64} />
              <h3 className="text-xl font-medium mb-2">No feedback history yet</h3>
              <p className="text-white/60 mb-4">Submit your first content to get AI feedback</p>
              <Button variant="outline" onClick={() => document.querySelector('[value="feedback"]')?.dispatchEvent(new Event('click'))}>
                Get Your First Feedback
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {history.map(item => (
                <Card 
                  key={item.id} 
                  className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${activeFeedback?.id === item.id ? 'bg-white/5 border-airavat-cyan/30' : 'border-white/10'}`}
                  onClick={() => setActiveFeedback(item)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium truncate mb-1 flex items-center gap-2">
                        {item.feedbackType === 'writing' && <MessageSquare size={14} className="text-airavat-cyan" />}
                        {item.feedbackType === 'code' && <ClipboardCheck size={14} className="text-purple-400" />}
                        {item.feedbackType === 'design' && <Brain size={14} className="text-green-400" />}
                        <span>
                          {item.content.substring(0, 50)}{item.content.length > 50 ? '...' : ''}
                        </span>
                      </h3>
                      <div className="text-xs text-white/60 flex items-center gap-2">
                        <span className="bg-white/10 px-2 py-0.5 rounded-full">
                          {item.feedbackType} feedback
                        </span>
                        <span>{getDateDisplay(item.createdAt)}</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(item.feedback);
                      }}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                  <div className="text-xs text-white/60 truncate">
                    <span className="font-medium text-white/80">Feedback:</span> {item.feedback.substring(0, 80)}...
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AiFeedback;
