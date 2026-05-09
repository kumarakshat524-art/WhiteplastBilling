'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb = ({ items, className = '' }: BreadcrumbProps) => {
  const pathname = usePathname();

  // Route mapping for automatic breadcrumb generation
  const routeMap: Record<string, { label: string; icon?: string }> = {
    '/compliance-dashboard-overview': { label: 'Dashboard', icon: 'HomeIcon' },
    '/compliance-tasks-management': { label: 'Tasks', icon: 'ClipboardDocumentListIcon' },
    '/risk-monitoring-dashboard': { label: 'Risk Management', icon: 'ShieldExclamationIcon' },
    '/policy-management-center': { label: 'Policies', icon: 'DocumentTextIcon' },
    '/audit-timeline-management': { label: 'Audits', icon: 'ClockIcon' },
    '/incident-reporting-system': { label: 'Incidents', icon: 'ExclamationTriangleIcon' },
    '/user-access-management': { label: 'User Access', icon: 'UsersIcon' },
    '/compliance-analytics-dashboard': { label: 'Analytics', icon: 'ChartBarIcon' },
    '/system-configuration-center': { label: 'Settings', icon: 'Cog6ToothIcon' }
  };

  // Generate breadcrumb items if not provided
  const breadcrumbItems = items || (() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', path: '/compliance-dashboard-overview', icon: 'HomeIcon' }
    ];

    if (pathname !== '/compliance-dashboard-overview') {
      const currentRoute = routeMap[pathname];
      if (currentRoute) {
        breadcrumbs.push({
          label: currentRoute.label,
          icon: currentRoute.icon
        });
      }
    }

    return breadcrumbs;
  })();

  // Don't render if only one item (current page)
  if (breadcrumbItems.length <= 1 && pathname === '/compliance-dashboard-overview') {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const isClickable = item.path && !isLast;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <Icon 
                  name="ChevronRightIcon" 
                  size={16} 
                  className="text-muted-foreground mx-2" 
                />
              )}
              
              <div className="flex items-center">
                {item.icon && (
                  <Icon 
                    name={item.icon} 
                    size={16} 
                    className={`mr-2 ${isLast ? 'text-foreground' : 'text-muted-foreground'}`}
                  />
                )}
                
                {isClickable ? (
                  <Link
                    href={item.path}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-150 hover:underline"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                    {item.label}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;