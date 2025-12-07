import React from 'react';
import { Transaction, TransactionType } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { AlertTriangle, CheckCircle, Download } from 'lucide-react';

interface AuditReportProps {
  transactions: Transaction[];
  physicalTotal: number | null;
  auditorName: string;
}

export const AuditReport: React.FC<AuditReportProps> = ({ transactions, physicalTotal, auditorName }) => {
  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const systemBalance = totalIncome - totalExpense;
  const discrepancy = physicalTotal !== null ? physicalTotal - systemBalance : 0;
  const isBalanced = physicalTotal !== null && discrepancy === 0;

  const handleExportCSV = () => {
    const headers = ["ID", "Tanggal", "Tipe", "Kategori", "Keterangan", "Ref. Bukti", "Masuk", "Keluar"];
    const rows = transactions.map(t => [
      t.id,
      formatDate(t.date),
      t.type,
      t.category,
      `"${t.description.replace(/"/g, '""')}"`, // Escape quotes
      t.evidenceRef,
      t.type === TransactionType.INCOME ? t.amount : 0,
      t.type === TransactionType.EXPENSE ? t.amount : 0,
    ]);

    // Add Summary Rows
    rows.push([]);
    rows.push(["RINGKASAN"]);
    rows.push(["Total Masuk", "", "", "", "", "", totalIncome, ""]);
    rows.push(["Total Keluar", "", "", "", "", "", "", totalExpense]);
    rows.push(["Saldo Sistem", "", "", "", "", "", systemBalance, ""]);
    if (physicalTotal !== null) {
      rows.push(["Saldo Fisik", "", "", "", "", "", physicalTotal, ""]);
      rows.push(["Selisih", "", "", "", "", "", discrepancy, ""]);
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden mt-8">
      <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
        <div>
          <h2 className="text-xl font-bold">Laporan Akhir Audit Kas</h2>
          <p className="text-slate-400 text-sm">Auditor: {auditorName || 'Anonim'} | Tanggal: {formatDate(new Date().toISOString())}</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-100 transition-colors flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Ekspor CSV
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-sm text-slate-500 mb-1">Saldo Menurut Sistem</p>
          <p className="text-2xl font-bold text-slate-800">{formatCurrency(systemBalance)}</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-sm text-slate-500 mb-1">Saldo Fisik (Opname)</p>
          <p className="text-2xl font-bold text-slate-800">
            {physicalTotal !== null ? formatCurrency(physicalTotal) : '-'}
          </p>
        </div>
        <div className={`p-4 rounded-lg border ${
            physicalTotal === null 
            ? 'bg-slate-50 border-slate-100' 
            : isBalanced 
              ? 'bg-emerald-50 border-emerald-200' 
              : 'bg-rose-50 border-rose-200'
          }`}>
          <p className="text-sm text-slate-500 mb-1">Status Rekonsiliasi</p>
          <div className="flex items-center">
            {physicalTotal === null ? (
              <span className="text-slate-400 font-medium">Menunggu Opname</span>
            ) : isBalanced ? (
              <div className="flex items-center text-emerald-700 font-bold">
                <CheckCircle className="w-5 h-5 mr-2" />
                SEIMBANG (Balanced)
              </div>
            ) : (
              <div className="flex items-center text-rose-700 font-bold">
                <AlertTriangle className="w-5 h-5 mr-2" />
                SELISIH: {formatCurrency(discrepancy)}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mini Statement */}
      <div className="px-6 pb-6">
        <h4 className="text-sm font-semibold text-slate-700 uppercase mb-3">Ringkasan Aktivitas</h4>
        <div className="w-full bg-slate-50 rounded h-2 overflow-hidden flex">
          <div 
            style={{ width: `${(totalIncome / (totalIncome + totalExpense || 1)) * 100}%` }} 
            className="bg-emerald-500 h-full"
          ></div>
          <div 
            style={{ width: `${(totalExpense / (totalIncome + totalExpense || 1)) * 100}%` }} 
            className="bg-rose-500 h-full"
          ></div>
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>Total Masuk: {formatCurrency(totalIncome)}</span>
          <span>Total Keluar: {formatCurrency(totalExpense)}</span>
        </div>
      </div>
    </div>
  );
};