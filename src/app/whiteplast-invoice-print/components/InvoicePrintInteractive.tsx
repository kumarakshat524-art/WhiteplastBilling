'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { InvoiceDB, CustomerDB, SalesInvoice, Customer, numberToWords } from '@/lib/whiteplast-db';

const NAVY = '#1a3a6b';
const NAVY_DARK = '#122a52';
const NAVY_LIGHT = '#e8eef7';

const BUSINESS = {
  legalName: 'Kumar Cement Corporation',
  tradeName: 'Whiteplast',
  tagline: 'From the House of Whiteplast Products',
  address: 'C1/414, Jaroda Gate, Jagadhri-135003, Haryana',
  gstin: '06BZRPK1707R1ZP',
  phone: '98962-94045, 90507-94045',
  email: 'kumarwhiteplast@gmail.com',
};

const PRODUCT_CATEGORIES = [
  'WALL PUTTY', 'GYSAM (POP)', 'TILE ADHESIVE', 'CEMENT GROUT', 'AD MIXTURE',
  'EPOXY GROUT', 'CONSTRUCTION CHEMICALS', 'TEXTURE (RUSTIC)', 'SPACER',
  'TILE LEVELER', 'EPOXY GROUT SPARKLES',
];

export default function InvoicePrintInteractive() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const invoiceId = searchParams.get('id');
  const [invoice, setInvoice] = useState<SalesInvoice | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [mounted, setMounted] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!invoiceId) return;
    const inv = InvoiceDB.getById(invoiceId);
    if (inv) {
      setInvoice(inv);
      const cust = CustomerDB.getById(inv.customerId);
      setCustomer(cust || null);
    }
    setMounted(true);
  }, [invoiceId]);

  function handlePrint() {
    window.print();
  }

  if (!mounted) return null;
  if (!invoice) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-4xl mb-3">🧾</div>
        <p className="text-gray-600">Invoice not found.</p>
        <button onClick={() => router.push('/whiteplast-invoices')} className="mt-4 hover:underline" style={{ color: NAVY }}>Back to Invoices</button>
      </div>
    </div>
  );

  function f(v: number) { return v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  const amountInWords = numberToWords(invoice.grandTotalInclGST);

  // Group GST rates for summary
  const gstSummary: Record<string, { cgst: number; sgst: number; igst: number; taxable: number }> = {};
  invoice.lines.forEach(line => {
    const key = `${line.cgstPct}-${line.sgstPct}-${line.igstPct}`;
    if (!gstSummary[key]) gstSummary[key] = { cgst: line.cgstPct, sgst: line.sgstPct, igst: line.igstPct, taxable: 0 };
    gstSummary[key].taxable += line.totalExGST;
  });

  return (
    <>
      {/* Print Controls - hidden on print */}
      <div className="print:hidden text-white px-6 py-3 flex items-center justify-between sticky top-0 z-50" style={{ backgroundColor: NAVY_DARK }}>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/whiteplast-invoices')} className="text-gray-300 hover:text-white text-sm">← Back</button>
          <span className="text-gray-500">|</span>
          <span className="text-sm font-medium">{invoice.invoiceNumber}</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push(`/whiteplast-invoice-create?edit=${invoice.id}`)}
            className="border border-gray-400 text-gray-300 hover:text-white px-4 py-1.5 rounded text-sm transition-colors">
            ✏️ Edit
          </button>
          <button onClick={handlePrint}
            className="text-white px-5 py-1.5 rounded text-sm font-semibold transition-colors" style={{ backgroundColor: NAVY }}>
            🖨️ Print / Save PDF
          </button>
        </div>
      </div>

      {/* Invoice Print Area */}
      <div className="min-h-screen bg-gray-100 print:bg-white py-8 print:py-0">
        <div ref={printRef} className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none print:max-w-none" style={{ fontFamily: 'Arial, sans-serif' }}>
          <div className="p-8 print:p-6">

            {/* Header */}
            <div className="flex items-start justify-between mb-6 pb-5" style={{ borderBottom: `3px solid ${NAVY}` }}>
              <div className="flex items-center gap-4">
                {/* Logo - WP navy house icon */}
                <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-md flex-shrink-0" style={{ backgroundColor: NAVY }}>
                  <span className="text-white text-2xl font-black">WP</span>
                </div>
                <div>
                  <div className="text-2xl font-black tracking-wide" style={{ color: NAVY }}>{BUSINESS.tradeName}</div>
                  <div className="text-xs italic" style={{ color: NAVY }}>{BUSINESS.tagline}</div>
                  <div className="text-sm font-semibold text-gray-700 mt-0.5">{BUSINESS.legalName}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black tracking-widest" style={{ color: NAVY }}>TAX INVOICE</div>
                <div className="text-xs text-gray-500 mt-1 border px-2 py-0.5 rounded inline-block" style={{ borderColor: NAVY }}>Original for Recipient</div>
                <div className="mt-3 text-xs text-gray-600 space-y-0.5">
                  <div>{BUSINESS.address}</div>
                  <div>GSTIN: <strong>{BUSINESS.gstin}</strong></div>
                  <div>📞 {BUSINESS.phone}</div>
                  <div>✉️ {BUSINESS.email}</div>
                </div>
              </div>
            </div>

            {/* Invoice Meta */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="rounded-lg p-3 border" style={{ backgroundColor: NAVY_LIGHT, borderColor: NAVY }}>
                <table className="text-sm w-full">
                  <tbody>
                    <tr>
                      <td className="pr-3 py-0.5 font-medium" style={{ color: NAVY }}>Invoice No.</td>
                      <td className="font-bold text-gray-900 font-mono">{invoice.invoiceNumber}</td>
                    </tr>
                    <tr>
                      <td className="pr-3 py-0.5 font-medium" style={{ color: NAVY }}>Date</td>
                      <td className="font-semibold text-gray-800">{new Date(invoice.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                    </tr>
                    <tr>
                      <td className="pr-3 py-0.5 font-medium" style={{ color: NAVY }}>Place of Supply</td>
                      <td className="text-gray-800">{invoice.placeOfSupply}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="rounded-lg p-3 border" style={{ backgroundColor: NAVY_LIGHT, borderColor: NAVY }}>
                <div className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: NAVY }}>Bill To</div>
                <div className="font-bold text-gray-900 text-sm">{invoice.customerName}</div>
                {customer && (
                  <>
                    {customer.gstin && <div className="text-xs text-gray-600 mt-0.5">GSTIN: {customer.gstin}</div>}
                    <div className="text-xs text-gray-600 mt-0.5">{customer.address}</div>
                    <div className="text-xs text-gray-600">{customer.state}</div>
                    {customer.phone && <div className="text-xs text-gray-600">📞 {customer.phone}</div>}
                  </>
                )}
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-xs border-collapse mb-5">
              <thead>
                <tr className="text-white" style={{ backgroundColor: NAVY }}>
                  <th className="px-2 py-2.5 text-left font-semibold w-8">S.No</th>
                  <th className="px-2 py-2.5 text-left font-semibold">Product Name</th>
                  <th className="px-2 py-2.5 text-left font-semibold">Pack Size</th>
                  <th className="px-2 py-2.5 text-center font-semibold">HSN</th>
                  <th className="px-2 py-2.5 text-right font-semibold">Qty</th>
                  <th className="px-2 py-2.5 text-right font-semibold">Rate</th>
                  <th className="px-2 py-2.5 text-right font-semibold">Total</th>
                  <th className="px-2 py-2.5 text-center font-semibold">CGST%</th>
                  <th className="px-2 py-2.5 text-center font-semibold">SGST%</th>
                  <th className="px-2 py-2.5 text-center font-semibold">IGST%</th>
                  <th className="px-2 py-2.5 text-right font-semibold">Tax Amt</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lines.map((line, idx) => (
                  <tr key={line.id || idx} className={idx % 2 === 0 ? 'bg-white' : ''} style={{ backgroundColor: idx % 2 !== 0 ? NAVY_LIGHT : undefined, borderBottom: '1px solid #d1d5db' }}>
                    <td className="px-2 py-2 text-center text-gray-500">{idx + 1}</td>
                    <td className="px-2 py-2 font-medium text-gray-800">{line.productNameSnapshot}</td>
                    <td className="px-2 py-2 text-gray-600">{line.packSizeSnapshot}</td>
                    <td className="px-2 py-2 text-center text-gray-500 font-mono">{line.hsnSnapshot}</td>
                    <td className="px-2 py-2 text-right text-gray-700">{line.quantity}</td>
                    <td className="px-2 py-2 text-right text-gray-700">₹{f(line.rateExGST)}</td>
                    <td className="px-2 py-2 text-right font-medium text-gray-800">₹{f(line.totalExGST)}</td>
                    <td className="px-2 py-2 text-center text-gray-600">{line.cgstPct > 0 ? `${line.cgstPct}%` : '—'}</td>
                    <td className="px-2 py-2 text-center text-gray-600">{line.sgstPct > 0 ? `${line.sgstPct}%` : '—'}</td>
                    <td className="px-2 py-2 text-center text-gray-600">{line.igstPct > 0 ? `${line.igstPct}%` : '—'}</td>
                    <td className="px-2 py-2 text-right text-gray-700">₹{f(line.taxAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals + GST Summary */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* GST Summary */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: NAVY }}>GST Summary</div>
                <table className="w-full text-xs border rounded-lg overflow-hidden" style={{ borderColor: NAVY }}>
                  <thead>
                    <tr style={{ backgroundColor: NAVY_LIGHT }}>
                      <th className="px-3 py-2 text-left" style={{ color: NAVY }}>Taxable Amt</th>
                      <th className="px-3 py-2 text-center" style={{ color: NAVY }}>CGST</th>
                      <th className="px-3 py-2 text-center" style={{ color: NAVY }}>SGST</th>
                      <th className="px-3 py-2 text-center" style={{ color: NAVY }}>IGST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(gstSummary).map(([key, g]) => (
                      <tr key={key} className="border-t border-gray-100">
                        <td className="px-3 py-1.5 text-gray-700">₹{f(g.taxable)}</td>
                        <td className="px-3 py-1.5 text-center text-gray-600">{g.cgst > 0 ? `${g.cgst}% = ₹${f(g.taxable * g.cgst / 100)}` : '—'}</td>
                        <td className="px-3 py-1.5 text-center text-gray-600">{g.sgst > 0 ? `${g.sgst}% = ₹${f(g.taxable * g.sgst / 100)}` : '—'}</td>
                        <td className="px-3 py-1.5 text-center text-gray-600">{g.igst > 0 ? `${g.igst}% = ₹${f(g.taxable * g.igst / 100)}` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Amount Summary */}
              <div className="flex flex-col justify-end">
                <div className="border rounded-lg overflow-hidden" style={{ borderColor: NAVY }}>
                  {[
                    { label: 'Subtotal (ex-GST)', value: invoice.subtotalExGST },
                    ...(invoice.cgstTotal > 0 ? [{ label: 'CGST', value: invoice.cgstTotal }] : []),
                    ...(invoice.sgstTotal > 0 ? [{ label: 'SGST', value: invoice.sgstTotal }] : []),
                    ...(invoice.igstTotal > 0 ? [{ label: 'IGST', value: invoice.igstTotal }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between px-4 py-2 text-sm border-b border-gray-100 last:border-0">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-medium text-gray-800">₹{f(value)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between px-4 py-3 text-white" style={{ backgroundColor: NAVY }}>
                    <span className="font-bold text-base">Grand Total</span>
                    <span className="font-black text-lg">₹{f(invoice.grandTotalInclGST)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount in Words */}
            <div className="rounded-lg px-4 py-2.5 mb-6 text-sm border" style={{ backgroundColor: NAVY_LIGHT, borderColor: NAVY }}>
              <span className="font-semibold" style={{ color: NAVY }}>Amount in Words: </span>
              <span className="text-gray-800 italic">{amountInWords}</span>
            </div>

            {/* Footer — no legal terms, product categories only */}
            <div className="pt-4" style={{ borderTop: `2px solid ${NAVY}` }}>
              <div className="grid grid-cols-2 gap-6 mb-4">
                {/* Product Categories */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: NAVY }}>
                    From the House of Whiteplast Products
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: NAVY }}>
                    {PRODUCT_CATEGORIES.join(' | ')}
                  </div>
                </div>
                {/* Signature */}
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-8">For <strong>{BUSINESS.legalName}</strong></div>
                  <div className="border-t border-gray-400 pt-2 inline-block min-w-[160px]">
                    <div className="text-xs text-gray-600 font-medium">Authorised Signatory</div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-4 pt-3 text-xs" style={{ borderTop: `1px solid ${NAVY_LIGHT}`, color: NAVY }}>
                Thank you for your business! — {BUSINESS.tagline}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:hidden { display: none !important; }
          #__next, #__next * { visibility: visible; }
          .max-w-4xl { max-width: 100% !important; margin: 0 !important; }
          @page { size: A4; margin: 10mm; }
        }
      `}</style>
    </>
  );
}
