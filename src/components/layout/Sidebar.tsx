import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  Clock,
  Target,
  Brain,
  Bell,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Zap,
  Lightbulb,
  LineChart,
  Flame,
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SidebarProps {
  className?: string;
}

type NavItemGroup = {
  icon: React.ElementType;
  label: string;
  path: string;
  highlight?: boolean;
  isNew?: boolean;
};

type NavGroup = {
  label: string;
  icon: React.ElementType;
  items: NavItemGroup[];
  isExpanded?: boolean;
  highlight?: boolean;
};

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  highlight?: boolean;
  isNew?: boolean;
}

const mainNavItems: NavItem[] = [ 
  { icon: BarChart3, label: 'Dashboard', path: '/dashboard', highlight: true },
  { icon: CheckCircle, label: 'Tasks', path: '/tasks' },
  { icon: Clock, label: 'Time Blocks', path: '/timeblocks' },
  { icon: Brain, label: 'Smart Assistant', path: '/assistant' },
];

const aiFeatures: NavGroup = {
  label: 'AI Features',
  icon: Sparkles,
  highlight: true,
  items: [
    { icon: Sparkles, label: 'AI Coach', path: '/ai-coach', highlight: true },
    { icon: Zap, label: 'Flow State', path: '/flow-state' },
    { icon: Lightbulb, label: 'Idea Generator', path: '/idea-generator' },
    { icon: LineChart, label: 'Productivity AI', path: '/productivity-ai' },
    { icon: MessageSquare, label: 'AI Feedback', path: '/ai-feedback' },
    { icon: Flame, label: 'Habit Builder', path: '/habit-builder', highlight: true },
  ]
};

const otherNavItems: NavItem[] = [
  { icon: Target, label: 'Insights', path: '/insights' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
];

export const Sidebar = ({ className }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activePath, setActivePath] = useState('/dashboard');
  const [isAIFeaturesOpen, setIsAIFeaturesOpen] = useState(true);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        'fixed h-full z-50 transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      <div className="h-full glass flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {!collapsed && (
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-electric animate-pulse-glow"></div>
              <h1 className="ml-2 text-xl font-orbitron font-bold text-gradient-blue-purple">
                AiRSpace
              </h1>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            {collapsed ? <ChevronRight size={20} /> : <X size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-2 px-2">
            {mainNavItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center p-2 rounded-lg transition-all duration-300',
                    'hover:bg-white/10 group',
                    activePath === item.path ? 'sidebar-item-active' : ''
                  )}
                  onClick={() => setActivePath(item.path)}
                >
                  <div 
                    className={cn(
                      'flex items-center justify-center rounded-md transition-all',
                      collapsed ? 'p-1.5 mx-auto' : 'p-1 mr-3',
                      item.highlight ? 'text-airavat-cyan' : 'text-white/70 group-hover:text-white'
                    )}
                  >
                    <item.icon size={collapsed ? 24 : 20} />
                  </div>
                  {!collapsed && (
                    <div className="flex items-center">
                      <span 
                        className={cn(
                          'text-sm font-medium tracking-wide',
                          item.highlight ? 'text-white' : 'text-white/70 group-hover:text-white'
                        )}
                      >
                        {item.label}
                      </span>
                      {item.isNew && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold rounded-md bg-gradient-to-r from-airavat-cyan to-purple-500">
                          NEW
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              </li>
            ))}
            
            {!collapsed && (
              <li className="mt-4">
                <Collapsible
                  open={isAIFeaturesOpen}
                  onOpenChange={setIsAIFeaturesOpen}
                  className="w-full"
                >
                  <CollapsibleTrigger asChild>
                    <button 
                      className={cn(
                        'flex items-center justify-between w-full p-2 rounded-lg transition-all',
                        'hover:bg-white/10 group',
                        'text-airavat-cyan'
                      )}
                    >
                      <div className="flex items-center">
                        <div className="p-1 mr-3 text-airavat-cyan">
                          <aiFeatures.icon size={20} />
                        </div>
                        <span className="text-sm font-medium tracking-wide text-white">
                          {aiFeatures.label}
                        </span>
                      </div>
                      <ChevronDown 
                        size={16} 
                        className={cn(
                          'transition-transform duration-200',
                          isAIFeaturesOpen ? 'transform rotate-180' : ''
                        )}
                      />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4">
                    <ul className="space-y-1 mt-1">
                      {aiFeatures.items.map((item) => (
                        <li key={item.path}>
                          <Link
                            to={item.path}
                            className={cn(
                              'flex items-center p-2 rounded-lg transition-all',
                              'hover:bg-white/10 group',
                              activePath === item.path ? 'sidebar-item-active' : ''
                            )}
                            onClick={() => setActivePath(item.path)}
                          >
                            <div 
                              className={cn(
                                'flex items-center justify-center rounded-md p-1 mr-3 transition-all',
                                item.highlight ? 'text-airavat-cyan' : 'text-white/70 group-hover:text-white'
                              )}
                            >
                              <item.icon size={18} />
                            </div>
                            <div className="flex items-center">
                              <span 
                                className={cn(
                                  'text-sm font-medium tracking-wide',
                                  item.highlight ? 'text-white' : 'text-white/70 group-hover:text-white'
                                )}
                              >
                                {item.label}
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              </li>
            )}
            
            {collapsed && aiFeatures.items.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center p-2 rounded-lg transition-all',
                    'hover:bg-white/10 group',
                    activePath === item.path ? 'sidebar-item-active' : ''
                  )}
                  onClick={() => setActivePath(item.path)}
                >
                  <div 
                    className={cn(
                      'flex items-center justify-center rounded-md p-1.5 mx-auto transition-all',
                      item.highlight ? 'text-airavat-cyan' : 'text-white/70 group-hover:text-white'
                    )}
                  >
                    <item.icon size={24} />
                  </div>
                </Link>
              </li>
            ))}
            
            {otherNavItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center p-2 rounded-lg transition-all',
                    'hover:bg-white/10 group',
                    activePath === item.path ? 'sidebar-item-active' : ''
                  )}
                  onClick={() => setActivePath(item.path)}
                >
                  <div 
                    className={cn(
                      'flex items-center justify-center rounded-md transition-all',
                      collapsed ? 'p-1.5 mx-auto' : 'p-1 mr-3',
                      item.highlight ? 'text-airavat-cyan' : 'text-white/70 group-hover:text-white'
                    )}
                  >
                    <item.icon size={collapsed ? 24 : 20} />
                  </div>
                  {!collapsed && (
                    <div className="flex items-center">
                      <span 
                        className={cn(
                          'text-sm font-medium tracking-wide',
                          item.highlight ? 'text-white' : 'text-white/70 group-hover:text-white'
                        )}
                      >
                        {item.label}
                      </span>
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          {!collapsed ? (
            <div className="glass-dark p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="h-2 w-2 rounded-full bg-airavat-cyan animate-pulse-glow"></div>
                <p className="ml-2 text-xs text-white/70">AI Assistant Online</p>
              </div>
              <Link to="/assistant" className="btn-glow w-full text-xs py-1.5 block text-center">Ask Airavat</Link>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="h-2 w-2 rounded-full bg-airavat-cyan animate-pulse-glow"></div>
            </div>
          )}
        </div>
      </div>
      
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <button 
          onClick={toggleSidebar}
          className="btn-premium p-3 rounded-full"
        >
          <Menu size={24} />
        </button>
      </div>
    </div>
  );
};
