'use client';

import React, { useEffect, useState } from 'react';
import WhiteplastLayout from '@/components/whiteplast/WhiteplastLayout';
import { ProductDB, Product, seedSampleData } from '@/lib/whiteplast-db';

export default function StockReportInteractive() {
  const [products, setProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'value'>('name');

  useEffect(() => {
    seedSampleData();
    setProducts(ProductDB.getAll());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const sorted = [...products].sort((a, b) => {
    if (sortBy === 'stock') return a.stock - b.stock;
    if (sortBy === 'value') return (b.stock * b.defaultPriceExGST) - (a.stock * a.defaultPriceExGST);
    return a.name.localeCompare(b.name);
  });

  const totalValue = products.reduce((s, p) => s + p.stock * p.defaultPriceExGST, 0);
  const totalUnits = products.reduce((s, p) => s + p.stock, 0);
  const lowStockCount = products.filter(p => p.minAlert > 0 && p.stock <= p.minAlert).length;

  function f(v: number) { return v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  return (
    <WhiteplastLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stock Report</h1>
            <p className="text-sm text-gray-500">As of {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>
          <button onClick={() => window.print()} className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            🖨️ Print Report
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="text-2xl font-bold text-blue-700">{products.length}</div>
            <div className="text-sm text-gray-500 mt-1">Total Products</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="text-2xl font-bold text-green-700">{totalUnits.toLocaleString('en-IN')}</div>
            <div className="text-sm text-gray-500 mt-1">Total Units in Stock</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="text-2xl font-bold text-orange-700">₹{f(totalValue)}</div>
            <div className="text-sm text-gray-500 mt-1">Total Stock Value (ex-GST)</div>
          </div>
        </div>

        {lowStockCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <div className="font-semibold text-red-700">{lowStockCount} product{lowStockCount > 1 ? 's' : ''} below minimum stock level</div>
              <div className="text-sm text-red-600">Please reorder soon to avoid stockout.</div>
            </div>
          </div>
        )}

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          {(['name', 'stock', 'value'] as const).map(s => (
            <button key={s} onClick={() => setSortBy(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${sortBy === s ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s === 'name' ? 'Name' : s === 'stock' ? 'Stock (Low→High)' : 'Value (High→Low)'}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Product Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Pack Size</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">HSN</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Default Price</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Stock (Units)</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Min Alert</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Stock Value</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sorted.map((p, i) => {
                  const isLow = p.minAlert > 0 && p.stock <= p.minAlert;
                  const value = p.stock * p.defaultPriceExGST;
                  return (
                    <tr key={p.id} className={`hover:bg-gray-50 ${isLow ? 'bg-red-50/40' : i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                      <td className="px-4 py-3 text-gray-600">{p.packSize}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.hsn}</td>
                      <td className="px-4 py-3 text-right text-gray-700">₹{f(p.defaultPriceExGST)}</td>
                      <td className={`px-4 py-3 text-right font-bold ${isLow ? 'text-red-600' : 'text-gray-800'}`}>{p.stock}</td>
                      <td className="px-4 py-3 text-right text-gray-500">{p.minAlert || '—'}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-800">₹{f(value)}</td>
                      <td className="px-4 py-3 text-center">
                        {isLow ? (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">⚠️ Low</span>
                        ) : (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">✓ OK</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-orange-50 border-t-2 border-orange-200">
                  <td colSpan={4} className="px-4 py-3 font-bold text-gray-800">TOTAL</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-800">{totalUnits}</td>
                  <td></td>
                  <td className="px-4 py-3 text-right font-bold text-orange-700">₹{f(totalValue)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </WhiteplastLayout>
  );
}
