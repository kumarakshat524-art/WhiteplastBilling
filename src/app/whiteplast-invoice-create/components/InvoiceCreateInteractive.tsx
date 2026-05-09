'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import WhiteplastLayout from '@/components/whiteplast/WhiteplastLayout';
import { ProductDB, CustomerDB, CustomerPriceDB, InvoiceDB, Product, Customer, SalesInvoice, adjustStock, seedSampleData, numberToWords } from '@/lib/whiteplast-db';
import { validateFullInvoice, validateInvoiceLine, getFieldError, ValidationError } from '@/lib/whiteplast-validation';

const NAVY = '#1a3a6b';
const NAVY_LIGHT = '#e8eef7';

interface LineItem {
  id: string;
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

function calcLine(line: Omit<LineItem, 'totalExGST' | 'taxAmount' | 'lineTotal'>): LineItem {
  const totalExGST = parseFloat((line.quantity * line.rateExGST).toFixed(2));
  const taxAmount = parseFloat((totalExGST * (line.cgstPct + line.sgstPct + line.igstPct) / 100).toFixed(2));
  return { ...line, totalExGST, taxAmount, lineTotal: parseFloat((totalExGST + taxAmount).toFixed(2)) };
}

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

// ─── Product Autocomplete Component ──────────────────────────────────────────
interface ProductAutocompleteProps {
  products: Product[];
  line: LineItem;
  customerId: string;
  onUpdate: (lineId: string, field: string, value: string | number) => void;
  onUpdateMultiple: (lineId: string, updates: Partial<LineItem>) => void;
}

function ProductAutocomplete({ products, line, customerId, onUpdate, onUpdateMultiple }: ProductAutocompleteProps) {
  const [query, setQuery] = useState(line.productNameSnapshot || '');
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [isCustom, setIsCustom] = useState(!line.productId || line.productId === '__custom__');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim().length === 0
    ? products.slice(0, 8)
    : products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.packSize.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);

  function selectProduct(p: Product) {
    const rate = CustomerPriceDB.getPrice(customerId, p.id) ?? p.defaultPriceExGST;
    setQuery(p.name);
    setOpen(false);
    setIsCustom(false);
    setHighlighted(-1);
    onUpdateMultiple(line.id, {
      productId: p.id,
      productNameSnapshot: p.name,
      packSizeSnapshot: p.packSize,
      hsnSnapshot: p.hsn,
      rateExGST: rate,
      cgstPct: p.cgstPct,
      sgstPct: p.sgstPct,
      igstPct: p.igstPct,
    });
  }

  function handleInputChange(val: string) {
    setQuery(val);
    setOpen(true);
    setHighlighted(-1);
    // If user is typing freely, mark as custom product
    setIsCustom(true);
    onUpdateMultiple(line.id, {
      productId: '__custom__',
      productNameSnapshot: val,
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) { if (e.key === 'ArrowDown') setOpen(true); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(h => Math.max(h - 1, -1)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlighted >= 0 && filtered[highlighted]) selectProduct(filtered[highlighted]);
      else setOpen(false);
    }
    else if (e.key === 'Escape') setOpen(false);
  }

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Sync query when line changes externally
  useEffect(() => {
    setQuery(line.productNameSnapshot || '');
  }, [line.productNameSnapshot]);

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        placeholder="Type product name..."
        onChange={e => handleInputChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1"
        style={{ '--tw-ring-color': NAVY } as React.CSSProperties}
      />
      {open && (
        <div className="absolute left-0 top-full mt-0.5 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((p, idx) => (
              <div
                key={p.id}
                onMouseDown={() => selectProduct(p)}
                className="px-3 py-2 cursor-pointer text-xs hover:text-white transition-colors"
                style={{ backgroundColor: idx === highlighted ? NAVY : undefined, color: idx === highlighted ? 'white' : undefined }}
                onMouseEnter={() => setHighlighted(idx)}
              >
                <div className="font-medium">{p.name}</div>
                <div className="text-gray-400" style={{ color: idx === highlighted ? '#c8d8f0' : undefined }}>{p.packSize} · HSN: {p.hsn} · ₹{p.defaultPriceExGST}</div>
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-xs text-gray-400 italic">No matches — using as custom product</div>
          )}
        </div>
      )}
      {/* Custom product extra fields */}
      {isCustom && line.productId === '__custom__' && (
        <div className="mt-1.5 grid grid-cols-2 gap-1">
          <input
            type="text"
            placeholder="Pack Size"
            value={line.packSizeSnapshot}
            onChange={e => onUpdate(line.id, 'packSizeSnapshot', e.target.value)}
            className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1"
          />
          <input
            type="text"
            placeholder="HSN (optional)"
            value={line.hsnSnapshot}
            onChange={e => onUpdate(line.id, 'hsnSnapshot', e.target.value)}
            className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1"
          />
        </div>
      )}
      {!isCustom && <div className="text-gray-400 mt-0.5 pl-1 text-xs">HSN: {line.hsnSnapshot}</div>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InvoiceCreateInteractive() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [mounted, setMounted] = useState(false);

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerId, setCustomerId] = useState('');
  const [placeOfSupply, setPlaceOfSupply] = useState('Haryana');
  const [lines, setLines] = useState<LineItem[]>([]);
  const [saving, setSaving] = useState(false);

