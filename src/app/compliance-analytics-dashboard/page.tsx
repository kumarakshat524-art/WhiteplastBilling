import type { Metadata } from 'next';
import AnalyticsDashboardInteractive from './components/AnalyticsDashboardInteractive';

export const metadata: Metadata = {
  title: 'Compliance Analytics Dashboard - ComplianceHub',
  description: 'Advanced analytics and reporting interface with comprehensive compliance metrics visualization, trend analysis, and automated reporting capabilities.',
};

export default function ComplianceAnalyticsDashboardPage() {
  return <AnalyticsDashboardInteractive />;
}