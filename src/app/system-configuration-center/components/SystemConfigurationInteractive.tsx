'use client';

import React, { useState, useEffect } from 'react';
import UserRolesPermissions from './UserRolesPermissions';
import WorkflowAutomation from './WorkflowAutomation';
import IntegrationSettings from './IntegrationSettings';
import NotificationRules from './NotificationRules';
import ComplianceFrameworks from './ComplianceFrameworks';
import Icon from '@/components/ui/AppIcon';

interface SystemConfigurationInteractiveProps {
  className?: string;
}

const SystemConfigurationInteractive = ({
  className = ''
}: SystemConfigurationInteractiveProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState('roles');
  const [searchTerm, setSearchTerm] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
        <div className="h-96 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'roles',
      label: 'User Roles & Permissions',
      icon: 'UserGroupIcon',
      description: 'Manage user roles and permission assignments'
    },
    {
      id: 'workflows',
      label: 'Workflow Automation',
      icon: 'CogIcon',
      description: 'Design and configure automated workflows'
    },
    {
      id: 'integrations',
      label: 'Integration Settings',
      icon: 'LinkIcon',
      description: 'Manage API connections and data sync'
    },
    {
      id: 'notifications',
      label: 'Notification Rules',
      icon: 'BellIcon',
      description: 'Configure alert rules and templates'
    },
    {
      id: 'frameworks',
      label: 'Compliance Frameworks',
      icon: 'DocumentTextIcon',
      description: 'Manage regulatory requirements'
    }
  ];

  const handleTabChange = (tabId: string) => {
    if (hasUnsavedChanges) {
      const confirmChange = window.confirm('You have unsaved changes. Are you sure you want to switch tabs?');
      if (!confirmChange) return;
      setHasUnsavedChanges(false);
    }
    setActiveTab(tabId);
  };

  const handleSaveChanges = () => {
    // Simulate save operation
    setHasUnsavedChanges(false);
    // Show success notification
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'roles':
        return <UserRolesPermissions />;
      case 'workflows':
        return <WorkflowAutomation />;
      case 'integrations':
        return <IntegrationSettings />;
      case 'notifications':
        return <NotificationRules />;
      case 'frameworks':
        return <ComplianceFrameworks />;
      default:
        return <UserRolesPermissions />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">System Configuration Center</h1>
          <p className="text-muted-foreground">Manage system-wide compliance settings and configurations</p>
        </div>
        <div className="flex items-center space-x-3">
          {hasUnsavedChanges && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Icon name="ExclamationTriangleIcon" size={16} className="text-yellow-600" />
              <span className="text-sm text-yellow-700">Unsaved changes</span>
              <button
                onClick={handleSaveChanges}
                className="text-sm text-yellow-800 hover:text-yellow-900 font-medium"
              >
                Save
              </button>
            </div>
          )}
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-150 flex items-center space-x-2">
            <Icon name="ArrowDownTrayIcon" size={16} />
            <span>Export Config</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-150 ${
                activeTab === tab.id
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Description */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <Icon name="InformationCircleIcon" size={20} className="text-primary" />
          <p className="text-sm text-muted-foreground">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {renderTabContent()}
      </div>

      {/* System Status Footer */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-foreground">System Status: Operational</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Last backup: {new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
              View System Logs
            </button>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
              Performance Metrics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemConfigurationInteractive;