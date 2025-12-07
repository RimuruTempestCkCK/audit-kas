import React, { useState } from 'react';
import { Transaction, TransactionType, CATEGORIES } from '../types';
import { generateId } from '../utils';
import { PlusCircle, MinusCircle, Save } from 'lucide-react';

interface TransactionFormProps {
  onAddTransaction: (transaction: Transaction) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.INCOME);
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState<string>('');
  const [evidenceRef, setEvidenceRef] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    const newTransaction: Transaction = {
      id: generateId(),
      date: new Date().toISOString(),
      type,
      amount: parseFloat(amount),
      category,
      description,
      evidenceRef: evidenceRef || 'N/A',
    };

    onAddTransaction(newTransaction);
    
    // Reset form
    setAmount('');
    setDescription('');
    setEvidenceRef('');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
        <PlusCircle className="w-5 h-5 mr-2 text-indigo-600" />
        Input Transaksi Baru
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4 mb-4">
          <button
            type="button"
            onClick={() => setType(TransactionType.INCOME)}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 border transition-all ${
              type === TransactionType.INCOME 
                ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold' 
                : 'border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Kas Masuk</span>
          </button>
          <button
            type="button"
            onClick={() => setType(TransactionType.EXPENSE)}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 border transition-all ${
              type === TransactionType.EXPENSE
                ? 'bg-rose-50 border-rose-500 text-rose-700 font-semibold' 
                : 'border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <MinusCircle className="w-4 h-4" />
            <span>Kas Keluar</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah (Rp)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              placeholder="0"
              required
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Keterangan</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Contoh: Pembayaran listrik bulan ini"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">No. Bukti / Referensi Audit</label>
          <input
            type="text"
            value={evidenceRef}
            onChange={(e) => setEvidenceRef(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="No. Kwitansi / Faktur (Opsional)"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Transaksi</span>
        </button>
      </form>
    </div>
  );
};