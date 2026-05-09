'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Policy {
  id: string;
  title: string;
  version: string;
  status: 'Draft' | 'Under Review' | 'Approved' | 'Published' | 'Archived';
  owner: string;
  lastUpdated: Date;
  complianceScore: number;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate?: Date;
  reviewers: number;
  comments: number;
  description?: string;
  effectiveDate?: Date;
  reviewCycle?: string;
  tags?: string[];
  relatedPolicies?: string[];
  applicableDepartments?: string[];
  approvalHistory?: Array<{
    date: Date;
    approver: string;
    action: string;
    comments?: string;
  }>;
}

interface PolicyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: Policy | null;
}

const PolicyDetailModal = ({ isOpen, onClose, policy }: PolicyDetailModalProps) => {
  if (!isOpen || !policy) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-success/10 text-success border-success/20';
      case 'Approved': return 'bg-primary/10 text-primary border-primary/20';
      case 'Under Review': return 'bg-warning/10 text-warning border-warning/20';
      case 'Draft': return 'bg-muted text-muted-foreground border-border';
      case 'Archived': return 'bg-secondary/10 text-secondary border-secondary/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-error';
      case 'High': return 'text-warning';
      case 'Medium': return 'text-primary';
      case 'Low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dueDate?: Date) => {
    if (!dueDate) return false;
    return dueDate < new Date();
  };

  // Mock detailed data for the selected policy
  const detailedPolicy = {
    ...policy,
    description: policy.description || 'This policy establishes the framework for organizational compliance and governance standards. It outlines the requirements, procedures, and responsibilities necessary to maintain regulatory compliance and operational excellence across all departments.',
    effectiveDate: policy.effectiveDate || new Date('2024-01-01'),
    reviewCycle: policy.reviewCycle || 'Annual',
    tags: policy.tags || ['Compliance', 'Governance', 'Regulatory', 'Standards'],
    relatedPolicies: policy.relatedPolicies || ['Risk Management Policy', 'Information Security Policy', 'Business Continuity Plan'],
    applicableDepartments: policy.applicableDepartments || ['All Departments', 'Legal', 'Compliance', 'IT Security'],
    approvalHistory: policy.approvalHistory || [
      {
        date: new Date('2024-11-10T14:30:00'),
        approver: 'Jennifer Walsh',
        action: 'Approved',
        comments: 'Final review completed. Policy ready for publication.'
      },
      {
        date: new Date('2024-11-08T11:15:00'),
        approver: 'Michael Chen',
        action: 'Reviewed',
        comments: 'Technical review completed. Minor formatting updates applied.'
      },
      {
        date: new Date('2024-11-05T09:45:00'),
        approver: 'Sarah Johnson',
        action: 'Submitted for Review',
        comments: 'Initial draft submitted for stakeholder review.'
      }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-xl font-semibold text-foreground truncate">{detailedPolicy.title}</h2>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(detailedPolicy.status)}`}>
                {detailedPolicy.status}
              </span>
              <Icon
                name="ExclamationCircleIcon"
                size={16}
                className={getPriorityColor(detailedPolicy.priority)}
              />
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Version {detailedPolicy.version}</span>
              <span>•</span>
              <span>Owner: {detailedPolicy.owner}</span>
              <span>•</span>
              <span>Updated {formatDate(detailedPolicy.lastUpdated)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-150"
          >
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="p-6 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Compliance Score</div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        detailedPolicy.complianceScore >= 95 ? 'bg-success' :
                        detailedPolicy.complianceScore >= 85 ? 'bg-warning' : 'bg-error'
                      }`}
                      style={{ width: `${detailedPolicy.complianceScore}%` }}
                    />
                  </div>
                  <span className="font-semibold text-foreground">{detailedPolicy.complianceScore}%</span>
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Effective Date</div>
                <div className="font-semibold text-foreground">{formatDate(detailedPolicy.effectiveDate)}</div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Review Cycle</div>
                <div className="font-semibold text-foreground">{detailedPolicy.reviewCycle}</div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Next Review</div>
                <div className={`font-semibold ${detailedPolicy.dueDate && isOverdue(detailedPolicy.dueDate) ? 'text-error' : 'text-foreground'}`}>
                  {detailedPolicy.dueDate ? formatDate(detailedPolicy.dueDate) : 'Not scheduled'}
                  {detailedPolicy.dueDate && isOverdue(detailedPolicy.dueDate) && (
                    <Icon name="ExclamationTriangleIcon" size={14} className="inline ml-1 text-error" />
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Policy Description</h3>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-foreground leading-relaxed">{detailedPolicy.description}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {detailedPolicy.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Applicable Departments */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Applicable Departments</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {detailedPolicy.applicableDepartments.map((dept) => (
                  <div
                    key={dept}
                    className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg"
                  >
                    <Icon name="BuildingOfficeIcon" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">{dept}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Policies */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Related Policies</h3>
              <div className="space-y-2">
                {detailedPolicy.relatedPolicies.map((relatedPolicy) => (
                  <div
                    key={relatedPolicy}
                    className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-150 cursor-pointer"
                  >
                    <Icon name="DocumentTextIcon" size={16} className="text-muted-foreground" />
                    <span className="text-foreground">{relatedPolicy}</span>
                    <Icon name="ChevronRightIcon" size={16} className="text-muted-foreground ml-auto" />
                  </div>
                ))}
              </div>
            </div>

            {/* Activity & Reviews */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Activity & Reviews</h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="UsersIcon" size={16} />
                  <span>{detailedPolicy.reviewers} reviewers</span>
                  <Icon name="ChatBubbleLeftIcon" size={16} className="ml-2" />
                  <span>{detailedPolicy.comments} comments</span>
                </div>
              </div>
              <div className="space-y-3">
                {detailedPolicy.approvalHistory.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      entry.action === 'Approved' ? 'bg-success/20 text-success' :
                      entry.action === 'Reviewed'? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {entry.action === 'Approved' ? '✓' : entry.action === 'Reviewed' ? '👁' : '📝'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-foreground">{entry.approver}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{entry.action}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{formatDateTime(entry.date)}</span>
                      </div>
                      {entry.comments && (
                        <p className="text-sm text-muted-foreground">{entry.comments}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 bg-card border-t border-border">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3 flex-wrap">
              <button className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm shadow-md hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 min-w-[120px]">
                <Icon name="PencilIcon" size={16} className="mr-2 flex-shrink-0" />
                Edit Policy
              </button>
              <button className="inline-flex items-center justify-center px-5 py-2.5 bg-secondary/10 text-secondary border border-secondary/20 rounded-lg font-medium text-sm hover:bg-secondary/20 hover:border-secondary/30 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 min-w-[100px]">
                <Icon name="DocumentDuplicateIcon" size={16} className="mr-2 flex-shrink-0" />
                Duplicate
              </button>
              <button className="inline-flex items-center justify-center px-5 py-2.5 bg-muted/80 text-foreground border border-border rounded-lg font-medium text-sm hover:bg-muted hover:border-border/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 min-w-[90px]">
                <Icon name="ArrowDownTrayIcon" size={16} className="mr-2 flex-shrink-0" />
                Export
              </button>
            </div>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center px-5 py-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-transparent hover:border-border rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 min-w-[80px]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyDetailModal;