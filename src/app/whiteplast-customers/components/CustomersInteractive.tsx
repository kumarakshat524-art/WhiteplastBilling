'use client';

import React, { useEffect, useState } from 'react';
import WhiteplastLayout from '@/components/whiteplast/WhiteplastLayout';
import { CustomerDB, Customer, ProductDB, Product, CustomerPriceDB, seedSampleData } from '@/lib/whiteplast-db';

const emptyForm = { name: '', gstin: '', address: '', phone: '', state: 'Haryana' };

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

export default function CustomersInteractive() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [search, setSearch] = useState('');
  const [pricingCustomer, setPricingCustomer] = useState<Customer | null>(null);
  const [specialPrices, setSpecialPrices] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    seedSampleData();
    setCustomers(CustomerDB.getAll());
    setProducts(ProductDB.getAll());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.state.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() {
    setForm({ ...emptyForm });
    setEditId(null);
    setShowModal(true);
  }

  function openEdit(c: Customer) {
    setForm({ name: c.name, gstin: c.gstin, address: c.address, phone: c.phone, state: c.state });
    setEditId(c.id);
    setShowModal(true);
  }

  function handleSave() {
    if (!form.name.trim()) return alert('Customer name is required');
    if (editId) {
      CustomerDB.update(editId, form);
    } else {
      CustomerDB.add(form);
    }
    setCustomers(CustomerDB.getAll());
    setShowModal(false);
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this customer? Their special prices will also be removed.')) return;
    CustomerDB.delete(id);
    setCustomers(CustomerDB.getAll());
  }

  function openPricing(c: Customer) {
    setPricingCustomer(c);
    const existing: Record<string, string> = {};
    products.forEach(p => {
      const sp = CustomerPriceDB.getPrice(c.id, p.id);
      existing[p.id] = sp !== null ? String(sp) : '';
    });
    setSpecialPrices(existing);
  }

  function savePricing() {
    if (!pricingCustomer) return;
    products.forEach(p => {
      const val = specialPrices[p.id];
      if (val !== '' && !isNaN(parseFloat(val))) {
        CustomerPriceDB.set(pricingCustomer.id, p.id, parseFloat(val));
      } else {
        CustomerPriceDB.remove(pricingCustomer.id, p.id);
      }
    });
    setPricingCustomer(null);
    alert('Special prices saved!');
  }

  return (
    <WhiteplastLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
            <p className="text-sm text-gray-500">{customers.length} customers</p>
          </div>
          <button onClick={openAdd} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
            + Add Customer
          </button>
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input type="text" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Customer Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">GSTIN</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Phone</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">State</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-400">No customers found</td></tr>
                ) : filtered.map((c, i) => (
                  <tr key={c.id} className={`hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{c.name}</div>
                      <div className="text-xs text-gray-400 truncate max-w-xs">{c.address}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{c.gstin || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{c.phone}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.state === 'Haryana' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {c.state}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openPricing(c)} className="text-purple-600 hover:text-purple-800 text-xs font-medium px-2 py-1 rounded hover:bg-purple-50 transition-colors">Pricing</button>
                        <button onClick={() => openEdit(c)} className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors">Edit</button>
                        <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editId ? 'Edit Customer' : 'Add Customer'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: 'Customer Name *', key: 'name' as const, placeholder: 'e.g. Sharma Hardware Store' },
                { label: 'GSTIN', key: 'gstin' as const, placeholder: 'e.g. 06ABCDE1234F1Z5' },
                { label: 'Phone', key: 'phone' as const, placeholder: 'e.g. 98765-43210' },
                { label: 'Billing Address', key: 'address' as const, placeholder: 'Full address' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
                  <input type="text" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder={placeholder} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">State</label>
                <select value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                {editId ? 'Update' : 'Add Customer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Special Pricing Modal */}
      {pricingCustomer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Special Pricing</h2>
                <p className="text-sm text-gray-500">{pricingCustomer.name} — leave blank to use default price</p>
              </div>
              <button onClick={() => setPricingCustomer(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-semibold text-gray-600">Product</th>
                    <th className="text-right py-2 font-semibold text-gray-600">Default Price</th>
                    <th className="text-right py-2 font-semibold text-gray-600">Special Price (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="py-3">
                        <div className="font-medium text-gray-800">{p.name}</div>
                        <div className="text-xs text-gray-400">{p.packSize}</div>
                      </td>
                      <td className="py-3 text-right text-gray-500">₹{p.defaultPriceExGST}</td>
                      <td className="py-3 text-right">
                        <input
                          type="number"
                          value={specialPrices[p.id] || ''}
                          onChange={e => setSpecialPrices({ ...specialPrices, [p.id]: e.target.value })}
                          placeholder={String(p.defaultPriceExGST)}
                          className="w-28 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-orange-400"
                          min="0" step="0.01"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setPricingCustomer(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={savePricing} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">Save Prices</button>
            </div>
          </div>
        </div>
      )}
    </WhiteplastLayout>
  );
}
