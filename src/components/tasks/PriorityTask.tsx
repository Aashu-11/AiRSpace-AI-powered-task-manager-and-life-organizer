
import React from 'react';
import { CheckCircle, Clock, Flag, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskProps {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  completed?: boolean;
  aiRecommended?: boolean;
}

export const PriorityTask = ({
  title,
  description,
  priority,
  dueDate,
  completed = false,
  aiRecommended = false,
}: TaskProps) => {
  const priorityColors = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  return (
    <div className={cn(
      "glass p-4 rounded-xl transition-all duration-300 hover:border-white/20",
      aiRecommended && "border-l-2 border-l-airavat-cyan"
    )}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <button className="p-1 rounded-full hover:bg-white/10 transition-colors mr-3">
            {completed ? (
              <CheckCircle className="text-airavat-cyan" size={20} />
            ) : (
              <div className="w-5 h-5 rounded-full border border-white/40 hover:border-airavat-cyan transition-colors"></div>
            )}
          </button>
          <div>
            <h3 className={cn(
              "font-medium text-white transition-colors",
              completed && "line-through text-white/50"
            )}>
              {title}
            </h3>
            <p className="text-sm text-white/60 mt-1">{description}</p>
          </div>
        </div>
        <button className="p-1 rounded-full hover:bg-white/10 transition-colors">
          <MoreVertical size={18} className="text-white/60" />
        </button>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 pl-9">
        <div className={cn(
          "text-xs px-2 py-0.5 rounded-full border flex items-center",
          priorityColors[priority]
        )}>
          <Flag size={12} className="mr-1" />
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </div>
        
        <div className="text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/20 flex items-center">
          <Clock size={12} className="mr-1 text-white/70" />
          {dueDate}
        </div>
        
        {aiRecommended && (
          <div className="text-xs px-2 py-0.5 rounded-full bg-airavat-cyan/10 border border-airavat-cyan/30 text-airavat-cyan">
            AI Recommended
          </div>
        )}
      </div>
    </div>
  );
};
