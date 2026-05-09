'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  icon: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: '🏠', href: '/whiteplast-dashboard' },
  { label: 'Products', icon: '📦', href: '/whiteplast-products' },
  { label: 'Customers', icon: '👥', href: '/whiteplast-customers' },
  { label: 'Stock', icon: '🏗️', href: '/whiteplast-stock' },
  { label: 'Invoices', icon: '🧾', href: '/whiteplast-invoices' },
  { label: 'New Invoice', icon: '➕', href: '/whiteplast-invoice-create' },
  { label: 'Stock Report', icon: '📊', href: '/whiteplast-stock-report' },
  { label: 'Sales Report', icon: '📈', href: '/whiteplast-sales-report' },
  { label: 'Backup', icon: '💾', href: '/whiteplast-backup' },
];

interface WhiteplastLayoutProps {
  children: React.ReactNode;
}

export default function WhiteplastLayout({ children }: WhiteplastLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg z-50 flex flex-col
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="px-5 py-5 border-b border-gray-100 bg-gradient-to-r from-orange-600 to-orange-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-xl">🎨</span>
            </div>
            <div>
              <div className="text-white font-bold text-base leading-tight">Whiteplast</div>
              <div className="text-orange-100 text-xs">Distribution Manager</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 space-y-1">
            {navItems.map(item => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-orange-50 text-orange-700 border border-orange-200' :'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.label === 'New Invoice' && (
                    <span className="ml-auto bg-orange-600 text-white text-xs px-1.5 py-0.5 rounded-full">New</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Business Info */}
        <div className="px-4 py-4 border-t border-gray-100 bg-gray-50">
          <div className="text-xs text-gray-500 leading-relaxed">
            <div className="font-semibold text-gray-700 mb-1">Kumar Cement Corporation</div>
            <div>Jagadhri, Haryana</div>
            <div>GSTIN: 06BZRPK1707R1ZP</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm h-14 flex items-center px-4 gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 text-sm text-gray-500 hidden sm:block">
            From the House of Whiteplast Products
          </div>
          <Link href="/whiteplast-invoice-create" className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
            + New Invoice
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
