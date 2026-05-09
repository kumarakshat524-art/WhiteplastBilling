import type { Metadata } from 'next';
import InvoicesInteractive from './components/InvoicesInteractive';

export const metadata: Metadata = {
  title: 'Invoices - Whiteplast Distribution',
};

export default function InvoicesPage() {
  return <InvoicesInteractive />;
}
