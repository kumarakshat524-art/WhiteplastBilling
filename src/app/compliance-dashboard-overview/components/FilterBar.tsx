'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterBarProps {
  onDateRangeChange?: (range: { start: string; end: string }) => void;
  onDepartmentChange?: (department: string) => void;
  onRiskLevelChange?: (levels: string[]) => void;
  onRefresh?: () => void;
}

const FilterBar = ({ 
  onDateRangeChange, 
  onDepartmentChange, 
  onRiskLevelChange, 
  onRefresh 
}: FilterBarProps) => {
  const [selectedDateRange, setSelectedDateRange] = useState('7d');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<string[]>(['low', 'medium', 'high', 'critical']);
  const [showFilters, setShowFilters] = useState(false);

  const dateRanges = [
    { value: '1d', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'finance', label: 'Finance' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'it', label: 'Information Technology' },
    { value: 'legal', label: 'Legal' },
    { value: 'operations', label: 'Operations' },
    { value: 'marketing', label: 'Marketing' }
  ];

  const riskLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-orange-500' },
    { value: 'critical', label: 'Critical', color: 'bg-red-500' }
  ];

  const handleDateRangeChange = (range: string) => {
    setSelectedDateRange(range);
    
    const now = new Date();
    let start = new Date();
    
    switch (range) {
      case '1d':
        start.setDate(now.getDate() - 1);
        break;
      case '7d':
        start.setDate(now.getDate() - 7);
        break;
      case '30d':
        start.setDate(now.getDate() - 30);
        break;
      case '90d':
        start.setDate(now.getDate() - 90);
        break;
      default:
        return;
    }
    
    onDateRangeChange?.({
      start: start.toISOString().split('T')[0],
      end: now.toISOString().split('T')[0]
    });
  };

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department);
    onDepartmentChange?.(department);
  };

  const handleRiskLevelToggle = (level: string) => {
    const newLevels = selectedRiskLevels.includes(level)
      ? selectedRiskLevels.filter(l => l !== level)
      : [...selectedRiskLevels, level];
    
    setSelectedRiskLevels(newLevels);
    onRiskLevelChange?.(newLevels);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Date Range Filter */}
          <div className="relative">
            <select
              value={selectedDateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="appearance-none bg-muted border border-border rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              {dateRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <Icon 
              name="ChevronDownIcon" 
              size={16} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
            />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select
              value={selectedDepartment}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              className="appearance-none bg-muted border border-border rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              {departments.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
            <Icon 
              name="ChevronDownIcon" 
              size={16} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
            />
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
              showFilters 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
          >
            <Icon name="AdjustmentsHorizontalIcon" size={16} />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 px-3 py-2 bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg text-sm font-medium transition-colors duration-150 hover-lift"
          >
            <Icon name="ArrowPathIcon" size={16} />
            <span>Refresh</span>
          </button>

          {/* Export Button */}
          <button className="flex items-center space-x-2 px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors duration-150 hover-lift">
            <Icon name="ArrowDownTrayIcon" size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="space-y-4">
            {/* Risk Level Filters */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Risk Levels</label>
              <div className="flex items-center space-x-3">
                {riskLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => handleRiskLevelToggle(level.value)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      selectedRiskLevels.includes(level.value)
                        ? 'bg-foreground text-background'
                        : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${level.color}`}></div>
                    <span>{level.label}</span>
                    {selectedRiskLevels.includes(level.value) && (
                      <Icon name="CheckIcon" size={14} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Quick Actions</label>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1.5 bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded text-sm transition-colors duration-150">
                  Clear All Filters
                </button>
                <button className="px-3 py-1.5 bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded text-sm transition-colors duration-150">
                  Save Filter Preset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;