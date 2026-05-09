'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import WhiteplastLayout from '@/components/whiteplast/WhiteplastLayout';
import { ProductDB, InvoiceDB, seedSampleData, Product, SalesInvoice } from '@/lib/whiteplast-db';

export default function WhiteplastDashboardInteractive() {
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    seedSampleData();
    setProducts(ProductDB.getAll());
    setInvoices(InvoiceDB.getAll());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const lowStock = products.filter(p => p.minAlert > 0 && p.stock <= p.minAlert);
  const totalStockValue = products.reduce((sum, p) => sum + p.stock * p.defaultPriceExGST, 0);
  const recentInvoices = invoices.slice(0, 8);
  const todayInvoices = invoices.filter(inv => inv.date === new Date().toISOString().split('T')[0]);
  const todaySales = todayInvoices.reduce((sum, inv) => sum + inv.grandTotalInclGST, 0);

  const statCards = [
    { label: 'Total Products', value: products.length, icon: '📦', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700', link: '/whiteplast-products' },
    { label: 'Low Stock Alerts', value: lowStock.length, icon: '⚠️', color: 'bg-red-50 border-red-200', textColor: 'text-red-700', link: '/whiteplast-stock' },
    { label: "Today\'s Sales", value: `₹${todaySales.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, icon: '💰', color: 'bg-green-50 border-green-200', textColor: 'text-green-700', link: '/whiteplast-invoices' },
    { label: 'Stock Value', value: `₹${totalStockValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, icon: '🏪', color: 'bg-amber-50 border-amber-200', textColor: 'text-amber-700', link: '/whiteplast-stock-report' },
  ];

  return (
    <WhiteplastLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Whiteplast Paint Distribution — {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <Link href="/whiteplast-invoice-create" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
            <span>+</span> New Invoice
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <Link key={card.label} href={card.link} className={`block p-5 rounded-xl border-2 ${card.color} hover:shadow-md transition-all`}>
              <div className="text-2xl mb-2">{card.icon}</div>
              <div className={`text-2xl font-bold ${card.textColor}`}>{card.value}</div>
              <div className="text-sm text-gray-600 mt-1">{card.label}</div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alerts */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-red-500">⚠️</span> Low Stock Alerts
              </h2>
              <Link href="/whiteplast-stock" className="text-xs text-orange-600 hover:underline font-medium">View All →</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {lowStock.length === 0 ? (
                <div className="px-5 py-8 text-center text-gray-400 text-sm">
                  <div className="text-3xl mb-2">✅</div>
                  All stock levels are healthy
                </div>
              ) : (
                lowStock.map(p => (
                  <div key={p.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <div className="text-sm font-medium text-gray-800">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.packSize}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-red-600">{p.stock} units</div>
                      <div className="text-xs text-gray-400">Min: {p.minAlert}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <span>🧾</span> Recent Invoices
              </h2>
              <Link href="/whiteplast-invoices" className="text-xs text-orange-600 hover:underline font-medium">View All →</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentInvoices.length === 0 ? (
                <div className="px-5 py-8 text-center text-gray-400 text-sm">
                  <div className="text-3xl mb-2">📋</div>
                  No invoices yet. <Link href="/whiteplast-invoice-create" className="text-orange-600 hover:underline">Create one</Link>
                </div>
              ) : (
                recentInvoices.map(inv => (
                  <div key={inv.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <div className="text-sm font-medium text-gray-800">{inv.invoiceNumber}</div>
                      <div className="text-xs text-gray-500">{inv.customerName} · {new Date(inv.date).toLocaleDateString('en-IN')}</div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <div className="text-sm font-semibold text-gray-800">₹{inv.grandTotalInclGST.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                      {inv.isDraft && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Draft</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'New Invoice', icon: '🧾', href: '/whiteplast-invoice-create', color: 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700' },
              { label: 'Add Product', icon: '📦', href: '/whiteplast-products', color: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700' },
              { label: 'Add Customer', icon: '👤', href: '/whiteplast-customers', color: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700' },
              { label: 'Stock Report', icon: '📊', href: '/whiteplast-stock-report', color: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700' },
            ].map(action => (
              <Link key={action.label} href={action.href} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 ${action.color} transition-colors text-center`}>
                <span className="text-2xl">{action.icon}</span>
                <span className="text-sm font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </WhiteplastLayout>
  );
}
