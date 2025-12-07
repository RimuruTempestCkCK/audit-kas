import React from 'react';

interface SummaryCardProps {
  title: string;
  amount: string;
  icon: React.ReactNode;
  colorClass: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, icon, colorClass }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${colorClass} bg-opacity-10 text-white`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{amount}</h3>
      </div>
    </div>
  );
};