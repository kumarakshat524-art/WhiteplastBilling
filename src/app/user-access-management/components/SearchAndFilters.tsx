'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  departmentFilter: string;
  onDepartmentFilterChange: (department: string) => void;
  roleFilter: string;
  onRoleFilterChange: (role: string) => void;
  accessLevelFilter: string;
  onAccessLevelFilterChange: (level: string) => void;
  onClearFilters: () => void;
  departments: string[];
  roles: string[];
  totalUsers: number;
  filteredUsers: number;
}

const SearchAndFilters = ({
  searchQuery,
  onSearchChange,
  departmentFilter,
  onDepartmentFilterChange,
  roleFilter,
  onRoleFilterChange,
  accessLevelFilter,
  onAccessLevelFilterChange,
  onClearFilters,
  departments,
  roles,
  totalUsers,
  filteredUsers
}: SearchAndFiltersProps) => {
  const accessLevels = ['Basic', 'Standard', 'Elevated', 'Admin'];
  
  const hasActiveFilters = departmentFilter || roleFilter || accessLevelFilter || searchQuery;

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Icon
              name="MagnifyingGlassIcon"
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search users, emails, departments..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-150"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                <Icon name="XMarkIcon" size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Department Filter */}
          <div className="relative">
            <select
              value={departmentFilter}
              onChange={(e) => onDepartmentFilterChange(e.target.value)}
              className="appearance-none bg-background border border-border rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-150"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <Icon
              name="ChevronDownIcon"
              size={16}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => onRoleFilterChange(e.target.value)}
              className="appearance-none bg-background border border-border rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-150"
            >
              <option value="">All Roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <Icon
              name="ChevronDownIcon"
              size={16}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>

          {/* Access Level Filter */}
          <div className="relative">
            <select
              value={accessLevelFilter}
              onChange={(e) => onAccessLevelFilterChange(e.target.value)}
              className="appearance-none bg-background border border-border rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-150"
            >
              <option value="">All Access Levels</option>
              {accessLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            <Icon
              name="ChevronDownIcon"
              size={16}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-all duration-150"
            >
              <Icon name="XMarkIcon" size={16} className="inline mr-1" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          Showing {filteredUsers.toLocaleString()} of {totalUsers.toLocaleString()} users
          {hasActiveFilters && (
            <span className="ml-2 text-primary">
              (filtered)
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1.5 text-sm text-foreground border border-border rounded-lg hover:bg-muted transition-all duration-150">
            <Icon name="ArrowDownTrayIcon" size={16} className="inline mr-1" />
            Export
          </button>
          <button className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-150">
            <Icon name="UserPlusIcon" size={16} className="inline mr-1" />
            Add User
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilters;