import type { Metadata } from 'next';
import SalesReportInteractive from './components/SalesReportInteractive';

export const metadata: Metadata = {
  title: 'Sales Report - Whiteplast Distribution',
};

export default function SalesReportPage() {
  return <SalesReportInteractive />;
}
