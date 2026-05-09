'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface NewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateReport?: (reportData: any) => void;
}

const NewReportModal = ({ isOpen, onClose, onCreateReport }: NewReportModalProps) => {
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState<'executive' | 'operational' | 'regulatory' | 'custom'>('operational');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('Monthly');
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['pdf']);
  const [dateRange, setDateRange] = useState('6m');
  const [departments, setDepartments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportTypes = [
    { value: 'executive', label: 'Executive Report', icon: 'PresentationChartBarIcon', description: 'High-level summary for leadership' },
    { value: 'operational', label: 'Operational Report', icon: 'ClipboardDocumentListIcon', description: 'Detailed operational metrics' },
    { value: 'regulatory', label: 'Regulatory Report', icon: 'ShieldCheckIcon', description: 'Compliance with regulations' },
    { value: 'custom', label: 'Custom Report', icon: 'Cog6ToothIcon', description: 'Customized report format' }
  ];

  const frequencies = ['Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Yearly', 'On-demand'];
  const formats = ['pdf', 'xlsx', 'csv', 'pptx'];
  const dateRanges = [
    { value: '1m', label: '1 Month' },
    { value: '3m', label: '3 Months' },
    { value: '6m', label: '6 Months' },
    { value: '1y', label: '1 Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const availableDepartments = [
    'IT Security', 'Operations', 'HR', 'Legal', 'Finance', 'Compliance', 'Risk Management', 'Training'
  ];

  const handleFormatToggle = (format: string) => {
    setSelectedFormats(prev => 
      prev.includes(format) 
        ? prev.filter(f => f !== format)
        : [...prev, format]
    );
  };

  const handleDepartmentToggle = (department: string) => {
    setDepartments(prev => 
      prev.includes(department) 
        ? prev.filter(d => d !== department)
        : [...prev, department]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportName.trim() || selectedFormats.length === 0) return;

    setIsSubmitting(true);
    
    const reportData = {
      name: reportName.trim(),
      type: reportType,
      description: description.trim(),
      frequency,
      formats: selectedFormats,
      dateRange,
      departments,
      createdAt: new Date().toISOString()
    };

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      onCreateReport?.(reportData);
      handleClose();
    } catch (error) {
      console.error('Error creating report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setReportName('');
      setReportType('operational');
      setDescription('');
      setFrequency('Monthly');
      setSelectedFormats(['pdf']);
      setDateRange('6m');
      setDepartments([]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Create New Report</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Configure your compliance report settings
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-150 disabled:opacity-50"
          >
            <Icon name="XMarkIcon" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Report Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Report Name *
              </label>
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Enter report name..."
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                required
              />
            </div>

            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Report Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {reportTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setReportType(type.value as any)}
                    className={`p-3 rounded-lg border text-left transition-all duration-150 ${
                      reportType === type.value
                        ? 'border-primary bg-primary/5 text-foreground'
                        : 'border-border hover:border-muted-foreground text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <Icon name={type.icon} size={16} />
                      <span className="font-medium text-sm">{type.label}</span>
                    </div>
                    <p className="text-xs opacity-80">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the report purpose and content..."
                rows={3}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
              />
            </div>

            {/* Frequency and Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                >
                  {frequencies.map((freq) => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                >
                  {dateRanges.map((range) => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Output Formats */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Output Formats *
              </label>
              <div className="flex flex-wrap gap-2">
                {formats.map((format) => (
                  <button
                    key={format}
                    type="button"
                    onClick={() => handleFormatToggle(format)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 border ${
                      selectedFormats.includes(format)
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'bg-muted text-muted-foreground hover:text-foreground border-border hover:border-muted-foreground'
                    }`}
                  >
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
              {selectedFormats.length === 0 && (
                <p className="text-sm text-destructive mt-1">At least one format must be selected</p>
              )}
            </div>

            {/* Departments */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Departments (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {availableDepartments.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => handleDepartmentToggle(dept)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 border ${
                      departments.includes(dept)
                        ? 'bg-secondary text-secondary-foreground border-secondary shadow-sm'
                        : 'bg-muted text-muted-foreground hover:text-foreground border-border hover:border-muted-foreground'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Select departments to include in the report scope
              </p>
            </div>
          </form>
        </div>

        {/* Footer - Fixed and Sticky */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/50 flex-shrink-0">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 disabled:opacity-50 border border-border hover:border-muted-foreground rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !reportName.trim() || selectedFormats.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed border border-primary shadow-sm"
          >
            {isSubmitting && <Icon name="ArrowPathIcon" size={16} className="animate-spin" />}
            <span className="text-sm font-medium">
              {isSubmitting ? 'Creating...' : 'Create Report'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewReportModal;