'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAVY = '#1a3a6b';
const NAVY_DARK = '#122a52';
const NAVY_LIGHT = '#e8eef7';

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
        fixed top-0 left-0 h-full w-64 border-r shadow-lg z-50 flex flex-col
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `} style={{ backgroundColor: NAVY_DARK, borderColor: NAVY }}>
        {/* Brand */}
        <div className="px-5 py-5 border-b" style={{ borderColor: NAVY, background: `linear-gradient(135deg, ${NAVY_DARK} 0%, ${NAVY} 100%)` }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-sm font-black" style={{ color: NAVY }}>WP</span>
            </div>
            <div>
              <div className="text-white font-bold text-base leading-tight">Whiteplast</div>
              <div className="text-xs" style={{ color: '#a8c0e0' }}>Distribution Manager</div>
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
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all`}
                  style={{
                    backgroundColor: active ? 'rgba(255,255,255,0.15)' : undefined,
                    color: active ? '#ffffff' : '#a8c0e0',
                    border: active ? '1px solid rgba(255,255,255,0.25)' : '1px solid transparent',
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = ''; }}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.label === 'New Invoice' && (
                    <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>New</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Business Info */}
        <div className="px-4 py-4 border-t" style={{ borderColor: NAVY, backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <div className="text-xs leading-relaxed" style={{ color: '#a8c0e0' }}>
            <div className="font-semibold text-white mb-1">Kumar Cement Corporation</div>
            <div>Jagadhri, Haryana</div>
            <div>GSTIN: 06BZRPK1707R1ZP</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b shadow-sm h-14 flex items-center px-4 gap-3" style={{ backgroundColor: NAVY, borderColor: NAVY_DARK }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 text-sm hidden sm:block" style={{ color: '#a8c0e0' }}>
            From the House of Whiteplast Products
          </div>
          <Link href="/whiteplast-invoice-create" className="text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors border border-white/30 hover:bg-white/10">
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
