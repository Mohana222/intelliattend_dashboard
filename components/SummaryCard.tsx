
import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, colorClass }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 transition-all hover:shadow-lg group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 tracking-tighter">{value}</h3>
        </div>
        <div className={`p-4 rounded-2xl ${colorClass} bg-opacity-10 text-opacity-100 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
