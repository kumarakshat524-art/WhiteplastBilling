import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Deadline {
  id: string;
  title: string;
  type: 'policy' | 'audit' | 'review' | 'training';
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  department: string;
}

interface UpcomingDeadlinesProps {
  deadlines: Deadline[];
}

const UpcomingDeadlines = ({ deadlines }: UpcomingDeadlinesProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'policy':
        return 'DocumentTextIcon';
      case 'audit':
        return 'ClockIcon';
      case 'review':
        return 'EyeIcon';
      case 'training':
        return 'AcademicCapIcon';
      default:
        return 'ClipboardDocumentListIcon';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'policy':
        return 'text-primary bg-primary/10';
      case 'audit':
        return 'text-warning bg-warning/10';
      case 'review':
        return 'text-accent bg-accent/10';
      case 'training':
        return 'text-success bg-success/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      default:
        return 'text-success';
    }
  };

  const formatDaysUntil = (dueDate: string) => {
    const today = new Date('2024-11-14');
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Upcoming Deadlines</h3>
          <Icon name="CalendarIcon" size={20} className="text-muted-foreground" />
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {deadlines.map((deadline) => (
          <div key={deadline.id} className="p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors duration-150">
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeColor(deadline.type)}`}>
                <Icon name={getTypeIcon(deadline.type)} size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-foreground text-sm truncate">{deadline.title}</h4>
                  <span className={`text-xs font-medium ${getPriorityColor(deadline.priority)}`}>
                    {formatDaysUntil(deadline.dueDate)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{deadline.assignee}</span>
                  <span>{deadline.department}</span>
                </div>
                
                <div className="mt-2 text-xs text-muted-foreground">
                  Due: {new Date(deadline.dueDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-border">
        <button className="w-full text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-150">
          View All Deadlines
        </button>
      </div>
    </div>
  );
};

export default UpcomingDeadlines;