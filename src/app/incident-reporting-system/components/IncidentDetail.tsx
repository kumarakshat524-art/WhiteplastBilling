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

interface IncidentDetailProps {
  incident: Incident | null;
  onClose: () => void;
  onUpdate: (incident: Incident) => void;
  className?: string;
}

const IncidentDetail = ({
  incident,
  onClose,
  onUpdate,
  className = ''
}: IncidentDetailProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedIncident, setEditedIncident] = useState<Incident | null>(null);

  if (!incident) {
    return (
      <div className={`bg-card border border-border rounded-lg p-8 text-center ${className}`}>
        <Icon name="DocumentTextIcon" size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Select an incident</h3>
        <p className="text-muted-foreground">Choose an incident from the list to view details and manage the investigation.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'DocumentTextIcon' },
    { id: 'investigation', label: 'Investigation', icon: 'MagnifyingGlassIcon' },
    { id: 'actions', label: 'Actions', icon: 'ClipboardDocumentListIcon' },
    { id: 'timeline', label: 'Timeline', icon: 'ClockIcon' },
    { id: 'attachments', label: 'Evidence', icon: 'PaperClipIcon' }
  ];

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handleEdit = () => {
    setEditedIncident({ ...incident });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedIncident) {
      onUpdate(editedIncident);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedIncident(null);
    setIsEditing(false);
  };

  return (
    <div className={`bg-card border border-border rounded-lg flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-foreground">Incident #{incident.id}</h2>
          <span className={`px-3 py-1 text-sm font-medium rounded-md border ${getSeverityColor(incident.severity)}`}>
            {incident.severity}
          </span>
          <span className={`px-3 py-1 text-sm font-medium rounded-md border ${getStatusColor(incident.status)}`}>
            {incident.status}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-150"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-150"
              >
                Save
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors duration-150"
          >
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-150 ${
              activeTab === tab.id
                ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={tab.icon} size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Incident Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Title</label>
                  <p className="text-foreground">{incident.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Type</label>
                  <p className="text-foreground">{incident.incidentType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Reporter</label>
                  <p className="text-foreground">{incident.reporter}</p>
                  <p className="text-sm text-muted-foreground">{incident.reporterEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Department</label>
                  <p className="text-foreground">{incident.department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Date Reported</label>
                  <p className="text-foreground">{formatDate(incident.date)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Assigned Investigator</label>
                  <p className="text-foreground">{incident.assignedInvestigator}</p>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Description</label>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-foreground whitespace-pre-wrap">{incident.description}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Resolution Timeline</label>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-foreground">{incident.resolutionTimeline}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'investigation' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Investigation Notes</h3>
              <div className="space-y-3">
                {incident.investigationNotes.map((note, index) => (
                  <div key={index} className="bg-muted p-4 rounded-lg">
                    <p className="text-foreground">{note}</p>
                  </div>
                ))}
                <button className="w-full p-4 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-150">
                  <Icon name="PlusIcon" size={20} className="mx-auto mb-2" />
                  Add Investigation Note
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Witness Statements</h3>
              <div className="space-y-4">
                {incident.witnesses.map((witness, index) => (
                  <div key={index} className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-foreground">{witness.name}</p>
                        <p className="text-sm text-muted-foreground">{witness.email}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Contacted: {witness.contactDate}</p>
                    </div>
                    <p className="text-foreground">{witness.statement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Corrective Actions</h3>
              <div className="space-y-3">
                {incident.correctiveActions.map((action, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                    <input type="checkbox" className="rounded border-border text-primary focus:ring-ring" />
                    <p className="flex-1 text-foreground">{action}</p>
                    <button className="text-muted-foreground hover:text-foreground">
                      <Icon name="PencilIcon" size={16} />
                    </button>
                  </div>
                ))}
                <button className="w-full p-4 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-150">
                  <Icon name="PlusIcon" size={20} className="mx-auto mb-2" />
                  Add Corrective Action
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Audit Trail</h3>
            <div className="space-y-4">
              {incident.auditTrail.map((entry, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {entry.user.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-foreground">{entry.action}</p>
                      <p className="text-sm text-muted-foreground">{entry.timestamp}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">by {entry.user}</p>
                    <p className="text-foreground">{entry.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'attachments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-foreground">Evidence & Attachments</h3>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-150">
                Upload File
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {incident.attachments.map((file, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                  <Icon name="DocumentIcon" size={24} className="text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {file.size} • Uploaded by {file.uploadedBy} on {file.uploadedAt}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-muted-foreground hover:text-foreground">
                      <Icon name="EyeIcon" size={16} />
                    </button>
                    <button className="p-2 text-muted-foreground hover:text-foreground">
                      <Icon name="ArrowDownTrayIcon" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentDetail;