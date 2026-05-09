// Whiteplast Paint Distribution - Local Data Storage Layer
// All data stored in localStorage (browser-based, offline-capable)

export interface Product {
  id: string;
  name: string;
  packSize: string;
  hsn: string;
  defaultPriceExGST: number;
  cgstPct: number;
  sgstPct: number;
  igstPct: number;
  stock: number;
  minAlert: number;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  gstin: string;
  address: string;
  phone: string;
  state: string;
  createdAt: string;
}

export interface CustomerPrice {
  customerId: string;
  productId: string;
  specialPriceExGST: number;
}

export interface InvoiceLine {
  id: string;
  invoiceId: string;
  productId: string;
  productNameSnapshot: string;
  packSizeSnapshot: string;
  hsnSnapshot: string;
  quantity: number;
  rateExGST: number;
  cgstPct: number;
  sgstPct: number;
  igstPct: number;
  totalExGST: number;
  taxAmount: number;
  lineTotal: number;
}

export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  customerId: string;
  customerName: string;
  placeOfSupply: string;
  subtotalExGST: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  grandTotalInclGST: number;
  isDraft: boolean;
  createdAt: string;
  lines: InvoiceLine[];
}

export interface StockHistory {
  id: string;
  productId: string;
  productName: string;
  date: string;
  quantityChange: number;
  reason: string;
  invoiceId?: string;
  invoiceNumber?: string;
}

// ─── Storage Keys ───────────────────────────────────────────────────────────
const KEYS = {
  products: 'wp_products',
  customers: 'wp_customers',
  customerPrices: 'wp_customer_prices',
  invoices: 'wp_invoices',
  stockHistory: 'wp_stock_history',
  invoiceCounter: 'wp_invoice_counter',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ─── Invoice Number Generator ────────────────────────────────────────────────
export function nextInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const counter = load<number>(KEYS.invoiceCounter, 0) + 1;
  save(KEYS.invoiceCounter, counter);
  return `INV-${year}-${String(counter).padStart(4, '0')}`;
}

// ─── Customer Prices ─────────────────────────────────────────────────────────
export const CustomerPriceDB = {
  getAll(): CustomerPrice[] {
    return load<CustomerPrice[]>(KEYS.customerPrices, []);
  },
  getForCustomer(customerId: string): CustomerPrice[] {
    return this.getAll().filter(cp => cp.customerId === customerId);
  },
  getPrice(customerId: string, productId: string): number | null {
    const cp = this.getAll().find(p => p.customerId === customerId && p.productId === productId);
    return cp ? cp.specialPriceExGST : null;
  },
  set(customerId: string, productId: string, price: number): void {
    const all = this.getAll().filter(cp => !(cp.customerId === customerId && cp.productId === productId));
    all.push({ customerId, productId, specialPriceExGST: price });
    save(KEYS.customerPrices, all);
  },
  remove(customerId: string, productId: string): void {
    const all = this.getAll().filter(cp => !(cp.customerId === customerId && cp.productId === productId));
    save(KEYS.customerPrices, all);
  },
};

// ─── Products ────────────────────────────────────────────────────────────────
export const ProductDB = {
  getAll(): Product[] {
    return load<Product[]>(KEYS.products, []);
  },
  save(products: Product[]): void {
    save(KEYS.products, products);
  },
  add(data: Omit<Product, 'id' | 'createdAt'>): Product {
    const products = this.getAll();
    const product: Product = { ...data, id: uid(), createdAt: new Date().toISOString() };
    products.push(product);
    this.save(products);
    return product;
  },
  update(id: string, data: Partial<Product>): void {
    const products = this.getAll().map(p => p.id === id ? { ...p, ...data } : p);
    this.save(products);
  },
  delete(id: string): void {
    this.save(this.getAll().filter(p => p.id !== id));
    // Also remove customer prices for this product
    const prices = CustomerPriceDB.getAll().filter(cp => cp.productId !== id);
    save(KEYS.customerPrices, prices);
  },
  getById(id: string): Product | undefined {
    return this.getAll().find(p => p.id === id);
  },
};

// ─── Customers ───────────────────────────────────────────────────────────────
export const CustomerDB = {
  getAll(): Customer[] {
    return load<Customer[]>(KEYS.customers, []);
  },
  save(customers: Customer[]): void {
    save(KEYS.customers, customers);
  },
  add(data: Omit<Customer, 'id' | 'createdAt'>): Customer {
    const customers = this.getAll();
    const customer: Customer = { ...data, id: uid(), createdAt: new Date().toISOString() };
    customers.push(customer);
    this.save(customers);
    return customer;
  },
  update(id: string, data: Partial<Customer>): void {
    const customers = this.getAll().map(c => c.id === id ? { ...c, ...data } : c);
    this.save(customers);
  },
  delete(id: string): void {
    this.save(this.getAll().filter(c => c.id !== id));
    const prices = CustomerPriceDB.getAll().filter(cp => cp.customerId !== id);
    save(KEYS.customerPrices, prices);
  },
  getById(id: string): Customer | undefined {
    return this.getAll().find(c => c.id === id);
  },
};

// ─── Invoices ────────────────────────────────────────────────────────────────
export const InvoiceDB = {
  getAll(): SalesInvoice[] {
    return load<SalesInvoice[]>(KEYS.invoices, []);
  },
  getById(id: string): SalesInvoice | undefined {
    return this.getAll().find(inv => inv.id === id);
  },
  save(invoices: SalesInvoice[]): void {
    save(KEYS.invoices, invoices);
  },
  add(data: Omit<SalesInvoice, 'id' | 'createdAt'>): SalesInvoice {
    const invoices = this.getAll();
    const invoice: SalesInvoice = { ...data, id: uid(), createdAt: new Date().toISOString() };
    invoices.unshift(invoice);
    this.save(invoices);
    return invoice;
  },
  update(id: string, data: Partial<SalesInvoice>): void {
    const invoices = this.getAll().map(inv => inv.id === id ? { ...inv, ...data } : inv);
    this.save(invoices);
  },
  delete(id: string): void {
    this.save(this.getAll().filter(inv => inv.id !== id));
  },
};

// ─── Stock History ────────────────────────────────────────────────────────────
export const StockHistoryDB = {
  getAll(): StockHistory[] {
    return load<StockHistory[]>(KEYS.stockHistory, []);
  },
  add(entry: Omit<StockHistory, 'id'>): void {
    const history = this.getAll();
    history.unshift({ ...entry, id: uid() });
    save(KEYS.stockHistory, history);
  },
  getForProduct(productId: string): StockHistory[] {
    return this.getAll().filter(h => h.productId === productId);
  },
};

// ─── Stock Operations ─────────────────────────────────────────────────────────
export function adjustStock(productId: string, delta: number, reason: string, invoiceId?: string, invoiceNumber?: string): void {
  const product = ProductDB.getById(productId);
  if (!product) return;
  ProductDB.update(productId, { stock: product.stock + delta });
  StockHistoryDB.add({
    productId,
    productName: product.name,
    date: new Date().toISOString(),
    quantityChange: delta,
    reason,
    invoiceId,
    invoiceNumber,
  });
}

// ─── Seed Sample Data ─────────────────────────────────────────────────────────
export function seedSampleData(): void {
  if (ProductDB.getAll().length > 0) return; // Already seeded

  const products = [
    { name: 'Whiteplast Wall Putty', packSize: '40 kg Bag', hsn: '3214', defaultPriceExGST: 850, cgstPct: 9, sgstPct: 9, igstPct: 0, stock: 120, minAlert: 20 },
    { name: 'Whiteplast Premium Putty', packSize: '20 kg Bag', hsn: '3214', defaultPriceExGST: 480, cgstPct: 9, sgstPct: 9, igstPct: 0, stock: 85, minAlert: 15 },
    { name: 'Whiteplast Tile Adhesive', packSize: '20 kg Bag', hsn: '3214', defaultPriceExGST: 420, cgstPct: 9, sgstPct: 9, igstPct: 0, stock: 60, minAlert: 10 },
    { name: 'Whiteplast Crack Filler', packSize: '5 kg Bucket', hsn: '3214', defaultPriceExGST: 180, cgstPct: 9, sgstPct: 9, igstPct: 0, stock: 8, minAlert: 15 },
    { name: 'Whiteplast Waterproof Putty', packSize: '40 kg Bag', hsn: '3214', defaultPriceExGST: 950, cgstPct: 9, sgstPct: 9, igstPct: 0, stock: 45, minAlert: 10 },
    { name: 'Whiteplast Interior Primer', packSize: '10 L Can', hsn: '3210', defaultPriceExGST: 650, cgstPct: 9, sgstPct: 9, igstPct: 0, stock: 5, minAlert: 8 },
  ];

  products.forEach(p => ProductDB.add(p));

  const customers = [
    { name: 'Sharma Hardware Store', gstin: '06ABCDE1234F1Z5', address: 'Shop 12, Main Market, Yamuna Nagar', phone: '98765-43210', state: 'Haryana' },
    { name: 'Gupta Building Materials', gstin: '06FGHIJ5678K2Z3', address: '45 Industrial Area, Ambala', phone: '87654-32109', state: 'Haryana' },
    { name: 'Delhi Paint House', gstin: '07LMNOP9012Q3Z1', address: '78 Karol Bagh, New Delhi', phone: '76543-21098', state: 'Delhi' },
  ];

  customers.forEach(c => CustomerDB.add(c));
}

// ─── Number to Words ──────────────────────────────────────────────────────────
export function numberToWords(amount: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convert(n: number): string {
    if (n === 0) return '';
    if (n < 20) return ones[n] + ' ';
    if (n < 100) return tens[Math.floor(n / 10)] + ' ' + ones[n % 10] + ' ';
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred ' + convert(n % 100);
    if (n < 100000) return convert(Math.floor(n / 1000)) + 'Thousand ' + convert(n % 1000);
    if (n < 10000000) return convert(Math.floor(n / 100000)) + 'Lakh ' + convert(n % 100000);
    return convert(Math.floor(n / 10000000)) + 'Crore ' + convert(n % 10000000);
  }

  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  let result = convert(rupees).trim();
  if (paise > 0) result += ` and ${convert(paise).trim()} Paise`;
  return result + ' Only';
}

// ─── Backup / Restore ─────────────────────────────────────────────────────────
export function exportBackup(): string {
  const data = {
    products: ProductDB.getAll(),
    customers: CustomerDB.getAll(),
    customerPrices: CustomerPriceDB.getAll(),
    invoices: InvoiceDB.getAll(),
    stockHistory: StockHistoryDB.getAll(),
    invoiceCounter: load<number>(KEYS.invoiceCounter, 0),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

export function importBackup(jsonStr: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(jsonStr);
    if (!data.products || !data.customers) throw new Error('Invalid backup file');
    save(KEYS.products, data.products);
    save(KEYS.customers, data.customers);
    save(KEYS.customerPrices, data.customerPrices || []);
    save(KEYS.invoices, data.invoices || []);
    save(KEYS.stockHistory, data.stockHistory || []);
    if (data.invoiceCounter) save(KEYS.invoiceCounter, data.invoiceCounter);
    return { success: true, message: 'Backup restored successfully.' };
  } catch (e: any) {
    return { success: false, message: e.message || 'Failed to restore backup.' };
  }
}
