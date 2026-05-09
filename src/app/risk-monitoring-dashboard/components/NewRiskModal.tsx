'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface NewRiskData {
  title: string;
  description: string;
  category: string;
  probability: number;
  impact: number;
  owner: string;
  department: string;
  mitigationStrategy: string;
  nextReview: string;
  tags: string[];
  relatedPolicies: string[];
}

interface NewRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewRiskData) => void;
  className?: string;
}

const NewRiskModal = ({
  isOpen,
  onClose,
  onSubmit,
  className = ''
}: NewRiskModalProps) => {
  const [formData, setFormData] = useState<NewRiskData>({
    title: '',
    description: '',
    category: '',
    probability: 1,
    impact: 1,
    owner: '',
    department: '',
    mitigationStrategy: '',
    nextReview: '',
    tags: [],
    relatedPolicies: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [newTag, setNewTag] = useState('');
  const totalSteps = 3;

  const riskCategories = [
    'Cybersecurity',
    'Regulatory',
    'Third Party',
    'Financial',
    'Operational',
    'Access Control',
    'Compliance',
    'Strategic',
    'Reputational',
    'Environmental'
  ];

  const departments = [
    'IT Security',
    'Legal',
    'Procurement',
    'Finance',
    'Operations',
    'HR',
    'Marketing',
    'Engineering',
    'Sales',
    'Customer Support'
  ];

  const riskOwners = [
    'Sarah Johnson',
    'Michael Chen',
    'Emily Rodriguez',
    'David Kim',
    'Lisa Thompson',
    'James Wilson',
    'Maria Garcia',
    'Robert Taylor',
    'Jennifer Lee',
    'Alex Martinez'
  ];

  const commonPolicies = [
    'Information Security Policy',
    'Data Privacy Policy',
    'Risk Management Policy',
    'Business Continuity Plan',
    'Incident Response Plan',
    'Vendor Management Policy',
    'Access Control Policy',
    'Change Management Policy',
    'Acceptable Use Policy',
    'Compliance Framework'
  ];

  const probabilityLevels = [
    { value: 1, label: 'Very Low', description: 'Highly unlikely to occur (0-5%)', color: 'text-green-600' },
    { value: 2, label: 'Low', description: 'Unlikely but possible (6-25%)', color: 'text-blue-600' },
    { value: 3, label: 'Medium', description: 'Moderate likelihood (26-50%)', color: 'text-yellow-600' },
    { value: 4, label: 'High', description: 'Likely to occur (51-75%)', color: 'text-orange-600' },
    { value: 5, label: 'Very High', description: 'Almost certain to occur (76-100%)', color: 'text-red-600' }
  ];

  const impactLevels = [
    { value: 1, label: 'Very Low', description: 'Minimal business impact', color: 'text-green-600' },
    { value: 2, label: 'Low', description: 'Minor business disruption', color: 'text-blue-600' },
    { value: 3, label: 'Medium', description: 'Moderate business impact', color: 'text-yellow-600' },
    { value: 4, label: 'High', description: 'Significant business disruption', color: 'text-orange-600' },
    { value: 5, label: 'Very High', description: 'Severe business impact', color: 'text-red-600' }
  ];

  const handleInputChange = (field: keyof NewRiskData, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handlePolicyToggle = (policy: string) => {
    setFormData(prev => ({
      ...prev,
      relatedPolicies: prev.relatedPolicies.includes(policy)
        ? prev.relatedPolicies.filter(p => p !== policy)
        : [...prev.relatedPolicies, policy]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const riskScore = formData.probability * formData.impact;
    const riskId = `RSK-${String(Date.now()).slice(-3).padStart(3, '0')}`;
    
    const riskData = {
      ...formData,
      id: riskId,
      riskScore,
      status: 'Open' as const,
      mitigationStatus: 'Planning',
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    onSubmit(riskData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      probability: 1,
      impact: 1,
      owner: '',
      department: '',
      mitigationStrategy: '',
      nextReview: '',
      tags: [],
      relatedPolicies: []
    });
    setCurrentStep(1);
    setNewTag('');
    onClose();
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.category && formData.description;
      case 2:
        return formData.probability && formData.impact && formData.owner && formData.department;
      case 3:
        return true; // Optional step
      default:
        return false;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score <= 5) return 'text-green-600';
    if (score <= 10) return 'text-yellow-600';
    if (score <= 15) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRiskLevel = (score: number) => {
    if (score <= 5) return 'Low';
    if (score <= 10) return 'Medium';
    if (score <= 15) return 'High';
    return 'Critical';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className={`bg-card border border-border rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Create New Risk</h2>
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
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center space-x-4">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div key={index} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                  index + 1 <= currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                {index < totalSteps - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded transition-colors duration-200 ${
                    index + 1 < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Basic Info</span>
            <span>Assessment</span>
            <span>Additional</span>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 p-6 overflow-y-auto">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Risk Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter a clear, descriptive risk title"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-150"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Risk Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-150"
                    required
                  >
                    <option value="">Select a category</option>
                    {riskCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Risk Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Provide a detailed description of the risk, including potential causes, scenarios, and consequences..."
                    rows={6}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-150"
                    required
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Probability Level *
                  </label>
                  <div className="space-y-3">
                    {probabilityLevels.map((level) => (
                      <label key={level.value} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors duration-150">
                        <input
                          type="radio"
                          name="probability"
                          value={level.value}
                          checked={formData.probability === level.value}
                          onChange={(e) => handleInputChange('probability', parseInt(e.target.value))}
                          className="mt-1 text-primary focus:ring-ring"
                        />
                        <div>
                          <p className={`font-medium ${level.color}`}>{level.value} - {level.label}</p>
                          <p className="text-sm text-muted-foreground">{level.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Impact Level *
                  </label>
                  <div className="space-y-3">
                    {impactLevels.map((level) => (
                      <label key={level.value} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors duration-150">
                        <input
                          type="radio"
                          name="impact"
                          value={level.value}
                          checked={formData.impact === level.value}
                          onChange={(e) => handleInputChange('impact', parseInt(e.target.value))}
                          className="mt-1 text-primary focus:ring-ring"
                        />
                        <div>
                          <p className={`font-medium ${level.color}`}>{level.value} - {level.label}</p>
                          <p className="text-sm text-muted-foreground">{level.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Risk Owner *
                    </label>
                    <select
                      value={formData.owner}
                      onChange={(e) => handleInputChange('owner', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-150"
                      required
                    >
                      <option value="">Select owner</option>
                      {riskOwners.map((owner) => (
                        <option key={owner} value={owner}>{owner}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Department *
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-150"
                      required
                    >
                      <option value="">Select department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Risk Score Preview */}
                {formData.probability && formData.impact && (
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Risk Score Preview</h4>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Probability ({formData.probability}) × Impact ({formData.impact}) = </span>
                        <span className={`font-bold ${getRiskScoreColor(formData.probability * formData.impact)}`}>
                          {formData.probability * formData.impact} ({getRiskLevel(formData.probability * formData.impact)})
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mitigation Strategy
                  </label>
                  <textarea
                    value={formData.mitigationStrategy}
                    onChange={(e) => handleInputChange('mitigationStrategy', e.target.value)}
                    placeholder="Describe the planned mitigation strategy, controls, and action items..."
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-150"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Next Review Date
                  </label>
                  <input
                    type="date"
                    value={formData.nextReview}
                    onChange={(e) => handleInputChange('nextReview', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-150"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tags
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="Add a tag"
                      className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-150"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-150"
                    >
                      Add
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-primary hover:text-primary/70"
                          >
                            <Icon name="XMarkIcon" size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Related Policies
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-border rounded-md p-3">
                    {commonPolicies.map((policy) => (
                      <label key={policy} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.relatedPolicies.includes(policy)}
                          onChange={() => handlePolicyToggle(policy)}
                          className="text-primary focus:ring-ring"
                        />
                        <span className="text-sm text-foreground">{policy}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Risk Summary</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Title:</span> {formData.title}</p>
                    <p><span className="font-medium">Category:</span> {formData.category}</p>
                    <p><span className="font-medium">Risk Score:</span> 
                      <span className={`ml-1 font-bold ${getRiskScoreColor(formData.probability * formData.impact)}`}>
                        {formData.probability * formData.impact} ({getRiskLevel(formData.probability * formData.impact)})
                      </span>
                    </p>
                    <p><span className="font-medium">Owner:</span> {formData.owner}</p>
                    <p><span className="font-medium">Department:</span> {formData.department}</p>
                    {formData.nextReview && (
                      <p><span className="font-medium">Next Review:</span> {formData.nextReview}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border">
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
                className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors duration-150"
              >
                Cancel
              </button>
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceedToNext()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canProceedToNext()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  Create Risk
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRiskModal;