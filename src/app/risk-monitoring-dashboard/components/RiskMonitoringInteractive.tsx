'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import Breadcrumb from '@/components/common/Breadcrumb';
import RiskMatrix from './RiskMatrix';
import RiskRegister from './RiskRegister';
import RiskFilters from './RiskFilters';
import RiskMetrics from './RiskMetrics';
import QuickActions from './QuickActions';
import RiskTrendChart from './RiskTrendChart';
import NewRiskModal from './NewRiskModal';
import Icon from '@/components/ui/AppIcon';

interface Risk {
  id: string;
  title: string;
  description: string;
  category: string;
  probability: number;
  impact: number;
  riskScore: number;
  owner: string;
  status: 'Open' | 'In Progress' | 'Mitigated' | 'Closed';
  department: string;
  nextReview: string;
  mitigationStatus: string;
  lastUpdated: string;
}

interface FilterOptions {
  departments: string[];
  categories: string[];
  severityLevels: string[];
  statuses: string[];
}

interface ActiveFilters {
  departments: string[];
  categories: string[];
  severityLevels: string[];
  statuses: string[];
  searchQuery: string;
}

interface TrendData {
  month: string;
  totalRisks: number;
  criticalRisks: number;
  mitigatedRisks: number;
}

const RiskMonitoringInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [selectedRisks, setSelectedRisks] = useState<string[]>([]);
  const [sortField, setSortField] = useState('riskScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeView, setActiveView] = useState<'matrix' | 'register' | 'trends'>('matrix');
  const [isNewRiskModalOpen, setIsNewRiskModalOpen] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const mockRisks: Risk[] = [
    {
      id: 'RSK-001',
      title: 'Data Breach Risk',
      description: 'Potential unauthorized access to customer personal data due to inadequate security controls',
      category: 'Cybersecurity',
      probability: 4,
      impact: 5,
      riskScore: 20,
      owner: 'Sarah Johnson',
      status: 'Open',
      department: 'IT Security',
      nextReview: '2024-12-01',
      mitigationStatus: 'Planning',
      lastUpdated: '2024-11-10'
    },
    {
      id: 'RSK-002',
      title: 'Regulatory Compliance Gap',
      description: 'Non-compliance with GDPR requirements for data processing and consent management',
      category: 'Regulatory',
      probability: 3,
      impact: 4,
      riskScore: 12,
      owner: 'Michael Chen',
      status: 'In Progress',
      department: 'Legal',
      nextReview: '2024-11-25',
      mitigationStatus: 'In Progress',
      lastUpdated: '2024-11-12'
    },
    {
      id: 'RSK-003',
      title: 'Vendor Security Risk',
      description: 'Third-party vendor lacks adequate security certifications and audit reports',
      category: 'Third Party',
      probability: 3,
      impact: 3,
      riskScore: 9,
      owner: 'Emily Rodriguez',
      status: 'Open',
      department: 'Procurement',
      nextReview: '2024-12-15',
      mitigationStatus: 'Assessment',
      lastUpdated: '2024-11-08'
    },
    {
      id: 'RSK-004',
      title: 'Financial Fraud Risk',
      description: 'Inadequate segregation of duties in financial processes increasing fraud potential',
      category: 'Financial',
      probability: 2,
      impact: 5,
      riskScore: 10,
      owner: 'David Kim',
      status: 'Mitigated',
      department: 'Finance',
      nextReview: '2025-01-30',
      mitigationStatus: 'Completed',
      lastUpdated: '2024-11-05'
    },
    {
      id: 'RSK-005',
      title: 'Business Continuity Risk',
      description: 'Lack of comprehensive disaster recovery plan for critical business operations',
      category: 'Operational',
      probability: 3,
      impact: 4,
      riskScore: 12,
      owner: 'Lisa Thompson',
      status: 'In Progress',
      department: 'Operations',
      nextReview: '2024-12-10',
      mitigationStatus: 'In Progress',
      lastUpdated: '2024-11-13'
    },
    {
      id: 'RSK-006',
      title: 'Employee Access Risk',
      description: 'Excessive user privileges and inadequate access review processes',
      category: 'Access Control',
      probability: 4,
      impact: 3,
      riskScore: 12,
      owner: 'James Wilson',
      status: 'Open',
      department: 'HR',
      nextReview: '2024-11-28',
      mitigationStatus: 'Planning',
      lastUpdated: '2024-11-11'
    }
  ];

  const filterOptions: FilterOptions = {
    departments: ['IT Security', 'Legal', 'Procurement', 'Finance', 'Operations', 'HR'],
    categories: ['Cybersecurity', 'Regulatory', 'Third Party', 'Financial', 'Operational', 'Access Control'],
    severityLevels: ['Low (1-5)', 'Medium (6-10)', 'High (11-15)', 'Critical (16-25)'],
    statuses: ['Open', 'In Progress', 'Mitigated', 'Closed']
  };

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    departments: [],
    categories: [],
    severityLevels: [],
    statuses: [],
    searchQuery: ''
  });

  const trendData: TrendData[] = [
    { month: 'Jan 2024', totalRisks: 45, criticalRisks: 8, mitigatedRisks: 12 },
    { month: 'Feb 2024', totalRisks: 48, criticalRisks: 9, mitigatedRisks: 15 },
    { month: 'Mar 2024', totalRisks: 52, criticalRisks: 11, mitigatedRisks: 18 },
    { month: 'Apr 2024', totalRisks: 49, criticalRisks: 10, mitigatedRisks: 21 },
    { month: 'May 2024', totalRisks: 55, criticalRisks: 12, mitigatedRisks: 19 },
    { month: 'Jun 2024', totalRisks: 58, criticalRisks: 13, mitigatedRisks: 22 },
    { month: 'Jul 2024', totalRisks: 54, criticalRisks: 11, mitigatedRisks: 25 },
    { month: 'Aug 2024', totalRisks: 51, criticalRisks: 9, mitigatedRisks: 28 },
    { month: 'Sep 2024', totalRisks: 56, criticalRisks: 10, mitigatedRisks: 24 },
    { month: 'Oct 2024', totalRisks: 59, criticalRisks: 12, mitigatedRisks: 26 },
    { month: 'Nov 2024', totalRisks: 62, criticalRisks: 14, mitigatedRisks: 23 }
  ];

  const filteredRisks = mockRisks.filter(risk => {
    const matchesDepartment = activeFilters.departments.length === 0 || activeFilters.departments.includes(risk.department);
    const matchesCategory = activeFilters.categories.length === 0 || activeFilters.categories.includes(risk.category);
    const matchesStatus = activeFilters.statuses.length === 0 || activeFilters.statuses.includes(risk.status);
    const matchesSearch = !activeFilters.searchQuery || 
      risk.title.toLowerCase().includes(activeFilters.searchQuery.toLowerCase()) ||
      risk.description.toLowerCase().includes(activeFilters.searchQuery.toLowerCase());
    
    let matchesSeverity = true;
    if (activeFilters.severityLevels.length > 0) {
      matchesSeverity = activeFilters.severityLevels.some(level => {
        if (level === 'Low (1-5)') return risk.riskScore <= 5;
        if (level === 'Medium (6-10)') return risk.riskScore >= 6 && risk.riskScore <= 10;
        if (level === 'High (11-15)') return risk.riskScore >= 11 && risk.riskScore <= 15;
        if (level === 'Critical (16-25)') return risk.riskScore >= 16;
        return false;
      });
    }

    return matchesDepartment && matchesCategory && matchesStatus && matchesSearch && matchesSeverity;
  });

  const sortedRisks = [...filteredRisks].sort((a, b) => {
    const aValue = a[sortField as keyof Risk];
    const bValue = b[sortField as keyof Risk];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const handleRiskClick = (risk: Risk) => {
    setSelectedRisk(risk);
  };

  const handleRiskSelect = (riskId: string) => {
    setSelectedRisks(prev => 
      prev.includes(riskId) 
        ? prev.filter(id => id !== riskId)
        : [...prev, riskId]
    );
  };

  const handleSelectAll = () => {
    setSelectedRisks(
      selectedRisks.length === sortedRisks.length 
        ? [] 
        : sortedRisks.map(risk => risk.id)
    );
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleFilterChange = (filters: ActiveFilters) => {
    setActiveFilters(filters);
  };

  const handleClearFilters = () => {
    setActiveFilters({
      departments: [],
      categories: [],
      severityLevels: [],
      statuses: [],
      searchQuery: ''
    });
  };

  const handleCreateRisk = () => {
    setIsNewRiskModalOpen(true);
  };

  const handleNewRiskSubmit = (riskData: any) => {
    // Handle the new risk data - in a real app, this would save to database
    console.log('New risk created:', riskData);
    // You could add the new risk to the mockRisks array or refresh the data
  };

  const criticalRisks = sortedRisks.filter(risk => risk.riskScore >= 16).length;
  const mitigatedRisks = sortedRisks.filter(risk => risk.status === 'Mitigated').length;
  const overdueReviews = sortedRisks.filter(risk => new Date(risk.nextReview) < new Date()).length;

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-16 bg-muted"></div>
          <div className="flex">
            <div className="w-64 h-screen bg-muted"></div>
            <div className="flex-1 p-6">
              <div className="h-8 bg-muted rounded mb-6"></div>
              <div className="grid grid-cols-4 gap-6 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
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
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'ml-0 lg:ml-64'} pt-16`}>
        <div className="flex">
          {/* Filters Sidebar */}
          <RiskFilters
            filterOptions={filterOptions}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            isCollapsed={filtersCollapsed}
            onToggleCollapse={() => setFiltersCollapsed(!filtersCollapsed)}
          />

          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="mb-6">
              <Breadcrumb />
              <div className="flex items-center justify-between mt-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Risk Monitoring Dashboard</h1>
                  <p className="text-muted-foreground mt-1">
                    Monitor and manage organizational risks with real-time insights
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {filtersCollapsed && (
                    <button
                      onClick={() => setFiltersCollapsed(false)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-150"
                    >
                      <Icon name="FunnelIcon" size={16} className="mr-2" />
                      Show Filters
                    </button>
                  )}
                  <div className="flex bg-muted rounded-lg p-1">
                    <button
                      onClick={() => setActiveView('matrix')}
                      className={`px-3 py-1 text-sm font-medium rounded transition-colors duration-150 ${
                        activeView === 'matrix' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Matrix
                    </button>
                    <button
                      onClick={() => setActiveView('register')}
                      className={`px-3 py-1 text-sm font-medium rounded transition-colors duration-150 ${
                        activeView === 'register' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Register
                    </button>
                    <button
                      onClick={() => setActiveView('trends')}
                      className={`px-3 py-1 text-sm font-medium rounded transition-colors duration-150 ${
                        activeView === 'trends' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Trends
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Metrics */}
            <RiskMetrics
              totalRisks={sortedRisks.length}
              criticalRisks={criticalRisks}
              mitigatedRisks={mitigatedRisks}
              overdueReviews={overdueReviews}
            />

            {/* Quick Actions */}
            <QuickActions
              selectedRisksCount={selectedRisks.length}
              onBulkAssign={() => console.log('Bulk assign')}
              onBulkStatusUpdate={() => console.log('Bulk status update')}
              onBulkExport={() => console.log('Bulk export')}
              onCreateRisk={handleCreateRisk}
              onGenerateReport={() => console.log('Generate report')}
            />

            {/* Main Content Area */}
            {activeView === 'matrix' && (
              <div className="space-y-6">
                <div>
                  <RiskMatrix
                    risks={sortedRisks}
                    onRiskClick={handleRiskClick}
                    selectedRisk={selectedRisk}
                  />
                </div>
                <div>
                  <RiskRegister
                    risks={sortedRisks.slice(0, 10)}
                    selectedRisks={selectedRisks}
                    onRiskSelect={handleRiskSelect}
                    onSelectAll={handleSelectAll}
                    onRiskClick={handleRiskClick}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                </div>
              </div>
            )}

            {activeView === 'register' && (
              <RiskRegister
                risks={sortedRisks}
                selectedRisks={selectedRisks}
                onRiskSelect={handleRiskSelect}
                onSelectAll={handleSelectAll}
                onRiskClick={handleRiskClick}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            )}

            {activeView === 'trends' && (
              <div className="grid grid-cols-1 gap-6">
                <RiskTrendChart data={trendData} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* New Risk Modal */}
      <NewRiskModal
        isOpen={isNewRiskModalOpen}
        onClose={() => setIsNewRiskModalOpen(false)}
        onSubmit={handleNewRiskSubmit}
      />
    </div>
  );
};

export default RiskMonitoringInteractive;