'use client';

import React, { useState } from 'react';
import { Header, Sidebar } from '../../components/common';
import Icon from '@/components/ui/AppIcon';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  joinDate: Date;
  phone: string;
  location: string;
  avatar?: string;
  bio: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  passwordLastChanged: Date;
  sessionTimeout: number;
}

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'activity'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'usr_001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@compliancehub.com',
    role: 'Compliance Officer',
    department: 'Risk Management',
    joinDate: new Date('2023-03-15'),
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    bio: 'Experienced compliance professional with over 8 years in risk management and regulatory compliance. Specializes in financial services compliance and audit coordination.'
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: true,
    passwordLastChanged: new Date('2024-10-15'),
    sessionTimeout: 60
  });

  const [formData, setFormData] = useState(userProfile);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setUserProfile(formData);
    setIsEditing(false);
    // Handle save logic here
  };

  const handleCancel = () => {
    setFormData(userProfile);
    setIsEditing(false);
  };

  const recentActivity = [
    {
      id: '1',
      action: 'Updated Risk Assessment Policy',
      timestamp: new Date('2024-11-14T14:30:00'),
      type: 'edit'
    },
    {
      id: '2',
      action: 'Completed Quarterly Compliance Review',
      timestamp: new Date('2024-11-14T10:15:00'),
      type: 'complete'
    },
    {
      id: '3',
      action: 'Added new incident report',
      timestamp: new Date('2024-11-13T16:45:00'),
      type: 'create'
    },
    {
      id: '4',
      action: 'Approved policy changes',
      timestamp: new Date('2024-11-13T09:20:00'),
      type: 'approve'
    }
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'edit': return 'PencilIcon';
      case 'complete': return 'CheckCircleIcon';
      case 'create': return 'PlusCircleIcon';
      case 'approve': return 'CheckBadgeIcon';
      default: return 'InformationCircleIcon';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'edit': return 'text-blue-600 bg-blue-100';
      case 'complete': return 'text-green-600 bg-green-100';
      case 'create': return 'text-purple-600 bg-purple-100';
      case 'approve': return 'text-emerald-600 bg-emerald-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        <main className="flex-1 ml-64 pt-16">
          <div className="p-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
              <p className="text-muted-foreground">
                Manage your account information and security settings
              </p>
            </div>

            {/* Profile Card */}
            <div className="bg-card rounded-xl border border-border shadow-soft mb-8">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl shadow-soft">
                      {userProfile.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">{userProfile.name}</h2>
                      <p className="text-muted-foreground">{userProfile.role}</p>
                      <p className="text-sm text-muted-foreground">{userProfile.department}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Icon name={isEditing ? "XMarkIcon" : "PencilIcon"} size={16} />
                    <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                  </button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="px-6 py-4 border-b border-border">
                <nav className="flex space-x-6">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      activeTab === 'profile' ?'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    Profile Information
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      activeTab === 'security' ?'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    Security
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      activeTab === 'activity' ?'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    Recent Activity
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Full Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 bg-input"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-muted/30 rounded-lg text-foreground">
                            {userProfile.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email Address
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 bg-input"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-muted/30 rounded-lg text-foreground">
                            {userProfile.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone Number
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 bg-input"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-muted/30 rounded-lg text-foreground">
                            {userProfile.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Location
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 bg-input"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-muted/30 rounded-lg text-foreground">
                            {userProfile.location}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Department
                        </label>
                        <p className="px-4 py-3 bg-muted/30 rounded-lg text-foreground">
                          {userProfile.department}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Join Date
                        </label>
                        <p className="px-4 py-3 bg-muted/30 rounded-lg text-foreground">
                          {formatDate(userProfile.joinDate)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          value={formData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 bg-input resize-none"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-muted/30 rounded-lg text-foreground">
                          {userProfile.bio}
                        </p>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex items-center justify-end space-x-4 pt-4 border-t border-border">
                        <button
                          onClick={handleCancel}
                          className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-foreground">Two-Factor Authentication</h3>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            securitySettings.twoFactorEnabled 
                              ? 'bg-green-100 text-green-800' :'bg-red-100 text-red-800'
                          }`}>
                            {securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Add an extra layer of security to your account
                        </p>
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 text-sm">
                          {securitySettings.twoFactorEnabled ? 'Manage 2FA' : 'Enable 2FA'}
                        </button>
                      </div>

                      <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-foreground">Password</h3>
                          <span className="text-xs text-muted-foreground">
                            Last changed {formatDate(securitySettings.passwordLastChanged)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Keep your password strong and secure
                        </p>
                        <button className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted/60 transition-colors duration-200 text-sm">
                          Change Password
                        </button>
                      </div>

                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h3 className="font-medium text-foreground mb-2">Session Timeout</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Automatically log out after {securitySettings.sessionTimeout} minutes of inactivity
                        </p>
                        <button className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted/60 transition-colors duration-200 text-sm">
                          Adjust Timeout
                        </button>
                      </div>

                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h3 className="font-medium text-foreground mb-2">Active Sessions</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Monitor and manage your active login sessions
                        </p>
                        <button className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted/60 transition-colors duration-200 text-sm">
                          View Sessions
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/40 transition-colors duration-200"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                          <Icon name={getActivityIcon(activity.type)} size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.timestamp.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;