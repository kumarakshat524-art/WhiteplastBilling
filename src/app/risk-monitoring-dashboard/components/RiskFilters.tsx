'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

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

interface RiskFiltersProps {
  filterOptions: FilterOptions;
  activeFilters: ActiveFilters;
  onFilterChange: (filters: ActiveFilters) => void;
  onClearFilters: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const RiskFilters = ({
  filterOptions,
  activeFilters,
  onFilterChange,
  onClearFilters,
  isCollapsed,
  onToggleCollapse
}: RiskFiltersProps) => {
  const handleFilterToggle = (category: keyof ActiveFilters, value: string) => {
    if (category === 'searchQuery') return;
    
    const currentValues = activeFilters[category] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange({
      ...activeFilters,
      [category]: newValues
    });
  };

  const handleSearchChange = (query: string) => {
    onFilterChange({
      ...activeFilters,
      searchQuery: query
    });
  };

  const getActiveFilterCount = () => {
    return activeFilters.departments.length + 
           activeFilters.categories.length + 
           activeFilters.severityLevels.length + 
           activeFilters.statuses.length +
           (activeFilters.searchQuery ? 1 : 0);
  };

  const FilterSection = ({ 
    title, 
    options, 
    category, 
    activeValues 
  }: { 
    title: string; 
    options: string[]; 
    category: keyof ActiveFilters; 
    activeValues: string[] 
  }) => (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-foreground mb-3">{title}</h4>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={activeValues.includes(option)}
              onChange={() => handleFilterToggle(category, option)}
              className="rounded border-border text-primary focus:ring-primary focus:ring-offset-0 mr-3"
            />
            <span className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`bg-card border-r border-border transition-all duration-300 ${isCollapsed ? 'w-0' : 'w-80'} overflow-hidden`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-foreground">Filters</h3>
            {getActiveFilterCount() > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {getActiveFilterCount() > 0 && (
              <button
                onClick={onClearFilters}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onToggleCollapse}
              className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors duration-150"
            >
              <Icon name="XMarkIcon" size={16} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Search</h4>
          <div className="relative">
            <Icon
              name="MagnifyingGlassIcon"
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search risks..."
              value={activeFilters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Department Filter */}
        <FilterSection
          title="Department"
          options={filterOptions.departments}
          category="departments"
          activeValues={activeFilters.departments}
        />

        {/* Category Filter */}
        <FilterSection
          title="Risk Category"
          options={filterOptions.categories}
          category="categories"
          activeValues={activeFilters.categories}
        />

        {/* Severity Filter */}
        <FilterSection
          title="Severity Level"
          options={filterOptions.severityLevels}
          category="severityLevels"
          activeValues={activeFilters.severityLevels}
        />

        {/* Status Filter */}
        <FilterSection
          title="Mitigation Status"
          options={filterOptions.statuses}
          category="statuses"
          activeValues={activeFilters.statuses}
        />

        {/* Saved Filters */}
        <div className="border-t border-border pt-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Saved Filters</h4>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-150">
              Critical Risks Only
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-150">
              Overdue Reviews
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-150">
              My Department
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskFilters;