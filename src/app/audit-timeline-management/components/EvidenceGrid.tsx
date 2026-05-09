'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface EvidenceItem {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'submitted' | 'in-review' | 'approved' | 'rejected' | 'overdue';
  assignee: {
    name: string;
    avatar: string;
    alt: string;
  };
  reviewer?: {
    name: string;
    avatar: string;
    alt: string;
  };
  dueDate: Date;
  submittedDate?: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  auditPhase: string;
  description: string;
  attachments: number;
}

interface EvidenceGridProps {
  evidenceItems: EvidenceItem[];
  selectedItems: string[];
  onItemSelect: (itemId: string) => void;
  onBulkAction: (action: string, itemIds: string[]) => void;
  onStatusUpdate: (itemId: string, status: string) => void;
  onAssignReviewer: (itemId: string, reviewerId: string) => void;
}

const EvidenceGrid = ({
  evidenceItems,
  selectedItems,
  onItemSelect,
  onBulkAction,
  onStatusUpdate,
  onAssignReviewer
}: EvidenceGridProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [sortBy, setSortBy] = useState<'dueDate' | 'status' | 'priority' | 'name'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6">
          <div className="h-6 bg-muted animate-pulse rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-success bg-success/10 border-success/20';
      case 'submitted': case 'in-review': return 'text-primary bg-primary/10 border-primary/20';
      case 'rejected': case 'overdue': return 'text-error bg-error/10 border-error/20';
      case 'pending': return 'text-warning bg-warning/10 border-warning/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-primary';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return 'ExclamationTriangleIcon';
      case 'high': return 'ArrowUpIcon';
      case 'medium': return 'MinusIcon';
      case 'low': return 'ArrowDownIcon';
      default: return 'MinusIcon';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate: Date, status: string) => {
    return new Date() > dueDate && !['approved', 'submitted'].includes(status);
  };

  const filteredAndSortedItems = evidenceItems
    .filter(item => {
      if (filterStatus !== 'all' && item.status !== filterStatus) return false;
      if (filterPriority !== 'all' && item.priority !== filterPriority) return false;
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'dueDate':
          comparison = a.dueDate.getTime() - b.dueDate.getTime();
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'priority':
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredAndSortedItems.length) {
      // Deselect all
      filteredAndSortedItems.forEach(item => onItemSelect(item.id));
    } else {
      // Select all
      filteredAndSortedItems.forEach(item => {
        if (!selectedItems.includes(item.id)) {
          onItemSelect(item.id);
        }
      });
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Evidence Collection</h2>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-150">
              <Icon name="PlusIcon" size={16} className="mr-2" />
              Add Evidence
            </button>
            <button className="flex items-center px-3 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors duration-150">
              <Icon name="ArrowUpTrayIcon" size={16} className="mr-2" />
              Bulk Upload
            </button>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="in-review">In Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="overdue">Overdue</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {selectedItems.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {selectedItems.length} selected
                </span>
                <button
                  onClick={() => onBulkAction('assign-reviewer', selectedItems)}
                  className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors duration-150"
                >
                  Assign Reviewer
                </button>
                <button
                  onClick={() => onBulkAction('update-status', selectedItems)}
                  className="px-3 py-1 border border-border text-foreground rounded text-sm hover:bg-muted transition-colors duration-150"
                >
                  Update Status
                </button>
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredAndSortedItems.length} of {evidenceItems.length} items
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredAndSortedItems.length && filteredAndSortedItems.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-border focus:ring-2 focus:ring-ring"
                />
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors duration-150"
                >
                  <span>Evidence Item</span>
                  <Icon name="ChevronUpDownIcon" size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors duration-150"
                >
                  <span>Status</span>
                  <Icon name="ChevronUpDownIcon" size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('priority')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors duration-150"
                >
                  <span>Priority</span>
                  <Icon name="ChevronUpDownIcon" size={14} />
                </button>
              </th>
              <th className="text-left p-4">Assignee</th>
              <th className="text-left p-4">Reviewer</th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('dueDate')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors duration-150"
                >
                  <span>Due Date</span>
                  <Icon name="ChevronUpDownIcon" size={14} />
                </button>
              </th>
              <th className="text-left p-4">Phase</th>
              <th className="w-12 p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedItems.map((item) => (
              <tr
                key={item.id}
                className={`border-b border-border hover:bg-muted/50 transition-colors duration-150 ${
                  selectedItems.includes(item.id) ? 'bg-primary/5' : ''
                }`}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => onItemSelect(item.id)}
                    className="rounded border-border focus:ring-2 focus:ring-ring"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.type}</div>
                      {item.attachments > 0 && (
                        <div className="flex items-center mt-1">
                          <Icon name="PaperClipIcon" size={12} className="text-muted-foreground mr-1" />
                          <span className="text-xs text-muted-foreground">{item.attachments} files</span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                    {item.status.replace('-', ' ')}
                  </span>
                  {isOverdue(item.dueDate, item.status) && (
                    <div className="flex items-center mt-1">
                      <Icon name="ExclamationTriangleIcon" size={12} className="text-error mr-1" />
                      <span className="text-xs text-error">Overdue</span>
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center">
                    <Icon name={getPriorityIcon(item.priority)} size={14} className={`mr-1 ${getPriorityColor(item.priority)}`} />
                    <span className={`text-sm font-medium ${getPriorityColor(item.priority)}`}>
                      {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <AppImage
                      src={item.assignee.avatar}
                      alt={item.assignee.alt}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm text-foreground">{item.assignee.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  {item.reviewer ? (
                    <div className="flex items-center space-x-2">
                      <AppImage
                        src={item.reviewer.avatar}
                        alt={item.reviewer.alt}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-sm text-foreground">{item.reviewer.name}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onAssignReviewer(item.id, 'reviewer-1')}
                      className="text-sm text-primary hover:text-primary/80 transition-colors duration-150"
                    >
                      Assign Reviewer
                    </button>
                  )}
                </td>
                <td className="p-4">
                  <div className="text-sm text-foreground">{formatDate(item.dueDate)}</div>
                  {item.submittedDate && (
                    <div className="text-xs text-muted-foreground">
                      Submitted: {formatDate(item.submittedDate)}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">{item.auditPhase}</span>
                </td>
                <td className="p-4">
                  <button className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors duration-150">
                    <Icon name="EllipsisVerticalIcon" size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedItems.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="DocumentIcon" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No evidence items found</h3>
          <p className="text-muted-foreground mb-4">
            {filterStatus !== 'all' || filterPriority !== 'all' ?'Try adjusting your filters to see more results.' :'Get started by adding your first evidence item.'}
          </p>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-150">
            Add Evidence Item
          </button>
        </div>
      )}
    </div>
  );
};

export default EvidenceGrid;