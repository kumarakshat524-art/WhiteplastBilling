import type { Metadata } from 'next';
import { Suspense } from 'react';
import InvoiceCreateInteractive from './components/InvoiceCreateInteractive';

export const metadata: Metadata = {
  title: 'Create Invoice - Whiteplast Distribution',
};

export default function InvoiceCreatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>}>
      <InvoiceCreateInteractive />
    </Suspense>
  );
}
