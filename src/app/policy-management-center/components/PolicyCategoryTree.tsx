'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface PolicyCategory {
  id: string;
  name: string;
  icon: string;
  totalPolicies: number;
  compliantPolicies: number;
  compliancePercentage: number;
  subcategories?: PolicyCategory[];
  isExpanded?: boolean;
}

interface PolicyCategoryTreeProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
}

const PolicyCategoryTree = ({ selectedCategory, onCategorySelect }: PolicyCategoryTreeProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['hr', 'it', 'data-protection', 'security']));

  const categories: PolicyCategory[] = [
    {
      id: 'hr',
      name: 'HR Policies',
      icon: 'UsersIcon',
      totalPolicies: 24,
      compliantPolicies: 22,
      compliancePercentage: 92,
      subcategories: [
        { id: 'hr-employment', name: 'Employment', icon: 'BriefcaseIcon', totalPolicies: 8, compliantPolicies: 8, compliancePercentage: 100 },
        { id: 'hr-benefits', name: 'Benefits', icon: 'HeartIcon', totalPolicies: 6, compliantPolicies: 5, compliancePercentage: 83 },
        { id: 'hr-conduct', name: 'Code of Conduct', icon: 'ScaleIcon', totalPolicies: 10, compliantPolicies: 9, compliancePercentage: 90 }
      ]
    },
    {
      id: 'it',
      name: 'IT Policies',
      icon: 'ComputerDesktopIcon',
      totalPolicies: 18,
      compliantPolicies: 15,
      compliancePercentage: 83,
      subcategories: [
        { id: 'it-security', name: 'IT Security', icon: 'LockClosedIcon', totalPolicies: 8, compliantPolicies: 7, compliancePercentage: 88 },
        { id: 'it-usage', name: 'Acceptable Use', icon: 'DevicePhoneMobileIcon', totalPolicies: 5, compliantPolicies: 4, compliancePercentage: 80 },
        { id: 'it-access', name: 'Access Control', icon: 'KeyIcon', totalPolicies: 5, compliantPolicies: 4, compliancePercentage: 80 }
      ]
    },
    {
      id: 'data-protection',
      name: 'Data Protection',
      icon: 'ShieldCheckIcon',
      totalPolicies: 12,
      compliantPolicies: 11,
      compliancePercentage: 92,
      subcategories: [
        { id: 'dp-privacy', name: 'Privacy Policy', icon: 'EyeSlashIcon', totalPolicies: 4, compliantPolicies: 4, compliancePercentage: 100 },
        { id: 'dp-retention', name: 'Data Retention', icon: 'ArchiveBoxIcon', totalPolicies: 4, compliantPolicies: 3, compliancePercentage: 75 },
        { id: 'dp-breach', name: 'Breach Response', icon: 'ExclamationTriangleIcon', totalPolicies: 4, compliantPolicies: 4, compliancePercentage: 100 }
      ]
    },
    {
      id: 'security',
      name: 'Security Policies',
      icon: 'ShieldExclamationIcon',
      totalPolicies: 16,
      compliantPolicies: 13,
      compliancePercentage: 81,
      subcategories: [
        { id: 'sec-physical', name: 'Physical Security', icon: 'BuildingOfficeIcon', totalPolicies: 6, compliantPolicies: 5, compliancePercentage: 83 },
        { id: 'sec-incident', name: 'Incident Response', icon: 'BellAlertIcon', totalPolicies: 5, compliantPolicies: 4, compliancePercentage: 80 },
        { id: 'sec-vendor', name: 'Vendor Management', icon: 'TruckIcon', totalPolicies: 5, compliantPolicies: 4, compliancePercentage: 80 }
      ]
    }
  ];

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getComplianceColor = (percentage: number) => {
    if (percentage >= 95) return 'text-success';
    if (percentage >= 85) return 'text-warning';
    return 'text-error';
  };

  const getComplianceBgColor = (percentage: number) => {
    if (percentage >= 95) return 'bg-success/10';
    if (percentage >= 85) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const renderCategory = (category: PolicyCategory, level: number = 0) => {
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategory === category.id;
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;

    return (
      <div key={category.id} className="mb-1">
        <div
          className={`
            flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-150 hover-lift
            ${isSelected ? 'bg-primary text-primary-foreground shadow-subtle' : 'hover:bg-muted'}
            ${level > 0 ? 'ml-6' : ''}
          `}
          onClick={() => onCategorySelect(category.id)}
        >
          <div className="flex items-center flex-1 min-w-0">
            {hasSubcategories && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCategory(category.id);
                }}
                className="mr-2 p-1 hover:bg-black/10 rounded transition-colors duration-150"
              >
                <Icon
                  name={isExpanded ? 'ChevronDownIcon' : 'ChevronRightIcon'}
                  size={16}
                  className={isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}
                />
              </button>
            )}
            <Icon
              name={category.icon}
              size={18}
              className={`mr-3 flex-shrink-0 ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`}
            />
            <div className="flex-1 min-w-0">
              <div className={`font-medium text-sm truncate ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                {category.name}
              </div>
              <div className={`text-xs ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                {category.compliantPolicies}/{category.totalPolicies} compliant
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-2">
            <div className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${isSelected 
                ? 'bg-primary-foreground/20 text-primary-foreground' 
                : `${getComplianceBgColor(category.compliancePercentage)} ${getComplianceColor(category.compliancePercentage)}`
              }
            `}>
              {category.compliancePercentage}%
            </div>
          </div>
        </div>

        {hasSubcategories && isExpanded && (
          <div className="mt-1">
            {category.subcategories!.map(subcategory => renderCategory(subcategory, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full bg-card border-r border-border">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-2">Policy Categories</h2>
        <div className="text-sm text-muted-foreground">
          Organize and track policy compliance by category
        </div>
      </div>
      
      <div className="p-4 space-y-2 overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
        <div
          className={`
            flex items-center p-3 rounded-lg cursor-pointer transition-all duration-150 hover-lift mb-4
            ${selectedCategory === null ? 'bg-primary text-primary-foreground shadow-subtle' : 'hover:bg-muted'}
          `}
          onClick={() => onCategorySelect('')}
        >
          <Icon
            name="FolderIcon"
            size={18}
            className={`mr-3 ${selectedCategory === null ? 'text-primary-foreground' : 'text-muted-foreground'}`}
          />
          <div className="flex-1">
            <div className={`font-medium text-sm ${selectedCategory === null ? 'text-primary-foreground' : 'text-foreground'}`}>
              All Policies
            </div>
            <div className={`text-xs ${selectedCategory === null ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
              View all organizational policies
            </div>
          </div>
        </div>

        {categories.map(category => renderCategory(category))}
      </div>
    </div>
  );
};

export default PolicyCategoryTree;