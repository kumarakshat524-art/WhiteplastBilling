import type { Metadata } from 'next';
import ProductsInteractive from './components/ProductsInteractive';

export const metadata: Metadata = {
  title: 'Products - Whiteplast Distribution',
};

export default function ProductsPage() {
  return <ProductsInteractive />;
}
