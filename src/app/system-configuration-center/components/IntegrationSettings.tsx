'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Integration {
  id: string;
  name: string;
  type: 'ERP' | 'CRM' | 'Document Management' | 'Identity Provider' | 'Monitoring';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync: string;
  syncFrequency: string;
  dataTypes: string[];
  errorCount: number;
  recordsProcessed: number;
  apiEndpoint: string;
  version: string;
}

interface ApiLog {
  id: string;
  integrationId: string;
  timestamp: string;
  method: string;
  endpoint: string;
  status: number;
  responseTime: number;
  errorMessage?: string;
}

interface IntegrationSettingsProps {
  integrations?: Integration[];
  apiLogs?: ApiLog[];
  onIntegrationToggle?: (integrationId: string) => void;
  onIntegrationTest?: (integrationId: string) => void;
  onIntegrationSync?: (integrationId: string) => void;
}

const IntegrationSettings = ({
  integrations = [
    {
      id: '1',
      name: 'SAP ERP System',
      type: 'ERP',
      status: 'connected',
      lastSync: '2024-11-14T09:45:00Z',
      syncFrequency: 'Every 4 hours',
      dataTypes: ['Financial Data', 'Employee Records', 'Vendor Information'],
      errorCount: 0,
      recordsProcessed: 15420,
      apiEndpoint: 'https://sap.company.com/api/v2',
      version: '2.1.3'
    },
    {
      id: '2',
      name: 'Salesforce CRM',
      type: 'CRM',
      status: 'connected',
      lastSync: '2024-11-14T10:00:00Z',
      syncFrequency: 'Real-time',
      dataTypes: ['Customer Data', 'Contract Information', 'Risk Assessments'],
      errorCount: 2,
      recordsProcessed: 8930,
      apiEndpoint: 'https://company.salesforce.com/services/data/v58.0',
      version: '58.0'
    },
    {
      id: '3',
      name: 'SharePoint Document Center',
      type: 'Document Management',
      status: 'syncing',
      lastSync: '2024-11-14T09:30:00Z',
      syncFrequency: 'Every 2 hours',
      dataTypes: ['Policy Documents', 'Audit Evidence', 'Compliance Reports'],
      errorCount: 1,
      recordsProcessed: 2340,
      apiEndpoint: 'https://company.sharepoint.com/_api/web',
      version: 'Online'
    },
    {
      id: '4',
      name: 'Active Directory',
      type: 'Identity Provider',
      status: 'connected',
      lastSync: '2024-11-14T10:05:00Z',
      syncFrequency: 'Every 15 minutes',
      dataTypes: ['User Accounts', 'Group Memberships', 'Access Permissions'],
      errorCount: 0,
      recordsProcessed: 1250,
      apiEndpoint: 'ldaps://ad.company.com:636',
      version: '2019'
    },
    {
      id: '5',
      name: 'Splunk SIEM',
      type: 'Monitoring',
      status: 'error',
      lastSync: '2024-11-14T08:15:00Z',
      syncFrequency: 'Every 5 minutes',
      dataTypes: ['Security Events', 'Audit Logs', 'Incident Data'],
      errorCount: 15,
      recordsProcessed: 45600,
      apiEndpoint: 'https://splunk.company.com:8089/services/rest',
      version: '9.1.2'
    }
  ],
  apiLogs = [
    {
      id: '1',
      integrationId: '1',
      timestamp: '2024-11-14T10:05:23Z',
      method: 'GET',
      endpoint: '/financial/transactions',
      status: 200,
      responseTime: 245
    },
    {
      id: '2',
      integrationId: '2',
      timestamp: '2024-11-14T10:04:15Z',
      method: 'POST',
      endpoint: '/sobjects/Account',
      status: 201,
      responseTime: 180
    },
    {
      id: '3',
      integrationId: '5',
      timestamp: '2024-11-14T10:03:45Z',
      method: 'GET',
      endpoint: '/search/jobs',
      status: 500,
      responseTime: 5000,
      errorMessage: 'Connection timeout'
    },
    {
      id: '4',
      integrationId: '3',
      timestamp: '2024-11-14T10:02:30Z',
      method: 'GET',
      endpoint: '/lists/documents',
      status: 200,
      responseTime: 320
    },
    {
      id: '5',
      integrationId: '4',
      timestamp: '2024-11-14T10:01:12Z',
      method: 'GET',
      endpoint: '/users',
      status: 200,
      responseTime: 95
    }
  ],
  onIntegrationToggle,
  onIntegrationTest,
  onIntegrationSync
}: IntegrationSettingsProps) => {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'performance'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-700';
      case 'disconnected': return 'bg-gray-100 text-gray-700';
      case 'error': return 'bg-red-100 text-red-700';
      case 'syncing': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return 'CheckCircleIcon';
      case 'disconnected': return 'XCircleIcon';
      case 'error': return 'ExclamationTriangleIcon';
      case 'syncing': return 'ArrowPathIcon';
      default: return 'QuestionMarkCircleIcon';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ERP': return 'BuildingOfficeIcon';
      case 'CRM': return 'UsersIcon';
      case 'Document Management': return 'DocumentTextIcon';
      case 'Identity Provider': return 'KeyIcon';
      case 'Monitoring': return 'EyeIcon';
      default: return 'CogIcon';
    }
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || integration.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const selectedIntegrationData = integrations.find(i => i.id === selectedIntegration);
  const integrationLogs = apiLogs.filter(log => log.integrationId === selectedIntegration);

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
          <h3 className="text-lg font-semibold text-foreground">Integration Settings</h3>
          <p className="text-sm text-muted-foreground">Manage API connections and data synchronization</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-150 flex items-center space-x-2">
          <Icon name="PlusIcon" size={16} />
          <span>Add Integration</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Integration List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search integrations..."
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
              <option value="connected">Connected</option>
              <option value="disconnected">Disconnected</option>
              <option value="error">Error</option>
              <option value="syncing">Syncing</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredIntegrations.map((integration) => (
              <div
                key={integration.id}
                className={`bg-card border border-border rounded-lg p-4 cursor-pointer transition-all duration-150 ${
                  selectedIntegration === integration.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedIntegration(integration.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Icon name={getTypeIcon(integration.type)} size={20} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="font-medium text-foreground">{integration.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(integration.status)}`}>
                          {integration.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{integration.type}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Last sync: {formatTimeAgo(integration.lastSync)}</span>
                        <span>{integration.recordsProcessed.toLocaleString()} records</span>
                        {integration.errorCount > 0 && (
                          <span className="text-red-600">{integration.errorCount} errors</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onIntegrationSync?.(integration.id);
                      }}
                      className="p-1 text-muted-foreground hover:text-foreground"
                      title="Sync Now"
                    >
                      <Icon name="ArrowPathIcon" size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onIntegrationTest?.(integration.id);
                      }}
                      className="p-1 text-muted-foreground hover:text-foreground"
                      title="Test Connection"
                    >
                      <Icon name="WifiIcon" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Details */}
        <div className="bg-card border border-border rounded-lg p-6">
          {selectedIntegrationData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">Integration Details</h4>
                <button className="p-1 text-muted-foreground hover:text-foreground">
                  <Icon name="Cog6ToothIcon" size={16} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 bg-muted rounded-lg p-1">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'logs', label: 'Logs' },
                  { id: 'performance', label: 'Performance' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 px-3 py-1 text-sm rounded-md transition-colors duration-150 ${
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
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Icon name={getStatusIcon(selectedIntegrationData.status)} size={16} className={selectedIntegrationData.status === 'connected' ? 'text-green-600' : selectedIntegrationData.status === 'error' ? 'text-red-600' : 'text-muted-foreground'} />
                      <span className="text-sm text-foreground capitalize">{selectedIntegrationData.status}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">API Endpoint</label>
                    <p className="text-sm text-foreground font-mono break-all">{selectedIntegrationData.apiEndpoint}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Version</label>
                    <p className="text-sm text-foreground">{selectedIntegrationData.version}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sync Frequency</label>
                    <p className="text-sm text-foreground">{selectedIntegrationData.syncFrequency}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Data Types</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedIntegrationData.dataTypes.map((type, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'logs' && (
                <div className="space-y-3">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Recent API Calls</div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {integrationLogs.map((log) => (
                      <div key={log.id} className="p-2 bg-muted rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-medium ${log.status >= 200 && log.status < 300 ? 'text-green-600' : 'text-red-600'}`}>
                            {log.method} {log.status}
                          </span>
                          <span className="text-xs text-muted-foreground">{formatTimeAgo(log.timestamp)}</span>
                        </div>
                        <p className="text-xs text-foreground font-mono">{log.endpoint}</p>
                        <p className="text-xs text-muted-foreground">{log.responseTime}ms</p>
                        {log.errorMessage && (
                          <p className="text-xs text-red-600 mt-1">{log.errorMessage}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'performance' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-semibold text-foreground">{selectedIntegrationData.recordsProcessed.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Records Processed</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-semibold text-foreground">{selectedIntegrationData.errorCount}</div>
                      <div className="text-xs text-muted-foreground">Errors</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span className="text-foreground">
                        {((selectedIntegrationData.recordsProcessed - selectedIntegrationData.errorCount) / selectedIntegrationData.recordsProcessed * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${((selectedIntegrationData.recordsProcessed - selectedIntegrationData.errorCount) / selectedIntegrationData.recordsProcessed * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="LinkIcon" size={32} className="mx-auto mb-2 opacity-50" />
              <p>Select an integration to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Integration Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="LinkIcon" size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">{integrations.length}</div>
              <div className="text-sm text-muted-foreground">Total Integrations</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircleIcon" size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">{integrations.filter(i => i.status === 'connected').length}</div>
              <div className="text-sm text-muted-foreground">Connected</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Icon name="ExclamationTriangleIcon" size={20} className="text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">{integrations.filter(i => i.status === 'error').length}</div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Icon name="ChartBarIcon" size={20} className="text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">{integrations.reduce((sum, i) => sum + i.recordsProcessed, 0).toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Records Synced</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSettings;