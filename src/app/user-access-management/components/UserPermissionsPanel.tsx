import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Permission {
  id: string;
  system: string;
  role: string;
  permissions: string[];
  grantedDate: Date;
  grantedBy: string;
  expiryDate?: Date;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

interface AccessHistory {
  id: string;
  action: string;
  timestamp: Date;
  performedBy: string;
  details: string;
  type: 'Grant' | 'Revoke' | 'Modify' | 'Review';
}

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  manager: string;
  lastLogin: Date;
  accessLevel: 'Basic' | 'Standard' | 'Elevated' | 'Admin';
  reviewStatus: 'Current' | 'Pending' | 'Overdue';
  status: 'Active' | 'Inactive' | 'Suspended';
}

interface UserPermissionsPanelProps {
  selectedUser: User | null;
  permissions: Permission[];
  accessHistory: AccessHistory[];
  onRevokePermission: (permissionId: string) => void;
  onModifyPermission: (permissionId: string) => void;
  onRequestAccess: () => void;
}

const UserPermissionsPanel = ({
  selectedUser,
  permissions,
  accessHistory,
  onRevokePermission,
  onModifyPermission,
  onRequestAccess
}: UserPermissionsPanelProps) => {
  if (!selectedUser) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="UserIcon" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-medium text-foreground mb-2">Select a User</h3>
        <p className="text-muted-foreground">Choose a user from the directory to view their permissions and access details.</p>
      </div>
    );
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'bg-error text-error-foreground';
      case 'High': return 'bg-warning text-warning-foreground';
      case 'Medium': return 'bg-accent text-accent-foreground';
      default: return 'bg-success text-success-foreground';
    }
  };

  const getActionTypeColor = (type: string) => {
    switch (type) {
      case 'Grant': return 'text-success';
      case 'Revoke': return 'text-error';
      case 'Modify': return 'text-warning';
      case 'Review': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'Grant': return 'PlusCircleIcon';
      case 'Revoke': return 'MinusCircleIcon';
      case 'Modify': return 'PencilIcon';
      case 'Review': return 'EyeIcon';
      default: return 'InformationCircleIcon';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpiringSoon = (expiryDate?: Date) => {
    if (!expiryDate) return false;
    const now = new Date();
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (expiryDate?: Date) => {
    if (!expiryDate) return false;
    return expiryDate < new Date();
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* User Header */}
      <div className="p-4 sm:p-6 border-b border-border bg-muted/30">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium text-sm sm:text-lg flex-shrink-0">
              {selectedUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground truncate">{selectedUser.name}</h2>
              <p className="text-sm sm:text-base text-muted-foreground truncate">{selectedUser.email}</p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm">
                <span className="text-muted-foreground flex items-center">
                  <Icon name="BuildingOfficeIcon" size={14} className="mr-1 flex-shrink-0" />
                  <span className="truncate">{selectedUser.department}</span>
                </span>
                <span className="text-muted-foreground flex items-center">
                  <Icon name="BriefcaseIcon" size={14} className="mr-1 flex-shrink-0" />
                  <span className="truncate">{selectedUser.role}</span>
                </span>
                <span className="text-muted-foreground flex items-center">
                  <Icon name="UserIcon" size={14} className="mr-1 flex-shrink-0" />
                  <span className="truncate">Reports to {selectedUser.manager}</span>
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onRequestAccess}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-150 text-xs sm:text-sm font-medium flex-shrink-0 flex items-center justify-center"
          >
            <Icon name="PlusIcon" size={14} className="mr-2" />
            Request Access
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 min-h-[500px]">
        {/* Permissions Section */}
        <div className="p-4 sm:p-6 border-b xl:border-b-0 xl:border-r border-border flex flex-col">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h3 className="text-base sm:text-lg font-medium text-foreground">Current Permissions</h3>
            <span className="text-xs sm:text-sm text-muted-foreground">{permissions.length} active</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
            {permissions.map((permission) => (
              <div
                key={permission.id}
                className={`
                  p-3 sm:p-4 border rounded-lg transition-colors duration-150
                  ${isExpired(permission.expiryDate) 
                    ? 'border-error bg-error/5' 
                    : isExpiringSoon(permission.expiryDate)
                    ? 'border-warning bg-warning/5' :'border-border bg-background'
                  }
                `}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="font-medium text-foreground text-sm sm:text-base truncate">{permission.system}</h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getRiskLevelColor(permission.riskLevel)}`}>
                        {permission.riskLevel}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 truncate">{permission.role}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {permission.permissions.slice(0, 2).map((perm, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground rounded text-xs truncate max-w-[120px]">
                          {perm}
                        </span>
                      ))}
                      {permission.permissions.length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground rounded text-xs flex-shrink-0">
                          +{permission.permissions.length - 2} more
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="truncate">Granted: {formatDate(permission.grantedDate)} by <span className="truncate inline-block max-w-[100px]">{permission.grantedBy}</span></div>
                      {permission.expiryDate && (
                        <div className={`truncate ${isExpired(permission.expiryDate) ? 'text-error' : isExpiringSoon(permission.expiryDate) ? 'text-warning' : ''}`}>
                          {isExpired(permission.expiryDate) ? 'Expired: ' : 'Expires: '}{formatDate(permission.expiryDate)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <button
                      onClick={() => onModifyPermission(permission.id)}
                      className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors duration-150"
                      title="Modify Permission"
                    >
                      <Icon name="PencilIcon" size={14} />
                    </button>
                    <button
                      onClick={() => onRevokePermission(permission.id)}
                      className="p-1 text-muted-foreground hover:text-error hover:bg-error/10 rounded transition-colors duration-150"
                      title="Revoke Permission"
                    >
                      <Icon name="TrashIcon" size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {permissions.length === 0 && (
              <div className="flex-1 flex items-center justify-center py-8">
                <div className="text-center">
                  <Icon name="LockClosedIcon" size={32} className="mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground text-sm">No permissions assigned</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Access History Section */}
        <div className="p-4 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h3 className="text-base sm:text-lg font-medium text-foreground">Access History</h3>
            <span className="text-xs sm:text-sm text-muted-foreground">{accessHistory.length} events</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
            {accessHistory.map((event) => (
              <div key={event.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg bg-background">
                <div className={`p-1 rounded-full ${getActionTypeColor(event.type)} bg-current/10 flex-shrink-0`}>
                  <Icon name={getActionIcon(event.type)} size={14} className={getActionTypeColor(event.type)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-foreground text-xs sm:text-sm break-words flex-1">{event.action}</p>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{formatDateTime(event.timestamp)}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">{event.details}</p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">by {event.performedBy}</p>
                </div>
              </div>
            ))}

            {accessHistory.length === 0 && (
              <div className="flex-1 flex items-center justify-center py-8">
                <div className="text-center">
                  <Icon name="ClockIcon" size={32} className="mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground text-sm">No access history available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPermissionsPanel;