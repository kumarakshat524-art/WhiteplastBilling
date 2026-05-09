'use client';

import React, { useState, useEffect } from 'react';
import TaskFilters from './TaskFilters';
import TaskTable from './TaskTable';
import BulkActions from './BulkActions';
import TaskSearch from './TaskSearch';
import TaskStats from './TaskStats';
import NewTaskModal from './NewTaskModal';
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

interface FilterState {
  savedViews: string;
  assignees: string[];
  dueDateRange: string;
  categories: string[];
  status: string[];
  priority: string[];
}

const TasksInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    savedViews: 'all',
    assignees: [],
    dueDateRange: '',
    categories: [],
    status: [],
    priority: []
  });
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    setIsHydrated(true);
    
    // Mock tasks data
    const mockTasks: Task[] = [
      {
        id: 'CT-001',
        title: 'Update Data Privacy Policy for GDPR Compliance',
        assignee: 'Sarah Johnson',
        status: 'In Review',
        priority: 'High',
        dueDate: '2024-11-20',
        completionPercentage: 75,
        timeTracked: '12.5h',
        category: 'Policy Updates',
        description: 'Review and update data privacy policy to ensure GDPR compliance',
        lastUpdated: '2024-11-14T09:30:00',
        isActive: false
      },
      {
        id: 'CT-002',
        title: 'Complete GDPR Data Mapping Exercise',
        assignee: 'Michael Chen',
        status: 'Pending',
        priority: 'Critical',
        dueDate: '2024-11-15',
        completionPercentage: 30,
        timeTracked: '8.2h',
        category: 'GDPR Checklist',
        description: 'Map all personal data processing activities across the organization',
        lastUpdated: '2024-11-13T14:20:00',
        isActive: true
      },
      {
        id: 'CT-003',
        title: 'SOC 2 Security Controls Documentation',
        assignee: 'Emily Rodriguez',
        status: 'Completed',
        priority: 'High',
        dueDate: '2024-11-10',
        completionPercentage: 100,
        timeTracked: '24.7h',
        category: 'SOC 2 Evidence',
        description: 'Document all security controls for SOC 2 Type II audit',
        lastUpdated: '2024-11-10T16:45:00',
        isActive: false
      },
      {
        id: 'CT-004',
        title: 'Vendor Risk Assessment - CloudTech Solutions',
        assignee: 'David Kim',
        status: 'In Review',
        priority: 'Medium',
        dueDate: '2024-11-25',
        completionPercentage: 60,
        timeTracked: '6.8h',
        category: 'Vendor Assessments',
        description: 'Conduct comprehensive risk assessment for new cloud vendor',
        lastUpdated: '2024-11-14T11:15:00',
        isActive: false
      },
      {
        id: 'CT-005',
        title: 'Quarterly Access Control Review',
        assignee: 'Lisa Thompson',
        status: 'Pending',
        priority: 'Medium',
        dueDate: '2024-11-30',
        completionPercentage: 15,
        timeTracked: '3.2h',
        category: 'Access Reviews',
        description: 'Review user access permissions across all systems',
        lastUpdated: '2024-11-12T08:30:00',
        isActive: false
      },
      {
        id: 'CT-006',
        title: 'Security Awareness Training Completion Tracking',
        assignee: 'James Wilson',
        status: 'On Hold',
        priority: 'Low',
        dueDate: '2024-12-05',
        completionPercentage: 45,
        timeTracked: '5.5h',
        category: 'Security Audits',
        description: 'Track and report security training completion rates',
        lastUpdated: '2024-11-11T13:20:00',
        isActive: false
      },
      {
        id: 'CT-007',
        title: 'PCI DSS Compliance Gap Analysis',
        assignee: 'Maria Garcia',
        status: 'Pending',
        priority: 'Critical',
        dueDate: '2024-11-18',
        completionPercentage: 20,
        timeTracked: '4.1h',
        category: 'Security Audits',
        description: 'Identify gaps in PCI DSS compliance requirements',
        lastUpdated: '2024-11-13T10:45:00',
        isActive: false
      },
      {
        id: 'CT-008',
        title: 'Employee Data Processing Agreement Updates',
        assignee: 'Robert Taylor',
        status: 'In Review',
        priority: 'Medium',
        dueDate: '2024-11-22',
        completionPercentage: 80,
        timeTracked: '9.3h',
        category: 'Policy Updates',
        description: 'Update employee data processing agreements for new regulations',
        lastUpdated: '2024-11-14T15:10:00',
        isActive: false
      }
    ];
    
    setTasks(mockTasks);
    setFilteredTasks(mockTasks);
  }, []);

  useEffect(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.assignees.length > 0) {
      filtered = filtered.filter(task => filters.assignees.includes(task.assignee));
    }

    if (filters.categories.length > 0) {
      filtered = filtered.filter(task => filters.categories.includes(task.category));
    }

    if (filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status.includes(task.status));
    }

    if (filters.priority.length > 0) {
      filtered = filtered.filter(task => filters.priority.includes(task.priority));
    }

    if (filters.dueDateRange) {
      const now = new Date();
      filtered = filtered.filter(task => {
        const dueDate = new Date(task.dueDate);
        switch (filters.dueDateRange) {
          case 'today':
            return dueDate.toDateString() === now.toDateString();
          case 'week':
            const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            return dueDate >= now && dueDate <= weekFromNow;
          case 'month':
            const monthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
            return dueDate >= now && dueDate <= monthFromNow;
          case 'overdue':
            return dueDate < now;
          default:
            return true;
        }
      });
    }

    // Apply saved view filters
    if (filters.savedViews === 'my-tasks') {
      filtered = filtered.filter(task => task.assignee === 'Sarah Johnson');
    } else if (filters.savedViews === 'overdue') {
      const now = new Date();
      filtered = filtered.filter(task => new Date(task.dueDate) < now);
    } else if (filters.savedViews === 'due-today') {
      const today = new Date().toDateString();
      filtered = filtered.filter(task => new Date(task.dueDate).toDateString() === today);
    } else if (filters.savedViews === 'high-priority') {
      filtered = filtered.filter(task => task.priority === 'High' || task.priority === 'Critical');
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Task];
      let bValue: any = b[sortBy as keyof Task];

      if (sortBy === 'dueDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredTasks(filtered);
  }, [tasks, filters, searchQuery, sortBy, sortOrder]);

  if (!isHydrated) {
    return (
      <div className="flex h-screen bg-background">
        <div className="w-80 bg-card border-r border-border">
          <div className="p-4 animate-pulse">
            <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const taskCounts = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    inReview: tasks.filter(t => t.status === 'In Review').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date()).length
  };

  const completionRate = Math.round((taskCounts.completed / taskCounts.total) * 100);

  const handleTaskSelect = (taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleTaskSelectAll = (selected: boolean) => {
    setSelectedTasks(selected ? filteredTasks.map(task => task.id) : []);
  };

  const handleTaskEdit = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleTaskStatusChange = (taskId: string, status: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId 
        ? { ...task, status: status as Task['status'], completionPercentage: status === 'Completed' ? 100 : task.completionPercentage }
        : task
    ));
  };

  const handleStartTimer = (taskId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, isActive: true } : { ...task, isActive: false }
    ));
  };

  const handleStopTimer = (taskId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, isActive: false } : task
    ));
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleBulkStatusChange = (status: string) => {
    setTasks(prev => prev.map(task =>
      selectedTasks.includes(task.id)
        ? { ...task, status: status as Task['status'], completionPercentage: status === 'Completed' ? 100 : task.completionPercentage }
        : task
    ));
    setSelectedTasks([]);
  };

  const handleBulkAssigneeChange = (assignee: string) => {
    setTasks(prev => prev.map(task =>
      selectedTasks.includes(task.id) ? { ...task, assignee } : task
    ));
    setSelectedTasks([]);
  };

  const handleBulkPriorityChange = (priority: string) => {
    setTasks(prev => prev.map(task =>
      selectedTasks.includes(task.id) ? { ...task, priority: priority as Task['priority'] } : task
    ));
    setSelectedTasks([]);
  };

  const handleBulkDueDateChange = (dueDate: string) => {
    setTasks(prev => prev.map(task =>
      selectedTasks.includes(task.id) ? { ...task, dueDate } : task
    ));
    setSelectedTasks([]);
  };

  const handleBulkDelete = () => {
    setTasks(prev => prev.filter(task => !selectedTasks.includes(task.id)));
    setSelectedTasks([]);
  };

  const handleSearchResultSelect = (result: any) => {
    // Handle search result selection
    console.log('Selected search result:', result);
  };

  const handleNewTaskSubmit = (newTaskData: any) => {
    setTasks(prev => [newTaskData, ...prev]);
    setIsNewTaskModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Filters Sidebar */}
      {showFilters && (
        <TaskFilters
          filters={filters}
          onFiltersChange={setFilters}
          taskCounts={taskCounts}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-card border-b border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-150"
              >
                <Icon name="AdjustmentsHorizontalIcon" size={20} />
              </button>
              <h1 className="text-2xl font-semibold text-foreground">Compliance Tasks</h1>
              <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                {filteredTasks.length} of {tasks.length} tasks
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsNewTaskModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-150"
              >
                <Icon name="PlusIcon" size={16} />
                <span>New Task</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors duration-150">
                <Icon name="ArrowDownTrayIcon" size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Search */}
          <TaskSearch
            onSearch={setSearchQuery}
            onResultSelect={handleSearchResultSelect}
            className="max-w-md"
          />
        </div>

        {/* Stats */}
        <div className="p-6 bg-background">
          <TaskStats
            totalTasks={taskCounts.total}
            pendingTasks={taskCounts.pending}
            inReviewTasks={taskCounts.inReview}
            completedTasks={taskCounts.completed}
            overdueTasks={taskCounts.overdue}
            completionRate={completionRate}
            averageCompletionTime="3.2d"
          />
        </div>

        {/* Task Table */}
        <div className="flex-1 overflow-auto p-6 pt-0">
          <TaskTable
            tasks={filteredTasks}
            selectedTasks={selectedTasks}
            onTaskSelect={handleTaskSelect}
            onTaskSelectAll={handleTaskSelectAll}
            onTaskEdit={handleTaskEdit}
            onTaskStatusChange={handleTaskStatusChange}
            onStartTimer={handleStartTimer}
            onStopTimer={handleStopTimer}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        </div>
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedTasks.length}
        onBulkStatusChange={handleBulkStatusChange}
        onBulkAssigneeChange={handleBulkAssigneeChange}
        onBulkPriorityChange={handleBulkPriorityChange}
        onBulkDueDateChange={handleBulkDueDateChange}
        onBulkDelete={handleBulkDelete}
        onClearSelection={() => setSelectedTasks([])}
      />

      {/* New Task Modal */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onSubmit={handleNewTaskSubmit}
      />
    </div>
  );
};

export default TasksInteractive;