'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface QuickActionsProps {
  selectedRisksCount: number;
  onBulkAssign: () => void;
  onBulkStatusUpdate: () => void;
  onBulkExport: () => void;
  onCreateRisk: () => void;
  onGenerateReport: () => void;
}

const QuickActions = ({
  selectedRisksCount,
  onBulkAssign,
  onBulkStatusUpdate,
  onBulkExport,
  onCreateRisk,
  onGenerateReport
}: QuickActionsProps) => {
  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-sm font-medium text-foreground">Quick Actions</h3>
          {selectedRisksCount > 0 && (
            <span className="text-sm text-muted-foreground">
              {selectedRisksCount} risk{selectedRisksCount !== 1 ? 's' : ''} selected
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Bulk Actions (shown when risks are selected) */}
          {selectedRisksCount > 0 && (
            <>
              <button
                onClick={onBulkAssign}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors duration-150"
              >
                <Icon name="UserIcon" size={16} className="mr-2" />
                Assign
              </button>
              <button
                onClick={onBulkStatusUpdate}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors duration-150"
              >
                <Icon name="ArrowPathIcon" size={16} className="mr-2" />
                Update Status
              </button>
              <button
                onClick={onBulkExport}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors duration-150"
              >
                <Icon name="ArrowDownTrayIcon" size={16} className="mr-2" />
                Export
              </button>
              <div className="w-px h-6 bg-border mx-2"></div>
            </>
          )}
          
          {/* Standard Actions */}
          <button
            onClick={onCreateRisk}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors duration-150"
          >
            <Icon name="PlusIcon" size={16} className="mr-2" />
            New Risk
          </button>
          <button
            onClick={onGenerateReport}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors duration-150"
          >
            <Icon name="DocumentChartBarIcon" size={16} className="mr-2" />
            Generate Report
          </button>
          
          {/* More Actions Dropdown */}
          <div className="relative">
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-150">
              <Icon name="EllipsisHorizontalIcon" size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Keyboard Shortcuts Hint */}
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+N</kbd> New Risk
            </span>
            <span>
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+A</kbd> Select All
            </span>
            <span>
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Del</kbd> Delete Selected
            </span>
          </div>
          <span>Press <kbd className="px-2 py-1 bg-muted rounded text-xs">?</kbd> for more shortcuts</span>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;