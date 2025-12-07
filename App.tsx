import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from './types';
import { SummaryCard } from './components/SummaryCard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { PhysicalCount } from './components/PhysicalCount';
import { AuditReport } from './components/AuditReport';
import { formatCurrency } from './utils';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  LayoutDashboard, 
  List, 
  PieChart 
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const App: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'audit'>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [physicalTotal, setPhysicalTotal] = useState<number | null>(null);
  const [auditorName, setAuditorName] = useState<string>('');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('cashAuditData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setTransactions(parsed.transactions || []);
      setPhysicalTotal(parsed.physicalTotal || null);
      setAuditorName(parsed.auditorName || '');
    }
  }, []);

  // Save data to localStorage on change
  useEffect(() => {
    localStorage.setItem('cashAuditData', JSON.stringify({
      transactions,
      physicalTotal,
      auditorName
    }));
  }, [transactions, physicalTotal, auditorName]);

  // Derived Statistics
  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpense;

  // Chart Data Preparation
  const chartData = transactions.slice(-10).map(t => ({
    name: new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    amount: t.type === TransactionType.INCOME ? t.amount : -t.amount,
    type: t.type
  }));

  // Handlers
  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleClearData = () => {
    if (window.confirm('PERINGATAN: Ini akan menghapus semua data audit. Lanjutkan?')) {
      setTransactions([]);
      setPhysicalTotal(null);
      localStorage.removeItem('cashAuditData');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold flex items-center space-x-2">
            <Wallet className="w-6 h-6 text-indigo-400" />
            <span>CashAudit Pro</span>
          </h1>
          <p className="text-xs text-slate-400 mt-2">Versi Browser (Tanpa Database)</p>
        </div>
        
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'transactions' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <List className="w-5 h-5" />
            <span>Transaksi</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'audit' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <PieChart className="w-5 h-5" />
            <span>Rekonsiliasi & Laporan</span>
          </button>
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-slate-800 rounded-lg p-4">
            <label className="block text-xs text-slate-400 mb-1">Nama Auditor</label>
            <input 
              type="text" 
              value={auditorName}
              onChange={(e) => setAuditorName(e.target.value)}
              placeholder="Ketik nama anda..."
              className="w-full bg-slate-700 border-none rounded text-sm px-2 py-1 text-white placeholder-slate-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button 
            onClick={handleClearData}
            className="w-full mt-4 text-xs text-rose-400 hover:text-rose-300 underline"
          >
            Reset Semua Data
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {activeTab === 'dashboard' && 'Dashboard Ikhtisar'}
              {activeTab === 'transactions' && 'Manajemen Transaksi'}
              {activeTab === 'audit' && 'Audit & Pelaporan'}
            </h2>
            <p className="text-slate-500">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="hidden md:block">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              currentBalance >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              Saldo Aktif: {formatCurrency(currentBalance)}
            </span>
          </div>
        </header>

        {/* Tab Content */}
        <div className="space-y-6">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard 
                  title="Total Kas Masuk" 
                  amount={formatCurrency(totalIncome)} 
                  icon={<TrendingUp className="w-6 h-6 bg-emerald-500" />} 
                  colorClass="bg-emerald-500"
                />
                <SummaryCard 
                  title="Total Kas Keluar" 
                  amount={formatCurrency(totalExpense)} 
                  icon={<TrendingDown className="w-6 h-6 bg-rose-500" />} 
                  colorClass="bg-rose-500"
                />
                <SummaryCard 
                  title="Saldo Saat Ini" 
                  amount={formatCurrency(currentBalance)} 
                  icon={<Wallet className="w-6 h-6 bg-blue-500" />} 
                  colorClass="bg-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Grafik Arus Kas (10 Terakhir)</h3>
                  <div className="h-64">
                    {transactions.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                          <Tooltip 
                            formatter={(value: number) => formatCurrency(Math.abs(value))}
                            cursor={{ fill: 'transparent' }}
                          />
                          <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400">
                        Belum ada data visual
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                   <h3 className="text-lg font-bold text-slate-800 mb-4">Input Cepat</h3>
                   <TransactionForm onAddTransaction={handleAddTransaction} />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Transaksi Terbaru</h3>
                <TransactionList transactions={transactions.slice(0, 5)} onDelete={handleDeleteTransaction} />
                {transactions.length > 5 && (
                  <button 
                    onClick={() => setActiveTab('transactions')}
                    className="mt-4 text-indigo-600 font-medium hover:underline text-sm"
                  >
                    Lihat semua transaksi &rarr;
                  </button>
                )}
              </div>
            </>
          )}

          {/* TRANSACTIONS TAB */}
          {activeTab === 'transactions' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 order-2 lg:order-1">
                 <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
              </div>
              <div className="lg:col-span-1 order-1 lg:order-2">
                <div className="sticky top-6">
                  <TransactionForm onAddTransaction={handleAddTransaction} />
                </div>
              </div>
            </div>
          )}

          {/* AUDIT TAB */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PhysicalCount 
                  onCalculate={setPhysicalTotal} 
                  currentPhysicalTotal={physicalTotal}
                />
                <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg flex flex-col justify-center">
                  <h3 className="text-xl font-bold mb-2">Panduan Audit</h3>
                  <ul className="space-y-3 text-indigo-100 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Pastikan semua transaksi kas masuk dan keluar telah dicatat di menu Transaksi.
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Lakukan perhitungan fisik uang tunai (Cash Count) yang ada di brankas/laci.
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Input hasil perhitungan fisik ke dalam form di sebelah kiri.
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Sistem akan membandingkan saldo buku vs saldo fisik dan menampilkan selisih jika ada.
                    </li>
                  </ul>
                </div>
              </div>
              
              <AuditReport 
                transactions={transactions} 
                physicalTotal={physicalTotal} 
                auditorName={auditorName} 
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;