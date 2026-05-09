'use client';

import React, { useEffect, useState } from 'react';
import WhiteplastLayout from '@/components/whiteplast/WhiteplastLayout';
import { ProductDB, Product, seedSampleData } from '@/lib/whiteplast-db';
import { validateProduct, getFieldError, ValidationError,  } from '@/lib/whiteplast-validation';

const emptyForm = {
  name: '', packSize: '', hsn: '', defaultPriceExGST: 0,
  cgstPct: 9, sgstPct: 9, igstPct: 0, stock: 0, minAlert: 0,
};

export default function ProductsInteractive() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [formErrors, setFormErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    seedSampleData();
    setProducts(ProductDB.getAll());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.packSize.toLowerCase().includes(search.toLowerCase()) ||
    p.hsn.includes(search)
  );

  function openAdd() {
    setForm({ ...emptyForm });
    setEditId(null);
    setFormErrors([]);
    setTouched({});
    setShowModal(true);
  }

  function openEdit(p: Product) {
    setForm({
      name: p.name, packSize: p.packSize, hsn: p.hsn,
      defaultPriceExGST: p.defaultPriceExGST, cgstPct: p.cgstPct,
      sgstPct: p.sgstPct, igstPct: p.igstPct, stock: p.stock, minAlert: p.minAlert,
    });
    setEditId(p.id);
    setFormErrors([]);
    setTouched({});
    setShowModal(true);
  }

  function handleFieldChange(field: string, value: string | number) {
    const updated = { ...form, [field]: value };
    setForm(updated);
    setTouched(prev => ({ ...prev, [field]: true }));
    // Live validation on change
    const result = validateProduct(updated);
    setFormErrors(result.errors);
  }

  function handleSave() {
    // Mark all fields as touched so all errors show
    setTouched({
      name: true, packSize: true, hsn: true, defaultPriceExGST: true,
      cgstPct: true, sgstPct: true, igstPct: true, stock: true, minAlert: true,
    });

    const result = validateProduct(form);
    setFormErrors(result.errors);

    if (!result.valid) return;

    if (editId) {
      ProductDB.update(editId, form);
    } else {
      ProductDB.add(form);
    }
    setProducts(ProductDB.getAll());
    setShowModal(false);
  }

  function handleDelete(id: string) {
    const p = products.find(x => x.id === id);
    if (p && p.stock > 0) {
      if (!confirm(`This product has ${p.stock} units in stock. Are you sure you want to delete it?`)) return;
    }
    ProductDB.delete(id);
    setProducts(ProductDB.getAll());
    setDeleteConfirm(null);
  }

  function f(v: number) {
    return v.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  }

  function fieldError(field: string): string | undefined {
    return touched[field] ? getFieldError(formErrors, field) : undefined;
  }

  function inputClass(field: string, extra = '') {
    const err = fieldError(field);
    return `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
      err ? 'border-red-400 focus:ring-red-300 bg-red-50' : 'border-gray-200 focus:ring-orange-400'
    } ${extra}`;
  }

  return (
    <WhiteplastLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-sm text-gray-500">{products.length} products in catalog</p>
          </div>
          <button onClick={openAdd} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
            + Add Product
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search by name, pack size, or HSN..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Pack Size</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">HSN</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Price (ex-GST)</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">GST</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Stock</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Min Alert</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-gray-400">No products found</td></tr>
                ) : filtered.map((p, i) => {
                  const isLow = p.minAlert > 0 && p.stock <= p.minAlert;
                  return (
                    <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                      <td className="px-4 py-3 text-gray-600">{p.packSize}</td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">{p.hsn}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-800">₹{f(p.defaultPriceExGST)}</td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {p.igstPct > 0 ? `IGST ${p.igstPct}%` : `${p.cgstPct}+${p.sgstPct}%`}
                      </td>
                      <td className={`px-4 py-3 text-right font-bold ${isLow ? 'text-red-600' : 'text-gray-800'}`}>
                        {p.stock} {isLow && <span className="text-xs ml-1">⚠️</span>}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500">{p.minAlert || '—'}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openEdit(p)} className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors">Edit</button>
                          <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors">Delete</button>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editId ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            {/* Validation Summary Banner */}
            {formErrors.length > 0 && Object.keys(touched).length > 0 && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs font-semibold text-red-700 mb-1">⚠️ Please fix the following errors:</p>
                <ul className="text-xs text-red-600 space-y-0.5">
                  {formErrors.map((e, i) => (
                    <li key={i}>• {e.message}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Product Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => handleFieldChange('name', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                    className={inputClass('name')}
                    placeholder="e.g. Whiteplast Wall Putty"
                  />
                  {fieldError('name') && <p className="text-xs text-red-600 mt-1">{fieldError('name')}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Pack Size</label>
                  <input
                    type="text"
                    value={form.packSize}
                    onChange={e => handleFieldChange('packSize', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, packSize: true }))}
                    className={inputClass('packSize')}
                    placeholder="e.g. 40 kg Bag"
                  />
                  {fieldError('packSize') && <p className="text-xs text-red-600 mt-1">{fieldError('packSize')}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">HSN Code</label>
                  <input
                    type="text"
                    value={form.hsn}
                    onChange={e => handleFieldChange('hsn', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, hsn: true }))}
                    className={inputClass('hsn')}
                    placeholder="e.g. 3214"
                    maxLength={8}
                  />
                  {fieldError('hsn') && <p className="text-xs text-red-600 mt-1">{fieldError('hsn')}</p>}
                  <p className="text-xs text-gray-400 mt-0.5">4–8 digits</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Default Price (ex-GST) ₹ *</label>
                  <input
                    type="number"
                    value={form.defaultPriceExGST}
                    onChange={e => handleFieldChange('defaultPriceExGST', parseFloat(e.target.value) || 0)}
                    onBlur={() => setTouched(prev => ({ ...prev, defaultPriceExGST: true }))}
                    className={inputClass('defaultPriceExGST')}
                    min="0"
                    max="10000000"
                    step="0.01"
                  />
                  {fieldError('defaultPriceExGST') && <p className="text-xs text-red-600 mt-1">{fieldError('defaultPriceExGST')}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Current Stock (units)</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={e => handleFieldChange('stock', parseInt(e.target.value) || 0)}
                    onBlur={() => setTouched(prev => ({ ...prev, stock: true }))}
                    className={inputClass('stock')}
                    min="0"
                    step="1"
                  />
                  {fieldError('stock') && <p className="text-xs text-red-600 mt-1">{fieldError('stock')}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Min Stock Alert</label>
                  <input
                    type="number"
                    value={form.minAlert}
                    onChange={e => handleFieldChange('minAlert', parseInt(e.target.value) || 0)}
                    onBlur={() => setTouched(prev => ({ ...prev, minAlert: true }))}
                    className={inputClass('minAlert')}
                    min="0"
                    step="1"
                  />
                  {fieldError('minAlert') && <p className="text-xs text-red-600 mt-1">{fieldError('minAlert')}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">GST Rates</label>
                  <p className="text-xs text-gray-400 mb-2">
                    Use CGST+SGST for intra-state sales (Haryana). Use IGST for inter-state. Cannot use both simultaneously.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'CGST %', key: 'cgstPct' as const },
                      { label: 'SGST %', key: 'sgstPct' as const },
                      { label: 'IGST %', key: 'igstPct' as const },
                    ].map(({ label, key }) => (
                      <div key={key}>
                        <label className="block text-xs text-gray-500 mb-1">{label}</label>
                        <input
                          type="number"
                          value={form[key]}
                          onChange={e => handleFieldChange(key, parseFloat(e.target.value) || 0)}
                          onBlur={() => setTouched(prev => ({ ...prev, [key]: true }))}
                          className={inputClass(key, 'text-center')}
                          min="0"
                          max="28"
                          step="0.5"
                        />
                        {fieldError(key) && <p className="text-xs text-red-600 mt-1">{fieldError(key)}</p>}
                      </div>
                    ))}
                  </div>
                  {/* GST mutual exclusion warning */}
                  {(fieldError('igstPct') || fieldError('sgstPct')) && (
                    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
                      💡 Common GST rates: 0%, 5%, 9% (CGST/SGST each), 12%, 18%, 28%
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button
                onClick={handleSave}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {editId ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </WhiteplastLayout>
  );
}
