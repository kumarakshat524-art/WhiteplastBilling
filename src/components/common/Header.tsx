'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface User {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
}

interface HeaderProps {
  user?: User;
  notifications?: Notification[];
  onSearch?: (query: string) => void;
  onNotificationClick?: (notification: Notification) => void;
  onNotificationMarkAsRead?: (notificationId: string) => void;
  onNotificationMarkAllAsRead?: () => void;
  className?: string;
}

const Header = ({
  user = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@compliancehub.com',
    role: 'Compliance Officer'
  },
  notifications = [
    {
      id: '1',
      title: 'Policy Review Due',
      message: 'Data Privacy Policy requires review by Nov 20, 2024',
      type: 'warning',
      timestamp: new Date('2024-11-14T09:30:00'),
      read: false
    },
    {
      id: '2',
      title: 'Audit Completed',
      message: 'Q4 Security Audit has been completed successfully',
      type: 'success',
      timestamp: new Date('2024-11-14T08:15:00'),
      read: false
    },
    {
      id: '3',
      title: 'Risk Alert',
      message: 'High-risk incident reported in Finance department',
      type: 'error',
      timestamp: new Date('2024-11-14T07:45:00'),
      read: true
    }
  ],
  onSearch,
  onNotificationClick,
  onNotificationMarkAsRead,
  onNotificationMarkAllAsRead,
  className = ''
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Mock search results
  const mockSearchResults = [
    { type: 'Policy', title: 'Data Privacy Policy', path: '/policy-management-center' },
    { type: 'Risk', title: 'Financial Risk Assessment', path: '/risk-monitoring-dashboard' },
    { type: 'Task', title: 'Quarterly Compliance Review', path: '/compliance-tasks-management' },
    { type: 'Incident', title: 'Security Breach Report', path: '/incident-reporting-system' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
        setSearchResults([]);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsSearchFocused(true);
        const searchInput = document.getElementById('global-search') as HTMLInputElement;
        searchInput?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const filtered = mockSearchResults.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }

    onSearch?.(query);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onNotificationMarkAsRead?.(notification.id);
    }
    onNotificationClick?.(notification);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return 'ExclamationTriangleIcon';
      case 'error': return 'XCircleIcon';
      case 'success': return 'CheckCircleIcon';
      default: return 'InformationCircleIcon';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      case 'success': return 'text-success';
      default: return 'text-primary';
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-200 shadow-soft lg:left-64 ${className}`}>
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Side - Logo (Mobile Only) */}
        <div className="flex items-center lg:hidden">
          <Link href="/compliance-dashboard-overview" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-soft">
              <Icon name="ShieldCheckIcon" size={16} className="text-primary-foreground" />
            </div>
            <div className="select-none">
              <h1 className="text-base font-semibold text-foreground">ComplianceHub</h1>
            </div>
          </Link>
        </div>

        {/* Right Side - Search Bar and Profile Section */}
        <div className="flex items-center space-x-3 ml-auto">
          {/* Enhanced Search Bar - Moved to Right */}
          <div className="max-w-lg" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <Icon
                  name="MagnifyingGlassIcon"
                  size={20}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
                <input
                  id="global-search"
                  type="text"
                  placeholder="Search policies, risks, tasks... (⌘K)"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-64 lg:w-80 pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 focus:bg-input transition-all duration-200 text-sm"
                />
              </div>
              
              {/* Enhanced Search Results Dropdown */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute top-full right-0 left-0 mt-2 bg-popover border border-border rounded-xl shadow-large z-300 max-h-80 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <Link
                      key={index}
                      href={result.path}
                      className="flex items-center px-4 py-3 hover:bg-muted/60 transition-colors duration-200 border-b border-border last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                      onClick={() => {
                        setIsSearchFocused(false);
                        setSearchResults([]);
                        setSearchQuery('');
                      }}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{result.title}</div>
                        <div className="text-sm text-muted-foreground">{result.type}</div>
                      </div>
                      <Icon name="ArrowRightIcon" size={16} className="text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Enhanced Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl transition-all duration-200 focus-ring"
            >
              <Icon name="BellIcon" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-soft">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Enhanced Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-popover border border-border rounded-xl shadow-large z-300 overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => {
                          onNotificationMarkAllAsRead?.();
                          setShowNotifications(false);
                        }}
                        className="text-sm text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-border last:border-b-0 cursor-pointer hover:bg-muted/40 transition-colors duration-200 ${
                          !notification.read ? 'bg-accent/30' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getNotificationIcon(notification.type) === 'CheckCircleIcon' ? 'bg-success/20' : getNotificationIcon(notification.type) === 'ExclamationTriangleIcon' ? 'bg-warning/20' : 'bg-error/20'}`}>
                            <Icon
                              name={getNotificationIcon(notification.type)}
                              size={16}
                              className={getNotificationColor(notification.type)}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-foreground text-sm truncate">
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2"></div>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatTimeAgo(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <Icon name="BellIcon" size={32} className="mx-auto mb-2 opacity-50" />
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced User Profile */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl transition-all duration-200 focus-ring"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm shadow-soft">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="hidden md:block text-left">
                <div className="font-medium text-foreground text-sm">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.role}</div>
              </div>
              <Icon name="ChevronDownIcon" size={16} />
            </button>

            {/* Enhanced User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-popover border border-border rounded-xl shadow-large z-300 overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-full flex items-center justify-center font-semibold shadow-soft">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      <div className="text-xs text-muted-foreground mt-1">{user.role}</div>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <Link
                    href="/user-profile"
                    className="flex items-center px-4 py-3 text-sm text-foreground hover:bg-muted/60 transition-colors duration-200"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Icon name="UserIcon" size={16} className="mr-3" />
                    Profile Settings
                  </Link>
                  <Link
                    href="/preferences"
                    className="flex items-center px-4 py-3 text-sm text-foreground hover:bg-muted/60 transition-colors duration-200"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Icon name="Cog6ToothIcon" size={16} className="mr-3" />
                    Preferences
                  </Link>
                  <Link
                    href="/help"
                    className="flex items-center px-4 py-3 text-sm text-foreground hover:bg-muted/60 transition-colors duration-200"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Icon name="QuestionMarkCircleIcon" size={16} className="mr-3" />
                    Help & Support
                  </Link>
                  <div className="border-t border-border mt-2 pt-2">
                    <button
                      className="flex items-center w-full px-4 py-3 text-sm text-error hover:bg-error/10 transition-colors duration-200"
                      onClick={() => {
                        setShowUserMenu(false);
                        // Handle logout
                      }}
                    >
                      <Icon name="ArrowRightOnRectangleIcon" size={16} className="mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;