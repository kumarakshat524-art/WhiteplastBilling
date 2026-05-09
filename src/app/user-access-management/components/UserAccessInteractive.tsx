'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import Breadcrumb from '@/components/common/Breadcrumb';
import AccessMetrics from './AccessMetrics';
import SearchAndFilters from './SearchAndFilters';
import UserDirectory from './UserDirectory';
import UserPermissionsPanel from './UserPermissionsPanel';
import BulkActions from './BulkActions';

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  manager: string;
  lastLogin: Date;
  accessLevel: 'Basic' | 'Standard' | 'Elevated' | 'Admin';
  reviewStatus: 'Current' | 'Pending' | 'Overdue';
  avatar?: string;
  status: 'Active' | 'Inactive' | 'Suspended';
}

interface Permission {
  id: string;
  system: string;
  role: string;
  permissions: string[];
  grantedDate: Date;
  grantedBy: string;
  expiryDate?: Date;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

interface AccessHistory {
  id: string;
  action: string;
  timestamp: Date;
  performedBy: string;
  details: string;
  type: 'Grant' | 'Revoke' | 'Modify' | 'Review';
}

const UserAccessInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [accessLevelFilter, setAccessLevelFilter] = useState('');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Mock data
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@compliancehub.com',
      department: 'Compliance',
      role: 'Compliance Officer',
      manager: 'Michael Chen',
      lastLogin: new Date('2024-11-14T08:30:00'),
      accessLevel: 'Admin',
      reviewStatus: 'Current',
      status: 'Active'
    },
    {
      id: '2',
      name: 'David Rodriguez',
      email: 'david.rodriguez@compliancehub.com',
      department: 'Risk Management',
      role: 'Risk Manager',
      manager: 'Sarah Johnson',
      lastLogin: new Date('2024-11-14T07:15:00'),
      accessLevel: 'Elevated',
      reviewStatus: 'Pending',
      status: 'Active'
    },
    {
      id: '3',
      name: 'Emily Chen',
      email: 'emily.chen@compliancehub.com',
      department: 'Internal Audit',
      role: 'Internal Auditor',
      manager: 'Robert Kim',
      lastLogin: new Date('2024-11-13T16:45:00'),
      accessLevel: 'Standard',
      reviewStatus: 'Current',
      status: 'Active'
    },
    {
      id: '4',
      name: 'Michael Thompson',
      email: 'michael.thompson@compliancehub.com',
      department: 'Legal',
      role: 'Legal Counsel',
      manager: 'Jennifer Walsh',
      lastLogin: new Date('2024-11-12T14:20:00'),
      accessLevel: 'Standard',
      reviewStatus: 'Overdue',
      status: 'Active'
    },
    {
      id: '5',
      name: 'Lisa Wang',
      email: 'lisa.wang@compliancehub.com',
      department: 'IT Security',
      role: 'Security Analyst',
      manager: 'James Park',
      lastLogin: new Date('2024-11-14T09:10:00'),
      accessLevel: 'Elevated',
      reviewStatus: 'Current',
      status: 'Active'
    },
    {
      id: '6',
      name: 'Robert Kim',
      email: 'robert.kim@compliancehub.com',
      department: 'Internal Audit',
      role: 'Audit Manager',
      manager: 'Sarah Johnson',
      lastLogin: new Date('2024-11-14T06:30:00'),
      accessLevel: 'Admin',
      reviewStatus: 'Current',
      status: 'Active'
    },
    {
      id: '7',
      name: 'Jennifer Walsh',
      email: 'jennifer.walsh@compliancehub.com',
      department: 'Legal',
      role: 'Chief Legal Officer',
      manager: 'CEO',
      lastLogin: new Date('2024-11-13T17:00:00'),
      accessLevel: 'Admin',
      reviewStatus: 'Current',
      status: 'Active'
    },
    {
      id: '8',
      name: 'James Park',
      email: 'james.park@compliancehub.com',
      department: 'IT Security',
      role: 'CISO',
      manager: 'CTO',
      lastLogin: new Date('2024-11-14T08:00:00'),
      accessLevel: 'Admin',
      reviewStatus: 'Current',
      status: 'Active'
    }
  ];

  const mockPermissions: Permission[] = [
    {
      id: 'p1',
      system: 'ComplianceHub Core',
      role: 'Compliance Administrator',
      permissions: ['Read All', 'Write All', 'Delete Records', 'Manage Users', 'Generate Reports'],
      grantedDate: new Date('2024-01-15T10:00:00'),
      grantedBy: 'System Administrator',
      riskLevel: 'High'
    },
    {
      id: 'p2',
      system: 'Risk Management System',
      role: 'Risk Analyst',
      permissions: ['Read Risk Data', 'Create Assessments', 'Update Risk Scores'],
      grantedDate: new Date('2024-02-01T14:30:00'),
      grantedBy: 'Risk Manager',
      expiryDate: new Date('2024-12-31T23:59:59'),
      riskLevel: 'Medium'
    },
    {
      id: 'p3',
      system: 'Document Management',
      role: 'Document Reviewer',
      permissions: ['Read Documents', 'Add Comments', 'Approve Policies'],
      grantedDate: new Date('2024-03-10T09:15:00'),
      grantedBy: 'Document Administrator',
      expiryDate: new Date('2024-11-30T23:59:59'),
      riskLevel: 'Low'
    }
  ];

  const mockAccessHistory: AccessHistory[] = [
    {
      id: 'h1',
      action: 'Access Level Modified',
      timestamp: new Date('2024-11-10T15:30:00'),
      performedBy: 'Sarah Johnson',
      details: 'Access level changed from Standard to Admin',
      type: 'Modify'
    },
    {
      id: 'h2',
      action: 'Permission Granted',
      timestamp: new Date('2024-11-05T11:20:00'),
      performedBy: 'System Administrator',
      details: 'ComplianceHub Core access granted',
      type: 'Grant'
    },
    {
      id: 'h3',
      action: 'Access Review Completed',
      timestamp: new Date('2024-10-15T14:45:00'),
      performedBy: 'Michael Chen',
      details: 'Quarterly access review approved',
      type: 'Review'
    },
    {
      id: 'h4',
      action: 'Permission Revoked',
      timestamp: new Date('2024-09-20T16:10:00'),
      performedBy: 'Security Team',
      details: 'Temporary elevated access removed',
      type: 'Revoke'
    }
  ];

  const mockMetrics = [
    {
      title: 'Total Users',
      value: 1247,
      change: 5.2,
      icon: 'UsersIcon',
      color: 'bg-primary',
      description: 'Active user accounts'
    },
    {
      title: 'Pending Reviews',
      value: 23,
      change: -12.5,
      icon: 'ClockIcon',
      color: 'bg-warning',
      description: 'Access reviews due'
    },
    {
      title: 'High Risk Access',
      value: 8,
      change: 0,
      icon: 'ShieldExclamationIcon',
      color: 'bg-error',
      description: 'Critical permissions'
    },
    {
      title: 'Compliance Score',
      value: 94,
      change: 2.1,
      icon: 'CheckBadgeIcon',
      color: 'bg-success',
      description: 'Overall compliance %'
    }
  ];

  const departments = [...new Set(mockUsers.map(user => user.department))];
  const roles = [...new Set(mockUsers.map(user => user.role))];

  const selectedUser = mockUsers.find(user => user.id === selectedUserId) || null;

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = departmentFilter === '' || user.department === departmentFilter;
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    const matchesAccessLevel = accessLevelFilter === '' || user.accessLevel === accessLevelFilter;
    
    return matchesSearch && matchesDepartment && matchesRole && matchesAccessLevel;
  });

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDepartmentFilter('');
    setRoleFilter('');
    setAccessLevelFilter('');
  };

  const handleRevokePermission = (permissionId: string) => {
    console.log('Revoking permission:', permissionId);
  };

  const handleModifyPermission = (permissionId: string) => {
    console.log('Modifying permission:', permissionId);
  };

  const handleRequestAccess = () => {
    console.log('Requesting access for user:', selectedUserId);
  };

  const handleBulkRoleAssignment = (role: string) => {
    console.log('Bulk role assignment:', role, selectedUserIds);
    setSelectedUserIds([]);
  };

  const handleBulkAccessModification = (accessLevel: string) => {
    console.log('Bulk access modification:', accessLevel, selectedUserIds);
    setSelectedUserIds([]);
  };

  const handleBulkReviewSchedule = (reviewDate: Date) => {
    console.log('Bulk review schedule:', reviewDate, selectedUserIds);
    setSelectedUserIds([]);
  };

  const handleBulkExport = () => {
    console.log('Bulk export:', selectedUserIds);
  };

  const handleClearSelection = () => {
    setSelectedUserIds([]);
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-16 bg-muted"></div>
          <div className="flex">
            <div className="w-64 h-screen bg-muted"></div>
            <div className="flex-1 p-6 space-y-6">
              <div className="h-8 bg-muted rounded"></div>
              <div className="grid grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded-lg"></div>
                ))}
              </div>
              <div className="h-96 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      
      <main className={`
        transition-all duration-300 pt-16
        ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
      `}>
        <div className="p-6">
          <div className="mb-6">
            <Breadcrumb />
            <div className="mt-4">
              <h1 className="text-2xl font-bold text-foreground">User Access Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage user permissions, role assignments, and access reviews
              </p>
            </div>
          </div>

          <AccessMetrics metrics={mockMetrics} />

          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            departmentFilter={departmentFilter}
            onDepartmentFilterChange={setDepartmentFilter}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
            accessLevelFilter={accessLevelFilter}
            onAccessLevelFilterChange={setAccessLevelFilter}
            onClearFilters={handleClearFilters}
            departments={departments}
            roles={roles}
            totalUsers={mockUsers.length}
            filteredUsers={filteredUsers.length}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UserDirectory
              users={filteredUsers}
              selectedUserId={selectedUserId}
              onUserSelect={handleUserSelect}
              searchQuery={searchQuery}
              departmentFilter={departmentFilter}
              roleFilter={roleFilter}
              accessLevelFilter={accessLevelFilter}
            />

            <UserPermissionsPanel
              selectedUser={selectedUser}
              permissions={mockPermissions}
              accessHistory={mockAccessHistory}
              onRevokePermission={handleRevokePermission}
              onModifyPermission={handleModifyPermission}
              onRequestAccess={handleRequestAccess}
            />
          </div>

          <BulkActions
            selectedUserIds={selectedUserIds}
            onClearSelection={handleClearSelection}
            onBulkRoleAssignment={handleBulkRoleAssignment}
            onBulkAccessModification={handleBulkAccessModification}
            onBulkReviewSchedule={handleBulkReviewSchedule}
            onBulkExport={handleBulkExport}
          />
        </div>
      </main>
    </div>
  );
};

export default UserAccessInteractive;