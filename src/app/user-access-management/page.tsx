import type { Metadata } from 'next';
import UserAccessInteractive from './components/UserAccessInteractive';

export const metadata: Metadata = {
  title: 'User Access Management - ComplianceHub',
  description: 'Comprehensive identity and access control interface for managing user permissions, role assignments, and access reviews with automated workflows and compliance reporting.',
};

export default function UserAccessManagementPage() {
  return <UserAccessInteractive />;
}