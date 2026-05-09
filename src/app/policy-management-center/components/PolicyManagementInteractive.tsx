'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import Breadcrumb from '@/components/common/Breadcrumb';
import PolicyCategoryTree from './PolicyCategoryTree';
import PolicyList from './PolicyList';
import Icon from '@/components/ui/AppIcon';

const PolicyManagementInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-16 bg-card border-b border-border"></div>
          <div className="flex">
            <div className="w-64 h-screen bg-card border-r border-border"></div>
            <div className="flex-1 p-6">
              <div className="h-8 bg-muted rounded mb-4"></div>
              <div className="grid grid-cols-4 gap-6">
                <div className="h-32 bg-card rounded-lg"></div>
                <div className="h-32 bg-card rounded-lg"></div>
                <div className="h-32 bg-card rounded-lg"></div>
                <div className="h-32 bg-card rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId || null);
    setSelectedPolicy(null);
  };

  const handlePolicySelect = (policyId: string) => {
    setSelectedPolicy(policyId);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreatePolicy = () => {
    setShowCreateModal(true);
  };

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/compliance-dashboard-overview', icon: 'HomeIcon' },
    { label: 'Policy Management Center', icon: 'DocumentTextIcon' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      <Sidebar />
      
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'ml-0 lg:ml-64'} mt-16`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Breadcrumb items={breadcrumbItems} />
              <h1 className="text-2xl font-semibold text-foreground mt-2">Policy Management Center</h1>
              <p className="text-muted-foreground mt-1">
                Centralized policy lifecycle management with version control and compliance tracking
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCreatePolicy}
                className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-150 hover-lift"
              >
                <Icon name="PlusIcon" size={20} className="mr-2" />
                Create Policy
              </button>
              
              <button className="flex items-center px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors duration-150 hover-lift">
                <Icon name="ArrowDownTrayIcon" size={20} className="mr-2" />
                Export
              </button>
              
              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-150">
                <Icon name="Cog6ToothIcon" size={20} />
              </button>
            </div>
          </div>

          {/* Two Panel Layout - Category Tree and Policy List */}
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
            {/* Left Panel - Category Tree (33%) */}
            <div className="col-span-4">
              <PolicyCategoryTree
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
              />
            </div>

            {/* Right Panel - Policy List (67%) */}
            <div className="col-span-8">
              <PolicyList
                selectedCategory={selectedCategory}
                selectedPolicy={selectedPolicy}
                onPolicySelect={handlePolicySelect}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Create Policy Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-300 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-large w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Create New Policy</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-150"
                >
                  <Icon name="XMarkIcon" size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Policy Title</label>
                <input
                  type="text"
                  placeholder="Enter policy title"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent">
                    <option value="">Select category</option>
                    <option value="hr">HR Policies</option>
                    <option value="it">IT Policies</option>
                    <option value="data-protection">Data Protection</option>
                    <option value="security">Security Policies</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
                  <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea
                  rows={4}
                  placeholder="Enter policy description"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Policy Owner</label>
                <input
                  type="text"
                  placeholder="Enter policy owner name"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tags</label>
                <input
                  type="text"
                  placeholder="Enter tags separated by commas"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-border flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  // Handle policy creation
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-150"
              >
                Create Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyManagementInteractive;