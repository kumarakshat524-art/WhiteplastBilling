'use client';

import React, { useState } from 'react';
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
}

interface IncidentListProps {
  incidents: Incident[];
  selectedIncidents: string[];
  onIncidentSelect: (incidentId: string) => void;
  onIncidentClick?: (incident: Incident) => void;
  onBulkAction: (action: string, incidentIds: string[]) => void;
  className?: string;
}

const IncidentList = ({
  incidents,
  selectedIncidents,
  onIncidentSelect,
  onIncidentClick,
  onBulkAction,
  className = ''
}: IncidentListProps) => {
  const [sortField, setSortField] = useState<keyof Incident>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showBulkActions, setShowBulkActions] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Investigation': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Pending Approval': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSort = (field: keyof Incident) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedIncidents = [...incidents].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSelectAll = () => {
    if (selectedIncidents.length === incidents.length) {
      // Deselect all
      incidents.forEach(incident => onIncidentSelect(incident.id));
    } else {
      // Select all
      incidents.forEach(incident => {
        if (!selectedIncidents.includes(incident.id)) {
          onIncidentSelect(incident.id);
        }
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Header with Bulk Actions */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <h3 className="font-medium text-foreground">
            Incidents ({incidents.length})
          </h3>
          {selectedIncidents.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {selectedIncidents.length} selected
            </span>
          )}
        </div>
        
        {selectedIncidents.length > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-150"
            >
              Bulk Actions
            </button>
            {showBulkActions && (
              <div className="absolute top-full right-0 mt-1 bg-popover border border-border rounded-lg shadow-large z-50 min-w-48">
                <button
                  onClick={() => onBulkAction('assign', selectedIncidents)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors duration-150"
                >
                  Assign Investigator
                </button>
                <button
                  onClick={() => onBulkAction('status', selectedIncidents)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors duration-150"
                >
                  Update Status
                </button>
                <button
                  onClick={() => onBulkAction('escalate', selectedIncidents)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors duration-150"
                >
                  Escalate
                </button>
                <button
                  onClick={() => onBulkAction('export', selectedIncidents)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors duration-150"
                >
                  Export Selected
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table Header - Improved column width distribution to prevent header misalignment */}
      <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-muted/50 border-b border-border text-sm font-medium text-muted-foreground">
        <div className="col-span-1 flex items-center">
          <input
            type="checkbox"
            checked={selectedIncidents.length === incidents.length && incidents.length > 0}
            onChange={handleSelectAll}
            className="rounded border-border text-primary focus:ring-ring"
          />
        </div>
        <div 
          className="col-span-1 flex items-center cursor-pointer hover:text-foreground"
          onClick={() => handleSort('id')}
        >
          <span className="truncate">ID</span>
          {sortField === 'id' && (
            <Icon name={sortDirection === 'asc' ? "ChevronUpIcon" : "ChevronDownIcon"} size={14} className="ml-1 flex-shrink-0" />
          )}
        </div>
        <div 
          className="col-span-3 flex items-center cursor-pointer hover:text-foreground"
          onClick={() => handleSort('title')}
        >
          <span className="truncate">Title</span>
          {sortField === 'title' && (
            <Icon name={sortDirection === 'asc' ? "ChevronUpIcon" : "ChevronDownIcon"} size={14} className="ml-1 flex-shrink-0" />
          )}
        </div>
        <div 
          className="col-span-2 flex items-center cursor-pointer hover:text-foreground"
          onClick={() => handleSort('reporter')}
        >
          <span className="truncate">Reporter</span>
          {sortField === 'reporter' && (
            <Icon name={sortDirection === 'asc' ? "ChevronUpIcon" : "ChevronDownIcon"} size={14} className="ml-1 flex-shrink-0" />
          )}
        </div>
        <div 
          className="col-span-1 flex items-center cursor-pointer hover:text-foreground"
          onClick={() => handleSort('date')}
        >
          <span className="truncate">Date</span>
          {sortField === 'date' && (
            <Icon name={sortDirection === 'asc' ? "ChevronUpIcon" : "ChevronDownIcon"} size={14} className="ml-1 flex-shrink-0" />
          )}
        </div>
        <div 
          className="col-span-1 flex items-center cursor-pointer hover:text-foreground"
          onClick={() => handleSort('severity')}
        >
          <span className="truncate">Severity</span>
          {sortField === 'severity' && (
            <Icon name={sortDirection === 'asc' ? "ChevronUpIcon" : "ChevronDownIcon"} size={14} className="ml-1 flex-shrink-0" />
          )}
        </div>
        <div 
          className="col-span-1 flex items-center cursor-pointer hover:text-foreground"
          onClick={() => handleSort('status')}
        >
          <span className="truncate">Status</span>
          {sortField === 'status' && (
            <Icon name={sortDirection === 'asc' ? "ChevronUpIcon" : "ChevronDownIcon"} size={14} className="ml-1 flex-shrink-0" />
          )}
        </div>
        <div 
          className="col-span-2 flex items-center cursor-pointer hover:text-foreground"
          onClick={() => handleSort('assignedInvestigator')}
        >
          <span className="truncate">Investigator</span>
          {sortField === 'assignedInvestigator' && (
            <Icon name={sortDirection === 'asc' ? "ChevronUpIcon" : "ChevronDownIcon"} size={14} className="ml-1 flex-shrink-0" />
          )}
        </div>
      </div>

      {/* Incident Rows - Fixed text overlap and improved spacing */}
      <div className="max-h-96 overflow-y-auto">
        {sortedIncidents.map((incident) => (
          <div
            key={incident.id}
            className={`grid grid-cols-12 gap-3 px-4 py-3 border-b border-border hover:bg-muted/50 transition-colors duration-150 ${
              selectedIncidents.includes(incident.id) ? 'bg-primary/5' : ''
            } ${onIncidentClick ? 'cursor-pointer' : ''}`}
            onClick={() => onIncidentClick?.(incident)}
          >
            <div className="col-span-1 flex items-center">
              <input
                type="checkbox"
                checked={selectedIncidents.includes(incident.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  onIncidentSelect(incident.id);
                }}
                className="rounded border-border text-primary focus:ring-ring"
              />
            </div>
            <div className="col-span-1 flex items-center min-w-0">
              <span className="text-xs font-mono text-muted-foreground truncate">#{incident.id}</span>
            </div>
            <div className="col-span-3 flex items-start min-w-0 py-1">
              <div className="min-w-0 w-full">
                <p className="text-sm font-medium text-foreground truncate leading-tight">{incident.title}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{incident.incidentType}</p>
              </div>
            </div>
            <div className="col-span-2 flex items-start min-w-0 py-1">
              <div className="min-w-0 w-full">
                <p className="text-sm text-foreground truncate leading-tight">{incident.reporter}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{incident.department}</p>
              </div>
            </div>
            <div className="col-span-1 flex items-start min-w-0 py-1">
              <div className="min-w-0 w-full">
                <p className="text-sm text-foreground truncate leading-tight">{formatDate(incident.date)}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{formatTime(incident.date)}</p>
              </div>
            </div>
            <div className="col-span-1 flex items-center min-w-0">
              <span className={`px-1.5 py-0.5 text-xs font-medium rounded border truncate ${getSeverityColor(incident.severity)}`}>
                {incident.severity}
              </span>
            </div>
            <div className="col-span-1 flex items-center min-w-0">
              <span className={`px-1.5 py-0.5 text-xs font-medium rounded border truncate ${getStatusColor(incident.status)}`}>
                {incident.status}
              </span>
            </div>
            <div className="col-span-2 flex items-center space-x-2 min-w-0">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                {incident.assignedInvestigator.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="text-sm text-foreground truncate">{incident.assignedInvestigator}</span>
            </div>
          </div>
        ))}
      </div>

      {incidents.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="ExclamationTriangleIcon" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No incidents found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default IncidentList;