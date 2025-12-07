import React, { useState, useEffect } from 'react';
import { DENOMINATIONS } from '../types';
import { formatCurrency } from '../utils';
import { Calculator, Save } from 'lucide-react';

interface PhysicalCountProps {
  onCalculate: (total: number) => void;
  currentPhysicalTotal: number | null;
}

export const PhysicalCount: React.FC<PhysicalCountProps> = ({ onCalculate, currentPhysicalTotal }) => {
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    // Calculate total whenever counts change
    let sum = 0;
    Object.entries(counts).forEach(([denom, count]) => {
      sum += parseInt(denom) * count;
    });
    setTotal(sum);
  }, [counts]);

  const handleCountChange = (denom: number, value: string) => {
    const count = parseInt(value) || 0;
    setCounts(prev => ({
      ...prev,
      [denom]: count
    }));
  };

  const handleSave = () => {
    onCalculate(total);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
        <Calculator className="w-5 h-5 mr-2 text-indigo-600" />
        Perhitungan Fisik Kas (Opname)
      </h3>
      <p className="text-sm text-slate-500 mb-6">
        Masukkan jumlah lembar/koin untuk setiap pecahan untuk melakukan rekonsiliasi dengan saldo sistem.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {DENOMINATIONS.map((denom) => (
          <div key={denom} className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
            <label className="w-24 text-xs font-semibold text-slate-600 text-right">
              {formatCurrency(denom)}
            </label>
            <span className="text-slate-400 text-xs">x</span>
            <input
              type="number"
              min="0"
              placeholder="0"
              className="flex-1 w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => handleCountChange(denom, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-sm text-slate-500">Total Fisik</p>
          <p className="text-2xl font-bold text-indigo-600">{formatCurrency(total)}</p>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Verifikasi Saldo
        </button>
      </div>
    </div>
  );
};