  // Validation state
  const [headerErrors, setHeaderErrors] = useState<ValidationError[]>([]);
  const [lineErrors, setLineErrors] = useState<Record<string, ValidationError[]>>({});
  const [globalErrors, setGlobalErrors] = useState<ValidationError[]>([]);
  const [saveAttempted, setSaveAttempted] = useState(false);

  useEffect(() => {
    seedSampleData();
    const prods = ProductDB.getAll();
    const custs = CustomerDB.getAll();
    setProducts(prods);
    setCustomers(custs);

    if (editId) {
      const inv = InvoiceDB.getById(editId);
      if (inv) {
        setInvoiceNumber(inv.invoiceNumber);
        setDate(inv.date);
        setCustomerId(inv.customerId);
        setPlaceOfSupply(inv.placeOfSupply);
        setLines(inv.lines.map(l => ({
          id: uid(),
          productId: l.productId,
          productNameSnapshot: l.productNameSnapshot,
          packSizeSnapshot: l.packSizeSnapshot,
          hsnSnapshot: l.hsnSnapshot,
          quantity: l.quantity,
          rateExGST: l.rateExGST,
          cgstPct: l.cgstPct,
          sgstPct: l.sgstPct,
          igstPct: l.igstPct,
          totalExGST: l.totalExGST,
          taxAmount: l.taxAmount,
          lineTotal: l.lineTotal,
        })));
      }
    } else {
      // Leave invoiceNumber empty — user types manually
      setInvoiceNumber('');
      if (custs.length > 0) {
        setCustomerId(custs[0].id);
        setPlaceOfSupply(custs[0].state);
      }
    }
    setMounted(true);
  }, [editId]);

  const selectedCustomer = customers.find(c => c.id === customerId);

  // Computed totals
  const subtotalExGST = parseFloat(lines.reduce((s, l) => s + l.totalExGST, 0).toFixed(2));
  const cgstTotal = parseFloat(lines.reduce((s, l) => s + l.totalExGST * l.cgstPct / 100, 0).toFixed(2));
  const sgstTotal = parseFloat(lines.reduce((s, l) => s + l.totalExGST * l.sgstPct / 100, 0).toFixed(2));
  const igstTotal = parseFloat(lines.reduce((s, l) => s + l.totalExGST * l.igstPct / 100, 0).toFixed(2));
  const grandTotal = parseFloat((subtotalExGST + cgstTotal + sgstTotal + igstTotal).toFixed(2));

  function handleCustomerChange(id: string) {
    setCustomerId(id);
    const c = customers.find(x => x.id === id);
    if (c) setPlaceOfSupply(c.state);
    if (saveAttempted) validateHeader(id, date, placeOfSupply);
  }

  function validateHeader(cid = customerId, d = date, pos = placeOfSupply) {
    const { errors } = validateFullInvoice({
      header: { invoiceNumber, date: d, customerId: cid, placeOfSupply: pos },
      lines: lines.map(l => ({
        productId: l.productId, quantity: l.quantity, rateExGST: l.rateExGST,
        cgstPct: l.cgstPct, sgstPct: l.sgstPct, igstPct: l.igstPct,
        totalExGST: l.totalExGST, taxAmount: l.taxAmount, lineTotal: l.lineTotal,
      })),
      subtotalExGST, cgstTotal, sgstTotal, igstTotal, grandTotal,
    });
    setHeaderErrors(errors.filter(e => ['invoiceNumber', 'date', 'customerId', 'placeOfSupply'].includes(e.field)));
    setGlobalErrors(errors.filter(e => ['lines', 'subtotalExGST', 'grandTotal'].includes(e.field)));
  }

  function addLine() {
    const newLine = calcLine({
      id: uid(), productId: '',
      productNameSnapshot: '', packSizeSnapshot: '', hsnSnapshot: '',
      quantity: 1, rateExGST: 0, cgstPct: 9, sgstPct: 9, igstPct: 0,
    });
    setLines(prev => [...prev, newLine]);
  }

  function updateLine(lineId: string, field: string, value: string | number) {
    setLines(prev => prev.map(line => {
      if (line.id !== lineId) return line;
      let updated = { ...line, [field]: value };

      // Clamp values to valid ranges before recalculating
      if (field === 'quantity') updated.quantity = Math.max(1, Math.floor(Number(value) || 1));
      if (field === 'rateExGST') updated.rateExGST = Math.max(0, Number(value) || 0);
      if (['cgstPct', 'sgstPct', 'igstPct'].includes(field)) {
        const pct = Math.max(0, Math.min(28, Number(value) || 0));
        updated = { ...updated, [field]: pct };
      }

      const recalculated = calcLine(updated);

      const lineValidationErrors = validateInvoiceLine({
        productId: recalculated.productId,
        quantity: recalculated.quantity,
        rateExGST: recalculated.rateExGST,
        cgstPct: recalculated.cgstPct,
        sgstPct: recalculated.sgstPct,
        igstPct: recalculated.igstPct,
        totalExGST: recalculated.totalExGST,
        taxAmount: recalculated.taxAmount,
        lineTotal: recalculated.lineTotal,
      }, prev.findIndex(l => l.id === lineId));

      setLineErrors(errs => ({ ...errs, [lineId]: lineValidationErrors }));
      return recalculated;
    }));
  }

  function updateLineMultiple(lineId: string, updates: Partial<LineItem>) {
    setLines(prev => prev.map(line => {
      if (line.id !== lineId) return line;
      const merged = { ...line, ...updates };
      return calcLine(merged);
    }));
  }

  function removeLine(lineId: string) {
    setLines(prev => prev.filter(l => l.id !== lineId));
    setLineErrors(prev => {
      const next = { ...prev };
      delete next[lineId];
      return next;
    });
  }

  function buildInvoiceData(isDraft: boolean): Omit<SalesInvoice, 'id' | 'createdAt'> {
    return {
      invoiceNumber,
      date,
      customerId,
      customerName: selectedCustomer?.name || '',
      placeOfSupply,
      subtotalExGST,
      cgstTotal,
      sgstTotal,
      igstTotal,
      grandTotalInclGST: grandTotal,
      isDraft,
      lines: lines.map(l => ({
        id: uid(),
        invoiceId: editId || '',
        productId: l.productId,
        productNameSnapshot: l.productNameSnapshot,
        packSizeSnapshot: l.packSizeSnapshot,
        hsnSnapshot: l.hsnSnapshot,
        quantity: l.quantity,
        rateExGST: l.rateExGST,
        cgstPct: l.cgstPct,
        sgstPct: l.sgstPct,
        igstPct: l.igstPct,
        totalExGST: l.totalExGST,
        taxAmount: l.taxAmount,
        lineTotal: l.lineTotal,
      })),
    };
  }

  function handleSave(isDraft: boolean) {
    setSaveAttempted(true);

    const result = validateFullInvoice({
      header: { invoiceNumber, date, customerId, placeOfSupply },
      lines: lines.map((l) => ({
        productId: l.productId, quantity: l.quantity, rateExGST: l.rateExGST,
        cgstPct: l.cgstPct, sgstPct: l.sgstPct, igstPct: l.igstPct,
        totalExGST: l.totalExGST, taxAmount: l.taxAmount, lineTotal: l.lineTotal,
      })),
      subtotalExGST, cgstTotal, sgstTotal, igstTotal, grandTotal,
    });

    if (!result.valid) {
      setHeaderErrors(result.errors.filter(e => ['invoiceNumber', 'date', 'customerId', 'placeOfSupply'].includes(e.field)));
      setGlobalErrors(result.errors.filter(e => ['lines', 'subtotalExGST', 'grandTotal'].includes(e.field)));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSaving(true);
    const data = buildInvoiceData(isDraft);

    if (editId) {
      InvoiceDB.update(editId, data);
    } else {
      const inv = InvoiceDB.add(data);
      if (!isDraft) {
        lines.forEach(l => {
          if (l.productId && l.productId !== '__custom__') {
            adjustStock(l.productId, -l.quantity, `Sold via invoice ${invoiceNumber}`, inv.id, invoiceNumber);
          }
        });
      }
    }

    setSaving(false);
    if (!isDraft) {
      const savedId = editId || InvoiceDB.getAll().find(i => i.invoiceNumber === invoiceNumber)?.id;
      router.push(`/whiteplast-invoice-print?id=${savedId}`);
    } else {
      router.push('/whiteplast-invoices');
    }
  }

  function f(v: number) { return v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  const allLineErrors = Object.values(lineErrors).flat();
  const hasAnyErrors = headerErrors.length > 0 || allLineErrors.length > 0 || globalErrors.length > 0;

  if (!mounted) return null;

  const navyBtnClass = 'text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-50';
  const navyOutlineClass = 'border text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50';

  return (
    <WhiteplastLayout>
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: NAVY }}>{editId ? 'Edit Invoice' : 'New Invoice'}</h1>
            <p className="text-sm text-gray-500">GST Tax Invoice</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleSave(true)} disabled={saving}
              className={navyOutlineClass}
              style={{ borderColor: NAVY, color: NAVY }}>
              Save as Draft
            </button>
            <button onClick={() => handleSave(false)} disabled={saving}
              className={navyBtnClass}
              style={{ backgroundColor: NAVY }}>
              💾 Save & Print
            </button>
          </div>
        </div>

        {/* Global Validation Banner */}
        {saveAttempted && hasAnyErrors && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-red-700 mb-2">⚠️ Please fix the following errors before saving:</p>
            <ul className="text-sm text-red-600 space-y-1">
              {[...headerErrors, ...globalErrors, ...allLineErrors].map((e, i) => (
                <li key={i}>• {e.message}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Invoice Meta */}
        <div className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: '#d1dce8' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: NAVY }}>Invoice Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Invoice Number — plain empty text input */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: NAVY }}>Invoice No. *</label>
              <input
                type="text"
                value={invoiceNumber}
                placeholder="e.g. 101, 2024-001"
                onChange={e => {
                  setInvoiceNumber(e.target.value);
                  if (saveAttempted) validateHeader(customerId, date, placeOfSupply);
                }}
                maxLength={50}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 ${
                  saveAttempted && getFieldError(headerErrors, 'invoiceNumber')
                    ? 'border-red-400 focus:ring-red-300 bg-red-50' : 'border-gray-200'
                }`}
                style={!(saveAttempted && getFieldError(headerErrors, 'invoiceNumber')) ? { '--tw-ring-color': NAVY } as React.CSSProperties : undefined}
              />
              {saveAttempted && getFieldError(headerErrors, 'invoiceNumber') && (
                <p className="text-xs text-red-600 mt-1">{getFieldError(headerErrors, 'invoiceNumber')}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: NAVY }}>Date *</label>
              <input
                type="date"
                value={date}
                onChange={e => {
                  setDate(e.target.value);
                  if (saveAttempted) validateHeader(customerId, e.target.value, placeOfSupply);
                }}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                  saveAttempted && getFieldError(headerErrors, 'date')
                    ? 'border-red-400 focus:ring-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {saveAttempted && getFieldError(headerErrors, 'date') && (
                <p className="text-xs text-red-600 mt-1">{getFieldError(headerErrors, 'date')}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: NAVY }}>Customer *</label>
              <select
                value={customerId}
                onChange={e => handleCustomerChange(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 bg-white ${
                  saveAttempted && getFieldError(headerErrors, 'customerId')
                    ? 'border-red-400 focus:ring-red-300 bg-red-50' : 'border-gray-200'
                }`}
              >
                <option value="">— Select Customer —</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {saveAttempted && getFieldError(headerErrors, 'customerId') && (
                <p className="text-xs text-red-600 mt-1">{getFieldError(headerErrors, 'customerId')}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: NAVY }}>Place of Supply *</label>
              <input
                type="text"
                value={placeOfSupply}
                onChange={e => {
                  setPlaceOfSupply(e.target.value);
                  if (saveAttempted) validateHeader(customerId, date, e.target.value);
                }}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                  saveAttempted && getFieldError(headerErrors, 'placeOfSupply')
                    ? 'border-red-400 focus:ring-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {saveAttempted && getFieldError(headerErrors, 'placeOfSupply') && (
                <p className="text-xs text-red-600 mt-1">{getFieldError(headerErrors, 'placeOfSupply')}</p>
              )}
            </div>
          </div>
          {selectedCustomer && (
            <div className="mt-4 p-3 rounded-lg border text-xs" style={{ backgroundColor: NAVY_LIGHT, borderColor: NAVY, color: NAVY }}>
              <strong>{selectedCustomer.name}</strong> · {selectedCustomer.address} · GSTIN: {selectedCustomer.gstin || 'N/A'} · {selectedCustomer.state}
            </div>
          )}
        </div>

        {/* Line Items */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: '#d1dce8' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold" style={{ color: NAVY }}>Line Items</h2>
            <button onClick={addLine} className="text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors" style={{ backgroundColor: NAVY }}>
              + Add Item
            </button>
          </div>

          {lines.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <div className="text-3xl mb-2">📦</div>
              <p className="text-sm">No items added yet.</p>
              {saveAttempted && globalErrors.find(e => e.field === 'lines') && (
                <p className="text-sm text-red-600 mt-2 font-medium">⚠️ {globalErrors.find(e => e.field === 'lines')?.message}</p>
              )}
              <button onClick={addLine} className="mt-3 hover:underline text-sm font-medium" style={{ color: NAVY }}>Add first item</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200" style={{ backgroundColor: NAVY_LIGHT }}>
                    <th className="text-left px-3 py-2.5 font-semibold min-w-[200px]" style={{ color: NAVY }}>Product</th>
                    <th className="text-right px-3 py-2.5 font-semibold w-20" style={{ color: NAVY }}>Qty</th>
                    <th className="text-right px-3 py-2.5 font-semibold w-24" style={{ color: NAVY }}>Rate (ex-GST)</th>
                    <th className="text-center px-3 py-2.5 font-semibold w-20" style={{ color: NAVY }}>CGST%</th>
                    <th className="text-center px-3 py-2.5 font-semibold w-20" style={{ color: NAVY }}>SGST%</th>
                    <th className="text-center px-3 py-2.5 font-semibold w-20" style={{ color: NAVY }}>IGST%</th>
                    <th className="text-right px-3 py-2.5 font-semibold w-24" style={{ color: NAVY }}>Total (ex-GST)</th>
                    <th className="text-right px-3 py-2.5 font-semibold w-24" style={{ color: NAVY }}>Tax Amt</th>
                    <th className="text-right px-3 py-2.5 font-semibold w-24" style={{ color: NAVY }}>Line Total</th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {lines.map((line, lineIndex) => {
                    const errs = lineErrors[line.id] || [];
                    const hasErr = errs.length > 0;
                    const qtyErr = errs.find(e => e.field.includes('quantity'));
                    const rateErr = errs.find(e => e.field.includes('rate'));
                    const gstErr = errs.find(e => e.field.includes('gst') || e.field.includes('cgst') || e.field.includes('sgst') || e.field.includes('igst'));

                    return (
                      <React.Fragment key={line.id}>
                        <tr className={`hover:bg-gray-50 ${hasErr ? 'bg-red-50/30' : ''}`}>
                          <td className="px-3 py-2">
                            <ProductAutocomplete
                              products={products}
                              line={line}
                              customerId={customerId}
                              onUpdate={updateLine}
                              onUpdateMultiple={updateLineMultiple}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={line.quantity}
                              min="1"
                              step="1"
                              onChange={e => updateLine(line.id, 'quantity', parseFloat(e.target.value) || 1)}
                              className={`w-full border rounded px-2 py-1.5 text-xs text-right focus:outline-none focus:ring-1 ${
                                qtyErr ? 'border-red-400 bg-red-50 focus:ring-red-300' : 'border-gray-200'
                              }`}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={line.rateExGST}
                              min="0"
                              step="0.01"
                              onChange={e => updateLine(line.id, 'rateExGST', parseFloat(e.target.value) || 0)}
                              className={`w-full border rounded px-2 py-1.5 text-xs text-right focus:outline-none focus:ring-1 ${
                                rateErr ? 'border-red-400 bg-red-50 focus:ring-red-300' : 'border-gray-200'
                              }`}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={line.cgstPct}
                              min="0" max="28" step="0.5"
                              onChange={e => updateLine(line.id, 'cgstPct', parseFloat(e.target.value) || 0)}
                              className={`w-full border rounded px-2 py-1.5 text-xs text-center focus:outline-none focus:ring-1 ${
                                gstErr ? 'border-red-400 bg-red-50 focus:ring-red-300' : 'border-gray-200'
                              }`}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={line.sgstPct}
                              min="0" max="28" step="0.5"
                              onChange={e => updateLine(line.id, 'sgstPct', parseFloat(e.target.value) || 0)}
                              className={`w-full border rounded px-2 py-1.5 text-xs text-center focus:outline-none focus:ring-1 ${
                                gstErr ? 'border-red-400 bg-red-50 focus:ring-red-300' : 'border-gray-200'
                              }`}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={line.igstPct}
                              min="0" max="28" step="0.5"
                              onChange={e => updateLine(line.id, 'igstPct', parseFloat(e.target.value) || 0)}
                              className={`w-full border rounded px-2 py-1.5 text-xs text-center focus:outline-none focus:ring-1 ${
                                gstErr ? 'border-red-400 bg-red-50 focus:ring-red-300' : 'border-gray-200'
                              }`}
                            />
                          </td>
                          <td className="px-3 py-2 text-right font-medium text-gray-700">₹{f(line.totalExGST)}</td>
                          <td className="px-3 py-2 text-right text-gray-500">₹{f(line.taxAmount)}</td>
                          <td className="px-3 py-2 text-right font-bold text-gray-900">₹{f(line.lineTotal)}</td>
                          <td className="px-3 py-2 text-center">
                            <button onClick={() => removeLine(line.id)} className="text-red-400 hover:text-red-600 transition-colors text-base">✕</button>
                          </td>
                        </tr>
                        {hasErr && (
                          <tr className="bg-red-50">
                            <td colSpan={10} className="px-3 py-1.5">
                              <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                                {errs.filter(e => !e.field.includes('total') && !e.field.includes('tax') && !e.field.includes('lineTotal')).map((e, i) => (
                                  <span key={i} className="text-xs text-red-600">⚠️ {e.message}</span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Totals */}
        {lines.length > 0 && (
          <div className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: '#d1dce8' }}>
            <div className="flex justify-end">
              <div className="w-full max-w-sm space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal (ex-GST)</span>
                  <span className="font-medium">₹{f(subtotalExGST)}</span>
                </div>
                {cgstTotal > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>CGST</span>
                    <span>₹{f(cgstTotal)}</span>
                  </div>
                )}
                {sgstTotal > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>SGST</span>
                    <span>₹{f(sgstTotal)}</span>
                  </div>
                )}
                {igstTotal > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>IGST</span>
                    <span>₹{f(igstTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200" style={{ color: NAVY }}>
                  <span>Grand Total</span>
                  <span>₹{f(grandTotal)}</span>
                </div>
                <div className="text-xs text-gray-500 italic pt-1">
                  {numberToWords(grandTotal)}
                </div>
                {saveAttempted && globalErrors.find(e => e.field === 'grandTotal') && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                    ⚠️ {globalErrors.find(e => e.field === 'grandTotal')?.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pb-6">
          <button onClick={() => router.push('/whiteplast-invoices')} className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Cancel
          </button>
          <button onClick={() => handleSave(true)} disabled={saving}
            className="border px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            style={{ borderColor: NAVY, color: NAVY }}>
            Save as Draft
          </button>
          <button onClick={() => handleSave(false)} disabled={saving}
            className="text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-50"
            style={{ backgroundColor: NAVY }}>
            💾 Save & Print
          </button>
        </div>
      </div>
    </WhiteplastLayout>
  );
}
