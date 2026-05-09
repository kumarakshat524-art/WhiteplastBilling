'use client';

import React, { useState, useEffect } from 'react';
import MetricsCard from './MetricsCard';
import UpcomingDeadlines from './UpcomingDeadlines';
import RiskHeatmap from './RiskHeatmap';
import ActivityFeed from './ActivityFeed';
import FilterBar from './FilterBar';
import QuickActions from './QuickActions';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import Breadcrumb from '@/components/common/Breadcrumb';

interface DashboardInteractiveProps {
  // Props can be added here if needed for data passing
}

const DashboardInteractive = ({}: DashboardInteractiveProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-16 bg-card border-b border-border"></div>
          <div className="flex">
            <div className="w-60 h-screen bg-card border-r border-border"></div>
            <div className="flex-1 p-6 space-y-6">
              <div className="h-8 bg-muted rounded"></div>
              <div className="grid grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-card border border-border rounded-lg"></div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-96 bg-card border border-border rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mock data
  const metricsData = [
    {
      title: "Open Compliance Issues",
      value: 23,
      trend: { direction: 'down' as const, percentage: 12, period: 'last week' },
      icon: 'ExclamationCircleIcon',
      color: 'error' as const
    },
    {
      title: "Pending Approvals",
      value: 8,
      trend: { direction: 'up' as const, percentage: 25, period: 'last week' },
      icon: 'ClockIcon',
      color: 'warning' as const
    },
    {
      title: "Audits in Progress",
      value: 5,
      trend: { direction: 'stable' as const, percentage: 0, period: 'last week' },
      icon: 'DocumentMagnifyingGlassIcon',
      color: 'primary' as const
    },
    {
      title: "Incidents This Week",
      value: 2,
      trend: { direction: 'down' as const, percentage: 60, period: 'last week' },
      icon: 'ShieldExclamationIcon',
      color: 'success' as const
    }
  ];

  const upcomingDeadlines = [
    {
      id: '1',
      title: 'GDPR Data Processing Review',
      type: 'policy' as const,
      dueDate: '2024-11-18',
      priority: 'high' as const,
      assignee: 'Sarah Johnson',
      department: 'Legal'
    },
    {
      id: '2',
      title: 'SOC 2 Evidence Collection',
      type: 'audit' as const,
      dueDate: '2024-11-20',
      priority: 'high' as const,
      assignee: 'Mike Chen',
      department: 'IT Security'
    },
    {
      id: '3',
      title: 'Employee Security Training',
      type: 'training' as const,
      dueDate: '2024-11-22',
      priority: 'medium' as const,
      assignee: 'Lisa Rodriguez',
      department: 'HR'
    },
    {
      id: '4',
      title: 'Vendor Risk Assessment - CloudTech',
      type: 'review' as const,
      dueDate: '2024-11-25',
      priority: 'medium' as const,
      assignee: 'David Park',
      department: 'Procurement'
    },
    {
      id: '5',
      title: 'Financial Controls Testing',
      type: 'audit' as const,
      dueDate: '2024-11-28',
      priority: 'high' as const,
      assignee: 'Jennifer Walsh',
      department: 'Finance'
    },
    {
      id: '6',
      title: 'Data Retention Policy Update',
      type: 'policy' as const,
      dueDate: '2024-12-01',
      priority: 'low' as const,
      assignee: 'Alex Thompson',
      department: 'Legal'
    },
    {
      id: '7',
      title: 'Access Control Review - Q4',
      type: 'review' as const,
      dueDate: '2024-12-05',
      priority: 'medium' as const,
      assignee: 'Rachel Kim',
      department: 'IT Security'
    },
    {
      id: '8',
      title: 'Incident Response Plan Drill',
      type: 'training' as const,
      dueDate: '2024-12-10',
      priority: 'high' as const,
      assignee: 'Tom Wilson',
      department: 'Operations'
    }
  ];

  const riskData = [
    {
      id: '1',
      category: 'Data Privacy',
      level: 'high' as const,
      count: 7,
      description: 'GDPR compliance gaps and data processing issues requiring immediate attention'
    },
    {
      id: '2',
      category: 'Financial Controls',
      level: 'medium' as const,
      count: 12,
      description: 'SOX compliance monitoring and financial reporting control weaknesses'
    },
    {
      id: '3',
      category: 'Vendor Management',
      level: 'critical' as const,
      count: 3,
      description: 'High-risk third-party vendors with incomplete security assessments'
    },
    {
      id: '4',
      category: 'Access Controls',
      level: 'low' as const,
      count: 18,
      description: 'Routine access reviews and privilege management maintenance tasks'
    },
    {
      id: '5',
      category: 'Regulatory Changes',
      level: 'medium' as const,
      count: 9,
      description: 'New regulatory requirements requiring policy updates and implementation'
    },
    {
      id: '6',
      category: 'Security Incidents',
      level: 'high' as const,
      count: 4,
      description: 'Recent security events requiring investigation and remediation actions'
    }
  ];

  const activityData = [
    {
      id: '1',
      type: 'audit' as const,
      title: 'SOC 2 Type II Audit Completed',
      description: 'Annual SOC 2 Type II audit has been successfully completed with no major findings. Report available for review.',
      user: 'Jennifer Walsh',
      timestamp: '2024-11-14T09:30:00',
      status: 'completed' as const
    },
    {
      id: '2',
      type: 'incident' as const,
      title: 'Data Access Violation Reported',
      description: 'Unauthorized access attempt detected in customer database. Investigation initiated and access revoked.',
      user: 'Mike Chen',
      timestamp: '2024-11-14T08:45:00',
      status: 'in-progress' as const
    },
    {
      id: '3',
      type: 'policy' as const,
      title: 'Privacy Policy Updated',
      description: 'Updated privacy policy to comply with new state regulations. Awaiting legal review and approval.',
      user: 'Sarah Johnson',
      timestamp: '2024-11-14T07:20:00',
      status: 'pending' as const
    },
    {
      id: '4',
      type: 'task' as const,
      title: 'Vendor Risk Assessment Completed',
      description: 'Completed comprehensive risk assessment for CloudTech vendor. Medium risk rating assigned.',
      user: 'David Park',
      timestamp: '2024-11-13T16:15:00',
      status: 'completed' as const
    },
    {
      id: '5',
      type: 'approval' as const,
      title: 'Security Training Module Approved',
      description: 'New employee security awareness training module has been approved and scheduled for deployment.',
      user: 'Lisa Rodriguez',
      timestamp: '2024-11-13T14:30:00',
      status: 'completed' as const
    },
    {
      id: '6',
      type: 'audit' as const,
      title: 'Internal Controls Testing Started',
      description: 'Q4 internal controls testing has commenced. Expected completion by November 30th.',
      user: 'Tom Wilson',
      timestamp: '2024-11-13T11:00:00',
      status: 'in-progress' as const
    }
  ];

  const handleMetricClick = (title: string) => {
    console.log(`Metric clicked: ${title}`);
  };

  const handleFilterChange = (filterType: string, value: any) => {
    console.log(`Filter changed: ${filterType}`, value);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    console.log('Dashboard refreshed');
  };

  const handleQuickAction = (actionId: string) => {
    console.log(`Quick action: ${actionId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'ml-0 lg:ml-60'} mt-16`}>
        <div className="p-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb />
          </div>

          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Compliance Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Real-time overview of your organization's compliance status and risk posture
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <FilterBar
            onDateRangeChange={(range) => handleFilterChange('dateRange', range)}
            onDepartmentChange={(dept) => handleFilterChange('department', dept)}
            onRiskLevelChange={(levels) => handleFilterChange('riskLevels', levels)}
            onRefresh={handleRefresh}
          />

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsData.map((metric, index) => (
              <MetricsCard
                key={`${metric.title}-${refreshKey}-${index}`}
                title={metric.title}
                value={metric.value}
                trend={metric.trend}
                icon={metric.icon}
                color={metric.color}
                onClick={() => handleMetricClick(metric.title)}
              />
            ))}
          </div>

          {/* Main Dashboard Grid - 2x2 Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* First Row */}
            {/* Upcoming Deadlines */}
            <div>
              <UpcomingDeadlines deadlines={upcomingDeadlines} />
            </div>

            {/* Quick Actions */}
            <div>
              <QuickActions onActionClick={handleQuickAction} />
            </div>

            {/* Second Row */}
            {/* Risk Heatmap */}
            <div>
              <RiskHeatmap risks={riskData} />
            </div>

            {/* Recent Activity */}
            <div>
              <ActivityFeed activities={activityData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardInteractive;