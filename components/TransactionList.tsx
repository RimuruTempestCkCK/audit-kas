import React from 'react';
import { Transaction, TransactionType } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { ArrowUpRight, ArrowDownRight, FileText, Trash2 } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 text-center">
        <div className="inline-block p-4 bg-slate-100 rounded-full mb-4">
          <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">Belum ada transaksi</h3>
        <p className="text-slate-500 mt-1">Mulai catat transaksi kas masuk atau keluar.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Keterangan</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Ref. Bukti</th>
              <th className="px-6 py-4 text-right">Jumlah</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                  {formatDate(t.date)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-800 font-medium">
                  {t.description}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <span className="inline-block px-2 py-1 bg-slate-100 rounded text-xs">
                    {t.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 font-mono text-xs">
                  {t.evidenceRef}
                </td>
                <td className={`px-6 py-4 text-sm text-right font-bold whitespace-nowrap ${
                  t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  <div className="flex items-center justify-end space-x-1">
                    {t.type === TransactionType.INCOME ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span>{formatCurrency(t.amount)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => onDelete(t.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Hapus Transaksi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};