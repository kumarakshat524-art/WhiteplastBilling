import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  lastLogin: Date;
  accessLevel: 'Basic' | 'Standard' | 'Elevated' | 'Admin';
  reviewStatus: 'Current' | 'Pending' | 'Overdue';
  avatar?: string;
  status: 'Active' | 'Inactive' | 'Suspended';
}

interface UserDirectoryProps {
  users: User[];
  selectedUserId?: string;
  onUserSelect: (userId: string) => void;
  searchQuery: string;
  departmentFilter: string;
  roleFilter: string;
  accessLevelFilter: string;
}

const UserDirectory = ({
  users,
  selectedUserId,
  onUserSelect,
  searchQuery,
  departmentFilter,
  roleFilter,
  accessLevelFilter
}: UserDirectoryProps) => {
  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'Admin': return 'bg-error text-error-foreground';
      case 'Elevated': return 'bg-warning text-warning-foreground';
      case 'Standard': return 'bg-primary text-primary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getReviewStatusColor = (status: string) => {
    switch (status) {
      case 'Current': return 'text-success';
      case 'Pending': return 'text-warning';
      case 'Overdue': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return 'CheckCircleIcon';
      case 'Inactive': return 'MinusCircleIcon';
      case 'Suspended': return 'XCircleIcon';
      default: return 'QuestionMarkCircleIcon';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-success';
      case 'Inactive': return 'text-muted-foreground';
      case 'Suspended': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const formatLastLogin = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = departmentFilter === '' || user.department === departmentFilter;
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    const matchesAccessLevel = accessLevelFilter === '' || user.accessLevel === accessLevelFilter;
    
    return matchesSearch && matchesDepartment && matchesRole && matchesAccessLevel;
  });

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">User Directory</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredUsers.length} of {users.length} users
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="UsersIcon" size={20} className="text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="overflow-auto max-h-[600px]">
        <table className="w-full">
          <thead className="bg-muted/50 sticky top-0">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-foreground text-sm">User</th>
              <th className="text-left py-3 px-4 font-medium text-foreground text-sm">Department</th>
              <th className="text-left py-3 px-4 font-medium text-foreground text-sm">Role</th>
              <th className="text-left py-3 px-4 font-medium text-foreground text-sm">Last Login</th>
              <th className="text-left py-3 px-4 font-medium text-foreground text-sm">Access Level</th>
              <th className="text-left py-3 px-4 font-medium text-foreground text-sm">Review Status</th>
              <th className="text-left py-3 px-4 font-medium text-foreground text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className={`
                  border-b border-border cursor-pointer transition-colors duration-150
                  ${selectedUserId === user.id 
                    ? 'bg-primary/10 border-primary/20' :'hover:bg-muted/50'
                  }
                `}
                onClick={() => onUserSelect(user.id)}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      {user.avatar ? (
                        <AppImage
                          src={user.avatar}
                          alt={`Profile photo of ${user.name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-foreground text-sm truncate">{user.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-foreground">{user.department}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-foreground">{user.role}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-muted-foreground">
                    {formatLastLogin(user.lastLogin)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelColor(user.accessLevel)}`}>
                    {user.accessLevel}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-1">
                    <Icon 
                      name={user.reviewStatus === 'Current' ? 'CheckCircleIcon' : user.reviewStatus === 'Pending' ? 'ClockIcon' : 'ExclamationTriangleIcon'} 
                      size={16} 
                      className={getReviewStatusColor(user.reviewStatus)}
                    />
                    <span className={`text-sm ${getReviewStatusColor(user.reviewStatus)}`}>
                      {user.reviewStatus}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-1">
                    <Icon 
                      name={getStatusIcon(user.status)} 
                      size={16} 
                      className={getStatusColor(user.status)}
                    />
                    <span className={`text-sm ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="p-8 text-center">
            <Icon name="UsersIcon" size={32} className="mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No users found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDirectory;