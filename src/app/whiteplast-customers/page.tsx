import type { Metadata } from 'next';
import CustomersInteractive from './components/CustomersInteractive';

export const metadata: Metadata = {
  title: 'Customers - Whiteplast Distribution',
};

export default function CustomersPage() {
  return <CustomersInteractive />;
}
