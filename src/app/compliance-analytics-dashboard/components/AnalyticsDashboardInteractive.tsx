'use client';

import React, { useState, useEffect } from 'react';
import MetricsOverview from './MetricsOverview';
import ComplianceScoreChart from './ComplianceScoreChart';
import RiskHeatMap from './RiskHeatMap';
import PolicyAdoptionChart from './PolicyAdoptionChart';
import AuditFindingsAnalysis from './AuditFindingsAnalysis';
import ComplianceReports from './ComplianceReports';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import Breadcrumb from '@/components/common/Breadcrumb';
import Icon from '@/components/ui/AppIcon';

interface AnalyticsDashboardInteractiveProps {
  // Props can be added here if needed for data passing
}

const AnalyticsDashboardInteractive = ({}: AnalyticsDashboardInteractiveProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('6m');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-16 bg-card border-b border-border"></div>
          <div className="flex">
            <div className="w-64 h-screen bg-card border-r border-border"></div>
            <div className="flex-1 p-6 space-y-6">
              <div className="h-8 bg-muted rounded"></div>
              <div className="grid grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded-lg"></div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="h-96 bg-muted rounded-lg"></div>
                <div className="h-96 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mock data for metrics overview
  const metricsData = [
    {
      id: '1',
      title: 'Compliance Score',
      value: '87%',
      change: 5,
      changeType: 'increase' as const,
      icon: 'ShieldCheckIcon',
      color: 'bg-success'
    },
    {
      id: '2',
      title: 'Active Risks',
      value: '23',
      change: -12,
      changeType: 'decrease' as const,
      icon: 'ExclamationTriangleIcon',
      color: 'bg-warning'
    },
    {
      id: '3',
      title: 'Policy Adoption',
      value: '94%',
      change: 8,
      changeType: 'increase' as const,
      icon: 'DocumentTextIcon',
      color: 'bg-primary'
    },
    {
      id: '4',
      title: 'Audit Findings',
      value: '15',
      change: -25,
      changeType: 'decrease' as const,
      icon: 'MagnifyingGlassIcon',
      color: 'bg-error'
    }
  ];

  // Mock data for compliance score chart
  const scoreData = [
    { month: 'Jun', score: 82, target: 85 },
    { month: 'Jul', score: 84, target: 85 },
    { month: 'Aug', score: 83, target: 85 },
    { month: 'Sep', score: 86, target: 85 },
    { month: 'Oct', score: 85, target: 85 },
    { month: 'Nov', score: 87, target: 85 }
  ];

  // Mock data for risk heat map
  const riskData = [
    {
      id: '1',
      category: 'Data Privacy',
      subcategory: 'GDPR Compliance',
      level: 'high' as const,
      impact: 8,
      probability: 6,
      lastUpdated: '2024-11-12'
    },
    {
      id: '2',
      category: 'Financial',
      subcategory: 'SOX Controls',
      level: 'medium' as const,
      impact: 7,
      probability: 4,
      lastUpdated: '2024-11-10'
    },
    {
      id: '3',
      category: 'Security',
      subcategory: 'Access Control',
      level: 'critical' as const,
      impact: 9,
      probability: 7,
      lastUpdated: '2024-11-14'
    },
    {
      id: '4',
      category: 'Operational',
      subcategory: 'Process Control',
      level: 'low' as const,
      impact: 3,
      probability: 2,
      lastUpdated: '2024-11-08'
    },
    {
      id: '5',
      category: 'Regulatory',
      subcategory: 'Industry Standards',
      level: 'medium' as const,
      impact: 6,
      probability: 5,
      lastUpdated: '2024-11-11'
    },
    {
      id: '6',
      category: 'IT Security',
      subcategory: 'Vulnerability Management',
      level: 'high' as const,
      impact: 8,
      probability: 6,
      lastUpdated: '2024-11-13'
    }
  ];

  // Mock data for policy adoption
  const policyData = [
    {
      category: 'HR Policies',
      adopted: 45,
      pending: 5,
      total: 50,
      adoptionRate: 90
    },
    {
      category: 'IT Policies',
      adopted: 28,
      pending: 7,
      total: 35,
      adoptionRate: 80
    },
    {
      category: 'Data Protection',
      adopted: 18,
      pending: 2,
      total: 20,
      adoptionRate: 90
    },
    {
      category: 'Security Policies',
      adopted: 22,
      pending: 3,
      total: 25,
      adoptionRate: 88
    },
    {
      category: 'Financial Controls',
      adopted: 15,
      pending: 5,
      total: 20,
      adoptionRate: 75
    }
  ];

  // Mock data for audit findings
  const findingsTrendData = [
    { month: 'Jun', critical: 2, high: 5, medium: 8, low: 12, resolved: 20 },
    { month: 'Jul', critical: 1, high: 4, medium: 6, low: 10, resolved: 18 },
    { month: 'Aug', critical: 3, high: 6, medium: 9, low: 15, resolved: 25 },
    { month: 'Sep', critical: 1, high: 3, medium: 7, low: 11, resolved: 19 },
    { month: 'Oct', critical: 2, high: 4, medium: 5, low: 8, resolved: 16 },
    { month: 'Nov', critical: 1, high: 2, medium: 4, low: 6, resolved: 12 }
  ];

  const topFindings = [
    {
      id: '1',
      title: 'Inadequate Access Controls',
      severity: 'critical' as const,
      department: 'IT Security',
      frequency: 8,
      lastOccurrence: '2024-11-12'
    },
    {
      id: '2',
      title: 'Missing Documentation',
      severity: 'high' as const,
      department: 'Operations',
      frequency: 12,
      lastOccurrence: '2024-11-10'
    },
    {
      id: '3',
      title: 'Policy Non-Compliance',
      severity: 'medium' as const,
      department: 'HR',
      frequency: 6,
      lastOccurrence: '2024-11-08'
    },
    {
      id: '4',
      title: 'Data Retention Issues',
      severity: 'high' as const,
      department: 'Legal',
      frequency: 4,
      lastOccurrence: '2024-11-14'
    },
    {
      id: '5',
      title: 'Training Gaps',
      severity: 'medium' as const,
      department: 'Training',
      frequency: 9,
      lastOccurrence: '2024-11-09'
    }
  ];

  // Mock data for reports
  const reportsData = [
    {
      id: '1',
      name: 'Executive Compliance Summary',
      type: 'executive' as const,
      description: 'High-level compliance metrics and KPIs for executive leadership',
      lastGenerated: '2024-11-13',
      frequency: 'Monthly',
      format: ['pdf', 'pptx'],
      size: '2.4 MB',
      status: 'ready' as const
    },
    {
      id: '2',
      name: 'Risk Assessment Report',
      type: 'operational' as const,
      description: 'Detailed risk analysis with mitigation recommendations',
      lastGenerated: '2024-11-12',
      frequency: 'Weekly',
      format: ['pdf', 'xlsx'],
      size: '5.1 MB',
      status: 'ready' as const
    },
    {
      id: '3',
      name: 'SOX Compliance Report',
      type: 'regulatory' as const,
      description: 'Sarbanes-Oxley compliance status and control effectiveness',
      lastGenerated: '2024-11-10',
      frequency: 'Quarterly',
      format: ['pdf'],
      size: '8.7 MB',
      status: 'generating' as const
    },
    {
      id: '4',
      name: 'Policy Adoption Metrics',
      type: 'operational' as const,
      description: 'Policy deployment and adoption rates across departments',
      lastGenerated: '2024-11-11',
      frequency: 'Bi-weekly',
      format: ['xlsx', 'csv'],
      size: '1.8 MB',
      status: 'scheduled' as const
    },
    {
      id: '5',
      name: 'Custom Analytics Dashboard',
      type: 'custom' as const,
      description: 'Customizable report with selected metrics and timeframes',
      lastGenerated: '2024-11-14',
      frequency: 'On-demand',
      format: ['pdf', 'xlsx', 'pptx'],
      size: '3.2 MB',
      status: 'ready' as const
    },
    {
      id: '6',
      name: 'GDPR Compliance Status',
      type: 'regulatory' as const,
      description: 'Data protection compliance and privacy impact assessments',
      lastGenerated: '2024-11-09',
      frequency: 'Monthly',
      format: ['pdf'],
      size: '4.5 MB',
      status: 'ready' as const
    }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleGenerateReport = (reportId: string) => {
    console.log('Generating report:', reportId);
    // Handle report generation
  };

  const handleScheduleReport = (reportId: string) => {
    console.log('Scheduling report:', reportId);
    // Handle report scheduling
  };

  const handleDownloadReport = (reportId: string, format: string) => {
    console.log('Downloading report:', reportId, 'in format:', format);
    // Handle report download
  };

  const dateRanges = [
    { value: '1m', label: '1 Month' },
    { value: '3m', label: '3 Months' },
    { value: '6m', label: '6 Months' },
    { value: '1y', label: '1 Year' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} pt-16`}>
        <div className="p-6">
          {/* Header Section */}
          <div className="mb-6">
            <Breadcrumb />
            <div className="flex items-center justify-between mt-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Compliance Analytics Dashboard</h1>
                <p className="text-muted-foreground">
                  Advanced analytics and reporting for comprehensive compliance insights
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex bg-muted rounded-lg p-1">
                  {dateRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setSelectedDateRange(range.value)}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-150 ${
                        selectedDateRange === range.value
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-150 disabled:opacity-50"
                >
                  <Icon 
                    name="ArrowPathIcon" 
                    size={16} 
                    className={refreshing ? 'animate-spin' : ''} 
                  />
                  <span className="text-sm font-medium">
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="mb-8">
            <MetricsOverview metrics={metricsData} />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <ComplianceScoreChart data={scoreData} />
            <RiskHeatMap risks={riskData} />
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <PolicyAdoptionChart data={policyData} />
            <AuditFindingsAnalysis 
              trendData={findingsTrendData} 
              topFindings={topFindings} 
            />
          </div>

          {/* Reports Section */}
          <div className="mb-8">
            <ComplianceReports
              reports={reportsData}
              onGenerateReport={handleGenerateReport}
              onScheduleReport={handleScheduleReport}
              onDownloadReport={handleDownloadReport}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboardInteractive;