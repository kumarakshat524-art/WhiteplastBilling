// Whiteplast Business Management — Comprehensive Validation Library
// Prevents data corruption across financial and inventory operations

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// ─── Constants ────────────────────────────────────────────────────────────────
export const VALID_GST_RATES = [0, 0.1, 0.25, 1, 1.5, 2, 2.5, 3, 5, 6, 7.5, 9, 12, 14, 18, 28];
export const MAX_PRICE = 10_000_000; // ₹1 Crore per unit
export const MAX_QUANTITY = 100_000;
export const MAX_STOCK = 1_000_000;
export const MAX_INVOICE_TOTAL = 100_000_000; // ₹10 Crore
export const MAX_LINE_ITEMS = 100;

// ─── Primitive Validators ─────────────────────────────────────────────────────

export function isValidPrice(value: number): boolean {
  return typeof value === 'number' && isFinite(value) && value >= 0 && value <= MAX_PRICE;
}

export function isValidPositivePrice(value: number): boolean {
  return isValidPrice(value) && value > 0;
}

export function isValidGSTRate(value: number): boolean {
  if (typeof value !== 'number' || !isFinite(value)) return false;
  if (value < 0 || value > 28) return false;
  // Allow any value that is a multiple of 0.5 within range (covers non-standard rates)
  return value % 0.5 === 0 || VALID_GST_RATES.includes(value);
}

export function isValidQuantity(value: number): boolean {
  return typeof value === 'number' && isFinite(value) && Number.isInteger(value) && value > 0 && value <= MAX_QUANTITY;
}

export function isValidStockQuantity(value: number): boolean {
  return typeof value === 'number' && isFinite(value) && Number.isInteger(value) && value >= 0 && value <= MAX_STOCK;
}

export function isValidMinAlert(value: number): boolean {
  return typeof value === 'number' && isFinite(value) && Number.isInteger(value) && value >= 0 && value <= MAX_STOCK;
}

export function isValidHSN(value: string): boolean {
  if (!value || value.trim() === '') return true; // Optional field
  return /^\d{4,8}$/.test(value.trim());
}

export function isValidGSTIN(value: string): boolean {
  if (!value || value.trim() === '') return true; // Optional
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value.trim().toUpperCase());
}

export function isValidInvoiceNumber(value: string): boolean {
  return typeof value === 'string' && value.trim().length >= 1 && value.trim().length <= 50;
}

export function isValidDate(value: string): boolean {
  if (!value) return false;
  const d = new Date(value);
  if (isNaN(d.getTime())) return false;
  // Must not be more than 5 years in the past or 1 year in the future
  const now = new Date();
  const fiveYearsAgo = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
  const oneYearAhead = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  return d >= fiveYearsAgo && d <= oneYearAhead;
}

// ─── Product Validation ───────────────────────────────────────────────────────

export interface ProductFormData {
  name: string;
  packSize: string;
  hsn: string;
  defaultPriceExGST: number;
  cgstPct: number;
  sgstPct: number;
  igstPct: number;
  stock: number;
  minAlert: number;
}

export function validateProduct(data: ProductFormData): ValidationResult {
  const errors: ValidationError[] = [];

  // Name
  if (!data.name || data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Product name is required.' });
  } else if (data.name.trim().length > 100) {
    errors.push({ field: 'name', message: 'Product name must be 100 characters or fewer.' });
  }

  // Pack Size
  if (data.packSize && data.packSize.trim().length > 50) {
    errors.push({ field: 'packSize', message: 'Pack size must be 50 characters or fewer.' });
  }

  // HSN Code
  if (data.hsn && !isValidHSN(data.hsn)) {
    errors.push({ field: 'hsn', message: 'HSN code must be 4–8 digits only.' });
  }

  // Default Price
  if (!isValidPrice(data.defaultPriceExGST)) {
    errors.push({ field: 'defaultPriceExGST', message: `Price must be between ₹0 and ₹${MAX_PRICE.toLocaleString('en-IN')}.` });
  } else if (isNaN(data.defaultPriceExGST)) {
    errors.push({ field: 'defaultPriceExGST', message: 'Price must be a valid number.' });
  }

  // GST Rates
  if (!isValidGSTRate(data.cgstPct)) {
    errors.push({ field: 'cgstPct', message: 'CGST rate must be between 0% and 28% in 0.5% increments.' });
  }
  if (!isValidGSTRate(data.sgstPct)) {
    errors.push({ field: 'sgstPct', message: 'SGST rate must be between 0% and 28% in 0.5% increments.' });
  }
  if (!isValidGSTRate(data.igstPct)) {
    errors.push({ field: 'igstPct', message: 'IGST rate must be between 0% and 28% in 0.5% increments.' });
  }

  // GST logic: CGST and SGST must be equal (they always are for intra-state)
  if (data.cgstPct !== data.sgstPct && data.igstPct === 0) {
    errors.push({ field: 'sgstPct', message: 'CGST and SGST rates must be equal for intra-state transactions.' });
  }

  // IGST and CGST/SGST cannot both be non-zero
  if (data.igstPct > 0 && (data.cgstPct > 0 || data.sgstPct > 0)) {
    errors.push({ field: 'igstPct', message: 'Cannot apply both IGST and CGST/SGST simultaneously. Use IGST for inter-state or CGST+SGST for intra-state.' });
  }

  // Stock
  if (!isValidStockQuantity(data.stock)) {
    errors.push({ field: 'stock', message: `Stock must be a whole number between 0 and ${MAX_STOCK.toLocaleString('en-IN')}.` });
  }

  // Min Alert
  if (!isValidMinAlert(data.minAlert)) {
    errors.push({ field: 'minAlert', message: `Minimum stock alert must be a whole number between 0 and ${MAX_STOCK.toLocaleString('en-IN')}.` });
  }

  return { valid: errors.length === 0, errors };
}

// ─── Customer Validation ──────────────────────────────────────────────────────

export interface CustomerFormData {
  name: string;
  gstin: string;
  address: string;
  phone: string;
  state: string;
}

export function validateCustomer(data: CustomerFormData): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Customer name is required.' });
  } else if (data.name.trim().length > 100) {
    errors.push({ field: 'name', message: 'Customer name must be 100 characters or fewer.' });
  }

  if (data.gstin && !isValidGSTIN(data.gstin)) {
    errors.push({ field: 'gstin', message: 'GSTIN format is invalid. Expected format: 06ABCDE1234F1Z5' });
  }

  if (!data.state || data.state.trim().length === 0) {
    errors.push({ field: 'state', message: 'State is required to determine GST type (CGST/SGST or IGST).' });
  }

  return { valid: errors.length === 0, errors };
}

// ─── Customer Special Price Validation ───────────────────────────────────────

export function validateSpecialPrice(price: number): ValidationResult {
  const errors: ValidationError[] = [];
  if (!isValidPrice(price)) {
    errors.push({ field: 'specialPriceExGST', message: `Special price must be between ₹0 and ₹${MAX_PRICE.toLocaleString('en-IN')}.` });
  }
  return { valid: errors.length === 0, errors };
}

// ─── Invoice Line Validation ──────────────────────────────────────────────────

export interface InvoiceLineData {
  productId: string;
  quantity: number;
  rateExGST: number;
  cgstPct: number;
  sgstPct: number;
  igstPct: number;
  totalExGST: number;
  taxAmount: number;
  lineTotal: number;
}

export function validateInvoiceLine(line: InvoiceLineData, index: number): ValidationError[] {
  const errors: ValidationError[] = [];
  const prefix = `Line ${index + 1}`;

  if (!line.productId) {
    errors.push({ field: `line_${index}_product`, message: `${prefix}: Please select a product.` });
  }

  if (!isValidQuantity(line.quantity)) {
    errors.push({ field: `line_${index}_quantity`, message: `${prefix}: Quantity must be a whole number between 1 and ${MAX_QUANTITY.toLocaleString('en-IN')}.` });
  }

  if (!isValidPrice(line.rateExGST)) {
    errors.push({ field: `line_${index}_rate`, message: `${prefix}: Rate must be between ₹0 and ₹${MAX_PRICE.toLocaleString('en-IN')}.` });
  }

  if (!isValidGSTRate(line.cgstPct)) {
    errors.push({ field: `line_${index}_cgst`, message: `${prefix}: CGST rate must be between 0% and 28%.` });
  }
  if (!isValidGSTRate(line.sgstPct)) {
    errors.push({ field: `line_${index}_sgst`, message: `${prefix}: SGST rate must be between 0% and 28%.` });
  }
  if (!isValidGSTRate(line.igstPct)) {
    errors.push({ field: `line_${index}_igst`, message: `${prefix}: IGST rate must be between 0% and 28%.` });
  }

  if (line.igstPct > 0 && (line.cgstPct > 0 || line.sgstPct > 0)) {
    errors.push({ field: `line_${index}_gst`, message: `${prefix}: Cannot apply both IGST and CGST/SGST simultaneously.` });
  }

  // Verify computed totals are consistent (guard against manual tampering)
  const expectedTotal = parseFloat((line.quantity * line.rateExGST).toFixed(2));
  const expectedTax = parseFloat((expectedTotal * (line.cgstPct + line.sgstPct + line.igstPct) / 100).toFixed(2));
  const expectedLineTotal = parseFloat((expectedTotal + expectedTax).toFixed(2));

  if (Math.abs(line.totalExGST - expectedTotal) > 0.02) {
    errors.push({ field: `line_${index}_total`, message: `${prefix}: Total (ex-GST) calculation mismatch. Expected ₹${expectedTotal}.` });
  }
  if (Math.abs(line.taxAmount - expectedTax) > 0.02) {
    errors.push({ field: `line_${index}_tax`, message: `${prefix}: Tax amount calculation mismatch. Expected ₹${expectedTax}.` });
  }
  if (Math.abs(line.lineTotal - expectedLineTotal) > 0.02) {
    errors.push({ field: `line_${index}_lineTotal`, message: `${prefix}: Line total calculation mismatch. Expected ₹${expectedLineTotal}.` });
  }

  return errors;
}

// ─── Invoice Header Validation ────────────────────────────────────────────────

export interface InvoiceHeaderData {
  invoiceNumber: string;
  date: string;
  customerId: string;
  placeOfSupply: string;
}

export function validateInvoiceHeader(data: InvoiceHeaderData): ValidationResult {
  const errors: ValidationError[] = [];

  if (!isValidInvoiceNumber(data.invoiceNumber)) {
    errors.push({ field: 'invoiceNumber', message: 'Invoice number is required (max 50 characters).' });
  }

  if (!isValidDate(data.date)) {
    errors.push({ field: 'date', message: 'Invoice date must be a valid date (not more than 5 years ago or 1 year in the future).' });
  }

  if (!data.customerId) {
    errors.push({ field: 'customerId', message: 'Please select a customer.' });
  }

  if (!data.placeOfSupply || data.placeOfSupply.trim().length === 0) {
    errors.push({ field: 'placeOfSupply', message: 'Place of supply is required.' });
  }

  return { valid: errors.length === 0, errors };
}

// ─── Full Invoice Validation ──────────────────────────────────────────────────

export interface FullInvoiceData {
  header: InvoiceHeaderData;
  lines: InvoiceLineData[];
  subtotalExGST: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  grandTotal: number;
}

export function validateFullInvoice(data: FullInvoiceData): ValidationResult {
  const errors: ValidationError[] = [];

  // Header
  const headerResult = validateInvoiceHeader(data.header);
  errors.push(...headerResult.errors);

  // Lines
  if (data.lines.length === 0) {
    errors.push({ field: 'lines', message: 'Invoice must have at least one line item.' });
  } else if (data.lines.length > MAX_LINE_ITEMS) {
    errors.push({ field: 'lines', message: `Invoice cannot have more than ${MAX_LINE_ITEMS} line items.` });
  } else {
    data.lines.forEach((line, i) => {
      errors.push(...validateInvoiceLine(line, i));
    });
  }

  // Verify grand total
  if (data.lines.length > 0) {
    const expectedSubtotal = parseFloat(data.lines.reduce((s, l) => s + l.totalExGST, 0).toFixed(2));
    const expectedCGST = parseFloat(data.lines.reduce((s, l) => s + l.totalExGST * l.cgstPct / 100, 0).toFixed(2));
    const expectedSGST = parseFloat(data.lines.reduce((s, l) => s + l.totalExGST * l.sgstPct / 100, 0).toFixed(2));
    const expectedIGST = parseFloat(data.lines.reduce((s, l) => s + l.totalExGST * l.igstPct / 100, 0).toFixed(2));
    const expectedGrand = parseFloat((expectedSubtotal + expectedCGST + expectedSGST + expectedIGST).toFixed(2));

    if (Math.abs(data.subtotalExGST - expectedSubtotal) > 0.05) {
      errors.push({ field: 'subtotalExGST', message: `Subtotal mismatch. Expected ₹${expectedSubtotal.toLocaleString('en-IN')}.` });
    }
    if (Math.abs(data.grandTotal - expectedGrand) > 0.05) {
      errors.push({ field: 'grandTotal', message: `Grand total mismatch. Expected ₹${expectedGrand.toLocaleString('en-IN')}.` });
    }
    if (data.grandTotal > MAX_INVOICE_TOTAL) {
      errors.push({ field: 'grandTotal', message: `Invoice total ₹${data.grandTotal.toLocaleString('en-IN')} exceeds maximum allowed ₹${MAX_INVOICE_TOTAL.toLocaleString('en-IN')}.` });
    }
  }

  return { valid: errors.length === 0, errors };
}

// ─── Stock Adjustment Validation ──────────────────────────────────────────────

export type StockAdjustType = 'add' | 'remove' | 'set';

export interface StockAdjustData {
  productId: string;
  adjustType: StockAdjustType;
  quantity: number;
  currentStock: number;
}

export function validateStockAdjustment(data: StockAdjustData): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.productId) {
    errors.push({ field: 'productId', message: 'Please select a product.' });
  }

  if (!Number.isInteger(data.quantity) || data.quantity <= 0) {
    errors.push({ field: 'quantity', message: 'Quantity must be a positive whole number.' });
  } else if (data.quantity > MAX_QUANTITY) {
    errors.push({ field: 'quantity', message: `Quantity cannot exceed ${MAX_QUANTITY.toLocaleString('en-IN')} units per operation.` });
  }

  if (data.adjustType === 'set') {
    if (!isValidStockQuantity(data.quantity)) {
      errors.push({ field: 'quantity', message: `New stock value must be between 0 and ${MAX_STOCK.toLocaleString('en-IN')}.` });
    }
  }

  if (data.adjustType === 'add') {
    const newStock = data.currentStock + data.quantity;
    if (newStock > MAX_STOCK) {
      errors.push({ field: 'quantity', message: `Adding ${data.quantity} units would exceed maximum stock limit of ${MAX_STOCK.toLocaleString('en-IN')}.` });
    }
  }

  return { valid: errors.length === 0, errors };
}

// ─── Direct Stock Edit Validation ────────────────────────────────────────────

export function validateDirectStockEdit(value: string): ValidationResult {
  const errors: ValidationError[] = [];
  const num = parseInt(value, 10);

  if (isNaN(num)) {
    errors.push({ field: 'stock', message: 'Stock value must be a valid whole number.' });
  } else if (!isValidStockQuantity(num)) {
    errors.push({ field: 'stock', message: `Stock must be between 0 and ${MAX_STOCK.toLocaleString('en-IN')}.` });
  }

  return { valid: errors.length === 0, errors };
}

// ─── Formatting Helpers ───────────────────────────────────────────────────────

export function formatValidationErrors(errors: ValidationError[]): string {
  return errors.map(e => `• ${e.message}`).join('\n');
}

export function getFieldError(errors: ValidationError[], field: string): string | undefined {
  return errors.find(e => e.field === field)?.message;
}
