import type { Metadata } from 'next';
import PolicyManagementInteractive from './components/PolicyManagementInteractive';

export const metadata: Metadata = {
  title: 'Policy Management Center - ComplianceHub',
  description: 'Centralized policy lifecycle management interface with structured workflows, version control, and compliance tracking for organizational policies.',
};

export default function PolicyManagementCenterPage() {
  return <PolicyManagementInteractive />;
}