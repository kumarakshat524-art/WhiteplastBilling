'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface BulkActionsProps {
  selectedUserIds: string[];
  onClearSelection: () => void;
  onBulkRoleAssignment: (role: string) => void;
  onBulkAccessModification: (accessLevel: string) => void;
  onBulkReviewSchedule: (reviewDate: Date) => void;
  onBulkExport: () => void;
}

const BulkActions = ({
  selectedUserIds,
  onClearSelection,
  onBulkRoleAssignment,
  onBulkAccessModification,
  onBulkReviewSchedule,
  onBulkExport
}: BulkActionsProps) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showAccessMenu, setShowAccessMenu] = useState(false);
  const [showReviewMenu, setShowReviewMenu] = useState(false);

  const roles = [
    'Compliance Officer',
    'Risk Manager',
    'Internal Auditor',
    'Legal Counsel',
    'Department Manager',
    'Security Analyst',
    'Data Protection Officer'
  ];

  const accessLevels = ['Basic', 'Standard', 'Elevated', 'Admin'];

  const reviewPeriods = [
    { label: '30 days', days: 30 },
    { label: '60 days', days: 60 },
    { label: '90 days', days: 90 },
    { label: '6 months', days: 180 },
    { label: '1 year', days: 365 }
  ];

  if (selectedUserIds.length === 0) {
    return null;
  }

  const handleReviewSchedule = (days: number) => {
    const reviewDate = new Date();
    reviewDate.setDate(reviewDate.getDate() + days);
    onBulkReviewSchedule(reviewDate);
    setShowReviewMenu(false);
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg shadow-large p-4 z-300 notification-slide">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Icon name="CheckCircleIcon" size={20} className="text-primary" />
          <span className="font-medium text-foreground">
            {selectedUserIds.length} user{selectedUserIds.length !== 1 ? 's' : ''} selected
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Role Assignment */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-150"
            >
              <Icon name="UserGroupIcon" size={16} className="inline mr-1" />
              Assign Role
            </button>
            {showRoleMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-popover border border-border rounded-lg shadow-large z-400">
                <div className="p-2">
                  {roles.map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        onBulkRoleAssignment(role);
                        setShowRoleMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors duration-150"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Access Level */}
          <div className="relative">
            <button
              onClick={() => setShowAccessMenu(!showAccessMenu)}
              className="px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors duration-150"
            >
              <Icon name="KeyIcon" size={16} className="inline mr-1" />
              Access Level
            </button>
            {showAccessMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-36 bg-popover border border-border rounded-lg shadow-large z-400">
                <div className="p-2">
                  {accessLevels.map((level) => (
                    <button
                      key={level}
                      onClick={() => {
                        onBulkAccessModification(level);
                        setShowAccessMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors duration-150"
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Schedule Review */}
          <div className="relative">
            <button
              onClick={() => setShowReviewMenu(!showReviewMenu)}
              className="px-3 py-2 text-sm bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors duration-150"
            >
              <Icon name="CalendarIcon" size={16} className="inline mr-1" />
              Schedule Review
            </button>
            {showReviewMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-36 bg-popover border border-border rounded-lg shadow-large z-400">
                <div className="p-2">
                  {reviewPeriods.map((period) => (
                    <button
                      key={period.days}
                      onClick={() => handleReviewSchedule(period.days)}
                      className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors duration-150"
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Export */}
          <button
            onClick={onBulkExport}
            className="px-3 py-2 text-sm border border-border text-foreground rounded-lg hover:bg-muted transition-colors duration-150"
          >
            <Icon name="ArrowDownTrayIcon" size={16} className="inline mr-1" />
            Export
          </button>

          {/* Clear Selection */}
          <button
            onClick={onClearSelection}
            className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors duration-150"
          >
            <Icon name="XMarkIcon" size={16} className="inline mr-1" />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;