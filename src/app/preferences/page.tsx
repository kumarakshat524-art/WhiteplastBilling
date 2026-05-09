'use client';

import React, { useState } from 'react';
import { Header, Sidebar } from '../../components/common';
import Icon from '@/components/ui/AppIcon';

interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  policyUpdates: boolean;
  riskAlerts: boolean;
  taskReminders: boolean;
  auditNotifications: boolean;
  weeklyReports: boolean;
}

interface DisplayPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
  compactView: boolean;
}

interface WorkflowPreferences {
  defaultDashboard: string;
  autoSave: boolean;
  autoSaveInterval: number;
  confirmActions: boolean;
  showTooltips: boolean;
}

const PreferencesPage = () => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'display' | 'workflow' | 'privacy'>('notifications');
  const [hasChanges, setHasChanges] = useState(false);

  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    policyUpdates: true,
    riskAlerts: true,
    taskReminders: true,
    auditNotifications: true,
    weeklyReports: false
  });

  const [displayPrefs, setDisplayPrefs] = useState<DisplayPreferences>({
    theme: 'light',
    language: 'en-US',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: 'US',
    compactView: false
  });

  const [workflowPrefs, setWorkflowPrefs] = useState<WorkflowPreferences>({
    defaultDashboard: 'compliance-dashboard-overview',
    autoSave: true,
    autoSaveInterval: 5,
    confirmActions: true,
    showTooltips: true
  });

  const handleNotificationChange = (key: keyof NotificationPreferences, value: boolean) => {
    setNotificationPrefs(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleDisplayChange = (key: keyof DisplayPreferences, value: string | boolean) => {
    setDisplayPrefs(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleWorkflowChange = (key: keyof WorkflowPreferences, value: string | boolean | number) => {
    setWorkflowPrefs(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSavePreferences = () => {
    // Save preferences logic here
    setHasChanges(false);
    console.log('Saving preferences:', { notificationPrefs, displayPrefs, workflowPrefs });
  };

  const handleResetDefaults = () => {
    // Reset to defaults logic here
    setHasChanges(true);
  };

  const dashboardOptions = [
    { value: 'compliance-dashboard-overview', label: 'Compliance Dashboard' },
    { value: 'risk-monitoring-dashboard', label: 'Risk Monitoring' },
    { value: 'audit-timeline-management', label: 'Audit Timeline' },
    { value: 'compliance-tasks-management', label: 'Tasks Management' },
    { value: 'policy-management-center', label: 'Policy Center' }
  ];

  const languageOptions = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es-ES', label: 'Español' },
    { value: 'fr-FR', label: 'Français' },
    { value: 'de-DE', label: 'Deutsch' }
  ];

  const timezoneOptions = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'GMT' },
    { value: 'Europe/Paris', label: 'Central European Time' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16">
          <div className="p-8">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">Preferences</h1>
                  <p className="text-muted-foreground">
                    Customize your ComplianceHub experience
                  </p>
                </div>
                {hasChanges && (
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleResetDefaults}
                      className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      Reset to Defaults
                    </button>
                    <button
                      onClick={handleSavePreferences}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <Icon name="CheckIcon" size={16} />
                      <span>Save Changes</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Preferences Card */}
            <div className="bg-card rounded-xl border border-border shadow-soft">
              {/* Tab Navigation */}
              <div className="px-6 py-4 border-b border-border">
                <nav className="flex space-x-6">
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                      activeTab === 'notifications'
                        ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    <Icon name="BellIcon" size={16} />
                    <span>Notifications</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('display')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                      activeTab === 'display' ?'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    <Icon name="ComputerDesktopIcon" size={16} />
                    <span>Display</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('workflow')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                      activeTab === 'workflow' ?'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    <Icon name="Cog6ToothIcon" size={16} />
                    <span>Workflow</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('privacy')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                      activeTab === 'privacy' ?'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    <Icon name="ShieldCheckIcon" size={16} />
                    <span>Privacy</span>
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'notifications' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Notification Channels</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Icon name="EnvelopeIcon" size={20} className="text-muted-foreground" />
                              <span className="font-medium text-foreground">Email</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notificationPrefs.emailNotifications}
                                onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                          </div>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>

                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Icon name="DevicePhoneMobileIcon" size={20} className="text-muted-foreground" />
                              <span className="font-medium text-foreground">Push</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notificationPrefs.pushNotifications}
                                onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                          </div>
                          <p className="text-sm text-muted-foreground">Browser push notifications</p>
                        </div>

                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Icon name="ChatBubbleLeftRightIcon" size={20} className="text-muted-foreground" />
                              <span className="font-medium text-foreground">SMS</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notificationPrefs.smsNotifications}
                                onChange={(e) => handleNotificationChange('smsNotifications', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                          </div>
                          <p className="text-sm text-muted-foreground">Critical alerts via SMS</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Notification Types</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'policyUpdates' as const, label: 'Policy Updates', description: 'When policies are created, updated, or require review' },
                          { key: 'riskAlerts' as const, label: 'Risk Alerts', description: 'High-priority risk notifications and threshold breaches' },
                          { key: 'taskReminders' as const, label: 'Task Reminders', description: 'Upcoming deadlines and overdue tasks' },
                          { key: 'auditNotifications' as const, label: 'Audit Notifications', description: 'Audit milestones and completion updates' },
                          { key: 'weeklyReports' as const, label: 'Weekly Reports', description: 'Weekly compliance summary reports' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                            <div>
                              <div className="font-medium text-foreground">{item.label}</div>
                              <div className="text-sm text-muted-foreground">{item.description}</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notificationPrefs[item.key]}
                                onChange={(e) => handleNotificationChange(item.key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'display' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Theme</label>
                        <select
                          value={displayPrefs.theme}
                          onChange={(e) => handleDisplayChange('theme', e.target.value as 'light' | 'dark' | 'system')}
                          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 bg-input"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="system">System</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Language</label>
                        <select
                          value={displayPrefs.language}
                          onChange={(e) => handleDisplayChange('language', e.target.value)}
                          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 bg-input"
                        >
                          {languageOptions.map(lang => (
                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
                        <select
                          value={displayPrefs.timezone}
                          onChange={(e) => handleDisplayChange('timezone', e.target.value)}
                          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 bg-input"
                        >
                          {timezoneOptions.map(tz => (
                            <option key={tz.value} value={tz.value}>{tz.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Date Format</label>
                        <select
                          value={displayPrefs.dateFormat}
                          onChange={(e) => handleDisplayChange('dateFormat', e.target.value)}
                          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 bg-input"
                        >
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <div className="font-medium text-foreground">Compact View</div>
                        <div className="text-sm text-muted-foreground">Use more compact spacing in tables and lists</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={displayPrefs.compactView}
                          onChange={(e) => handleDisplayChange('compactView', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                )}

                {activeTab === 'workflow' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Default Dashboard</label>
                        <select
                          value={workflowPrefs.defaultDashboard}
                          onChange={(e) => handleWorkflowChange('defaultDashboard', e.target.value)}
                          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 bg-input"
                        >
                          {dashboardOptions.map(dashboard => (
                            <option key={dashboard.value} value={dashboard.value}>{dashboard.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Auto-save Interval (minutes)</label>
                        <select
                          value={workflowPrefs.autoSaveInterval}
                          onChange={(e) => handleWorkflowChange('autoSaveInterval', parseInt(e.target.value))}
                          disabled={!workflowPrefs.autoSave}
                          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 bg-input disabled:opacity-50"
                        >
                          <option value={1}>1 minute</option>
                          <option value={5}>5 minutes</option>
                          <option value={10}>10 minutes</option>
                          <option value={15}>15 minutes</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { key: 'autoSave' as const, label: 'Auto-save', description: 'Automatically save changes while working' },
                        { key: 'confirmActions' as const, label: 'Confirm Actions', description: 'Show confirmation dialogs for important actions' },
                        { key: 'showTooltips' as const, label: 'Show Tooltips', description: 'Display helpful tooltips throughout the interface' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                          <div>
                            <div className="font-medium text-foreground">{item.label}</div>
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={workflowPrefs[item.key] as boolean}
                              onChange={(e) => handleWorkflowChange(item.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="space-y-8">
                    <div className="p-6 bg-muted/30 rounded-lg">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Data Collection & Usage</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Icon name="InformationCircleIcon" size={20} className="text-primary mt-0.5" />
                          <div>
                            <p className="text-foreground font-medium">Analytics & Performance</p>
                            <p className="text-sm text-muted-foreground">
                              We collect usage analytics to improve the platform performance and user experience.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Icon name="ShieldCheckIcon" size={20} className="text-green-600 mt-0.5" />
                          <div>
                            <p className="text-foreground font-medium">Data Security</p>
                            <p className="text-sm text-muted-foreground">
                              All data is encrypted in transit and at rest. We follow industry-standard security practices.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Icon name="EyeSlashIcon" size={20} className="text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-foreground font-medium">Privacy Controls</p>
                            <p className="text-sm text-muted-foreground">
                              You have full control over your privacy settings and can request data deletion at any time.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-muted/30 rounded-lg">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Data Export & Deletion</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center space-x-2">
                          <Icon name="ArrowDownTrayIcon" size={16} />
                          <span>Export My Data</span>
                        </button>
                        <button className="px-4 py-3 border border-error text-error hover:bg-error/10 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                          <Icon name="TrashIcon" size={16} />
                          <span>Delete Account</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PreferencesPage;