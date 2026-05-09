'use client';

import React, { useState, useEffect } from 'react';
import IncidentStats from './IncidentStats';
import IncidentFilters from './IncidentFilters';
import IncidentList from './IncidentList';

import NewIncidentModal from './NewIncidentModal';
import Icon from '@/components/ui/AppIcon';

interface Incident {
  id: string;
  title: string;
  reporter: string;
  reporterEmail: string;
  date: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Investigation' | 'Under Review' | 'Pending Approval' | 'Resolved' | 'Closed';
  assignedInvestigator: string;
  department: string;
  incidentType: string;
  description: string;
  resolutionTimeline: string;
  priority: number;
  investigationNotes: string[];
  correctiveActions: string[];
  auditTrail: Array<{
    action: string;
    user: string;
    timestamp: string;
    details: string;
  }>;
  attachments: Array<{
    name: string;
    type: string;
    size: string;
    uploadedBy: string;
    uploadedAt: string;
  }>;
  witnesses: Array<{
    name: string;
    email: string;
    statement: string;
    contactDate: string;
  }>;
}

interface FilterOptions {
  incidentTypes: string[];
  severityLevels: string[];
  departments: string[];
  statuses: string[];
  dateRange: {
    start: string;
    end: string;
  };
  assignedTo: string;
}

const IncidentReportingInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
  const [selectedIncidents, setSelectedIncidents] = useState<string[]>([]);
  const [showNewIncidentModal, setShowNewIncidentModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    incidentTypes: [],
    severityLevels: [],
    departments: [],
    statuses: [],
    dateRange: { start: '', end: '' },
    assignedTo: ''
  });

  const quickFilterPresets = [
    { label: 'Critical Open', filters: { severityLevels: ['Critical'], statuses: ['Open', 'In Investigation'] } },
    { label: 'This Week', filters: { dateRange: { start: '2024-11-11', end: '2024-11-17' } } },
    { label: 'Security Issues', filters: { incidentTypes: ['Security Breach', 'Data Loss'] } },
    { label: 'Pending Review', filters: { statuses: ['Under Review', 'Pending Approval'] } }
  ];

  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);

  // Mock data
  const mockIncidents: Incident[] = [
    {
      id: 'INC-2024-001',
      title: 'Unauthorized Access to Customer Database',
      reporter: 'Sarah Johnson',
      reporterEmail: 'sarah.johnson@company.com',
      date: '2024-11-14T08:30:00Z',
      severity: 'Critical',
      status: 'In Investigation',
      assignedInvestigator: 'Michael Chen',
      department: 'IT Security',
      incidentType: 'Security Breach',
      description: 'Suspicious login activity detected on customer database server. Multiple failed login attempts followed by successful access using compromised credentials. Potential data exposure of customer personal information.',
      resolutionTimeline: 'Investigation in progress. Expected resolution within 48 hours.',
      priority: 1,
      investigationNotes: [
        'Initial analysis shows login from unusual IP address (192.168.1.100)',
        'Credentials appear to be from terminated employee account',
        'Database access logs show queries on customer table between 08:15-08:25'
      ],
      correctiveActions: [
        'Immediately disable compromised account',
        'Reset all admin passwords',
        'Implement additional MFA requirements',
        'Conduct full security audit'
      ],
      auditTrail: [
        {
          action: 'Incident Created',
          user: 'Sarah Johnson',
          timestamp: '2024-11-14 08:30:00',
          details: 'Initial incident report submitted'
        },
        {
          action: 'Assigned to Investigator',
          user: 'Security Manager',
          timestamp: '2024-11-14 08:45:00',
          details: 'Assigned to Michael Chen for investigation'
        },
        {
          action: 'Status Updated',
          user: 'Michael Chen',
          timestamp: '2024-11-14 09:15:00',
          details: 'Changed status to In Investigation'
        }
      ],
      attachments: [
        {
          name: 'server_logs_20241114.txt',
          type: 'text/plain',
          size: '2.4 MB',
          uploadedBy: 'Michael Chen',
          uploadedAt: '2024-11-14 09:30:00'
        },
        {
          name: 'security_scan_results.pdf',
          type: 'application/pdf',
          size: '1.8 MB',
          uploadedBy: 'Security Team',
          uploadedAt: '2024-11-14 10:15:00'
        }
      ],
      witnesses: [
        {
          name: 'David Wilson',
          email: 'david.wilson@company.com',
          statement: 'I noticed unusual network activity around 8:15 AM and immediately reported it to the security team.',
          contactDate: '2024-11-14'
        }
      ]
    },
    {
      id: 'INC-2024-002',
      title: 'Employee Harassment Complaint',
      reporter: 'Jennifer Martinez',
      reporterEmail: 'jennifer.martinez@company.com',
      date: '2024-11-13T14:20:00Z',
      severity: 'High',
      status: 'Under Review',
      assignedInvestigator: 'Lisa Thompson',
      department: 'Human Resources',
      incidentType: 'Harassment',
      description: 'Employee reported inappropriate comments and behavior from supervisor during team meetings. Multiple witnesses present during incidents.',
      resolutionTimeline: 'HR investigation ongoing. Expected completion by November 20, 2024.',
      priority: 2,
      investigationNotes: [
        'Conducted initial interview with complainant',
        'Gathering witness statements from team members',
        'Reviewing meeting recordings and documentation'
      ],
      correctiveActions: [
        'Separate reporting lines temporarily',
        'Mandatory sensitivity training for management',
        'Review company harassment policies'
      ],
      auditTrail: [
        {
          action: 'Incident Created',
          user: 'Jennifer Martinez',
          timestamp: '2024-11-13 14:20:00',
          details: 'Harassment complaint filed'
        },
        {
          action: 'Assigned to HR',
          user: 'HR Director',
          timestamp: '2024-11-13 14:30:00',
          details: 'Assigned to Lisa Thompson for investigation'
        }
      ],
      attachments: [
        {
          name: 'witness_statement_1.pdf',
          type: 'application/pdf',
          size: '245 KB',
          uploadedBy: 'Lisa Thompson',
          uploadedAt: '2024-11-13 16:45:00'
        }
      ],
      witnesses: [
        {
          name: 'Robert Kim',
          email: 'robert.kim@company.com',
          statement: 'I was present during the meeting on November 10th and can confirm the inappropriate comments were made.',
          contactDate: '2024-11-13'
        },
        {
          name: 'Amanda Foster',
          email: 'amanda.foster@company.com',
          statement: 'I witnessed similar behavior in previous meetings and can provide additional context.',
          contactDate: '2024-11-14'
        }
      ]
    },
    {
      id: 'INC-2024-003',
      title: 'Financial Data Discrepancy',
      reporter: 'Thomas Anderson',
      reporterEmail: 'thomas.anderson@company.com',
      date: '2024-11-12T11:15:00Z',
      severity: 'Medium',
      status: 'Resolved',
      assignedInvestigator: 'Patricia Davis',
      department: 'Finance',
      incidentType: 'Compliance Issue',
      description: 'Discrepancy found in quarterly financial reports. Revenue figures do not match supporting documentation.',
      resolutionTimeline: 'Resolved - Error in data entry process identified and corrected.',
      priority: 3,
      investigationNotes: [
        'Reviewed all supporting financial documents',
        'Identified manual data entry error in Q3 revenue calculation',
        'Corrected figures and updated reports'
      ],
      correctiveActions: [
        'Implement automated data validation checks',
        'Additional review process for financial reports',
        'Staff training on data entry procedures'
      ],
      auditTrail: [
        {
          action: 'Incident Created',
          user: 'Thomas Anderson',
          timestamp: '2024-11-12 11:15:00',
          details: 'Financial discrepancy reported'
        },
        {
          action: 'Investigation Completed',
          user: 'Patricia Davis',
          timestamp: '2024-11-13 16:30:00',
          details: 'Root cause identified and corrected'
        },
        {
          action: 'Status Updated',
          user: 'Patricia Davis',
          timestamp: '2024-11-13 16:35:00',
          details: 'Marked as resolved'
        }
      ],
      attachments: [
        {
          name: 'corrected_financial_report.xlsx',
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          size: '1.2 MB',
          uploadedBy: 'Patricia Davis',
          uploadedAt: '2024-11-13 16:30:00'
        }
      ],
      witnesses: []
    }
  ];

  const statsData = {
    totalIncidents: 127,
    openIncidents: 23,
    criticalIncidents: 5,
    resolvedThisWeek: 18,
    averageResolutionTime: '4.2 days',
    escalatedIncidents: 7
  };

  useEffect(() => {
    setIsHydrated(true);
    setIncidents(mockIncidents);
    setFilteredIncidents(mockIncidents);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    let filtered = [...incidents];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(incident =>
        incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.reporter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.incidentTypes.length > 0) {
      filtered = filtered.filter(incident => filters.incidentTypes.includes(incident.incidentType));
    }

    if (filters.severityLevels.length > 0) {
      filtered = filtered.filter(incident => filters.severityLevels.includes(incident.severity));
    }

    if (filters.departments.length > 0) {
      filtered = filtered.filter(incident => filters.departments.includes(incident.department));
    }

    if (filters.statuses.length > 0) {
      filtered = filtered.filter(incident => filters.statuses.includes(incident.status));
    }

    if (filters.dateRange.start) {
      filtered = filtered.filter(incident => new Date(incident.date) >= new Date(filters.dateRange.start));
    }

    if (filters.dateRange.end) {
      filtered = filtered.filter(incident => new Date(incident.date) <= new Date(filters.dateRange.end));
    }

    if (filters.assignedTo.trim()) {
      filtered = filtered.filter(incident =>
        incident.assignedInvestigator.toLowerCase().includes(filters.assignedTo.toLowerCase())
      );
    }

    setFilteredIncidents(filtered);
  }, [incidents, searchQuery, filters, isHydrated]);

  const handleIncidentSelect = (incidentId: string) => {
    setSelectedIncidents(prev =>
      prev.includes(incidentId)
        ? prev.filter(id => id !== incidentId)
        : [...prev, incidentId]
    );
  };

  const handleBulkAction = (action: string, incidentIds: string[]) => {
    console.log(`Bulk action: ${action} on incidents:`, incidentIds);
    // Implement bulk actions here
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      incidentTypes: [],
      severityLevels: [],
      departments: [],
      statuses: [],
      dateRange: { start: '', end: '' },
      assignedTo: ''
    });
  };

  const handleNewIncident = (data: any) => {
    const newIncident: Incident = {
      id: `INC-2024-${String(incidents.length + 1).padStart(3, '0')}`,
      title: data.title,
      reporter: data.reporterName,
      reporterEmail: data.reporterEmail,
      date: new Date().toISOString(),
      severity: data.severity,
      status: 'Open',
      assignedInvestigator: 'Unassigned',
      department: data.department,
      incidentType: data.incidentType,
      description: data.description,
      resolutionTimeline: 'Pending assignment',
      priority: data.severity === 'Critical' ? 1 : data.severity === 'High' ? 2 : 3,
      investigationNotes: [],
      correctiveActions: [],
      auditTrail: [
        {
          action: 'Incident Created',
          user: data.reporterName,
          timestamp: new Date().toLocaleString(),
          details: 'Initial incident report submitted'
        }
      ],
      attachments: [],
      witnesses: []
    };

    setIncidents(prev => [newIncident, ...prev]);
  };

  const applyQuickFilter = (preset: any) => {
    setFilters(prev => ({
      ...prev,
      ...preset.filters
    }));
  };

  const removeFilterTag = (filterType: string, value: string) => {
    if (filterType === 'severityLevels' || filterType === 'statuses' || filterType === 'incidentTypes' || filterType === 'departments') {
      const currentArray = filters[filterType as keyof FilterOptions] as string[];
      setFilters(prev => ({
        ...prev,
        [filterType]: currentArray.filter(item => item !== value)
      }));
    }
  };

  const getActiveFilterTags = () => {
    const tags: Array<{ type: string; value: string; label: string }> = [];
    
    filters.severityLevels.forEach(severity => {
      tags.push({ type: 'severityLevels', value: severity, label: severity });
    });
    
    filters.statuses.forEach(status => {
      tags.push({ type: 'statuses', value: status, label: status });
    });
    
    filters.incidentTypes.forEach(type => {
      tags.push({ type: 'incidentTypes', value: type, label: type });
    });
    
    filters.departments.forEach(dept => {
      tags.push({ type: 'departments', value: dept, label: dept });
    });

    return tags;
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.incidentTypes.length > 0) count++;
    if (filters.severityLevels.length > 0) count++;
    if (filters.departments.length > 0) count++;
    if (filters.statuses.length > 0) count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.assignedTo) count++;
    return count;
  };

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <IncidentStats stats={statsData} />

      {/* Search and Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Icon name="MagnifyingGlassIcon" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search incidents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring w-80"
            />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowNewIncidentModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-150"
          >
            <Icon name="PlusIcon" size={16} />
            <span>Report Incident</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors duration-150">
            <Icon name="ArrowDownTrayIcon" size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Horizontal Filter Bar */}
      <div className="bg-gray-50 border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Filters Button */}
            <div className="relative">
              <button
                onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-border rounded-md hover:bg-gray-50 transition-colors duration-150"
              >
                <Icon name="FunnelIcon" size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Filters</span>
                {getActiveFilterCount() > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                    {getActiveFilterCount()}
                  </span>
                )}
                <Icon name="ChevronDownIcon" size={14} className="text-muted-foreground" />
              </button>

              {/* Filters Dropdown */}
              {showFiltersDropdown && (
                <div className="absolute top-full left-0 mt-2 w-80 z-50">
                  <IncidentFilters
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={handleClearFilters}
                    className="shadow-lg"
                  />
                </div>
              )}
            </div>

            {/* Quick Filter Presets */}
            <div className="flex flex-wrap gap-2">
              {quickFilterPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyQuickFilter(preset)}
                  className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full transition-colors duration-150"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleClearFilters}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              Clear All
            </button>
            <Icon name="ChevronDownIcon" size={16} className="text-muted-foreground" />
          </div>
        </div>

        {/* Active Filter Tags */}
        {getActiveFilterTags().length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
            {getActiveFilterTags().map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
              >
                {tag.label}
                <button
                  onClick={() => removeFilterTag(tag.type, tag.value)}
                  className="hover:text-gray-900 transition-colors duration-150"
                >
                  <Icon name="XMarkIcon" size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main Content - Full Width Incident List Only */}
      <div className="w-full">
        <IncidentList
          incidents={filteredIncidents}
          selectedIncidents={selectedIncidents}
          onIncidentSelect={handleIncidentSelect}
          onBulkAction={handleBulkAction}
        />
      </div>

      {/* New Incident Modal */}
      <NewIncidentModal
        isOpen={showNewIncidentModal}
        onClose={() => setShowNewIncidentModal(false)}
        onSubmit={handleNewIncident}
      />
    </div>
  );
};

export default IncidentReportingInteractive;