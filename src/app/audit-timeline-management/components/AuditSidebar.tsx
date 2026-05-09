'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  alt: string;
  email: string;
  workload: number;
}

interface AuditDetails {
  id: string;
  name: string;
  type: string;
  status: string;
  progress: number;
  startDate: Date;
  endDate: Date;
  description: string;
  lead: TeamMember;
  team: TeamMember[];
  evidenceCount: number;
  completedEvidence: number;
  nextMilestone: string;
  nextMilestoneDate: Date;
}

interface AuditSidebarProps {
  selectedAudit?: string;
  auditDetails?: AuditDetails;
  onClose: () => void;
  onTeamAssign: (auditId: string, memberId: string) => void;
  onStatusUpdate: (auditId: string, status: string) => void;
}

const AuditSidebar = ({
  selectedAudit,
  auditDetails,
  onClose,
  onTeamAssign,
  onStatusUpdate
}: AuditSidebarProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'evidence' | 'timeline'>('overview');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated || !selectedAudit || !auditDetails) {
    return (
      <div className="w-96 bg-card border-l border-border">
        <div className="p-6">
          <div className="h-6 bg-muted animate-pulse rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) =>
            <div key={i} className="h-4 bg-muted animate-pulse rounded"></div>
            )}
          </div>
        </div>
      </div>);

  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':return 'text-success bg-success/10';
      case 'in-progress':return 'text-primary bg-primary/10';
      case 'overdue':return 'text-error bg-error/10';
      case 'planning':return 'text-warning bg-warning/10';
      default:return 'text-muted-foreground bg-muted';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateDaysRemaining = (endDate: Date) => {
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Lead Auditor',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_19c152708-1762274558818.png",
    alt: 'Professional headshot of Sarah Johnson, lead auditor with brown hair in business attire',
    email: 'sarah.johnson@company.com',
    workload: 85
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Senior Auditor',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_117aaa114-1762274366119.png",
    alt: 'Professional headshot of Michael Chen, senior auditor in navy suit with glasses',
    email: 'michael.chen@company.com',
    workload: 72
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Compliance Specialist',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1beb9fc75-1762273370028.png",
    alt: 'Professional headshot of Emily Rodriguez, compliance specialist with long dark hair',
    email: 'emily.rodriguez@company.com',
    workload: 68
  }];


  return (
    <div className="w-96 bg-card border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Audit Details</h3>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-150">

            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        {/* Audit Title & Status */}
        <div className="mb-4">
          <h4 className="font-medium text-foreground mb-2">{auditDetails.name}</h4>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(auditDetails.status)}`}>
              {auditDetails.status}
            </span>
            <span className="text-sm text-muted-foreground">{auditDetails.type}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-medium text-foreground">{auditDetails.progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${auditDetails.progress}%` }}>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {[
          { id: 'overview', label: 'Overview', icon: 'InformationCircleIcon' },
          { id: 'team', label: 'Team', icon: 'UsersIcon' },
          { id: 'evidence', label: 'Evidence', icon: 'DocumentIcon' },
          { id: 'timeline', label: 'Timeline', icon: 'ClockIcon' }].
          map((tab) =>
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-xs font-medium transition-colors duration-150 ${
            activeTab === tab.id ?
            'bg-background text-foreground shadow-subtle' :
            'text-muted-foreground hover:text-foreground'}`
            }>

              <Icon name={tab.icon} size={14} className="mr-1" />
              {tab.label}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' &&
        <div className="space-y-6">
            {/* Key Metrics */}
            <div>
              <h5 className="font-medium text-foreground mb-3">Key Metrics</h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-2xl font-semibold text-foreground">{calculateDaysRemaining(auditDetails.endDate)}</div>
                  <div className="text-xs text-muted-foreground">Days Remaining</div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-2xl font-semibold text-foreground">{auditDetails.completedEvidence}/{auditDetails.evidenceCount}</div>
                  <div className="text-xs text-muted-foreground">Evidence Items</div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h5 className="font-medium text-foreground mb-3">Timeline</h5>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Start Date</span>
                  <span className="text-sm font-medium text-foreground">{formatDate(auditDetails.startDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">End Date</span>
                  <span className="text-sm font-medium text-foreground">{formatDate(auditDetails.endDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Next Milestone</span>
                  <span className="text-sm font-medium text-foreground">{formatDate(auditDetails.nextMilestoneDate)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h5 className="font-medium text-foreground mb-3">Description</h5>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {auditDetails.description}
              </p>
            </div>

            {/* Next Milestone */}
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Icon name="ClockIcon" size={16} className="text-accent mr-2" />
                <span className="font-medium text-foreground">Next Milestone</span>
              </div>
              <p className="text-sm text-muted-foreground">{auditDetails.nextMilestone}</p>
              <p className="text-xs text-accent mt-1">{formatDate(auditDetails.nextMilestoneDate)}</p>
            </div>
          </div>
        }

        {activeTab === 'team' &&
        <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="font-medium text-foreground">Team Members</h5>
              <button className="text-primary hover:text-primary/80 text-sm font-medium">
                + Add Member
              </button>
            </div>

            {/* Lead Auditor */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AppImage
                src={auditDetails.lead.avatar}
                alt={auditDetails.lead.alt}
                className="w-10 h-10 rounded-full object-cover" />

                <div className="flex-1">
                  <div className="font-medium text-foreground">{auditDetails.lead.name}</div>
                  <div className="text-sm text-muted-foreground">{auditDetails.lead.role}</div>
                </div>
                <Icon name="StarIcon" size={16} className="text-primary" />
              </div>
            </div>

            {/* Team Members */}
            <div className="space-y-3">
              {mockTeamMembers.slice(1).map((member) =>
            <div key={member.id} className="flex items-center space-x-3 p-3 hover:bg-muted rounded-lg transition-colors duration-150">
                  <AppImage
                src={member.avatar}
                alt={member.alt}
                className="w-8 h-8 rounded-full object-cover" />

                  <div className="flex-1">
                    <div className="font-medium text-foreground text-sm">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Workload</div>
                    <div className="text-sm font-medium text-foreground">{member.workload}%</div>
                  </div>
                </div>
            )}
            </div>

            {/* Workload Distribution */}
            <div className="bg-muted rounded-lg p-4">
              <h6 className="font-medium text-foreground mb-3">Workload Distribution</h6>
              <div className="space-y-2">
                {mockTeamMembers.map((member) =>
              <div key={member.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{member.name}</span>
                      <span className="text-sm text-muted-foreground">{member.workload}%</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-1.5">
                      <div
                    className={`h-1.5 rounded-full ${member.workload > 80 ? 'bg-error' : member.workload > 60 ? 'bg-warning' : 'bg-success'}`}
                    style={{ width: `${member.workload}%` }}>
                  </div>
                    </div>
                  </div>
              )}
              </div>
            </div>
          </div>
        }

        {activeTab === 'evidence' &&
        <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="font-medium text-foreground">Evidence Collection</h5>
              <button className="text-primary hover:text-primary/80 text-sm font-medium">
                + Add Evidence
              </button>
            </div>

            {/* Evidence Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-success/10 border border-success/20 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-success">{auditDetails.completedEvidence}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-warning">{auditDetails.evidenceCount - auditDetails.completedEvidence}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
              <div className="bg-error/10 border border-error/20 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-error">2</div>
                <div className="text-xs text-muted-foreground">Overdue</div>
              </div>
            </div>

            {/* Evidence Items */}
            <div className="space-y-3">
              {[
            { name: 'Financial Controls Documentation', status: 'completed', dueDate: '2024-11-10' },
            { name: 'Access Control Matrix', status: 'in-review', dueDate: '2024-11-15' },
            { name: 'Data Backup Procedures', status: 'pending', dueDate: '2024-11-20' },
            { name: 'Incident Response Plan', status: 'overdue', dueDate: '2024-11-12' }].
            map((item, index) =>
            <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status).split(' ')[1]}`}></div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground text-sm">{item.name}</div>
                    <div className="text-xs text-muted-foreground">Due: {item.dueDate}</div>
                  </div>
                  <Icon name="ChevronRightIcon" size={16} className="text-muted-foreground" />
                </div>
            )}
            </div>
          </div>
        }

        {activeTab === 'timeline' &&
        <div className="space-y-4">
            <h5 className="font-medium text-foreground">Recent Activity</h5>
            
            <div className="space-y-4">
              {[
            {
              action: 'Evidence submitted',
              item: 'Financial Controls Documentation',
              user: 'Sarah Johnson',
              time: '2 hours ago',
              type: 'success'
            },
            {
              action: 'Review completed',
              item: 'Access Control Matrix',
              user: 'Michael Chen',
              time: '4 hours ago',
              type: 'info'
            },
            {
              action: 'Milestone reached',
              item: 'Phase 1 Planning Complete',
              user: 'System',
              time: '1 day ago',
              type: 'success'
            },
            {
              action: 'Deadline approaching',
              item: 'Data Backup Procedures',
              user: 'System',
              time: '2 days ago',
              type: 'warning'
            }].
            map((activity, index) =>
            <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
              activity.type === 'success' ? 'bg-success' :
              activity.type === 'warning' ? 'bg-warning' :
              activity.type === 'error' ? 'bg-error' : 'bg-primary'}`
              }></div>
                  <div className="flex-1">
                    <div className="text-sm text-foreground">
                      <span className="font-medium">{activity.action}</span>
                      <span className="text-muted-foreground"> - {activity.item}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activity.user} • {activity.time}
                    </div>
                  </div>
                </div>
            )}
            </div>
          </div>
        }
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-border">
        <div className="flex space-x-3">
          <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-150 text-sm font-medium">
            Update Status
          </button>
          <button className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors duration-150 text-sm font-medium">
            Export
          </button>
        </div>
      </div>
    </div>);

};

export default AuditSidebar;