'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface NavigationItem {
  label: string;
  path: string;
  icon: string;
  badge?: number;
  description?: string;
}

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

const Sidebar = ({
  isCollapsed = false,
  onToggleCollapse,
  className = ''
}: SidebarProps) => {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      path: '/compliance-dashboard-overview',
      icon: 'HomeIcon',
      description: 'Overview of compliance status and key metrics'
    },
    {
      label: 'Tasks',
      path: '/compliance-tasks-management',
      icon: 'ClipboardDocumentListIcon',
      badge: 12,
      description: 'Manage compliance tasks and workflows'
    },
    {
      label: 'Risk Management',
      path: '/risk-monitoring-dashboard',
      icon: 'ShieldExclamationIcon',
      badge: 3,
      description: 'Monitor and assess organizational risks'
    },
    {
      label: 'Policies',
      path: '/policy-management-center',
      icon: 'DocumentTextIcon',
      description: 'Manage organizational policies and procedures'
    },
    {
      label: 'Audits',
      path: '/audit-timeline-management',
      icon: 'ClockIcon',
      description: 'Track audit schedules and progress'
    },
    {
      label: 'Incidents',
      path: '/incident-reporting-system',
      icon: 'ExclamationTriangleIcon',
      badge: 2,
      description: 'Report and manage compliance incidents'
    },
    {
      label: 'Analytics',
      path: '/compliance-analytics-dashboard',
      icon: 'ChartBarIcon',
      description: 'Advanced compliance analytics and reporting'
    },
    {
      label: 'User Access',
      path: '/user-access-management',
      icon: 'UsersIcon',
      description: 'Manage user permissions and access controls'
    },
    {
      label: 'Settings',
      path: '/system-configuration-center',
      icon: 'Cog6ToothIcon',
      description: 'System configuration and preferences'
    },
    {
      label: '🎨 Whiteplast',
      path: '/whiteplast-dashboard',
      icon: 'HomeIcon',
      description: 'Whiteplast Paint Distribution Management'
    },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  const getBadgeColor = (path: string) => {
    if (path.includes('risk') || path.includes('incident')) {
      return 'bg-error text-error-foreground';
    }
    if (path.includes('task')) {
      return 'bg-warning text-warning-foreground';
    }
    return 'bg-primary text-primary-foreground';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-100 lg:hidden"
          onClick={onToggleCollapse}
        />
      )}

      {/* Sidebar - Extended to reach header */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-card border-r border-border z-150 shadow-soft
          transition-transform duration-300 ease-smooth
          ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
          ${isCollapsed ? 'lg:w-16' : 'w-64'}
          ${className}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section - Enhanced with full header height */}
          <div className={`flex items-center h-16 px-6 border-b border-border bg-muted/30 ${isCollapsed ? 'lg:px-4 lg:justify-center' : ''}`}>
            <Link href="/compliance-dashboard-overview" className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-soft ring-1 ring-primary/20">
                <Icon name="ShieldCheckIcon" size={20} className="text-primary-foreground drop-shadow-sm" />
              </div>
              {!isCollapsed && (
                <div className="select-none">
                  <h1 className="text-lg font-semibold text-foreground tracking-tight antialiased">ComplianceHub</h1>
                  <p className="text-xs text-muted-foreground antialiased">Enterprise Platform</p>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation - Modern Style */}
          <nav className="flex-1 px-4 py-8 overflow-y-auto">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <div key={item.path} className="relative">
                    <Link
                      href={item.path}
                      className={`
                        group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                        ${active 
                          ? 'bg-primary text-primary-foreground shadow-soft' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                        }
                        ${isCollapsed ? 'lg:justify-center lg:px-3' : ''}
                      `}
                      onMouseEnter={() => setHoveredItem(item.path)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <Icon 
                        name={item.icon} 
                        size={20} 
                        className={`flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}
                      />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <span className={`
                              inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded-full
                              ${active ? 'bg-primary-foreground/20 text-primary-foreground' : getBadgeColor(item.path)}
                            `}>
                              {item.badge > 99 ? '99+' : item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>

                    {/* Enhanced Tooltip for collapsed state */}
                    {isCollapsed && hoveredItem === item.path && (
                      <div className="absolute left-full top-0 ml-3 px-4 py-3 bg-popover border border-border rounded-xl shadow-large z-300 min-w-56">
                        <div className="font-semibold text-foreground text-sm">{item.label}</div>
                        {item.description && (
                          <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</div>
                        )}
                        {item.badge && (
                          <div className="flex items-center mt-3">
                            <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded-full ${getBadgeColor(item.path)}`}>
                              {item.badge} pending
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Collapse Toggle (Desktop) - Modern */}
          <div className="hidden lg:block p-4 border-t border-border bg-muted/20">
            <button
              onClick={onToggleCollapse}
              className="w-full flex items-center justify-center px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl transition-all duration-200 focus-ring"
            >
              <Icon 
                name={isCollapsed ? "ChevronRightIcon" : "ChevronLeftIcon"} 
                size={20} 
              />
              {!isCollapsed && (
                <span className="ml-3 text-sm font-medium">Collapse</span>
              )}
            </button>
          </div>

          {/* User Status (Enhanced) */}
          {!isCollapsed && (
            <div className="p-4 border-t border-border bg-muted/20">
              <div className="flex items-center space-x-3 p-4 bg-success/10 rounded-xl border border-success/20">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <Icon name="CheckIcon" size={16} className="text-success-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-success">System Status</div>
                  <div className="text-xs text-success/80">All systems operational</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;