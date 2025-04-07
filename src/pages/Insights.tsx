import React from 'react';
import { 
  Target, BarChart2, LineChart, PieChart, ArrowUpRight, Brain, 
  Calendar, Clock, CheckCircle, Zap
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Legend, PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';

const productivityData = [
  { day: 'Mon', score: 65, tasks: 7, energy: 60 },
  { day: 'Tue', score: 80, tasks: 12, energy: 85 },
  { day: 'Wed', score: 45, tasks: 4, energy: 50 },
  { day: 'Thu', score: 90, tasks: 15, energy: 85 },
  { day: 'Fri', score: 75, tasks: 10, energy: 70 },
  { day: 'Sat', score: 50, tasks: 5, energy: 65 },
  { day: 'Sun', score: 30, tasks: 3, energy: 45 },
];

const timeAllocationData = [
  { name: 'Deep Work', value: 35 },
  { name: 'Meetings', value: 20 },
  { name: 'Learning', value: 15 },
  { name: 'Admin Tasks', value: 10 },
  { name: 'Breaks', value: 15 },
  { name: 'Misc', value: 5 },
];

const COLORS = ['#00E4FF', '#C700FF', '#00FF9D', '#FF5500', '#FFD600', '#FF00C7'];

const Insights = () => {
  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold font-orbitron mb-2 flex items-center">
          <Target className="text-airavat-cyan mr-3" size={28} />
          Productivity Insights
        </h1>
        <p className="text-white/70">
          Deep analytics and AI-driven insights into your productivity patterns
        </p>
      </div>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { 
            icon: BarChart2, 
            label: "Productivity Score", 
            value: "74/100", 
            subtext: "+8% from last week",
            color: "text-airavat-cyan" 
          },
          { 
            icon: CheckCircle, 
            label: "Task Completion", 
            value: "82%", 
            subtext: "56 of 68 tasks",
            color: "text-green-400" 
          },
          { 
            icon: Clock, 
            label: "Focus Time", 
            value: "24.5 hrs", 
            subtext: "This week",
            color: "text-purple-400" 
          },
          { 
            icon: Zap, 
            label: "Energy Level", 
            value: "High", 
            subtext: "Above average",
            color: "text-amber-400" 
          }
        ].map((stat, index) => (
          <div 
            key={index} 
            className="glass p-5 rounded-xl animate-slide-up"
            style={{ animationDelay: `${0.1 * (index + 1)}s` }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-white/60 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-orbitron font-bold">{stat.value}</h3>
                <p className="text-xs text-white/60 mt-1">{stat.subtext}</p>
              </div>
              <div className={`p-2 rounded-lg bg-white/10 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Productivity trends */}
        <div className="lg:col-span-2">
          <div className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <LineChart className="text-airavat-cyan mr-2" size={20} />
                <h2 className="text-xl font-semibold">Productivity Trends</h2>
              </div>
              <div className="flex gap-2">
                <button className="text-sm px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  This Week
                </button>
                <button className="text-sm px-3 py-1 rounded-full text-white/60 hover:bg-white/10 transition-colors">
                  Last Week
                </button>
              </div>
            </div>
            
            <div className="h-64">
              <ChartContainer 
                className="h-full" 
                config={{
                  score: { 
                    color: '#00E4FF',
                    label: 'Productivity Score' 
                  }, 
                  tasks: { 
                    color: '#C700FF',
                    label: 'Tasks Completed'
                  },
                  energy: {
                    color: '#FF5500',
                    label: 'Energy Level'
                  }
                }}
              >
                <AreaChart
                  data={productivityData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E4FF" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00E4FF" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="tasksGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C700FF" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#C700FF" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF5500" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FF5500" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" />
                  <YAxis stroke="rgba(255,255,255,0.4)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#00E4FF" 
                    fillOpacity={1} 
                    fill="url(#scoreGradient)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="tasks" 
                    stroke="#C700FF" 
                    fillOpacity={1} 
                    fill="url(#tasksGradient)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="energy" 
                    stroke="#FF5500" 
                    fillOpacity={1} 
                    fill="url(#energyGradient)" 
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>
        </div>
        
        {/* Time allocation */}
        <div>
          <div className="glass p-6 rounded-xl h-full">
            <div className="flex items-center mb-4">
              <PieChart className="text-airavat-cyan mr-2" size={20} />
              <h2 className="text-xl font-semibold">Time Allocation</h2>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={timeAllocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {timeAllocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 space-y-2">
              {timeAllocationData.map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span>{entry.name}</span>
                  </div>
                  <span>{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Insights */}
      <div className="glass p-6 rounded-xl animate-slide-up" style={{ animationDelay: '0.7s' }}>
        <div className="flex items-center mb-4">
          <Brain className="text-airavat-cyan mr-2" size={20} />
          <h2 className="text-xl font-semibold">AI Productivity Insights</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-dark p-5 rounded-lg border border-airavat-cyan/30">
            <h4 className="font-medium text-airavat-cyan flex items-center">
              <Zap size={16} className="mr-1" /> Energy Patterns
            </h4>
            <p className="text-sm text-white/80 mt-2">
              Your energy peaks between 9AM-11AM and 4PM-6PM. Consider scheduling your most demanding 
              tasks during these windows for optimal performance.
            </p>
          </div>
          
          <div className="glass-dark p-5 rounded-lg border border-white/10">
            <h4 className="font-medium flex items-center">
              <CheckCircle size={16} className="mr-1" /> Task Completion
            </h4>
            <p className="text-sm text-white/80 mt-2">
              You complete 27% more tasks when you utilize the Pomodoro technique. 
              Your ideal work/break ratio appears to be 45min work with 12min breaks.
            </p>
          </div>
          
          <div className="glass-dark p-5 rounded-lg border border-white/10">
            <h4 className="font-medium flex items-center">
              <Calendar size={16} className="mr-1" /> Schedule Optimization
            </h4>
            <p className="text-sm text-white/80 mt-2">
              Your productivity drops significantly after 3+ consecutive meetings.
              Try to limit meeting blocks to maximum 2 hours with buffer time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
