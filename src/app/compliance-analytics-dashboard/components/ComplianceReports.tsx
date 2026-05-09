'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import NewReportModal from './NewReportModal';

interface Report {
  id: string;
  name: string;
  type: 'executive' | 'operational' | 'regulatory' | 'custom';
  description: string;
  lastGenerated: string;
  frequency: string;
  format: string[];
  size: string;
  status: 'ready' | 'generating' | 'scheduled';
}

interface ComplianceReportsProps {
  reports: Report[];
  onGenerateReport?: (reportId: string) => void;
  onScheduleReport?: (reportId: string) => void;
  onDownloadReport?: (reportId: string, format: string) => void;
}

const ComplianceReports = ({ 
  reports, 
  onGenerateReport, 
  onScheduleReport, 
  onDownloadReport 
}: ComplianceReportsProps) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);

  const reportTypes = [
    { value: 'all', label: 'All Reports', icon: 'DocumentTextIcon' },
    { value: 'executive', label: 'Executive', icon: 'PresentationChartBarIcon' },
    { value: 'operational', label: 'Operational', icon: 'ClipboardDocumentListIcon' },
    { value: 'regulatory', label: 'Regulatory', icon: 'ShieldCheckIcon' },
    { value: 'custom', label: 'Custom', icon: 'Cog6ToothIcon' }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'executive': return 'bg-purple-100 text-purple-700';
      case 'operational': return 'bg-blue-100 text-blue-700';
      case 'regulatory': return 'bg-green-100 text-green-700';
      case 'custom': return 'bg-orange-100 text-orange-700';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-success text-success-foreground';
      case 'generating': return 'bg-warning text-warning-foreground';
      case 'scheduled': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return 'CheckCircleIcon';
      case 'generating': return 'ArrowPathIcon';
      case 'scheduled': return 'ClockIcon';
      default: return 'InformationCircleIcon';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleCreateReport = (reportData: any) => {
    console.log('Creating new report:', reportData);
    // Handle report creation logic here
    // This could involve API calls to save the report configuration
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Compliance Reports</h3>
          <p className="text-sm text-muted-foreground">
            {filteredReports.length} reports available
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Icon
              name="MagnifyingGlassIcon"
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring w-64"
            />
          </div>
          <button 
            onClick={() => setIsNewReportModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-150"
          >
            <Icon name="PlusIcon" size={16} />
            <span className="text-sm font-medium">New Report</span>
          </button>
        </div>
      </div>

      {/* Report Type Filters */}
      <div className="flex items-center space-x-2 mb-6 overflow-x-auto">
        {reportTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setSelectedType(type.value)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 whitespace-nowrap ${
              selectedType === type.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
          >
            <Icon name={type.icon} size={16} />
            <span>{type.label}</span>
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="border border-border rounded-lg p-4 hover:shadow-medium transition-shadow duration-150">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold text-foreground">{report.name}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(report.type)}`}>
                    {report.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
              </div>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                <Icon name={getStatusIcon(report.status)} size={12} />
                <span>{report.status.toUpperCase()}</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Generated:</span>
                <span className="text-foreground">{report.lastGenerated}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frequency:</span>
                <span className="text-foreground">{report.frequency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Size:</span>
                <span className="text-foreground">{report.size}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center space-x-2">
                {report.format.map((format) => (
                  <button
                    key={format}
                    onClick={() => onDownloadReport?.(report.id, format)}
                    className="flex items-center space-x-1 px-2 py-1 bg-muted text-muted-foreground hover:text-foreground rounded text-xs transition-colors duration-150"
                    disabled={report.status === 'generating'}
                  >
                    <Icon name="ArrowDownTrayIcon" size={12} />
                    <span>{format.toUpperCase()}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onScheduleReport?.(report.id)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors duration-150"
                  title="Schedule Report"
                >
                  <Icon name="CalendarIcon" size={16} />
                </button>
                <button
                  onClick={() => onGenerateReport?.(report.id)}
                  className="flex items-center space-x-1 px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors duration-150"
                  disabled={report.status === 'generating'}
                >
                  <Icon name={report.status === 'generating' ? 'ArrowPathIcon' : 'PlayIcon'} size={14} />
                  <span>{report.status === 'generating' ? 'Generating...' : 'Generate'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <Icon name="DocumentTextIcon" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">No Reports Found</h4>
          <p className="text-muted-foreground">
            {searchQuery ? 'Try adjusting your search criteria' : 'Create your first compliance report to get started'}
          </p>
        </div>
      )}

      {/* New Report Modal */}
      <NewReportModal
        isOpen={isNewReportModalOpen}
        onClose={() => setIsNewReportModalOpen(false)}
        onCreateReport={handleCreateReport}
      />
    </div>
  );
};

export default ComplianceReports;