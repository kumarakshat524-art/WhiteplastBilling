'use client';

import React, { useEffect, useState } from 'react';
import WhiteplastLayout from '@/components/whiteplast/WhiteplastLayout';
import { ProductDB, Product, StockHistoryDB, StockHistory, adjustStock, seedSampleData } from '@/lib/whiteplast-db';
import {
  validateStockAdjustment,
  validateDirectStockEdit,
  getFieldError,
  ValidationError,
  MAX_QUANTITY,
} from '@/lib/whiteplast-validation';

type AdjustType = 'add' | 'remove' | 'set';

export default function StockInteractive() {
  const [products, setProducts] = useState<Product[]>([]);
  const [history, setHistory] = useState<StockHistory[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [adjustType, setAdjustType] = useState<AdjustType>('add');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [activeTab, setActiveTab] = useState<'stock' | 'history'>('stock');
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);
  const [modalErrors, setModalErrors] = useState<ValidationError[]>([]);
  const [directEditErrors, setDirectEditErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    seedSampleData();
    setProducts(ProductDB.getAll());
    setHistory(StockHistoryDB.getAll());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.packSize.toLowerCase().includes(search.toLowerCase())
  );

  function openAdjust(type: AdjustType, productId?: string) {
    setAdjustType(type);
    setSelectedProductId(productId || (products[0]?.id || ''));
    setQuantity('');
    setNote('');
    setModalErrors([]);
    setShowModal(true);
  }

  function handleAdjust() {
    const qty = parseInt(quantity, 10);
    const product = products.find(p => p.id === selectedProductId);

    const result = validateStockAdjustment({
      productId: selectedProductId,
      adjustType,
      quantity: isNaN(qty) ? 0 : qty,
      currentStock: product?.stock ?? 0,
    });

    setModalErrors(result.errors);
    if (!result.valid) return;

    if (adjustType === 'remove' && product && product.stock - qty < 0) {
      if (!confirm(`⚠️ This will make stock negative (${product.stock - qty} units). Continue?`)) return;
    }

    if (adjustType === 'set') {
      const delta = qty - (product?.stock ?? 0);
      adjustStock(selectedProductId, delta, note || 'Manual stock correction');
    } else if (adjustType === 'add') {
      adjustStock(selectedProductId, qty, note || 'Stock added');
    } else {
      adjustStock(selectedProductId, -qty, note || 'Stock removed');
    }

    setProducts(ProductDB.getAll());
    setHistory(StockHistoryDB.getAll());
    setShowModal(false);
  }

  function handleDirectEdit(productId: string, newStock: string) {
    const result = validateDirectStockEdit(newStock);
    if (!result.valid) {
      setDirectEditErrors(prev => ({ ...prev, [productId]: result.errors[0]?.message || 'Invalid value' }));
      return;
    }
    setDirectEditErrors(prev => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });

    const val = parseInt(newStock, 10);
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const delta = val - product.stock;
    adjustStock(productId, delta, 'Direct stock edit');
    setProducts(ProductDB.getAll());
    setHistory(StockHistoryDB.getAll());
  }

  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
    <WhiteplastLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
            <p className="text-sm text-gray-500">{products.filter(p => p.minAlert > 0 && p.stock <= p.minAlert).length} low stock alerts</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => openAdjust('add')} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors">+ Add Stock</button>
            <button onClick={() => openAdjust('remove')} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors">− Remove Stock</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {(['stock', 'history'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${activeTab === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab === 'stock' ? '📦 Stock Levels' : '📋 History Log'}
            </button>
          ))}
        </div>

        {activeTab === 'stock' && (
          <>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white" />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Product</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Pack Size</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-600">Current Stock</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-600">Min Alert</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((p, i) => {
                      const isLow = p.minAlert > 0 && p.stock <= p.minAlert;
                      const editErr = directEditErrors[p.id];
                      return (
                        <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${isLow ? 'bg-red-50/40' : i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                          <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                          <td className="px-4 py-3 text-gray-500">{p.packSize}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex flex-col items-end gap-1">
                              <input
                                type="number"
                                defaultValue={p.stock}
                                onBlur={e => {
                                  if (e.target.value !== String(p.stock)) {
                                    handleDirectEdit(p.id, e.target.value);
                                  }
                                }}
                                onChange={e => {
                                  // Clear error on change
                                  if (directEditErrors[p.id]) {
                                    setDirectEditErrors(prev => {
                                      const next = { ...prev };
                                      delete next[p.id];
                                      return next;
                                    });
                                  }
                                }}
                                min="0"
                                step="1"
                                className={`w-24 text-right border rounded-lg px-2 py-1 text-sm font-bold focus:outline-none focus:ring-2 ${
                                  editErr
                                    ? 'border-red-400 focus:ring-red-300 bg-red-50 text-red-700'
                                    : isLow
                                    ? 'border-red-300 text-red-600 bg-red-50 focus:ring-orange-400' :'border-gray-200 text-gray-800 focus:ring-orange-400'
                                }`}
                              />
                              {editErr && <p className="text-xs text-red-600 text-right">{editErr}</p>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-gray-500">{p.minAlert || '—'}</td>
                          <td className="px-4 py-3 text-center">
                            {isLow ? (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">⚠️ Low</span>
                            ) : (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">✓ OK</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => openAdjust('add', p.id)} className="text-green-600 hover:text-green-800 text-xs font-medium px-2 py-1 rounded hover:bg-green-50 transition-colors">+Add</button>
                              <button onClick={() => openAdjust('remove', p.id)} className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors">−Remove</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Date & Time</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Product</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Change</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Reason / Note</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {history.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-12 text-gray-400">No stock history yet</td></tr>
                  ) : history.map((h, i) => (
                    <tr key={h.id} className={`hover:bg-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(h.date).toLocaleDateString('en-IN')} {new Date(h.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">{h.productName}</td>
                      <td className={`px-4 py-3 text-right font-bold ${h.quantityChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {h.quantityChange > 0 ? '+' : ''}{h.quantityChange}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{h.reason}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{h.invoiceNumber || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Adjust Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {adjustType === 'add' ? '+ Add Stock' : adjustType === 'remove' ? '− Remove Stock' : '✏️ Set Stock'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            {/* Error Banner */}
            {modalErrors.length > 0 && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs font-semibold text-red-700 mb-1">⚠️ Please fix the following:</p>
                <ul className="text-xs text-red-600 space-y-0.5">
                  {modalErrors.map((e, i) => <li key={i}>• {e.message}</li>)}
                </ul>
              </div>
            )}

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Product</label>
                <select
                  value={selectedProductId}
                  onChange={e => {
                    setSelectedProductId(e.target.value);
                    setModalErrors([]);
                  }}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white ${
                    getFieldError(modalErrors, 'productId') ? 'border-red-400' : 'border-gray-200'
                  }`}
                >
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.packSize}) — Stock: {p.stock}</option>)}
                </select>
                {getFieldError(modalErrors, 'productId') && (
                  <p className="text-xs text-red-600 mt-1">{getFieldError(modalErrors, 'productId')}</p>
                )}
              </div>

              {/* Current stock info */}
              {selectedProduct && (
                <div className="p-2 bg-gray-50 rounded-lg text-xs text-gray-600 border border-gray-100">
                  Current stock: <strong className="text-gray-900">{selectedProduct.stock} units</strong>
                  {adjustType === 'add' && quantity && !isNaN(parseInt(quantity)) && (
                    <span className="ml-2 text-green-700">→ After: <strong>{selectedProduct.stock + parseInt(quantity)}</strong></span>
                  )}
                  {adjustType === 'remove' && quantity && !isNaN(parseInt(quantity)) && (
                    <span className={`ml-2 ${selectedProduct.stock - parseInt(quantity) < 0 ? 'text-red-700' : 'text-gray-700'}`}>
                      → After: <strong>{selectedProduct.stock - parseInt(quantity)}</strong>
                      {selectedProduct.stock - parseInt(quantity) < 0 && ' ⚠️ Negative'}
                    </span>
                  )}
                  {adjustType === 'set' && quantity && !isNaN(parseInt(quantity)) && (
                    <span className="ml-2 text-blue-700">→ Will be set to: <strong>{parseInt(quantity)}</strong></span>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  {adjustType === 'set' ? 'New Stock Quantity' : 'Quantity'}
                  <span className="text-gray-400 font-normal ml-1">(max {MAX_QUANTITY.toLocaleString('en-IN')})</span>
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={e => {
                    setQuantity(e.target.value);
                    setModalErrors([]);
                  }}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                    getFieldError(modalErrors, 'quantity') ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                  min="0"
                  step="1"
                  placeholder="Enter quantity"
                />
                {getFieldError(modalErrors, 'quantity') && (
                  <p className="text-xs text-red-600 mt-1">{getFieldError(modalErrors, 'quantity')}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Note / Reason (optional)</label>
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="e.g. Purchase invoice #123"
                  maxLength={200}
                />
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button
                onClick={handleAdjust}
                className={`flex-1 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  adjustType === 'add' ? 'bg-green-600 hover:bg-green-700' : adjustType === 'remove' ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </WhiteplastLayout>
  );
}
