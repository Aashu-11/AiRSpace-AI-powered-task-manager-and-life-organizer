
import React, { useState } from 'react';
import { LineChart, Brain, Cpu, BarChart2, Loader2, Clock, Activity, Calendar, UserCircle, LayoutGrid, Maximize2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { analyzeProductivityData } from '@/lib/gemini';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Mock data for charts
const productivityData = [
  { day: 'Mon', focus: 75, energy: 80 },
  { day: 'Tue', focus: 60, energy: 65 },
  { day: 'Wed', focus: 85, energy: 70 },
  { day: 'Thu', focus: 50, energy: 55 },
  { day: 'Fri', focus: 70, energy: 75 },
  { day: 'Sat', focus: 40, energy: 60 },
  { day: 'Sun', focus: 30, energy: 40 },
];

const timeSpentData = [
  { name: 'Deep Work', value: 35 },
  { name: 'Meetings', value: 25 },
  { name: 'Admin Tasks', value: 15 },
  { name: 'Learning', value: 10 },
  { name: 'Other', value: 15 },
];

const COLORS = ['#00C8B8', '#845EC2', '#FF9671', '#FFC75F', '#D65DB1'];

const ProductivityAi = () => {
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [formData, setFormData] = useState({
    productiveHours: ['8:00-11:00', '15:00-17:00'],
    commonDistractions: ['social media', 'emails', 'unnecessary meetings'],
    completedTasks: 28,
    totalWorkTime: 45
  });
  const [customDistractions, setCustomDistractions] = useState('');
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'completedTasks' || name === 'totalWorkTime') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDistractionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomDistractions(e.target.value);
  };

  const handleAnalyze = async () => {
    // Update distractions list with custom distractions
    const distractions = [...formData.commonDistractions];
    if (customDistractions) {
      const customItems = customDistractions.split(',').map(item => item.trim());
      customItems.forEach(item => {
        if (item && !distractions.includes(item)) {
          distractions.push(item);
        }
      });
    }

    setLoading(true);
    try {
      const response = await analyzeProductivityData(
        formData.productiveHours,
        distractions,
        formData.completedTasks,
        formData.totalWorkTime
      );

      if (response.error) {
        throw new Error(response.error);
      }

      setAnalysisResult(response.text);
      setShowFullAnalysis(true);
      
      toast({
        title: "Analysis complete",
        description: "Your productivity data has been analyzed",
        variant: "default"
      });
    } catch (error) {
      console.error('Error analyzing data:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold font-orbitron mb-2 flex items-center">
          <LineChart className="text-airavat-cyan mr-3" size={28} />
          Productivity AI
        </h1>
        <p className="text-white/70">
          AI-powered analysis of your productivity patterns for optimized performance
        </p>
      </div>
      
      <Tabs defaultValue="dashboard" className="glass rounded-xl p-6">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="analyze">AI Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Productivity Score</h3>
                <Activity className="h-4 w-4 text-airavat-cyan" />
              </div>
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-full flex items-center justify-center border-4 border-airavat-cyan">
                  <span className="text-xl font-bold">76</span>
                </div>
                <div className="flex-1">
                  <Progress value={76} className="h-2 mb-1" />
                  <p className="text-xs text-white/60">+12% from last week</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Deep Work</h3>
                <Maximize2 className="h-4 w-4 text-purple-400" />
              </div>
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-full flex items-center justify-center border-4 border-purple-400">
                  <span className="text-xl font-bold">4.5</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm">hours/day</p>
                  <p className="text-xs text-white/60">+0.8 hrs from last week</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Task Completion</h3>
                <LayoutGrid className="h-4 w-4 text-green-400" />
              </div>
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-full flex items-center justify-center border-4 border-green-400">
                  <span className="text-xl font-bold">82%</span>
                </div>
                <div className="flex-1">
                  <Progress value={82} className="h-2 mb-1" />
                  <p className="text-xs text-white/60">28 of 34 tasks completed</p>
                </div>
              </div>
            </Card>
          </div>
          
          <Card className="p-6 border-white/10">
            <h3 className="font-medium mb-4">Weekly Focus & Energy</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="day" stroke="#ffffff80" />
                  <YAxis stroke="#ffffff80" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      borderColor: '#ffffff20',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="focus" 
                    stackId="1" 
                    stroke="#00C8B8" 
                    fill="#00C8B820" 
                    name="Focus Score"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="energy" 
                    stackId="2" 
                    stroke="#845EC2" 
                    fill="#845EC220"
                    name="Energy Level" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-white/10">
              <h3 className="font-medium mb-4">Time Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={timeSpentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {timeSpentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        borderColor: '#ffffff20',
                        borderRadius: '8px',
                        color: '#fff'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="p-6 border-white/10">
              <h3 className="font-medium mb-4">AI Recommendations</h3>
              <div className="space-y-3">
                <div className="glass-dark p-3 rounded-lg flex items-start">
                  <div className="bg-airavat-cyan/20 p-1.5 rounded-md mr-3">
                    <Clock className="h-4 w-4 text-airavat-cyan" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Optimal Work Periods</h4>
                    <p className="text-xs text-white/60">Schedule deep work from 8-11am when your focus is highest</p>
                  </div>
                </div>
                <div className="glass-dark p-3 rounded-lg flex items-start">
                  <div className="bg-purple-500/20 p-1.5 rounded-md mr-3">
                    <Calendar className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Meeting Optimization</h4>
                    <p className="text-xs text-white/60">Batch meetings on Tuesday & Thursday afternoons</p>
                  </div>
                </div>
                <div className="glass-dark p-3 rounded-lg flex items-start">
                  <div className="bg-green-500/20 p-1.5 rounded-md mr-3">
                    <UserCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Distraction Management</h4>
                    <p className="text-xs text-white/60">Set two 30-min blocks for email & communication</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-2">
                  <Brain className="mr-2 h-4 w-4" />
                  Get Personalized Plan
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analyze" className="space-y-6">
          {!showFullAnalysis ? (
            <Card className="p-6 border-white/10">
              <div className="flex items-center mb-4">
                <Brain className="text-airavat-cyan mr-2" size={24} />
                <h3 className="text-lg font-bold">Productivity Pattern Analysis</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="productiveHours">Your most productive hours</Label>
                    <Select value="default">
                      <SelectTrigger id="productiveHours">
                        <SelectValue placeholder="Select time blocks" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">8:00-11:00, 15:00-17:00</SelectItem>
                        <SelectItem value="morning">6:00-10:00</SelectItem>
                        <SelectItem value="afternoon">13:00-16:00</SelectItem>
                        <SelectItem value="evening">19:00-22:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="completedTasks">Tasks completed (last 7 days)</Label>
                    <Input 
                      id="completedTasks" 
                      name="completedTasks" 
                      type="number" 
                      value={formData.completedTasks}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Common distractions (select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="socialMedia" defaultChecked />
                      <Label htmlFor="socialMedia" className="text-sm">Social Media</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="emails" defaultChecked />
                      <Label htmlFor="emails" className="text-sm">Emails</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="meetings" defaultChecked />
                      <Label htmlFor="meetings" className="text-sm">Unnecessary Meetings</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="noise" />
                      <Label htmlFor="noise" className="text-sm">Noise</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="colleagues" />
                      <Label htmlFor="colleagues" className="text-sm">Colleague Interruptions</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notifications" />
                      <Label htmlFor="notifications" className="text-sm">Notifications</Label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="customDistractions">Other distractions (comma separated)</Label>
                  <Textarea 
                    id="customDistractions" 
                    placeholder="E.g., phone calls, hunger, tiredness" 
                    value={customDistractions}
                    onChange={handleDistractionChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="totalWorkTime">Total work hours (last 7 days)</Label>
                  <Input 
                    id="totalWorkTime" 
                    name="totalWorkTime" 
                    type="number" 
                    value={formData.totalWorkTime}
                    onChange={handleInputChange}
                  />
                </div>
                
                <Button 
                  onClick={handleAnalyze} 
                  disabled={loading}
                  className="w-full mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing your patterns...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Analyze My Productivity Patterns
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-6 border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Sparkles className="text-airavat-cyan mr-2" size={24} />
                  <h3 className="text-lg font-bold">AI Productivity Analysis</h3>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowFullAnalysis(false)}
                >
                  New Analysis
                </Button>
              </div>
              
              <div className="whitespace-pre-line bg-black/20 p-4 rounded-lg mb-6 max-h-96 overflow-y-auto">
                {analysisResult || "Your analysis will appear here after processing your productivity data."}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 border-white/10">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Clock className="h-4 w-4 text-airavat-cyan mr-2" />
                    Optimal Schedule
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">8:00 - 10:30</span>
                      <span>Deep Work Session</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">10:30 - 10:45</span>
                      <span>Short Break</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">10:45 - 12:00</span>
                      <span>Meetings & Collaboration</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">12:00 - 13:00</span>
                      <span>Lunch Break</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">13:00 - 14:00</span>
                      <span>Email & Communication</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">14:00 - 16:30</span>
                      <span>Deep Work Session</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">16:30 - 17:00</span>
                      <span>Review & Planning</span>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 border-white/10">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Activity className="h-4 w-4 text-purple-400 mr-2" />
                    Focus Optimization
                  </h4>
                  <div className="text-sm space-y-3">
                    <p className="text-white/80"><span className="font-medium text-white">Digital Detox:</span> Block social media access during 8:00-10:30 and 14:00-16:30</p>
                    <p className="text-white/80"><span className="font-medium text-white">Environment:</span> Use noise-cancelling headphones during deep work sessions</p>
                    <p className="text-white/80"><span className="font-medium text-white">Notification Batching:</span> Check emails only twice daily at set times</p>
                    <p className="text-white/80"><span className="font-medium text-white">Meeting Consolidation:</span> Schedule meetings only between 10:45-12:00</p>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      Apply Recommendations
                    </Button>
                  </div>
                </Card>
              </div>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="insights">
          <div className="text-center py-12">
            <BarChart2 className="mx-auto text-white/30 mb-4" size={64} />
            <h3 className="text-xl font-medium mb-2">Advanced Insights Coming Soon</h3>
            <p className="text-white/60 mb-4 max-w-xl mx-auto">
              We're developing advanced AI models to provide deeper insights into your productivity patterns, cognitive flow, and optimal work conditions. Stay tuned!
            </p>
            <Button variant="outline">
              Join Beta Program
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductivityAi;
