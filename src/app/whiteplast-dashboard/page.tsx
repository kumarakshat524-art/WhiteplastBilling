import type { Metadata } from 'next';
import WhiteplastDashboardInteractive from './components/WhiteplastDashboardInteractive';

export const metadata: Metadata = {
  title: 'Dashboard - Whiteplast Distribution',
  description: 'Whiteplast Paint Distribution Management System Dashboard',
};

export default function WhiteplastDashboardPage() {
  return <WhiteplastDashboardInteractive />;
}
