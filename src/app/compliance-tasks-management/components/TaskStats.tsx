import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface TaskStatsProps {
  totalTasks: number;
  pendingTasks: number;
  inReviewTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
  averageCompletionTime: string;
}

const TaskStats = ({
  totalTasks,
  pendingTasks,
  inReviewTasks,
  completedTasks,
  overdueTasks,
  completionRate,
  averageCompletionTime
}: TaskStatsProps) => {
  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: 'ClipboardDocumentListIcon',
      color: 'text-foreground',
      bgColor: 'bg-muted'
    },
    {
      label: 'Pending',
      value: pendingTasks,
      icon: 'ClockIcon',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      label: 'In Review',
      value: inReviewTasks,
      icon: 'EyeIcon',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: 'CheckCircleIcon',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Overdue',
      value: overdueTasks,
      icon: 'ExclamationTriangleIcon',
      color: 'text-error',
      bgColor: 'bg-error/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-semibold text-foreground mt-1">{stat.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <Icon name={stat.icon} size={20} className={stat.color} />
            </div>
          </div>
        </div>
      ))}
      
      {/* Additional Metrics */}
      <div className="md:col-span-3 lg:col-span-2 bg-card border border-border rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Completion Rate</p>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-2xl font-semibold text-foreground">{completionRate}%</p>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div 
                  className="h-2 bg-success rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg. Completion Time</p>
            <p className="text-2xl font-semibold text-foreground mt-1">{averageCompletionTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;