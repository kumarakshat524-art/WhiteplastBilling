'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'error';
  shortcut?: string;
}

interface QuickActionsProps {
  onActionClick?: (actionId: string) => void;
}

const QuickActions = ({ onActionClick }: QuickActionsProps) => {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const quickActions: QuickAction[] = [
    {
      id: 'create-task',
      title: 'Create Task',
      description: 'Add new compliance task',
      icon: 'PlusIcon',
      color: 'primary',
      shortcut: 'Ctrl+T'
    },
    {
      id: 'report-incident',
      title: 'Report Incident',
      description: 'Submit compliance incident',
      icon: 'ExclamationTriangleIcon',
      color: 'error',
      shortcut: 'Ctrl+I'
    },
    {
      id: 'schedule-audit',
      title: 'Schedule Audit',
      description: 'Plan new audit activity',
      icon: 'CalendarIcon',
      color: 'warning',
      shortcut: 'Ctrl+A'
    },
    {
      id: 'generate-report',
      title: 'Generate Report',
      description: 'Create compliance report',
      icon: 'DocumentChartBarIcon',
      color: 'success',
      shortcut: 'Ctrl+R'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'success':
        return 'bg-success text-success-foreground hover:bg-success/90';
      case 'warning':
        return 'bg-warning text-warning-foreground hover:bg-warning/90';
      case 'error':
        return 'bg-error text-error-foreground hover:bg-error/90';
      default:
        return 'bg-primary text-primary-foreground hover:bg-primary/90';
    }
  };

  const handleActionClick = (actionId: string) => {
    onActionClick?.(actionId);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <Icon name="BoltIcon" size={20} className="text-muted-foreground" />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action.id)}
            onMouseEnter={() => setHoveredAction(action.id)}
            onMouseLeave={() => setHoveredAction(null)}
            className={`
              p-4 rounded-lg text-left transition-all duration-150 hover-lift focus-ring
              ${getColorClasses(action.color)}
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <Icon name={action.icon} size={20} />
              {action.shortcut && hoveredAction === action.id && (
                <span className="text-xs opacity-75 font-mono">
                  {action.shortcut}
                </span>
              )}
            </div>
            
            <div className="space-y-1">
              <h4 className="font-medium text-sm">{action.title}</h4>
              <p className="text-xs opacity-90">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Keyboard shortcuts enabled</span>
          <button className="text-primary hover:text-primary/80 font-medium transition-colors duration-150">
            View All
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;