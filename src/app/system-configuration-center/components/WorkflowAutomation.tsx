'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'notification' | 'assignment' | 'validation' | 'escalation';
  assignee?: string;
  conditions?: string[];
  timeoutHours?: number;
  position: { x: number; y: number };
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'draft' | 'inactive';
  steps: WorkflowStep[];
  triggerEvents: string[];
  lastModified: string;
  createdBy: string;
  usageCount: number;
}

interface WorkflowAutomationProps {
  workflows?: Workflow[];
  onWorkflowUpdate?: (workflowId: string, updates: Partial<Workflow>) => void;
  onWorkflowCreate?: (workflow: Omit<Workflow, 'id'>) => void;
}

const WorkflowAutomation = ({
  workflows = [
    {
      id: '1',
      name: 'Policy Review Workflow',
      description: 'Automated policy review and approval process',
      category: 'Policy Management',
      status: 'active',
      steps: [
        { id: 's1', name: 'Initial Review', type: 'assignment', assignee: 'Legal Team', position: { x: 100, y: 100 } },
        { id: 's2', name: 'Manager Approval', type: 'approval', assignee: 'Department Manager', timeoutHours: 48, position: { x: 300, y: 100 } },
        { id: 's3', name: 'Final Approval', type: 'approval', assignee: 'Compliance Officer', timeoutHours: 24, position: { x: 500, y: 100 } },
        { id: 's4', name: 'Notification', type: 'notification', conditions: ['All stakeholders'], position: { x: 700, y: 100 } }
      ],
      triggerEvents: ['Policy Created', 'Policy Updated'],
      lastModified: '2024-11-14T09:30:00Z',
      createdBy: 'Sarah Johnson',
      usageCount: 45
    },
    {
      id: '2',
      name: 'Risk Assessment Escalation',
      description: 'Automatic escalation for high-risk incidents',
      category: 'Risk Management',
      status: 'active',
      steps: [
        { id: 's1', name: 'Risk Evaluation', type: 'validation', conditions: ['Risk Score > 7'], position: { x: 100, y: 100 } },
        { id: 's2', name: 'Immediate Alert', type: 'notification', assignee: 'Risk Manager', position: { x: 300, y: 100 } },
        { id: 's3', name: 'Executive Escalation', type: 'escalation', assignee: 'C-Suite', timeoutHours: 2, position: { x: 500, y: 100 } }
      ],
      triggerEvents: ['Risk Identified', 'Incident Reported'],
      lastModified: '2024-11-13T16:45:00Z',
      createdBy: 'Michael Chen',
      usageCount: 23
    },
    {
      id: '3',
      name: 'Audit Evidence Collection',
      description: 'Streamlined audit evidence gathering process',
      category: 'Audit Management',
      status: 'draft',
      steps: [
        { id: 's1', name: 'Evidence Request', type: 'assignment', assignee: 'Department Heads', position: { x: 100, y: 100 } },
        { id: 's2', name: 'Collection Reminder', type: 'notification', timeoutHours: 72, position: { x: 300, y: 100 } },
        { id: 's3', name: 'Quality Review', type: 'validation', assignee: 'Lead Auditor', position: { x: 500, y: 100 } }
      ],
      triggerEvents: ['Audit Scheduled'],
      lastModified: '2024-11-12T11:20:00Z',
      createdBy: 'Emily Rodriguez',
      usageCount: 0
    }
  ],
  onWorkflowUpdate,
  onWorkflowCreate
}: WorkflowAutomationProps) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'designer'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStepTypeIcon = (type: string) => {
    switch (type) {
      case 'approval': return 'CheckCircleIcon';
      case 'notification': return 'BellIcon';
      case 'assignment': return 'UserIcon';
      case 'validation': return 'ShieldCheckIcon';
      case 'escalation': return 'ExclamationTriangleIcon';
      default: return 'CogIcon';
    }
  };

  const getStepTypeColor = (type: string) => {
    switch (type) {
      case 'approval': return 'bg-green-100 text-green-700';
      case 'notification': return 'bg-blue-100 text-blue-700';
      case 'assignment': return 'bg-purple-100 text-purple-700';
      case 'validation': return 'bg-yellow-100 text-yellow-700';
      case 'escalation': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'draft': return 'bg-yellow-100 text-yellow-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || workflow.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const selectedWorkflowData = workflows.find(w => w.id === selectedWorkflow);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Workflow Automation</h3>
          <p className="text-sm text-muted-foreground">Design and manage automated compliance workflows</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm rounded-md transition-colors duration-150 ${
                viewMode === 'list' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('designer')}
              className={`px-3 py-1 text-sm rounded-md transition-colors duration-150 ${
                viewMode === 'designer' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              Designer
            </button>
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-150 flex items-center space-x-2">
            <Icon name="PlusIcon" size={16} />
            <span>Create Workflow</span>
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workflow List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="space-y-3">
              {filteredWorkflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className={`bg-card border border-border rounded-lg p-4 cursor-pointer transition-all duration-150 ${
                    selectedWorkflow === workflow.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedWorkflow(workflow.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-foreground">{workflow.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(workflow.status)}`}>
                          {workflow.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{workflow.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Icon name="TagIcon" size={12} />
                          <span>{workflow.category}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="CogIcon" size={12} />
                          <span>{workflow.steps.length} steps</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="ChartBarIcon" size={12} />
                          <span>{workflow.usageCount} uses</span>
                        </span>
                      </div>
                    </div>
                    <button className="p-1 text-muted-foreground hover:text-foreground">
                      <Icon name="EllipsisVerticalIcon" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Details */}
          <div className="bg-card border border-border rounded-lg p-6">
            {selectedWorkflowData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">Workflow Details</h4>
                  <button className="p-1 text-muted-foreground hover:text-foreground">
                    <Icon name="PencilIcon" size={16} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</label>
                    <p className="text-sm text-foreground">{selectedWorkflowData.name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Category</label>
                    <p className="text-sm text-foreground">{selectedWorkflowData.category}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Created By</label>
                    <p className="text-sm text-foreground">{selectedWorkflowData.createdBy}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Trigger Events</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedWorkflowData.triggerEvents.map((event, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h5 className="text-sm font-medium text-foreground mb-3">Workflow Steps</h5>
                  <div className="space-y-2">
                    {selectedWorkflowData.steps.map((step, index) => (
                      <div key={step.id} className="flex items-center space-x-3 p-2 bg-muted rounded-lg">
                        <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-foreground">{step.name}</span>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${getStepTypeColor(step.type)}`}>
                              {step.type}
                            </span>
                          </div>
                          {step.assignee && (
                            <p className="text-xs text-muted-foreground">Assigned to: {step.assignee}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="CogIcon" size={32} className="mx-auto mb-2 opacity-50" />
                <p>Select a workflow to view details</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Workflow Designer */
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-medium text-foreground">Workflow Designer</h4>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors duration-150">
                Save Draft
              </button>
              <button className="px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-150">
                Publish
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 h-96">
            {/* Step Palette */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-foreground">Step Types</h5>
              <div className="space-y-2">
                {[
                  { type: 'approval', label: 'Approval' },
                  { type: 'notification', label: 'Notification' },
                  { type: 'assignment', label: 'Assignment' },
                  { type: 'validation', label: 'Validation' },
                  { type: 'escalation', label: 'Escalation' }
                ].map((stepType) => (
                  <div
                    key={stepType.type}
                    className="flex items-center space-x-2 p-2 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors duration-150"
                  >
                    <Icon name={getStepTypeIcon(stepType.type)} size={16} />
                    <span className="text-sm text-foreground">{stepType.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Canvas */}
            <div className="col-span-3 border border-border rounded-lg bg-muted/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              <div className="relative h-full p-4">
                <div className="text-center text-muted-foreground mt-20">
                  <Icon name="CursorArrowRaysIcon" size={32} className="mx-auto mb-2 opacity-50" />
                  <p>Drag steps from the palette to design your workflow</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="CogIcon" size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">{workflows.length}</div>
              <div className="text-sm text-muted-foreground">Total Workflows</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="PlayIcon" size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">{workflows.filter(w => w.status === 'active').length}</div>
              <div className="text-sm text-muted-foreground">Active Workflows</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Icon name="DocumentTextIcon" size={20} className="text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">{workflows.filter(w => w.status === 'draft').length}</div>
              <div className="text-sm text-muted-foreground">Draft Workflows</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Icon name="ChartBarIcon" size={20} className="text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">{workflows.reduce((sum, w) => sum + w.usageCount, 0)}</div>
              <div className="text-sm text-muted-foreground">Total Executions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowAutomation;