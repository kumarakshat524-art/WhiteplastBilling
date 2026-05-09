'use client';

import React, { useState, useEffect } from 'react';
import TimelineView from './TimelineView';
import AuditSidebar from './AuditSidebar';
import EvidenceGrid from './EvidenceGrid';

interface AuditPhase {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'completed' | 'in-progress' | 'upcoming' | 'overdue';
  progress: number;
  milestones: Milestone[];
  color: string;
}

interface Milestone {
  id: string;
  name: string;
  date: Date;
  status: 'completed' | 'pending' | 'overdue';
  type: 'deliverable' | 'review' | 'meeting' | 'deadline';
  dependencies?: string[];
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
  lead: {
    id: string;
    name: string;
    role: string;
    avatar: string;
    alt: string;
    email: string;
    workload: number;
  };
  team: any[];
  evidenceCount: number;
  completedEvidence: number;
  nextMilestone: string;
  nextMilestoneDate: Date;
}

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

const AuditInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<string>('');
  const [selectedEvidenceItems, setSelectedEvidenceItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'timeline' | 'evidence'>('timeline');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const mockAudits: AuditPhase[] = [
  {
    id: 'audit-1',
    name: 'SOC 2 Type II Audit',
    startDate: new Date('2024-11-01'),
    endDate: new Date('2025-02-28'),
    status: 'in-progress',
    progress: 65,
    color: '#2563EB',
    milestones: [
    {
      id: 'm1',
      name: 'Planning Phase Complete',
      date: new Date('2024-11-15'),
      status: 'completed',
      type: 'deliverable'
    },
    {
      id: 'm2',
      name: 'Control Testing',
      date: new Date('2024-12-15'),
      status: 'pending',
      type: 'review'
    },
    {
      id: 'm3',
      name: 'Management Review',
      date: new Date('2025-01-15'),
      status: 'pending',
      type: 'meeting'
    },
    {
      id: 'm4',
      name: 'Final Report',
      date: new Date('2025-02-28'),
      status: 'pending',
      type: 'deadline'
    }]

  },
  {
    id: 'audit-2',
    name: 'Internal Financial Audit',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2025-01-31'),
    status: 'upcoming',
    progress: 25,
    color: '#059669',
    milestones: [
    {
      id: 'm5',
      name: 'Risk Assessment',
      date: new Date('2024-12-10'),
      status: 'pending',
      type: 'deliverable'
    },
    {
      id: 'm6',
      name: 'Controls Testing',
      date: new Date('2024-12-20'),
      status: 'pending',
      type: 'review'
    },
    {
      id: 'm7',
      name: 'Findings Review',
      date: new Date('2025-01-15'),
      status: 'pending',
      type: 'meeting'
    }]

  },
  {
    id: 'audit-3',
    name: 'GDPR Compliance Review',
    startDate: new Date('2024-10-01'),
    endDate: new Date('2024-11-30'),
    status: 'overdue',
    progress: 85,
    color: '#DC2626',
    milestones: [
    {
      id: 'm8',
      name: 'Data Mapping Complete',
      date: new Date('2024-10-15'),
      status: 'completed',
      type: 'deliverable'
    },
    {
      id: 'm9',
      name: 'Privacy Impact Assessment',
      date: new Date('2024-11-01'),
      status: 'completed',
      type: 'review'
    },
    {
      id: 'm10',
      name: 'Final Compliance Report',
      date: new Date('2024-11-30'),
      status: 'overdue',
      type: 'deadline'
    }]

  }];


  const mockAuditDetails: AuditDetails = {
    id: 'audit-1',
    name: 'SOC 2 Type II Audit',
    type: 'External Audit',
    status: 'In Progress',
    progress: 65,
    startDate: new Date('2024-11-01'),
    endDate: new Date('2025-02-28'),
    description: 'Comprehensive SOC 2 Type II audit focusing on security, availability, processing integrity, confidentiality, and privacy controls. This audit will evaluate the effectiveness of our controls over a 12-month period.',
    lead: {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Lead Auditor',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_19c152708-1762274558818.png",
      alt: 'Professional headshot of Sarah Johnson, lead auditor with brown hair in business attire',
      email: 'sarah.johnson@company.com',
      workload: 85
    },
    team: [],
    evidenceCount: 24,
    completedEvidence: 16,
    nextMilestone: 'Control Testing Phase',
    nextMilestoneDate: new Date('2024-12-15')
  };

  const mockEvidenceItems: EvidenceItem[] = [
  {
    id: 'ev-1',
    name: 'Access Control Matrix',
    type: 'Security Documentation',
    status: 'submitted',
    assignee: {
      name: 'Michael Chen',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_11e65badd-1762273612475.png",
      alt: 'Professional headshot of Michael Chen, senior auditor in navy suit with glasses'
    },
    reviewer: {
      name: 'Sarah Johnson',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_117c073be-1762273781803.png",
      alt: 'Professional headshot of Sarah Johnson, lead auditor with brown hair in business attire'
    },
    dueDate: new Date('2024-11-20'),
    submittedDate: new Date('2024-11-18'),
    priority: 'high',
    auditPhase: 'Control Testing',
    description: 'Comprehensive access control matrix documenting user permissions',
    attachments: 3
  },
  {
    id: 'ev-2',
    name: 'Data Backup Procedures',
    type: 'Process Documentation',
    status: 'in-review',
    assignee: {
      name: 'Emily Rodriguez',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_19c152708-1762274558818.png",
      alt: 'Professional headshot of Emily Rodriguez, compliance specialist with long dark hair'
    },
    reviewer: {
      name: 'Michael Chen',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_11e65badd-1762273612475.png",
      alt: 'Professional headshot of Michael Chen, senior auditor in navy suit with glasses'
    },
    dueDate: new Date('2024-11-25'),
    submittedDate: new Date('2024-11-22'),
    priority: 'medium',
    auditPhase: 'Control Testing',
    description: 'Detailed backup and recovery procedures documentation',
    attachments: 2
  },
  {
    id: 'ev-3',
    name: 'Incident Response Plan',
    type: 'Security Policy',
    status: 'overdue',
    assignee: {
      name: 'David Kim',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1d8751e58-1762274322225.png",
      alt: 'Professional headshot of David Kim, IT security specialist in dark suit'
    },
    dueDate: new Date('2024-11-12'),
    priority: 'critical',
    auditPhase: 'Planning',
    description: 'Comprehensive incident response and escalation procedures',
    attachments: 0
  },
  {
    id: 'ev-4',
    name: 'Vendor Risk Assessment',
    type: 'Risk Documentation',
    status: 'approved',
    assignee: {
      name: 'Lisa Wang',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a7390ff6-1762273732548.png",
      alt: 'Professional headshot of Lisa Wang, risk analyst with short black hair in blazer'
    },
    reviewer: {
      name: 'Sarah Johnson',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_19c152708-1762274558818.png",
      alt: 'Professional headshot of Sarah Johnson, lead auditor with brown hair in business attire'
    },
    dueDate: new Date('2024-11-10'),
    submittedDate: new Date('2024-11-08'),
    priority: 'high',
    auditPhase: 'Risk Assessment',
    description: 'Third-party vendor risk assessment and mitigation strategies',
    attachments: 5
  },
  {
    id: 'ev-5',
    name: 'Change Management Log',
    type: 'Process Documentation',
    status: 'pending',
    assignee: {
      name: 'James Thompson',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1d9a492a6-1762249014951.png",
      alt: 'Professional headshot of James Thompson, operations manager with beard in business casual'
    },
    dueDate: new Date('2024-11-30'),
    priority: 'medium',
    auditPhase: 'Control Testing',
    description: 'System change management and approval workflow documentation',
    attachments: 1
  }];


  if (!isHydrated) {
    return (
      <div className="space-y-6">
        <div className="h-96 bg-muted animate-pulse rounded-lg"></div>
        <div className="h-64 bg-muted animate-pulse rounded-lg"></div>
      </div>);

  }

  const handleAuditSelect = (auditId: string) => {
    setSelectedAudit(auditId);
  };

  const handleMilestoneUpdate = (auditId: string, milestoneId: string, newDate: Date) => {
    console.log('Updating milestone:', { auditId, milestoneId, newDate });
  };

  const handleEvidenceItemSelect = (itemId: string) => {
    setSelectedEvidenceItems((prev) =>
    prev.includes(itemId) ?
    prev.filter((id) => id !== itemId) :
    [...prev, itemId]
    );
  };

  const handleBulkAction = (action: string, itemIds: string[]) => {
    console.log('Bulk action:', { action, itemIds });
  };

  const handleStatusUpdate = (itemId: string, status: string) => {
    console.log('Status update:', { itemId, status });
  };

  const handleAssignReviewer = (itemId: string, reviewerId: string) => {
    console.log('Assign reviewer:', { itemId, reviewerId });
  };

  const handleTeamAssign = (auditId: string, memberId: string) => {
    console.log('Team assign:', { auditId, memberId });
  };

  const handleAuditStatusUpdate = (auditId: string, status: string) => {
    console.log('Audit status update:', { auditId, status });
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center space-x-1 bg-muted rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
          activeTab === 'timeline' ? 'bg-background text-foreground shadow-subtle' : 'text-muted-foreground hover:text-foreground'}`
          }>

          Timeline View
        </button>
        <button
          onClick={() => setActiveTab('evidence')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
          activeTab === 'evidence' ? 'bg-background text-foreground shadow-subtle' : 'text-muted-foreground hover:text-foreground'}`
          }>

          Evidence Collection
        </button>
      </div>

      {activeTab === 'timeline' &&
      <div className="flex space-x-6">
          {/* Timeline View */}
          <div className="flex-1">
            <TimelineView
            audits={mockAudits}
            selectedAudit={selectedAudit}
            onAuditSelect={handleAuditSelect}
            onMilestoneUpdate={handleMilestoneUpdate} />

          </div>

          {/* Sidebar */}
          {selectedAudit &&
        <AuditSidebar
          selectedAudit={selectedAudit}
          auditDetails={mockAuditDetails}
          onClose={() => setSelectedAudit('')}
          onTeamAssign={handleTeamAssign}
          onStatusUpdate={handleAuditStatusUpdate} />

        }
        </div>
      }

      {activeTab === 'evidence' &&
      <EvidenceGrid
        evidenceItems={mockEvidenceItems}
        selectedItems={selectedEvidenceItems}
        onItemSelect={handleEvidenceItemSelect}
        onBulkAction={handleBulkAction}
        onStatusUpdate={handleStatusUpdate}
        onAssignReviewer={handleAssignReviewer} />

      }
    </div>);

};

export default AuditInteractive;