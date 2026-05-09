'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Task {
  id: string;
  title: string;
  assignee: string;
  status: 'Pending' | 'In Review' | 'Completed' | 'On Hold' | 'Cancelled';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  dueDate: string;
  completionPercentage: number;
  timeTracked: string;
  category: string;
  description: string;
  lastUpdated: string;
  isActive?: boolean;
}

interface TaskTableProps {
  tasks: Task[];
  selectedTasks: string[];
  onTaskSelect: (taskId: string) => void;
  onTaskSelectAll: (selected: boolean) => void;
  onTaskEdit: (task: Task) => void;
  onTaskStatusChange: (taskId: string, status: string) => void;
  onStartTimer: (taskId: string) => void;
  onStopTimer: (taskId: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (column: string) => void;
}

const TaskTable = ({
  tasks,
  selectedTasks,
  onTaskSelect,
  onTaskSelectAll,
  onTaskEdit,
  onTaskStatusChange,
  onStartTimer,
  onStopTimer,
  sortBy,
  sortOrder,
  onSort
}: TaskTableProps) => {
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Task>>({});
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const allSelected = tasks.length > 0 && selectedTasks.length === tasks.length;
  const someSelected = selectedTasks.length > 0 && selectedTasks.length < tasks.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-success text-success-foreground';
      case 'In Review': return 'bg-accent text-accent-foreground';
      case 'Pending': return 'bg-warning text-warning-foreground';
      case 'On Hold': return 'bg-muted text-muted-foreground';
      case 'Cancelled': return 'bg-error text-error-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-error';
      case 'High': return 'text-warning';
      case 'Medium': return 'text-accent';
      case 'Low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'ExclamationTriangleIcon';
      case 'High': return 'ArrowUpIcon';
      case 'Medium': return 'MinusIcon';
      case 'Low': return 'ArrowDownIcon';
      default: return 'MinusIcon';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task.id);
    setEditValues(task);
  };

  const handleSaveEdit = () => {
    if (editingTask && editValues) {
      onTaskEdit({ ...editValues } as Task);
      setEditingTask(null);
      setEditValues({});
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditValues({});
  };

  const handleKeyDown = (e: React.KeyboardEvent, taskId: string) => {
    if (e.key === 'Enter' && editingTask === taskId) {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const SortableHeader = ({ column, children }: { column: string; children: React.ReactNode }) => (
    <th 
      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted transition-colors duration-150"
      onClick={() => onSort(column)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortBy === column && (
          <Icon 
            name={sortOrder === 'asc' ? 'ChevronUpIcon' : 'ChevronDownIcon'} 
            size={12} 
          />
        )}
      </div>
    </th>
  );

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={(e) => onTaskSelectAll(e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
                />
              </th>
              <SortableHeader column="id">ID</SortableHeader>
              <SortableHeader column="title">Task</SortableHeader>
              <SortableHeader column="assignee">Assignee</SortableHeader>
              <SortableHeader column="status">Status</SortableHeader>
              <SortableHeader column="priority">Priority</SortableHeader>
              <SortableHeader column="dueDate">Due Date</SortableHeader>
              <SortableHeader column="completionPercentage">Progress</SortableHeader>
              <SortableHeader column="timeTracked">Time</SortableHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {tasks.map((task) => (
              <tr 
                key={task.id}
                className={`hover:bg-muted/50 transition-colors duration-150 ${
                  selectedTasks.includes(task.id) ? 'bg-primary/5' : ''
                } ${task.isActive ? 'ring-2 ring-primary ring-inset' : ''}`}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(task.id)}
                    onChange={() => onTaskSelect(task.id)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
                  />
                </td>
                <td className="px-4 py-4 text-sm font-mono text-muted-foreground">
                  {task.id}
                </td>
                <td className="px-4 py-4">
                  {editingTask === task.id ? (
                    <input
                      type="text"
                      value={editValues.title || ''}
                      onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
                      onKeyDown={(e) => handleKeyDown(e, task.id)}
                      className="w-full px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
                      autoFocus
                    />
                  ) : (
                    <div>
                      <div className="text-sm font-medium text-foreground">{task.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{task.category}</div>
                    </div>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      {task.assignee.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm text-foreground">{task.assignee}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {editingTask === task.id ? (
                    <select
                      value={editValues.status || ''}
                      onChange={(e) => setEditValues({ ...editValues, status: e.target.value as Task['status'] })}
                      className="px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Review">In Review</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-1">
                    <Icon 
                      name={getPriorityIcon(task.priority)} 
                      size={14} 
                      className={getPriorityColor(task.priority)}
                    />
                    <span className={`text-sm ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className={`text-sm ${isOverdue(task.dueDate) ? 'text-error font-medium' : 'text-foreground'}`}>
                    {formatDate(task.dueDate)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">{task.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          task.completionPercentage === 100 ? 'bg-success' : 'bg-primary'
                        }`}
                        style={{ width: `${task.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-foreground font-mono">{task.timeTracked}</span>
                    <button
                      onClick={() => task.isActive ? onStopTimer(task.id) : onStartTimer(task.id)}
                      className={`p-1 rounded transition-colors duration-150 ${
                        task.isActive 
                          ? 'text-error hover:bg-error/10' :'text-success hover:bg-success/10'
                      }`}
                    >
                      <Icon name={task.isActive ? 'StopIcon' : 'PlayIcon'} size={14} />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    {editingTask === task.id ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="p-1 text-success hover:bg-success/10 rounded transition-colors duration-150"
                        >
                          <Icon name="CheckIcon" size={16} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 text-error hover:bg-error/10 rounded transition-colors duration-150"
                        >
                          <Icon name="XMarkIcon" size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(task)}
                          className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors duration-150"
                        >
                          <Icon name="PencilIcon" size={16} />
                        </button>
                        <button
                          onClick={() => onTaskStatusChange(task.id, task.status === 'Completed' ? 'Pending' : 'Completed')}
                          className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors duration-150"
                        >
                          <Icon name={task.status === 'Completed' ? 'ArrowUturnLeftIcon' : 'CheckIcon'} size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;