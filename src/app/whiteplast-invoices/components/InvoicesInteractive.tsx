'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import WhiteplastLayout from '@/components/whiteplast/WhiteplastLayout';
import { InvoiceDB, SalesInvoice, seedSampleData } from '@/lib/whiteplast-db';

export default function InvoicesInteractive() {
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);
  const [search, setSearch] = useState('');
  const [filterDraft, setFilterDraft] = useState<'all' | 'draft' | 'final'>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    seedSampleData();
    setInvoices(InvoiceDB.getAll());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterDraft === 'all' || (filterDraft === 'draft' ? inv.isDraft : !inv.isDraft);
    return matchSearch && matchFilter;
  });

  const totalSales = filtered.filter(i => !i.isDraft).reduce((sum, i) => sum + i.grandTotalInclGST, 0);

  return (
    <WhiteplastLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
            <p className="text-sm text-gray-500">{invoices.length} total · ₹{totalSales.toLocaleString('en-IN', { maximumFractionDigits: 0 })} in filtered sales</p>
          </div>
          <Link href="/whiteplast-invoice-create" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
            + New Invoice
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input type="text" placeholder="Search by invoice number or customer..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white" />
          </div>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {(['all', 'final', 'draft'] as const).map(f => (
              <button key={f} onClick={() => setFilterDraft(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${filterDraft === f ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                {f === 'all' ? 'All' : f === 'final' ? '✓ Final' : '📝 Draft'}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Invoice No.</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Customer</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Subtotal</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">GST</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Grand Total</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-400">
                      <div className="text-3xl mb-2">🧾</div>
                      No invoices found. <Link href="/whiteplast-invoice-create" className="text-orange-600 hover:underline">Create one</Link>
                    </td>
                  </tr>
                ) : filtered.map((inv, i) => {
                  const gstTotal = inv.cgstTotal + inv.sgstTotal + inv.igstTotal;
                  return (
                    <tr key={inv.id} className={`hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-800">{inv.invoiceNumber}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{new Date(inv.date).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{inv.customerName}</div>
                        <div className="text-xs text-gray-400">{inv.placeOfSupply}</div>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">₹{inv.subtotalExGST.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3 text-right text-gray-600">₹{gstTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">₹{inv.grandTotalInclGST.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3 text-center">
                        {inv.isDraft ? (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">Draft</span>
                        ) : (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Final</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Link href={`/whiteplast-invoice-print?id=${inv.id}`} className="text-orange-600 hover:text-orange-800 text-xs font-medium px-2 py-1 rounded hover:bg-orange-50 transition-colors">Print</Link>
                          <Link href={`/whiteplast-invoice-create?edit=${inv.id}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors">Edit</Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </WhiteplastLayout>
  );
}
