'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface NewIncidentData {
  title: string;
  incidentType: string;
  severity: string;
  department: string;
  description: string;
  reporterName: string;
  reporterEmail: string;
  dateOccurred: string;
  timeOccurred: string;
  location: string;
  witnessNames: string;
  immediateActions: string;
}

interface NewIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewIncidentData) => void;
  className?: string;
}

const NewIncidentModal = ({
  isOpen,
  onClose,
  onSubmit,
  className = ''
}: NewIncidentModalProps) => {
  const [formData, setFormData] = useState<NewIncidentData>({
    title: '',
    incidentType: '',
    severity: '',
    department: '',
    description: '',
    reporterName: '',
    reporterEmail: '',
    dateOccurred: '',
    timeOccurred: '',
    location: '',
    witnessNames: '',
    immediateActions: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const incidentTypes = [
    'Security Breach',
    'Data Loss',
    'System Outage',
    'Policy Violation',
    'Safety Incident',
    'Compliance Issue',
    'Fraud',
    'Harassment',
    'Environmental',
    'Other'
  ];

  const severityLevels = [
    { value: 'Critical', description: 'Immediate threat to safety, security, or operations' },
    { value: 'High', description: 'Significant impact requiring urgent attention' },
    { value: 'Medium', description: 'Moderate impact with manageable consequences' },
    { value: 'Low', description: 'Minor impact with minimal consequences' }
  ];

  const departments = [
    'IT Security',
    'Human Resources',
    'Finance',
    'Operations',
    'Legal',
    'Marketing',
    'Sales',
    'Customer Service',
    'Engineering',
    'Quality Assurance'
  ];

  const handleInputChange = (field: keyof NewIncidentData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      incidentType: '',
      severity: '',
      department: '',
      description: '',
      reporterName: '',
      reporterEmail: '',
      dateOccurred: '',
      timeOccurred: '',
      location: '',
      witnessNames: '',
      immediateActions: ''
    });
    setCurrentStep(1);
    onClose();
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.incidentType && formData.severity;
      case 2:
        return formData.description && formData.dateOccurred && formData.location;
      case 3:
        return formData.reporterName && formData.reporterEmail;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-300 flex items-center justify-center p-4">
      <div className={`bg-card border border-border rounded-lg shadow-large w-full max-w-2xl max-h-[90vh] flex flex-col ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Report New Incident</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors duration-150"
          >
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center space-x-4">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div key={index} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index + 1 <= currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                {index < totalSteps - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${
                    index + 1 < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 p-6 overflow-y-auto min-h-0">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Incident Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Brief description of the incident"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Incident Type *
                  </label>
                  <select
                    value={formData.incidentType}
                    onChange={(e) => handleInputChange('incidentType', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  >
                    <option value="">Select incident type</option>
                    {incidentTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Severity Level *
                  </label>
                  <div className="space-y-3">
                    {severityLevels.map((level) => (
                      <label key={level.value} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="severity"
                          value={level.value}
                          checked={formData.severity === level.value}
                          onChange={(e) => handleInputChange('severity', e.target.value)}
                          className="mt-1 text-primary focus:ring-ring"
                        />
                        <div>
                          <p className="font-medium text-foreground">{level.value}</p>
                          <p className="text-sm text-muted-foreground">{level.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Provide a detailed description of what happened, including circumstances, people involved, and any immediate impacts..."
                    rows={6}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Date Occurred *
                    </label>
                    <input
                      type="date"
                      value={formData.dateOccurred}
                      onChange={(e) => handleInputChange('dateOccurred', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Time Occurred
                    </label>
                    <input
                      type="time"
                      value={formData.timeOccurred}
                      onChange={(e) => handleInputChange('timeOccurred', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Where did the incident occur?"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Witnesses
                  </label>
                  <textarea
                    value={formData.witnessNames}
                    onChange={(e) => handleInputChange('witnessNames', e.target.value)}
                    placeholder="Names and contact information of any witnesses"
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Immediate Actions Taken
                  </label>
                  <textarea
                    value={formData.immediateActions}
                    onChange={(e) => handleInputChange('immediateActions', e.target.value)}
                    placeholder="Describe any immediate actions taken to address the incident"
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Reporter Name *
                  </label>
                  <input
                    type="text"
                    value={formData.reporterName}
                    onChange={(e) => handleInputChange('reporterName', e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Reporter Email *
                  </label>
                  <input
                    type="email"
                    value={formData.reporterEmail}
                    onChange={(e) => handleInputChange('reporterEmail', e.target.value)}
                    placeholder="your.email@company.com"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Review Your Report</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Title:</span> {formData.title}</p>
                    <p><span className="font-medium">Type:</span> {formData.incidentType}</p>
                    <p><span className="font-medium">Severity:</span> {formData.severity}</p>
                    <p><span className="font-medium">Date:</span> {formData.dateOccurred}</p>
                    <p><span className="font-medium">Location:</span> {formData.location}</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Icon name="ExclamationTriangleIcon" size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-1">Important Notice</h4>
                      <p className="text-sm text-yellow-700">
                        By submitting this report, you confirm that the information provided is accurate to the best of your knowledge. 
                        This incident will be investigated according to company policy and may be shared with relevant stakeholders.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex items-center justify-between p-6 border-t border-border bg-card flex-shrink-0">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors duration-150"
                >
                  Previous
                </button>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors duration-150 border border-border"
              >
                Cancel
              </button>
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceedToNext()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 shadow-sm"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canProceedToNext()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 shadow-sm"
                >
                  Submit Report
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewIncidentModal;