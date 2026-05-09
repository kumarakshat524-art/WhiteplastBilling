'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ComplianceControl {
  id: string;
  name: string;
  description: string;
  category: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'compliant' | 'non-compliant' | 'in-progress' | 'not-assessed';
  lastAssessment?: string;
  nextAssessment: string;
  owner: string;
  evidence: string[];
}

interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  type: 'regulatory' | 'industry' | 'internal';
  status: 'active' | 'draft' | 'archived';
  version: string;
  effectiveDate: string;
  controls: ComplianceControl[];
  completionPercentage: number;
  lastUpdated: string;
  updatedBy: string;
  applicableDepartments: string[];
}

interface ComplianceFrameworksProps {
  frameworks?: ComplianceFramework[];
  onFrameworkUpdate?: (frameworkId: string, updates: Partial<ComplianceFramework>) => void;
  onControlUpdate?: (frameworkId: string, controlId: string, updates: Partial<ComplianceControl>) => void;
}

const ComplianceFrameworks = ({
  frameworks = [
    {
      id: '1',
      name: 'SOX (Sarbanes-Oxley Act)',
      description: 'Financial reporting and internal controls compliance',
      type: 'regulatory',
      status: 'active',
      version: '2024.1',
      effectiveDate: '2024-01-01T00:00:00Z',
      completionPercentage: 92,
      lastUpdated: '2024-11-10T14:30:00Z',
      updatedBy: 'Sarah Johnson',
      applicableDepartments: ['Finance', 'Accounting', 'IT', 'Legal'],
      controls: [
        {
          id: 'sox-302',
          name: 'Management Assessment of Internal Controls',
          description: 'Quarterly assessment of internal control effectiveness',
          category: 'Internal Controls',
          riskLevel: 'high',
          status: 'compliant',
          lastAssessment: '2024-10-31T00:00:00Z',
          nextAssessment: '2024-12-31T00:00:00Z',
          owner: 'CFO',
          evidence: ['Management Certification', 'Control Testing Results']
        },
        {
          id: 'sox-404',
          name: 'Internal Control Over Financial Reporting',
          description: 'Annual assessment of financial reporting controls',
          category: 'Financial Reporting',
          riskLevel: 'critical',
          status: 'in-progress',
          nextAssessment: '2024-12-15T00:00:00Z',
          owner: 'Internal Audit',
          evidence: ['Control Documentation', 'Testing Procedures']
        }
      ]
    },
    {
      id: '2',
      name: 'GDPR (General Data Protection Regulation)',
      description: 'Data protection and privacy compliance for EU operations',
      type: 'regulatory',
      status: 'active',
      version: '2024.2',
      effectiveDate: '2024-05-25T00:00:00Z',
      completionPercentage: 87,
      lastUpdated: '2024-11-12T09:15:00Z',
      updatedBy: 'Michael Chen',
      applicableDepartments: ['IT', 'Legal', 'HR', 'Marketing'],
      controls: [
        {
          id: 'gdpr-art6',
          name: 'Lawful Basis for Processing',
          description: 'Establish and document lawful basis for data processing',
          category: 'Data Processing',
          riskLevel: 'high',
          status: 'compliant',
          lastAssessment: '2024-11-01T00:00:00Z',
          nextAssessment: '2024-12-01T00:00:00Z',
          owner: 'Data Protection Officer',
          evidence: ['Privacy Policy', 'Consent Records', 'Legal Basis Documentation']
        },
        {
          id: 'gdpr-art32',
          name: 'Security of Processing',
          description: 'Implement appropriate technical and organizational measures',
          category: 'Data Security',
          riskLevel: 'critical',
          status: 'non-compliant',
          nextAssessment: '2024-11-20T00:00:00Z',
          owner: 'CISO',
          evidence: ['Security Policies', 'Encryption Standards']
        }
      ]
    },
    {
      id: '3',
      name: 'SOC 2 Type II',
      description: 'Service organization controls for security and availability',
      type: 'industry',
      status: 'active',
      version: '2024.1',
      effectiveDate: '2024-01-01T00:00:00Z',
      completionPercentage: 95,
      lastUpdated: '2024-11-14T08:20:00Z',
      updatedBy: 'Emily Rodriguez',
      applicableDepartments: ['IT', 'Security', 'Operations'],
      controls: [
        {
          id: 'soc2-cc6.1',
          name: 'Logical and Physical Access Controls',
          description: 'Implement controls to restrict logical and physical access',
          category: 'Access Controls',
          riskLevel: 'high',
          status: 'compliant',
          lastAssessment: '2024-11-10T00:00:00Z',
          nextAssessment: '2024-12-10T00:00:00Z',
          owner: 'IT Security Manager',
          evidence: ['Access Control Matrix', 'Physical Security Logs']
        }
      ]
    },
    {
      id: '4',
      name: 'ISO 27001',
      description: 'Information security management system standard',
      type: 'industry',
      status: 'draft',
      version: '2024.1',
      effectiveDate: '2025-01-01T00:00:00Z',
      completionPercentage: 45,
      lastUpdated: '2024-11-13T16:45:00Z',
      updatedBy: 'David Kim',
      applicableDepartments: ['IT', 'Security', 'All Departments'],
      controls: [
        {
          id: 'iso-a5.1.1',
          name: 'Information Security Policy',
          description: 'Establish and maintain information security policy',
          category: 'Policy Management',
          riskLevel: 'medium',
          status: 'not-assessed',
          nextAssessment: '2024-12-01T00:00:00Z',
          owner: 'CISO',
          evidence: []
        }
      ]
    }
  ],
  onFrameworkUpdate,
  onControlUpdate
}: ComplianceFrameworksProps) => {
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'controls' | 'assessments'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'draft': return 'bg-yellow-100 text-yellow-700';
      case 'archived': return 'bg-gray-100 text-gray-700';
      case 'compliant': return 'bg-green-100 text-green-700';
      case 'non-compliant': return 'bg-red-100 text-red-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'not-assessed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'regulatory': return 'ScaleIcon';
      case 'industry': return 'BuildingOfficeIcon';
      case 'internal': return 'CogIcon';
      default: return 'DocumentTextIcon';
    }
  };

  const filteredFrameworks = frameworks.filter(framework => {
    const matchesSearch = framework.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         framework.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || framework.type === filterType;
    const matchesStatus = filterStatus === 'all' || framework.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const selectedFrameworkData = frameworks.find(f => f.id === selectedFramework);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Compliance Frameworks</h3>
          <p className="text-sm text-muted-foreground">Manage regulatory requirements and compliance controls</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-150 flex items-center space-x-2">
          <Icon name="PlusIcon" size={16} />
          <span>Add Framework</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Framework List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search frameworks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Types</option>
              <option value="regulatory">Regulatory</option>
              <option value="industry">Industry</option>
              <option value="internal">Internal</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredFrameworks.map((framework) => (
              <div
                key={framework.id}
                className={`bg-card border border-border rounded-lg p-4 cursor-pointer transition-all duration-150 ${
                  selectedFramework === framework.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedFramework(framework.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Icon name={getTypeIcon(framework.type)} size={20} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="font-medium text-foreground">{framework.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(framework.status)}`}>
                          {framework.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{framework.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                        <span className="flex items-center space-x-1">
                          <Icon name="TagIcon" size={12} />
                          <span className="capitalize">{framework.type}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="DocumentTextIcon" size={12} />
                          <span>{framework.controls.length} controls</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="CalendarIcon" size={12} />
                          <span>v{framework.version}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${framework.completionPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-foreground">{framework.completionPercentage}%</span>
                      </div>
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

        {/* Framework Details */}
        <div className="bg-card border border-border rounded-lg p-6">
          {selectedFrameworkData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">Framework Details</h4>
                <button className="p-1 text-muted-foreground hover:text-foreground">
                  <Icon name="PencilIcon" size={16} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 bg-muted rounded-lg p-1">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'controls', label: 'Controls' },
                  { id: 'assessments', label: 'Assessments' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 px-2 py-1 text-xs rounded-md transition-colors duration-150 ${
                      activeTab === tab.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</label>
                    <p className="text-sm text-foreground capitalize">{selectedFrameworkData.type}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Version</label>
                    <p className="text-sm text-foreground">{selectedFrameworkData.version}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Effective Date</label>
                    <p className="text-sm text-foreground">{formatDate(selectedFrameworkData.effectiveDate)}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Updated</label>
                    <p className="text-sm text-foreground">{formatDate(selectedFrameworkData.lastUpdated)} by {selectedFrameworkData.updatedBy}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Applicable Departments</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedFrameworkData.applicableDepartments.map((dept, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'controls' && (
                <div className="space-y-3">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Controls ({selectedFrameworkData.controls.length})</div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedFrameworkData.controls.map((control) => (
                      <div key={control.id} className="p-3 bg-muted rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-foreground">{control.name}</span>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(control.status)}`}>
                                {control.status}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{control.description}</p>
                          </div>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getRiskLevelColor(control.riskLevel)}`}>
                            {control.riskLevel}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Owner: {control.owner}</span>
                          <span>Next: {formatDate(control.nextAssessment)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'assessments' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-semibold text-foreground">{selectedFrameworkData.completionPercentage}%</div>
                      <div className="text-xs text-muted-foreground">Completion</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-semibold text-foreground">{selectedFrameworkData.controls.filter(c => c.status === 'compliant').length}</div>
                      <div className="text-xs text-muted-foreground">Compliant</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Compliance Status</span>
                    </div>
                    <div className="space-y-1">
                      {['compliant', 'in-progress', 'non-compliant', 'not-assessed'].map((status) => {
                        const count = selectedFrameworkData.controls.filter(c => c.status === status).length;
                        const percentage = (count / selectedFrameworkData.controls.length) * 100;
                        return (
                          <div key={status} className="flex items-center justify-between text-xs">
                            <span className="capitalize text-muted-foreground">{status.replace('-', ' ')}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-muted rounded-full h-1">
                                <div 
                                  className={`h-1 rounded-full ${
                                    status === 'compliant' ? 'bg-green-600' :
                                    status === 'in-progress' ? 'bg-blue-600' :
                                    status === 'non-compliant' ? 'bg-red-600' : 'bg-gray-400'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-foreground font-medium">{count}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="DocumentTextIcon" size={32} className="mx-auto mb-2 opacity-50" />
              <p>Select a framework to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Framework Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="DocumentTextIcon" size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">{frameworks.length}</div>
              <div className="text-sm text-muted-foreground">Total Frameworks</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircleIcon" size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">{frameworks.filter(f => f.status === 'active').length}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Icon name="ShieldCheckIcon" size={20} className="text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">{frameworks.reduce((sum, f) => sum + f.controls.length, 0)}</div>
              <div className="text-sm text-muted-foreground">Total Controls</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Icon name="ChartBarIcon" size={20} className="text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">
                {Math.round(frameworks.reduce((sum, f) => sum + f.completionPercentage, 0) / frameworks.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Completion</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceFrameworks;