'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface BulkActionsProps {
  selectedCount: number;
  onBulkStatusChange: (status: string) => void;
  onBulkAssigneeChange: (assignee: string) => void;
  onBulkPriorityChange: (priority: string) => void;
  onBulkDueDateChange: (dueDate: string) => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

const BulkActions = ({
  selectedCount,
  onBulkStatusChange,
  onBulkAssigneeChange,
  onBulkPriorityChange,
  onBulkDueDateChange,
  onBulkDelete,
  onClearSelection
}: BulkActionsProps) => {
  const [showActions, setShowActions] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const assignees = [
    'Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim', 
    'Lisa Thompson', 'James Wilson', 'Maria Garcia', 'Robert Taylor'
  ];

  const statusOptions = [
    'Pending', 'In Review', 'Completed', 'On Hold', 'Cancelled'
  ];

  const priorityOptions = [
    'Critical', 'High', 'Medium', 'Low'
  ];

  const handleActionClick = (action: string) => {
    if (activeAction === action) {
      setActiveAction(null);
    } else {
      setActiveAction(action);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onBulkDueDateChange(e.target.value);
    setActiveAction(null);
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-card border border-border rounded-lg shadow-large px-4 py-3">
        <div className="flex items-center space-x-4">
          {/* Selection Info */}
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircleIcon" size={20} className="text-primary" />
            <span className="text-sm font-medium text-foreground">
              {selectedCount} task{selectedCount > 1 ? 's' : ''} selected
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Status Change */}
            <div className="relative">
              <button
                onClick={() => handleActionClick('status')}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors duration-150"
              >
                <Icon name="ArrowPathIcon" size={16} />
                <span>Status</span>
                <Icon name="ChevronDownIcon" size={14} />
              </button>
              
              {activeAction === 'status' && (
                <div className="absolute bottom-full left-0 mb-2 bg-popover border border-border rounded-lg shadow-large py-1 min-w-32">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        onBulkStatusChange(status);
                        setActiveAction(null);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors duration-150"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Assignee Change */}
            <div className="relative">
              <button
                onClick={() => handleActionClick('assignee')}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors duration-150"
              >
                <Icon name="UserIcon" size={16} />
                <span>Assign</span>
                <Icon name="ChevronDownIcon" size={14} />
              </button>
              
              {activeAction === 'assignee' && (
                <div className="absolute bottom-full left-0 mb-2 bg-popover border border-border rounded-lg shadow-large py-1 min-w-48 max-h-48 overflow-y-auto">
                  {assignees.map((assignee) => (
                    <button
                      key={assignee}
                      onClick={() => {
                        onBulkAssigneeChange(assignee);
                        setActiveAction(null);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors duration-150 flex items-center space-x-2"
                    >
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        {assignee.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span>{assignee}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Priority Change */}
            <div className="relative">
              <button
                onClick={() => handleActionClick('priority')}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors duration-150"
              >
                <Icon name="ExclamationTriangleIcon" size={16} />
                <span>Priority</span>
                <Icon name="ChevronDownIcon" size={14} />
              </button>
              
              {activeAction === 'priority' && (
                <div className="absolute bottom-full left-0 mb-2 bg-popover border border-border rounded-lg shadow-large py-1 min-w-32">
                  {priorityOptions.map((priority) => (
                    <button
                      key={priority}
                      onClick={() => {
                        onBulkPriorityChange(priority);
                        setActiveAction(null);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors duration-150 flex items-center space-x-2"
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        priority === 'Critical' ? 'bg-error' :
                        priority === 'High' ? 'bg-warning' :
                        priority === 'Medium' ? 'bg-accent' : 'bg-muted-foreground'
                      }`} />
                      <span>{priority}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Due Date Change */}
            <div className="relative">
              <button
                onClick={() => handleActionClick('dueDate')}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors duration-150"
              >
                <Icon name="CalendarIcon" size={16} />
                <span>Due Date</span>
              </button>
              
              {activeAction === 'dueDate' && (
                <div className="absolute bottom-full left-0 mb-2 bg-popover border border-border rounded-lg shadow-large p-3">
                  <input
                    type="date"
                    onChange={handleDateChange}
                    className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="w-px h-6 bg-border" />

            {/* Delete */}
            <button
              onClick={onBulkDelete}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-error hover:bg-error/10 rounded-lg transition-colors duration-150"
            >
              <Icon name="TrashIcon" size={16} />
              <span>Delete</span>
            </button>

            {/* Clear Selection */}
            <button
              onClick={onClearSelection}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-150"
            >
              <Icon name="XMarkIcon" size={16} />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;