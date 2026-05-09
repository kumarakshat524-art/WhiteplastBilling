'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

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

interface IncidentFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  className?: string;
}

const IncidentFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
  className = ''
}: IncidentFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const incidentTypeOptions = [
    'Security Breach',
    'Data Loss',
    'System Outage',
    'Policy Violation',
    'Safety Incident',
    'Compliance Issue',
    'Fraud',
    'Harassment',
    'Environmental',
    'Other'
  ];

  const severityOptions = [
    { value: 'Critical', color: 'text-red-600', bgColor: 'bg-red-50' },
    { value: 'High', color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { value: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { value: 'Low', color: 'text-green-600', bgColor: 'bg-green-50' }
  ];

  const departmentOptions = [
    'IT Security',
    'Human Resources',
    'Finance',
    'Operations',
    'Legal',
    'Marketing',
    'Sales',
    'Customer Service',
    'Engineering',
    'Quality Assurance'
  ];

  const statusOptions = [
    'Open',
    'In Investigation',
    'Under Review',
    'Pending Approval',
    'Resolved',
    'Closed'
  ];

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleArrayFilterToggle = (key: keyof FilterOptions, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    handleFilterChange(key, newArray);
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

  return (
    <div className={`bg-white border border-border rounded-lg shadow-lg ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="FunnelIcon" size={20} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Advanced Filters</h3>
          {getActiveFilterCount() > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onClearFilters}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      <div className="p-4 space-y-6 max-h-96 overflow-y-auto">
        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Date Range</label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
              className="px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
              className="px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Severity Levels */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Severity Level</label>
          <div className="space-y-2">
            {severityOptions.map((severity) => (
              <label key={severity.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.severityLevels.includes(severity.value)}
                  onChange={() => handleArrayFilterToggle('severityLevels', severity.value)}
                  className="rounded border-border text-primary focus:ring-ring"
                />
                <span className={`text-sm font-medium ${severity.color}`}>{severity.value}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Incident Types */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Incident Type</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {incidentTypeOptions.map((type) => (
              <label key={type} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.incidentTypes.includes(type)}
                  onChange={() => handleArrayFilterToggle('incidentTypes', type)}
                  className="rounded border-border text-primary focus:ring-ring"
                />
                <span className="text-sm text-foreground">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Departments */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Department</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {departmentOptions.map((dept) => (
              <label key={dept} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.departments.includes(dept)}
                  onChange={() => handleArrayFilterToggle('departments', dept)}
                  className="rounded border-border text-primary focus:ring-ring"
                />
                <span className="text-sm text-foreground">{dept}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Status</label>
          <div className="space-y-2">
            {statusOptions.map((status) => (
              <label key={status} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.statuses.includes(status)}
                  onChange={() => handleArrayFilterToggle('statuses', status)}
                  className="rounded border-border text-primary focus:ring-ring"
                />
                <span className="text-sm text-foreground">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Assigned To */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Assigned To</label>
          <input
            type="text"
            placeholder="Search by investigator name..."
            value={filters.assignedTo}
            onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
    </div>
  );
};

export default IncidentFilters;