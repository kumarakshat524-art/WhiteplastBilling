'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import WhiteplastLayout from '@/components/whiteplast/WhiteplastLayout';
import { InvoiceDB, SalesInvoice, seedSampleData } from '@/lib/whiteplast-db';

export default function SalesReportInteractive() {
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);
  const [mounted, setMounted] = useState(false);
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    seedSampleData();
    setInvoices(InvoiceDB.getAll());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filtered = invoices.filter(inv =>
    !inv.isDraft && inv.date >= fromDate && inv.date <= toDate
  );

  const totalSales = filtered.reduce((s, i) => s + i.grandTotalInclGST, 0);
  const totalTaxable = filtered.reduce((s, i) => s + i.subtotalExGST, 0);
  const totalGST = filtered.reduce((s, i) => s + i.cgstTotal + i.sgstTotal + i.igstTotal, 0);

  function f(v: number) { return v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  // Customer-wise summary
  const customerSummary: Record<string, { name: string; count: number; total: number }> = {};
  filtered.forEach(inv => {
    if (!customerSummary[inv.customerId]) {
      customerSummary[inv.customerId] = { name: inv.customerName, count: 0, total: 0 };
    }
    customerSummary[inv.customerId].count++;
    customerSummary[inv.customerId].total += inv.grandTotalInclGST;
  });

  const topCustomers = Object.values(customerSummary).sort((a, b) => b.total - a.total).slice(0, 5);

  return (
    <WhiteplastLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales Report</h1>
            <p className="text-sm text-gray-500">{filtered.length} invoices in selected period</p>
          </div>
          <button onClick={() => window.print()} className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            🖨️ Print Report
          </button>
        </div>

        {/* Date Filter */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">From Date</label>
              <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">To Date</label>
              <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div className="flex gap-2">
              {[
                { label: 'This Month', action: () => { const d = new Date(); d.setDate(1); setFromDate(d.toISOString().split('T')[0]); setToDate(new Date().toISOString().split('T')[0]); } },
                { label: 'This Year', action: () => { setFromDate(`${new Date().getFullYear()}-01-01`); setToDate(new Date().toISOString().split('T')[0]); } },
                { label: 'All Time', action: () => { setFromDate('2000-01-01'); setToDate(new Date().toISOString().split('T')[0]); } },
              ].map(btn => (
                <button key={btn.label} onClick={btn.action}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors">
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="text-2xl font-bold text-green-700">₹{f(totalSales)}</div>
            <div className="text-sm text-gray-500 mt-1">Total Sales (incl. GST)</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="text-2xl font-bold text-blue-700">₹{f(totalTaxable)}</div>
            <div className="text-sm text-gray-500 mt-1">Taxable Amount (ex-GST)</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="text-2xl font-bold text-orange-700">₹{f(totalGST)}</div>
            <div className="text-sm text-gray-500 mt-1">Total GST Collected</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Invoice List */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Invoice List</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Invoice No.</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Date</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Customer</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Total</th>
                    <th className="text-center px-4 py-2.5 font-semibold text-gray-600">Print</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-10 text-gray-400">No invoices in this period</td></tr>
                  ) : filtered.map((inv, i) => (
                    <tr key={inv.id} className={`hover:bg-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-4 py-2.5 font-mono text-xs font-semibold text-gray-800">{inv.invoiceNumber}</td>
                      <td className="px-4 py-2.5 text-gray-600 text-xs">{new Date(inv.date).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-2.5 text-gray-700">{inv.customerName}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-gray-800">₹{f(inv.grandTotalInclGST)}</td>
                      <td className="px-4 py-2.5 text-center">
                        <Link href={`/whiteplast-invoice-print?id=${inv.id}`} className="text-orange-600 hover:text-orange-800 text-xs font-medium">Print</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Top Customers</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {topCustomers.length === 0 ? (
                <div className="px-5 py-8 text-center text-gray-400 text-sm">No data</div>
              ) : topCustomers.map((c, i) => (
                <div key={c.name} className="flex items-center gap-3 px-5 py-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : 'bg-orange-400'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">{c.name}</div>
                    <div className="text-xs text-gray-400">{c.count} invoice{c.count > 1 ? 's' : ''}</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-800">₹{f(c.total)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </WhiteplastLayout>
  );
}
