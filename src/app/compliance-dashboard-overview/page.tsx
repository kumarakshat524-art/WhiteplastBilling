import type { Metadata } from 'next';
import DashboardInteractive from './components/DashboardInteractive';

export const metadata: Metadata = {
  title: 'Compliance Dashboard Overview - ComplianceHub',
  description: 'Real-time visibility into organizational compliance status, risk monitoring, and audit workflows for proactive compliance management.',
};

export default function ComplianceDashboardOverviewPage() {
  return (
    <DashboardInteractive />
  );
}