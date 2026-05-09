import type { Metadata } from 'next';
import { Suspense } from 'react';
import InvoicePrintInteractive from './components/InvoicePrintInteractive';

export const metadata: Metadata = {
  title: 'Print Invoice - Whiteplast',
};

export default function InvoicePrintPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading invoice...</div>}>
      <InvoicePrintInteractive />
    </Suspense>
  );
}
