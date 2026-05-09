import type { Metadata } from 'next';
import RiskMonitoringInteractive from './components/RiskMonitoringInteractive';

export const metadata: Metadata = {
  title: 'Risk Monitoring Dashboard - ComplianceHub',
  description: 'Comprehensive risk visualization and management interface for proactive risk identification, assessment, and mitigation tracking.',
};

export default function RiskMonitoringDashboardPage() {
  return <RiskMonitoringInteractive />;
}