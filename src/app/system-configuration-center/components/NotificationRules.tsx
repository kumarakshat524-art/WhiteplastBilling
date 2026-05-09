'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface NotificationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  conditions: string[];
  recipients: string[];
  channels: ('email' | 'sms' | 'push' | 'slack')[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
  escalationRules?: {
    timeoutMinutes: number;
    escalateTo: string[];
  };
  template: string;
  lastTriggered?: string;
  triggerCount: number;
}

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'email' | 'sms' | 'push' | 'slack';
  variables: string[];
}

interface NotificationRulesProps {
  rules?: NotificationRule[];
  templates?: NotificationTemplate[];
  onRuleUpdate?: (ruleId: string, updates: Partial<NotificationRule>) => void;
  onRuleToggle?: (ruleId: string) => void;
  onTemplateUpdate?: (templateId: string, updates: Partial<NotificationTemplate>) => void;
}

const NotificationRules = ({
  rules = [
    {
      id: '1',
      name: 'High Risk Alert',
      description: 'Immediate notification for high-risk incidents',
      trigger: 'Risk Score > 8',
      conditions: ['Risk Level = High', 'Department = Any'],
      recipients: ['Risk Manager', 'Compliance Officer', 'Department Head'],
      channels: ['email', 'sms', 'push'],
      priority: 'critical',
      isActive: true,
      escalationRules: {
        timeoutMinutes: 15,
        escalateTo: ['C-Suite', 'Board Members']
      },
      template: 'high-risk-alert',
      lastTriggered: '2024-11-14T08:30:00Z',
      triggerCount: 23
    },
    {
      id: '2',
      name: 'Policy Review Due',
      description: 'Reminder for upcoming policy reviews',
      trigger: 'Policy Review Date - 7 days',
      conditions: ['Policy Status = Active', 'Review Required = True'],
      recipients: ['Policy Owner', 'Legal Team'],
      channels: ['email'],
      priority: 'medium',
      isActive: true,
      template: 'policy-review-reminder',
      lastTriggered: '2024-11-13T16:00:00Z',
      triggerCount: 156
    },
    {
      id: '3',
      name: 'Audit Deadline Warning',
      description: 'Warning for approaching audit deadlines',
      trigger: 'Audit Due Date - 3 days',
      conditions: ['Audit Status = In Progress', 'Evidence Collection < 80%'],
      recipients: ['Audit Team', 'Department Managers'],
      channels: ['email', 'slack'],
      priority: 'high',
      isActive: true,
      escalationRules: {
        timeoutMinutes: 60,
        escalateTo: ['Audit Director']
      },
      template: 'audit-deadline-warning',
      lastTriggered: '2024-11-12T14:20:00Z',
      triggerCount: 45
    },
    {
      id: '4',
      name: 'Task Assignment',
      description: 'Notification for new task assignments',
      trigger: 'Task Assigned',
      conditions: ['Task Priority >= Medium'],
      recipients: ['Assignee', 'Task Creator'],
      channels: ['email', 'push'],
      priority: 'low',
      isActive: true,
      template: 'task-assignment',
      lastTriggered: '2024-11-14T09:45:00Z',
      triggerCount: 892
    },
    {
      id: '5',
      name: 'System Maintenance',
      description: 'Scheduled maintenance notifications',
      trigger: 'Maintenance Scheduled',
      conditions: ['Maintenance Type = System Update'],
      recipients: ['All Users'],
      channels: ['email', 'push'],
      priority: 'medium',
      isActive: false,
      template: 'maintenance-notice',
      triggerCount: 12
    }
  ],
  templates = [
    {
      id: 'high-risk-alert',
      name: 'High Risk Alert Template',
      subject: 'URGENT: High Risk Incident Detected - {{incident_id}}',
      body: 'A high-risk incident has been detected in {{department}}. Risk Score: {{risk_score}}. Immediate action required. Details: {{incident_details}}',
      type: 'email',
      variables: ['incident_id', 'department', 'risk_score', 'incident_details']
    },
    {
      id: 'policy-review-reminder',
      name: 'Policy Review Reminder',
      subject: 'Policy Review Due: {{policy_name}}',
      body: 'The policy "{{policy_name}}" is due for review on {{review_date}}. Please complete the review process.',
      type: 'email',
      variables: ['policy_name', 'review_date']
    },
    {
      id: 'audit-deadline-warning',
      name: 'Audit Deadline Warning',
      subject: 'Audit Deadline Approaching: {{audit_name}}',
      body: 'The audit "{{audit_name}}" is due on {{due_date}}. Current progress: {{progress}}%. Please ensure timely completion.',
      type: 'email',
      variables: ['audit_name', 'due_date', 'progress']
    },
    {
      id: 'task-assignment',
      name: 'Task Assignment Notification',
      subject: 'New Task Assigned: {{task_title}}',
      body: 'You have been assigned a new task: {{task_title}}. Priority: {{priority}}. Due: {{due_date}}.',
      type: 'email',
      variables: ['task_title', 'priority', 'due_date']
    }
  ],
  onRuleUpdate,
  onRuleToggle,
  onTemplateUpdate
}: NotificationRulesProps) => {
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'rules' | 'templates'>('rules');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showPreview, setShowPreview] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return 'EnvelopeIcon';
      case 'sms': return 'DevicePhoneMobileIcon';
      case 'push': return 'BellIcon';
      case 'slack': return 'ChatBubbleLeftRightIcon';
      default: return 'BellIcon';
    }
  };

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || rule.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const selectedRuleData = rules.find(r => r.id === selectedRule);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Notification Rules</h3>
          <p className="text-sm text-muted-foreground">Configure alert rules and notification templates</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-3 py-1 text-sm rounded-md transition-colors duration-150 ${
                activeTab === 'rules' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              Rules
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-1 text-sm rounded-md transition-colors duration-150 ${
                activeTab === 'templates' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              Templates
            </button>
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-150 flex items-center space-x-2">
            <Icon name="PlusIcon" size={16} />
            <span>Create {activeTab === 'rules' ? 'Rule' : 'Template'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'rules' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rules List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search notification rules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="space-y-3">
              {filteredRules.map((rule) => (
                <div
                  key={rule.id}
                  className={`bg-card border border-border rounded-lg p-4 cursor-pointer transition-all duration-150 ${
                    selectedRule === rule.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedRule(rule.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-foreground">{rule.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(rule.priority)}`}>
                          {rule.priority}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${rule.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Icon name="BoltIcon" size={12} />
                          <span>{rule.trigger}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="UsersIcon" size={12} />
                          <span>{rule.recipients.length} recipients</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="ChartBarIcon" size={12} />
                          <span>{rule.triggerCount} triggers</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        {rule.channels.map((channel) => (
                          <div key={channel} className="flex items-center space-x-1 px-2 py-1 bg-muted rounded text-xs">
                            <Icon name={getChannelIcon(channel)} size={12} />
                            <span>{channel}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRuleToggle?.(rule.id);
                        }}
                        className={`w-10 h-6 rounded-full transition-colors duration-150 ${
                          rule.isActive ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-150 ${
                          rule.isActive ? 'translate-x-5' : 'translate-x-1'
                        }`}></div>
                      </button>
                      <button className="p-1 text-muted-foreground hover:text-foreground">
                        <Icon name="EllipsisVerticalIcon" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rule Details */}
          <div className="bg-card border border-border rounded-lg p-6">
            {selectedRuleData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">Rule Configuration</h4>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowPreview(true)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                      title="Preview"
                    >
                      <Icon name="EyeIcon" size={16} />
                    </button>
                    <button className="p-1 text-muted-foreground hover:text-foreground">
                      <Icon name="PencilIcon" size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Trigger</label>
                    <p className="text-sm text-foreground">{selectedRuleData.trigger}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Conditions</label>
                    <div className="space-y-1">
                      {selectedRuleData.conditions.map((condition, index) => (
                        <div key={index} className="text-sm text-foreground bg-muted px-2 py-1 rounded">
                          {condition}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Recipients</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedRuleData.recipients.map((recipient, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                          {recipient}
                        </span>
                      ))}
                    </div>
                  </div>
                  {selectedRuleData.escalationRules && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Escalation</label>
                      <div className="text-sm text-foreground">
                        <p>Timeout: {selectedRuleData.escalationRules.timeoutMinutes} minutes</p>
                        <p>Escalate to: {selectedRuleData.escalationRules.escalateTo.join(', ')}</p>
                      </div>
                    </div>
                  )}
                  {selectedRuleData.lastTriggered && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Triggered</label>
                      <p className="text-sm text-foreground">{formatTimeAgo(selectedRuleData.lastTriggered)}</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-semibold text-foreground">{selectedRuleData.triggerCount}</div>
                      <div className="text-xs text-muted-foreground">Total Triggers</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-semibold text-foreground">{selectedRuleData.recipients.length}</div>
                      <div className="text-xs text-muted-foreground">Recipients</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="BellIcon" size={32} className="mx-auto mb-2 opacity-50" />
                <p>Select a rule to view configuration</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Templates Tab */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon name={getChannelIcon(template.type)} size={16} className="text-muted-foreground" />
                    <h4 className="font-medium text-foreground">{template.name}</h4>
                  </div>
                  <button className="p-1 text-muted-foreground hover:text-foreground">
                    <Icon name="PencilIcon" size={14} />
                  </button>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Subject</label>
                    <p className="text-sm text-foreground font-mono text-wrap break-words">{template.subject}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Variables</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.variables.map((variable, index) => (
                        <span key={index} className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded font-mono">
                          {`{{${variable}}}`}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notification Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="BellIcon" size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">{rules.length}</div>
              <div className="text-sm text-muted-foreground">Total Rules</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircleIcon" size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">{rules.filter(r => r.isActive).length}</div>
              <div className="text-sm text-muted-foreground">Active Rules</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Icon name="DocumentTextIcon" size={20} className="text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">{templates.length}</div>
              <div className="text-sm text-muted-foreground">Templates</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Icon name="ChartBarIcon" size={20} className="text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">{rules.reduce((sum, r) => sum + r.triggerCount, 0)}</div>
              <div className="text-sm text-muted-foreground">Total Triggers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationRules;