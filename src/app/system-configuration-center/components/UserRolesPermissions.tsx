'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Role {
  id: string;
  name: string;
  description: string;
  level: number;
  userCount: number;
  permissions: string[];
  parentRole?: string;
  isActive: boolean;
  lastModified: string;
}

interface Permission {
  id: string;
  name: string;
  category: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface UserRolesPermissionsProps {
  roles?: Role[];
  permissions?: Permission[];
  onRoleUpdate?: (roleId: string, updates: Partial<Role>) => void;
  onPermissionToggle?: (roleId: string, permissionId: string) => void;
}

const UserRolesPermissions = ({
  roles = [
    {
      id: '1',
      name: 'System Administrator',
      description: 'Full system access and configuration control',
      level: 1,
      userCount: 3,
      permissions: ['system_config', 'user_management', 'audit_logs', 'data_export'],
      isActive: true,
      lastModified: '2024-11-10T14:30:00Z'
    },
    {
      id: '2',
      name: 'Compliance Manager',
      description: 'Manage compliance workflows and frameworks',
      level: 2,
      userCount: 8,
      permissions: ['workflow_config', 'framework_setup', 'notification_rules'],
      parentRole: '1',
      isActive: true,
      lastModified: '2024-11-12T09:15:00Z'
    },
    {
      id: '3',
      name: 'Risk Analyst',
      description: 'Risk assessment and monitoring capabilities',
      level: 3,
      userCount: 15,
      permissions: ['risk_monitoring', 'incident_reporting', 'analytics_view'],
      parentRole: '2',
      isActive: true,
      lastModified: '2024-11-13T16:45:00Z'
    },
    {
      id: '4',
      name: 'Department Head',
      description: 'Department-specific compliance oversight',
      level: 3,
      userCount: 12,
      permissions: ['notification_preferences', 'team_reports', 'task_assignment'],
      parentRole: '2',
      isActive: true,
      lastModified: '2024-11-14T08:20:00Z'
    },
    {
      id: '5',
      name: 'Auditor',
      description: 'Audit execution and evidence collection',
      level: 4,
      userCount: 6,
      permissions: ['audit_execution', 'evidence_collection', 'report_generation'],
      parentRole: '3',
      isActive: true,
      lastModified: '2024-11-11T11:30:00Z'
    }
  ],
  permissions = [
    { id: 'system_config', name: 'System Configuration', category: 'Administration', description: 'Modify system-wide settings', riskLevel: 'critical' },
    { id: 'user_management', name: 'User Management', category: 'Administration', description: 'Create and manage user accounts', riskLevel: 'high' },
    { id: 'audit_logs', name: 'Audit Log Access', category: 'Administration', description: 'View system audit trails', riskLevel: 'medium' },
    { id: 'data_export', name: 'Data Export', category: 'Administration', description: 'Export compliance data', riskLevel: 'high' },
    { id: 'workflow_config', name: 'Workflow Configuration', category: 'Compliance', description: 'Design compliance workflows', riskLevel: 'medium' },
    { id: 'framework_setup', name: 'Framework Setup', category: 'Compliance', description: 'Configure compliance frameworks', riskLevel: 'medium' },
    { id: 'notification_rules', name: 'Notification Rules', category: 'Compliance', description: 'Manage alert configurations', riskLevel: 'low' },
    { id: 'risk_monitoring', name: 'Risk Monitoring', category: 'Risk Management', description: 'Monitor and assess risks', riskLevel: 'medium' },
    { id: 'incident_reporting', name: 'Incident Reporting', category: 'Risk Management', description: 'Report compliance incidents', riskLevel: 'medium' },
    { id: 'analytics_view', name: 'Analytics Access', category: 'Reporting', description: 'View compliance analytics', riskLevel: 'low' },
    { id: 'notification_preferences', name: 'Notification Preferences', category: 'Personal', description: 'Manage personal notifications', riskLevel: 'low' },
    { id: 'team_reports', name: 'Team Reports', category: 'Reporting', description: 'Generate team compliance reports', riskLevel: 'low' },
    { id: 'task_assignment', name: 'Task Assignment', category: 'Workflow', description: 'Assign compliance tasks', riskLevel: 'medium' },
    { id: 'audit_execution', name: 'Audit Execution', category: 'Audit', description: 'Execute audit procedures', riskLevel: 'medium' },
    { id: 'evidence_collection', name: 'Evidence Collection', category: 'Audit', description: 'Collect audit evidence', riskLevel: 'medium' },
    { id: 'report_generation', name: 'Report Generation', category: 'Reporting', description: 'Generate audit reports', riskLevel: 'low' }
  ],
  onRoleUpdate,
  onPermissionToggle
}: UserRolesPermissionsProps) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPermissionsByCategory = () => {
    const categories = permissions.reduce((acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
    return categories;
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleEdit = (roleId: string, field: string, value: any) => {
    onRoleUpdate?.(roleId, { [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Role Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="UserGroupIcon" size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">{roles.length}</div>
              <div className="text-sm text-muted-foreground">Total Roles</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircleIcon" size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">{roles.filter(r => r.isActive).length}</div>
              <div className="text-sm text-muted-foreground">Active Roles</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Icon name="KeyIcon" size={20} className="text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">{permissions.length}</div>
              <div className="text-sm text-muted-foreground">Permissions</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Icon name="UsersIcon" size={20} className="text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">{roles.reduce((sum, role) => sum + role.userCount, 0)}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">User Roles & Permissions</h3>
          <p className="text-sm text-muted-foreground">Manage organizational role hierarchy and permission assignments</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-150 flex items-center space-x-2">
          <Icon name="PlusIcon" size={16} />
          <span>Create Role</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Hierarchy */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">Role Hierarchy</h4>
            <div className="relative">
              <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-2">
            {filteredRoles.map((role) => (
              <div
                key={role.id}
                className={`p-3 border border-border rounded-lg cursor-pointer transition-all duration-150 ${
                  selectedRole === role.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-8 rounded-full bg-primary opacity-${100 - (role.level - 1) * 20}`}></div>
                    <div>
                      <div className="font-medium text-foreground text-sm">{role.name}</div>
                      <div className="text-xs text-muted-foreground">{role.userCount} users</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${role.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {role.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingRole(role.id);
                      }}
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      <Icon name="PencilIcon" size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-5">{role.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Permission Matrix */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">Permission Matrix</h4>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Categories</option>
              <option value="Administration">Administration</option>
              <option value="Compliance">Compliance</option>
              <option value="Risk Management">Risk Management</option>
              <option value="Reporting">Reporting</option>
              <option value="Audit">Audit</option>
            </select>
          </div>

          {selectedRole ? (
            <div className="space-y-4">
              {Object.entries(getPermissionsByCategory()).map(([category, categoryPermissions]) => {
                if (filterCategory !== 'all' && category !== filterCategory) return null;
                
                return (
                  <div key={category} className="space-y-2">
                    <h5 className="text-sm font-medium text-foreground border-b border-border pb-1">{category}</h5>
                    {categoryPermissions.map((permission) => {
                      const selectedRoleData = roles.find(r => r.id === selectedRole);
                      const hasPermission = selectedRoleData?.permissions.includes(permission.id);
                      
                      return (
                        <div key={permission.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-foreground">{permission.name}</span>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${getRiskLevelColor(permission.riskLevel)}`}>
                                {permission.riskLevel}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                          </div>
                          <button
                            onClick={() => onPermissionToggle?.(selectedRole, permission.id)}
                            className={`w-10 h-6 rounded-full transition-colors duration-150 ${
                              hasPermission ? 'bg-primary' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-150 ${
                              hasPermission ? 'translate-x-5' : 'translate-x-1'
                            }`}></div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="UserGroupIcon" size={32} className="mx-auto mb-2 opacity-50" />
              <p>Select a role to view permissions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRolesPermissions;