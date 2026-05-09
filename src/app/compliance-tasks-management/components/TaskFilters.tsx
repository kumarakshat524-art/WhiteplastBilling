'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterState {
  savedViews: string;
  assignees: string[];
  dueDateRange: string;
  categories: string[];
  status: string[];
  priority: string[];
}

interface TaskFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  taskCounts: {
    total: number;
    pending: number;
    inReview: number;
    completed: number;
    overdue: number;
  };
}

const TaskFilters = ({ filters, onFiltersChange, taskCounts }: TaskFiltersProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const savedViews = [
    { id: 'all', label: 'All Tasks', count: taskCounts.total },
    { id: 'my-tasks', label: 'My Tasks', count: 18 },
    { id: 'overdue', label: 'Overdue', count: taskCounts.overdue },
    { id: 'due-today', label: 'Due Today', count: 7 },
    { id: 'high-priority', label: 'High Priority', count: 12 }
  ];

  const assignees = [
    'Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim', 
    'Lisa Thompson', 'James Wilson', 'Maria Garcia', 'Robert Taylor'
  ];

  const categories = [
    'Policy Updates', 'GDPR Checklist', 'SOC 2 Evidence', 
    'Vendor Assessments', 'Access Reviews', 'Security Audits'
  ];

  const statusOptions = [
    'Pending', 'In Review', 'Completed', 'On Hold', 'Cancelled'
  ];

  const priorityOptions = [
    'Critical', 'High', 'Medium', 'Low'
  ];

  const dueDateRanges = [
    { id: 'today', label: 'Due Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'overdue', label: 'Overdue' },
    { id: 'custom', label: 'Custom Range' }
  ];

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleArrayFilterToggle = (key: keyof FilterState, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    handleFilterChange(key, newArray);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      savedViews: 'all',
      assignees: [],
      dueDateRange: '',
      categories: [],
      status: [],
      priority: []
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.assignees.length > 0) count++;
    if (filters.dueDateRange && filters.dueDateRange !== '') count++;
    if (filters.categories.length > 0) count++;
    if (filters.status.length > 0) count++;
    if (filters.priority.length > 0) count++;
    return count;
  };

  return (
    <div className={`bg-card border-r border-border h-full flex flex-col transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          )}
          <div className="flex items-center space-x-2">
            {!isCollapsed && getActiveFilterCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-primary hover:text-primary/80 transition-colors duration-150"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors duration-150"
              title={isCollapsed ? "Expand filters" : "Collapse filters"}
            >
              <Icon name={isCollapsed ? "ChevronRightIcon" : "ChevronLeftIcon"} size={16} />
            </button>
          </div>
        </div>
        {!isCollapsed && getActiveFilterCount() > 0 && (
          <div className="mt-2 text-sm text-muted-foreground">
            {getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? 's' : ''} active
          </div>
        )}
        {isCollapsed && getActiveFilterCount() > 0 && (
          <div className="mt-2 flex justify-center">
            <div className="w-2 h-2 bg-primary rounded-full" title={`${getActiveFilterCount()} filter${getActiveFilterCount() > 1 ? 's' : ''} active`}></div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
        isCollapsed ? 'opacity-0 invisible' : 'opacity-100 visible'
      }`}>
        {!isCollapsed && (
          <>
            {/* Saved Views */}
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-medium text-foreground mb-3">Saved Views</h3>
              <div className="space-y-1">
                {savedViews.map((view) => (
                  <button
                    key={view.id}
                    onClick={() => handleFilterChange('savedViews', view.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                      filters.savedViews === view.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <span>{view.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      filters.savedViews === view.id
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {view.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date Range */}
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-medium text-foreground mb-3">Due Date</h3>
              <div className="space-y-2">
                {dueDateRanges.map((range) => (
                  <label key={range.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="dueDateRange"
                      value={range.id}
                      checked={filters.dueDateRange === range.id}
                      onChange={(e) => handleFilterChange('dueDateRange', e.target.value)}
                      className="w-4 h-4 text-primary border-border focus:ring-ring"
                    />
                    <span className="text-sm text-foreground">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Assignees */}
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-medium text-foreground mb-3">Assignees</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {assignees.map((assignee) => (
                  <label key={assignee} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.assignees.includes(assignee)}
                      onChange={() => handleArrayFilterToggle('assignees', assignee)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
                    />
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        {assignee.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm text-foreground truncate">{assignee}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-medium text-foreground mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => handleArrayFilterToggle('categories', category)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
                    />
                    <span className="text-sm text-foreground">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-medium text-foreground mb-3">Status</h3>
              <div className="space-y-2">
                {statusOptions.map((status) => (
                  <label key={status} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={() => handleArrayFilterToggle('status', status)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
                    />
                    <span className="text-sm text-foreground">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-foreground mb-3">Priority</h3>
              <div className="space-y-2">
                {priorityOptions.map((priority) => (
                  <label key={priority} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.priority.includes(priority)}
                      onChange={() => handleArrayFilterToggle('priority', priority)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
                    />
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        priority === 'Critical' ? 'bg-error' :
                        priority === 'High' ? 'bg-warning' :
                        priority === 'Medium' ? 'bg-accent' : 'bg-muted-foreground'
                      }`} />
                      <span className="text-sm text-foreground">{priority}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskFilters;