import type { Metadata } from 'next';
import StockInteractive from './components/StockInteractive';

export const metadata: Metadata = {
  title: 'Stock Management - Whiteplast Distribution',
};

export default function StockPage() {
  return <StockInteractive />;
}
