import type { Metadata } from 'next';
import StockReportInteractive from './components/StockReportInteractive';

export const metadata: Metadata = {
  title: 'Stock Report - Whiteplast Distribution',
};

export default function StockReportPage() {
  return <StockReportInteractive />;
}
