import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Activity {
  id: string;
  type: 'audit' | 'policy' | 'incident' | 'task' | 'approval';
  title: string;
  description: string;
  user: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'in-progress' | 'failed';
}

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'audit':
        return 'ClockIcon';
      case 'policy':
        return 'DocumentTextIcon';
      case 'incident':
        return 'ExclamationTriangleIcon';
      case 'task':
        return 'ClipboardDocumentListIcon';
      case 'approval':
        return 'CheckCircleIcon';
      default:
        return 'InformationCircleIcon';
    }
  };

  const getActivityColor = (type: string, status: string) => {
    if (status === 'failed') return 'text-error bg-error/10';
    if (status === 'pending') return 'text-warning bg-warning/10';
    
    switch (type) {
      case 'audit':
        return 'text-primary bg-primary/10';
      case 'policy':
        return 'text-accent bg-accent/10';
      case 'incident':
        return 'text-error bg-error/10';
      case 'task':
        return 'text-success bg-success/10';
      case 'approval':
        return 'text-success bg-success/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'in-progress':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'failed':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date('2024-11-14T10:08:55');
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {activities.map((activity, index) => (
          <div key={activity.id} className="p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors duration-150">
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type, activity.status)}`}>
                <Icon name={getActivityIcon(activity.type)} size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-foreground text-sm truncate">{activity.title}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(activity.status)}`}>
                    {activity.status.replace('-', ' ')}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {activity.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>by {activity.user}</span>
                  <span>{formatTimeAgo(activity.timestamp)}</span>
                </div>
              </div>
            </div>
            
            {index < activities.length - 1 && (
              <div className="ml-7 mt-4 h-px bg-border"></div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-border">
        <button className="w-full text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-150">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;