
import React, { useState } from 'react';
import { Lightbulb, Sparkles, Download, Copy, Loader2, Share2, BookMarked, ThumbsUp, ThumbsDown } from 'lucide-react';
import { generateIdeas } from '@/lib/gemini';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneratedIdea } from '@/lib/models';

const IdeaGenerator = () => {
  const [topic, setTopic] = useState('');
  const [constraints, setConstraints] = useState('');
  const [count, setCount] = useState(3);
  const [ideaText, setIdeaText] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedIdeas, setSavedIdeas] = useState<GeneratedIdea[]>([
    {
      id: '1',
      title: 'SmartTasker',
      description: 'AI-powered task prioritization system that learns from your work habits and automatically suggests the optimal task order.',
      benefit: 'Eliminates decision fatigue and increases productivity by 30%',
      topic: 'Productivity App',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: '2',
      title: 'MindfulBreak',
      description: 'Microbreak scheduler that detects focus fatigue and suggests optimal break timing with personalized rejuvenation exercises.',
      benefit: 'Prevents burnout while maintaining productivity momentum',
      topic: 'Mental Wellness',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    }
  ]);

  const handleGenerateIdeas = async () => {
    if (!topic) {
      toast({
        title: "Topic required",
        description: "Please enter a topic to generate ideas for",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await generateIdeas(topic, constraints, count);
      
      if (response.error) {
        toast({
          title: "Error generating ideas",
          description: response.error,
          variant: "destructive"
        });
      } else {
        setIdeaText(response.text);
        
        toast({
          title: "Ideas generated!",
          description: `${count} new ideas created for "${topic}"`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate ideas. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyIdeas = () => {
    navigator.clipboard.writeText(ideaText);
    toast({
      title: "Copied",
      description: "Ideas copied to clipboard",
    });
  };

  const saveCurrentIdea = () => {
    // In a real app, you'd parse the idea text into separate ideas
    // For now, we'll just save the whole text as one idea
    const newIdea: GeneratedIdea = {
      id: Date.now().toString(),
      title: topic,
      description: ideaText.substring(0, 200) + (ideaText.length > 200 ? '...' : ''),
      benefit: constraints || 'Custom generated idea',
      topic: topic,
      createdAt: new Date().toISOString()
    };
    
    setSavedIdeas([newIdea, ...savedIdeas]);
    
    toast({
      title: "Idea saved",
      description: "Idea has been added to your collection",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const predefinedTopics = [
    "Productivity App Features",
    "Learning Platform Innovations",
    "Work-Life Balance Solutions",
    "Mental Health Tech",
    "AI-Powered Study Tools",
    "Future of Remote Work",
    "Student Success Platforms"
  ];

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold font-orbitron mb-2 flex items-center">
          <Lightbulb className="text-airavat-cyan mr-3" size={28} />
          AI Idea Generator
        </h1>
        <p className="text-white/70">
          Generate creative, innovative ideas for any project or challenge
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="glass w-full">
              <TabsTrigger value="generate" className="flex-1">Generate Ideas</TabsTrigger>
              <TabsTrigger value="saved" className="flex-1">Saved Ideas</TabsTrigger>
              <TabsTrigger value="inspiration" className="flex-1">Inspiration</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate" className="mt-4">
              <div className="glass p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Generate New Ideas</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-white/70 mb-2 block">What do you need ideas for?</label>
                    <Input 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Productivity app features, Study techniques, Project innovations..."
                      className="glass-dark w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-white/70 mb-2 block">Any specific constraints or requirements? (optional)</label>
                    <Textarea 
                      value={constraints}
                      onChange={(e) => setConstraints(e.target.value)}
                      placeholder="e.g., Must be low-cost, Suitable for students, Implementable in 2 weeks..."
                      className="glass-dark w-full"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-white/70 mb-2 block">Number of ideas to generate</label>
                    <div className="flex space-x-3">
                      {[3, 5, 7, 10].map((num) => (
                        <Button 
                          key={num}
                          variant={count === num ? "default" : "outline"}
                          className={count === num ? "bg-airavat-cyan hover:bg-airavat-cyan/90" : ""}
                          onClick={() => setCount(num)}
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleGenerateIdeas} 
                    className="btn-glow w-full mt-6"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Creative Ideas...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate {count} Ideas
                      </>
                    )}
                  </Button>
                </div>
                
                {ideaText && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-medium">Generated Ideas</h3>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" onClick={handleCopyIdeas}>
                          <Copy className="h-4 w-4 mr-1" /> Copy
                        </Button>
                        <Button size="sm" variant="ghost" onClick={saveCurrentIdea}>
                          <BookMarked className="h-4 w-4 mr-1" /> Save
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4 mr-1" /> Export
                        </Button>
                      </div>
                    </div>
                    
                    <div className="glass-dark p-6 rounded-lg border border-airavat-cyan/30 bg-gradient-to-br from-transparent to-airavat-cyan/5">
                      <div className="prose prose-invert max-w-none">
                        {ideaText.split('\n').map((paragraph, index) => (
                          <div key={index} className={index === 0 ? "text-airavat-cyan font-medium" : ""}>
                            {paragraph.length > 0 ? paragraph : <br/>}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1" /> Helpful
                        </Button>
                        <Button size="sm" variant="outline" className="flex items-center">
                          <ThumbsDown className="h-4 w-4 mr-1" /> Not Useful
                        </Button>
                      </div>
                      <Button className="btn-glow" onClick={handleGenerateIdeas}>
                        <Sparkles className="h-4 w-4 mr-1" /> Regenerate
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="saved" className="mt-4">
              <div className="glass p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Your Idea Collection</h2>
                
                {savedIdeas.length > 0 ? (
                  <div className="space-y-4">
                    {savedIdeas.map((idea) => (
                      <div key={idea.id} className="glass-dark p-4 rounded-lg border border-white/10 hover:border-airavat-cyan/50 transition-all duration-300">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-airavat-cyan">{idea.title}</h3>
                          <p className="text-xs text-white/60">{formatDate(idea.createdAt)}</p>
                        </div>
                        <p className="text-sm mt-2">{idea.description}</p>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">
                            {idea.topic}
                          </span>
                          <div className="flex space-x-2">
                            <button className="text-white/60 hover:text-white">
                              <Copy size={14} />
                            </button>
                            <button className="text-white/60 hover:text-white">
                              <Share2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <Lightbulb className="h-12 w-12 text-white/30 mx-auto mb-3" />
                    <h3 className="text-lg font-medium">No saved ideas yet</h3>
                    <p className="text-white/60 mt-1">
                      Generate and save ideas to build your collection
                    </p>
                    <Button 
                      className="mt-4"
                      onClick={() => document.querySelector('[value="generate"]')?.dispatchEvent(new Event('click'))}
                    >
                      Generate Your First Ideas
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="inspiration" className="mt-4">
              <div className="glass p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Inspiration Hub</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium mb-3">Trending Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {predefinedTopics.map((topic, index) => (
                        <Button 
                          key={index}
                          variant="outline"
                          size="sm"
                          className="bg-white/5 hover:bg-white/10 border border-white/10"
                          onClick={() => {
                            setTopic(topic);
                            document.querySelector('[value="generate"]')?.dispatchEvent(new Event('click'));
                          }}
                        >
                          {topic}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium mb-3">Innovation Techniques</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          name: "SCAMPER Method",
                          description: "Systematically transforms existing ideas using: Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Reverse.",
                          color: "from-blue-500/20 to-airavat-cyan/20"
                        },
                        {
                          name: "First Principles Thinking",
                          description: "Break down complex problems into basic elements and reassemble them from the ground up.",
                          color: "from-purple-500/20 to-pink-500/20"
                        },
                        {
                          name: "Opposite Thinking",
                          description: "Consider the opposite approach to conventional wisdom to reveal innovative opportunities.",
                          color: "from-amber-500/20 to-red-500/20"
                        },
                        {
                          name: "Cross-Industry Innovation",
                          description: "Apply successful ideas from unrelated fields to your domain for fresh perspectives.",
                          color: "from-emerald-500/20 to-cyan-500/20"
                        }
                      ].map((technique, index) => (
                        <div 
                          key={index}
                          className={`glass-dark rounded-lg p-4 border border-white/10 bg-gradient-to-br ${technique.color}`}
                        >
                          <h4 className="font-medium">{technique.name}</h4>
                          <p className="text-sm text-white/70 mt-1">{technique.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <div className="glass p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Idea Analytics</h2>
            
            <div className="space-y-4">
              <div className="glass-dark p-4 rounded-lg text-center">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-airavat-cyan/20 text-airavat-cyan mb-2">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-lg font-medium">23</h3>
                <p className="text-sm text-white/60">Ideas Generated</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-dark p-3 rounded-lg text-center">
                  <p className="text-2xl font-orbitron text-purple-400">7</p>
                  <p className="text-xs text-white/60">Saved Ideas</p>
                </div>
                <div className="glass-dark p-3 rounded-lg text-center">
                  <p className="text-2xl font-orbitron text-green-400">4</p>
                  <p className="text-xs text-white/60">Implemented</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="flex justify-between text-sm mb-1">
                  <span>Topic Diversity</span>
                  <span className="text-airavat-cyan">73%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-airavat-cyan to-purple-500 rounded-full" style={{width: '73%'}}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Your Top Categories</h2>
            
            <div className="space-y-3">
              {[
                { name: "Productivity", count: 12, percentage: 85 },
                { name: "Learning Methods", count: 8, percentage: 70 },
                { name: "Project Management", count: 6, percentage: 55 },
                { name: "AI Applications", count: 5, percentage: 45 },
                { name: "UX Design", count: 3, percentage: 30 }
              ].map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{category.name}</span>
                    <span className="text-white/70">{category.count} ideas</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-airavat-cyan to-purple-500 rounded-full" 
                      style={{width: `${category.percentage}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Latest Spark</h2>
            
            <div className="glass-dark p-4 rounded-lg border-l-2 border-airavat-cyan bg-white/5">
              <div className="text-sm italic text-white/80">
                "The greatest innovations often come from connecting seemingly unrelated dots. Try combining two unrelated fields to spark fresh ideas."
              </div>
              <div className="mt-2 text-right text-xs text-white/60">
                — Airavat AI
              </div>
            </div>
            
            <button className="w-full mt-4 text-sm text-airavat-cyan hover:text-airavat-cyan/80">
              Get a new creative spark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaGenerator;
