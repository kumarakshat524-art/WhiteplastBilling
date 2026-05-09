'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import PolicyDetailModal from './PolicyDetailModal';

interface Policy {
  id: string;
  title: string;
  version: string;
  status: 'Draft' | 'Under Review' | 'Approved' | 'Published' | 'Archived';
  owner: string;
  lastUpdated: Date;
  complianceScore: number;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate?: Date;
  reviewers: number;
  comments: number;
}

interface PolicyListProps {
  selectedCategory: string | null;
  selectedPolicy: string | null;
  onPolicySelect: (policyId: string) => void;
  searchQuery: string;
}

const PolicyList = ({ selectedCategory, selectedPolicy, onPolicySelect, searchQuery }: PolicyListProps) => {
  const [sortBy, setSortBy] = useState<'title' | 'lastUpdated' | 'status' | 'compliance'>('lastUpdated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedPolicies, setSelectedPolicies] = useState<Set<string>>(new Set());
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalPolicy, setModalPolicy] = useState<Policy | null>(null);

  const policies: Policy[] = [
    {
      id: 'pol-001',
      title: 'Employee Code of Conduct',
      version: '3.2',
      status: 'Published',
      owner: 'Sarah Johnson',
      lastUpdated: new Date('2024-11-10T14:30:00'),
      complianceScore: 95,
      category: 'hr-conduct',
      priority: 'High',
      reviewers: 3,
      comments: 2
    },
    {
      id: 'pol-002',
      title: 'Data Privacy and Protection Policy',
      version: '2.1',
      status: 'Under Review',
      owner: 'Michael Chen',
      lastUpdated: new Date('2024-11-12T09:15:00'),
      complianceScore: 88,
      category: 'dp-privacy',
      priority: 'Critical',
      dueDate: new Date('2024-11-20T17:00:00'),
      reviewers: 5,
      comments: 8
    },
    {
      id: 'pol-003',
      title: 'IT Security Access Control',
      version: '1.8',
      status: 'Approved',
      owner: 'Lisa Rodriguez',
      lastUpdated: new Date('2024-11-08T16:45:00'),
      complianceScore: 92,
      category: 'it-security',
      priority: 'High',
      reviewers: 2,
      comments: 1
    },
    {
      id: 'pol-004',
      title: 'Remote Work Guidelines',
      version: '2.0',
      status: 'Draft',
      owner: 'David Kim',
      lastUpdated: new Date('2024-11-14T08:20:00'),
      complianceScore: 76,
      category: 'hr-employment',
      priority: 'Medium',
      dueDate: new Date('2024-11-25T17:00:00'),
      reviewers: 0,
      comments: 0
    },
    {
      id: 'pol-005',
      title: 'Incident Response Procedures',
      version: '1.5',
      status: 'Published',
      owner: 'Jennifer Walsh',
      lastUpdated: new Date('2024-11-05T11:30:00'),
      complianceScore: 98,
      category: 'sec-incident',
      priority: 'Critical',
      reviewers: 4,
      comments: 3
    },
    {
      id: 'pol-006',
      title: 'Vendor Risk Assessment Framework',
      version: '1.2',
      status: 'Under Review',
      owner: 'Robert Taylor',
      lastUpdated: new Date('2024-11-13T13:45:00'),
      complianceScore: 84,
      category: 'sec-vendor',
      priority: 'High',
      dueDate: new Date('2024-11-18T17:00:00'),
      reviewers: 3,
      comments: 5
    }
  ];

  const filteredPolicies = policies.filter(policy => {
    const matchesCategory = !selectedCategory || selectedCategory === '' || policy.category.startsWith(selectedCategory);
    const matchesSearch = !searchQuery || 
      policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.status.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const sortedPolicies = [...filteredPolicies].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'lastUpdated':
        comparison = a.lastUpdated.getTime() - b.lastUpdated.getTime();
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'compliance':
        comparison = a.complianceScore - b.complianceScore;
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const togglePolicySelection = (policyId: string) => {
    const newSelected = new Set(selectedPolicies);
    if (newSelected.has(policyId)) {
      newSelected.delete(policyId);
    } else {
      newSelected.add(policyId);
    }
    setSelectedPolicies(newSelected);
  };

  const selectAllPolicies = () => {
    if (selectedPolicies.size === sortedPolicies.length) {
      setSelectedPolicies(new Set());
    } else {
      setSelectedPolicies(new Set(sortedPolicies.map(p => p.id)));
    }
  };

  const handlePolicyClick = (policy: Policy) => {
    setModalPolicy(policy);
    setShowDetailModal(true);
    onPolicySelect(policy.id);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setModalPolicy(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-success/10 text-success border-success/20';
      case 'Approved': return 'bg-primary/10 text-primary border-primary/20';
      case 'Under Review': return 'bg-warning/10 text-warning border-warning/20';
      case 'Draft': return 'bg-muted text-muted-foreground border-border';
      case 'Archived': return 'bg-secondary/10 text-secondary border-secondary/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-error';
      case 'High': return 'text-warning';
      case 'Medium': return 'text-primary';
      case 'Low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate?: Date) => {
    if (!dueDate) return false;
    return dueDate < new Date();
  };

  return (
    <>
      <div className="h-full bg-card">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Policy Library</h2>
              <div className="text-sm text-muted-foreground">
                {sortedPolicies.length} policies found
              </div>
            </div>
            
            {selectedPolicies.size > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {selectedPolicies.size} selected
                </span>
                <button className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-colors duration-150">
                  Bulk Actions
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleSort('title')}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors duration-150 ${
                sortBy === 'title' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
              }`}
            >
              Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('lastUpdated')}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors duration-150 ${
                sortBy === 'lastUpdated' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
              }`}
            >
              Updated {sortBy === 'lastUpdated' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('status')}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors duration-150 ${
                sortBy === 'status' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
              }`}
            >
              Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('compliance')}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors duration-150 ${
                sortBy === 'compliance' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
              }`}
            >
              Compliance {sortBy === 'compliance' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>

        <div className="overflow-y-auto" style={{ height: 'calc(100vh - 240px)' }}>
          <div className="p-4">
            <div className="space-y-2">
              <div className="flex items-center p-2 border-b border-border">
                <input
                  type="checkbox"
                  checked={selectedPolicies.size === sortedPolicies.length && sortedPolicies.length > 0}
                  onChange={selectAllPolicies}
                  className="mr-3 rounded border-border focus:ring-2 focus:ring-ring"
                />
                <div className="text-sm font-medium text-muted-foreground">Select All</div>
              </div>

              {sortedPolicies.map((policy) => (
                <div
                  key={policy.id}
                  className={`
                    p-4 rounded-lg border cursor-pointer transition-all duration-150 hover-lift
                    ${selectedPolicy === policy.id ? 'border-primary bg-primary/5' : 'border-border hover:border-border/60 hover:bg-muted/50'}
                  `}
                  onClick={() => handlePolicyClick(policy)}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedPolicies.has(policy.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        togglePolicySelection(policy.id);
                      }}
                      className="mt-1 rounded border-border focus:ring-2 focus:ring-ring"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">{policy.title}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-muted-foreground">v{policy.version}</span>
                            <span className="text-sm text-muted-foreground">by {policy.owner}</span>
                            <span className="text-sm text-muted-foreground">
                              Updated {formatDate(policy.lastUpdated)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Icon
                            name="ExclamationCircleIcon"
                            size={16}
                            className={getPriorityColor(policy.priority)}
                          />
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(policy.status)}`}>
                            {policy.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  policy.complianceScore >= 95 ? 'bg-success' :
                                  policy.complianceScore >= 85 ? 'bg-warning' : 'bg-error'
                                }`}
                                style={{ width: `${policy.complianceScore}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">{policy.complianceScore}%</span>
                          </div>
                          
                          {policy.reviewers > 0 && (
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <Icon name="UsersIcon" size={14} />
                              <span>{policy.reviewers}</span>
                            </div>
                          )}
                          
                          {policy.comments > 0 && (
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <Icon name="ChatBubbleLeftIcon" size={14} />
                              <span>{policy.comments}</span>
                            </div>
                          )}
                        </div>
                        
                        {policy.dueDate && (
                          <div className={`text-sm ${isOverdue(policy.dueDate) ? 'text-error' : 'text-muted-foreground'}`}>
                            Due {formatDate(policy.dueDate)}
                            {isOverdue(policy.dueDate) && (
                              <Icon name="ExclamationTriangleIcon" size={14} className="inline ml-1" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <PolicyDetailModal
        isOpen={showDetailModal}
        onClose={handleCloseModal}
        policy={modalPolicy}
      />
    </>
  );
};

export default PolicyList;