'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface NewTaskData {
  title: string;
  description: string;
  assignee: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  category: string;
  dueDate: string;
  estimatedHours: string;
  tags: string[];
  relatedPolicies: string[];
  attachments: string[];
}

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewTaskData) => void;
  className?: string;
}

const NewTaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  className = ''
}: NewTaskModalProps) => {
  const [formData, setFormData] = useState<NewTaskData>({
    title: '',
    description: '',
    assignee: '',
    priority: 'Medium',
    category: '',
    dueDate: '',
    estimatedHours: '',
    tags: [],
    relatedPolicies: [],
    attachments: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [newTag, setNewTag] = useState('');
  const totalSteps = 3;

  const assignees = [
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

  const priorityLevels = [
    { value: 'Critical', description: 'Urgent compliance requirement with immediate deadline', color: 'text-red-600' },
    { value: 'High', description: 'Important task requiring prompt attention', color: 'text-orange-600' },
    { value: 'Medium', description: 'Standard priority task with normal timeline', color: 'text-yellow-600' },
    { value: 'Low', description: 'Lower priority task that can be scheduled flexibly', color: 'text-blue-600' }
  ];

  const categories = [
    'Policy Updates',
    'GDPR Compliance',
    'SOC 2 Evidence',
    'Vendor Assessments',
    'Access Reviews',
    'Security Audits',
    'Training & Awareness',
    'Risk Assessments',
    'Incident Response',
    'Regulatory Reporting',
    'Documentation',
    'Process Improvement'
  ];

  const commonPolicies = [
    'Data Privacy Policy',
    'Information Security Policy',
    'Acceptable Use Policy',
    'Incident Response Plan',
    'Business Continuity Plan',
    'Vendor Management Policy',
    'Access Control Policy',
    'Change Management Policy'
  ];

  const handleInputChange = (field: keyof NewTaskData, value: string | string[]) => {
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
    
    // Generate a unique task ID
    const taskId = `CT-${String(Date.now()).slice(-3).padStart(3, '0')}`;
    
    const taskData = {
      ...formData,
      id: taskId,
      status: 'Pending' as const,
      completionPercentage: 0,
      timeTracked: '0h',
      lastUpdated: new Date().toISOString(),
      isActive: false
    };
    
    onSubmit(taskData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      assignee: '',
      priority: 'Medium',
      category: '',
      dueDate: '',
      estimatedHours: '',
      tags: [],
      relatedPolicies: [],
      attachments: []
    });
    setCurrentStep(1);
    setNewTag('');
    onClose();
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.category && formData.priority;
      case 2:
        return formData.description && formData.assignee && formData.dueDate;
      case 3:
        return true; // Optional step
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className={`bg-card border border-border rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Create New Task</h2>
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
            <span>Details</span>
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
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter a clear, descriptive task title"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-150"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-150"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Priority Level *
                  </label>
                  <div className="space-y-3">
                    {priorityLevels.map((level) => (
                      <label key={level.value} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors duration-150">
                        <input
                          type="radio"
                          name="priority"
                          value={level.value}
                          checked={formData.priority === level.value}
                          onChange={(e) => handleInputChange('priority', e.target.value as NewTaskData['priority'])}
                          className="mt-1 text-primary focus:ring-ring"
                        />
                        <div>
                          <p className={`font-medium ${level.color}`}>{level.value}</p>
                          <p className="text-sm text-muted-foreground">{level.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Task Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Provide a detailed description of the task, including objectives, requirements, and expected deliverables..."
                    rows={6}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-150"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Assignee *
                    </label>
                    <select
                      value={formData.assignee}
                      onChange={(e) => handleInputChange('assignee', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-150"
                      required
                    >
                      <option value="">Select assignee</option>
                      {assignees.map((assignee) => (
                        <option key={assignee} value={assignee}>{assignee}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-150"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedHours}
                    onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
                    placeholder="Estimated hours to complete"
                    min="0.5"
                    step="0.5"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-150"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
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
                  <h4 className="font-medium text-foreground mb-2">Task Summary</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Title:</span> {formData.title}</p>
                    <p><span className="font-medium">Category:</span> {formData.category}</p>
                    <p><span className="font-medium">Priority:</span> {formData.priority}</p>
                    <p><span className="font-medium">Assignee:</span> {formData.assignee}</p>
                    <p><span className="font-medium">Due Date:</span> {formData.dueDate}</p>
                    {formData.estimatedHours && (
                      <p><span className="font-medium">Estimated Hours:</span> {formData.estimatedHours}h</p>
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
                  Create Task
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;