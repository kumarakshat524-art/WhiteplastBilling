'use client';

import React, { useEffect, useState, useRef } from 'react';
import WhiteplastLayout from '@/components/whiteplast/WhiteplastLayout';
import { exportBackup, importBackup } from '@/lib/whiteplast-db';

export default function BackupInteractive() {
  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  function handleExport() {
    const json = exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whiteplast-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ type: 'success', text: 'Backup downloaded successfully!' });
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (!confirm('This will replace ALL current data with the backup. Are you sure?')) return;
      const result = importBackup(content);
      setMessage({ type: result.success ? 'success' : 'error', text: result.message });
      if (result.success) setTimeout(() => window.location.reload(), 1500);
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <WhiteplastLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Backup & Restore</h1>
          <p className="text-sm text-gray-500 mt-1">All data is stored locally in your browser. Use backup to save a copy.</p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {message.type === 'success' ? '✅' : '❌'} {message.text}
          </div>
        )}

        {/* Backup */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">💾</div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">Export Backup</h2>
              <p className="text-sm text-gray-500 mt-1 mb-4">
                Download all your data (products, customers, invoices, stock history) as a JSON file. 
                Store it safely on your computer or cloud storage.
              </p>
              <button onClick={handleExport}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                ⬇️ Download Backup
              </button>
            </div>
          </div>
        </div>

        {/* Restore */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">📂</div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">Restore from Backup</h2>
              <p className="text-sm text-gray-500 mt-1 mb-4">
                Load a previously exported backup file. <strong className="text-red-600">Warning:</strong> This will replace all current data.
              </p>
              <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
              <button onClick={() => fileRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                ⬆️ Choose Backup File
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-semibold text-amber-800 mb-2">💡 Important Notes</h3>
          <ul className="text-sm text-amber-700 space-y-1.5 list-disc list-inside">
            <li>Data is stored in your browser's local storage — it stays on this device.</li>
            <li>Clearing browser data or cache will erase all records. Always keep a backup.</li>
            <li>Export backup regularly (weekly recommended) to avoid data loss.</li>
            <li>To move data to another computer, export backup and import on the new device.</li>
          </ul>
        </div>
      </div>
    </WhiteplastLayout>
  );
}
